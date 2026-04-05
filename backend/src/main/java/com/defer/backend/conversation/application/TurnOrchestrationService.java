package com.defer.backend.conversation.application;

import com.defer.backend.casefile.application.CaseFileApplicationService;
import com.defer.backend.casefile.domain.*;
import com.defer.backend.conversation.domain.Conversation;
import com.defer.backend.conversation.domain.Message;
import com.defer.backend.conversation.domain.SenderType;
import com.defer.backend.decision.application.DecisionApplicationService;
import com.defer.backend.decision.contracts.AiServiceResponse;
import com.defer.backend.decision.domain.DecisionOutcome;
import com.defer.backend.integration.ai.AiServiceClient;
import com.defer.backend.integration.ai.dto.AiSupportRequest;
import com.defer.backend.integration.ai.dto.AiSupportResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class TurnOrchestrationService {

    private final ConversationApplicationService conversationService;
    private final CaseFileApplicationService caseFileService;
    private final AiServiceClient aiServiceClient;
    private final DecisionApplicationService decisionService;

    public TurnOrchestrationService(ConversationApplicationService conversationService,
                                     CaseFileApplicationService caseFileService,
                                     AiServiceClient aiServiceClient,
                                     DecisionApplicationService decisionService) {
        this.conversationService = conversationService;
        this.caseFileService = caseFileService;
        this.aiServiceClient = aiServiceClient;
        this.decisionService = decisionService;
    }

    @Transactional
    public TurnResult processTurn(UUID conversationId, String customerMessage) {
        // 1. Append customer message
        Message customerMsg = conversationService.appendMessage(
                conversationId, SenderType.CUSTOMER, customerMessage);

        // 2. Load or create CaseFile
        Conversation conversation = conversationService.loadConversation(conversationId);
        CaseFile caseFile = caseFileService.createOrLoadCaseFile(
                conversationId, conversation.getCustomerId());

        // 3. Load recent messages for context
        List<Message> messages = conversationService.loadMessages(conversationId);

        // 4. Build AI service request
        AiSupportRequest aiRequest = buildAiRequest(
                conversationId, caseFile, customerMsg, messages);

        // 5. Call FastAPI
        AiSupportResponse aiResponse = aiServiceClient.callSupportRespond(aiRequest);

        // 6. Run decision engine
        AiServiceResponse decisionInput = toDecisionInput(aiResponse);
        DecisionOutcome outcome = decisionService.evaluateIncomingTurn(
                conversationId, customerMsg.getId(), decisionInput);

        // 7. Apply memory updates (controlled — not blind write)
        applyMemoryUpdates(caseFile.getId(), aiResponse.memoryUpdate(), caseFile);

        // 8. Persist customer state snapshot
        caseFileService.snapshotCustomerState(
                caseFile.getId(),
                customerMsg.getId(),
                aiResponse.customerState().frustrationScore(),
                aiResponse.customerState().confusionScore(),
                aiResponse.customerState().effortScore(),
                aiResponse.customerState().trustRiskScore(),
                0.0 // degradation — computed from delta, not provided by AI
        );

        // 9. Increment repetition if detected
        if (aiResponse.decisionSignals().repetitionDetected()) {
            caseFileService.incrementRepetition(caseFile.getId());
        }

        // 10. Append assistant reply
        Message assistantMsg = conversationService.appendMessage(
                conversationId, SenderType.ASSISTANT, aiResponse.responseDraft());

        // 11. Update CaseFile resolution mode and touch updatedAt
        caseFileService.setResolutionMode(caseFile.getId(), outcome.selectedMode());

        // 12. If escalation, mark candidate (handoff will be wired in Sprint 8)
        if (outcome.escalationRequired()) {
            caseFileService.markEscalationCandidate(caseFile.getId());
        }

        return new TurnResult(
                assistantMsg,
                outcome.selectedMode().name(),
                outcome.escalationRequired(),
                caseFile.getId()
        );
    }

    private AiSupportRequest buildAiRequest(UUID conversationId, CaseFile caseFile,
                                              Message latestMsg, List<Message> messages) {
        List<AiSupportRequest.HistoryEntry> history = messages.stream()
                .map(m -> new AiSupportRequest.HistoryEntry(
                        m.getSenderType().name(), m.getBody()))
                .toList();

        Map<String, Object> currentState = new HashMap<>();
        currentState.put("repetition_count", caseFile.getRepetitionCount());

        AiSupportRequest.CaseSummary caseSummary = new AiSupportRequest.CaseSummary(
                caseFile.getIssueSummary(),
                caseFile.getCustomerGoal(),
                List.of(),
                List.of(),
                currentState
        );

        return new AiSupportRequest(
                UUID.randomUUID(),
                conversationId,
                caseFile.getId(),
                new AiSupportRequest.LatestMessage(
                        latestMsg.getId(), "CUSTOMER", latestMsg.getBody()),
                history,
                caseSummary
        );
    }

    private AiServiceResponse toDecisionInput(AiSupportResponse r) {
        return new AiServiceResponse(
                r.suggestedMode(),
                r.responseDraft(),
                r.retrievalConfidence(),
                new AiServiceResponse.CustomerState(
                        r.customerState().frustrationScore(),
                        r.customerState().confusionScore(),
                        r.customerState().effortScore(),
                        r.customerState().trustRiskScore(),
                        r.customerState().isRepeated(),
                        r.customerState().repetitionSimilarity()
                ),
                new AiServiceResponse.MemoryUpdate(
                        r.memoryUpdate().updatedIssueSummary(),
                        r.memoryUpdate().customerGoal(),
                        r.memoryUpdate().attemptedActions(),
                        r.memoryUpdate().openQuestions()
                ),
                new AiServiceResponse.DecisionSignals(
                        r.decisionSignals().loopDetected(),
                        r.decisionSignals().repetitionDetected(),
                        r.decisionSignals().clarificationNeeded()
                )
        );
    }

    private void applyMemoryUpdates(UUID caseFileId, AiSupportResponse.MemoryUpdate update,
                                     CaseFile existing) {
        // Only update issue summary if materially different
        if (update.updatedIssueSummary() != null && !update.updatedIssueSummary().isBlank()) {
            if (existing.getIssueSummary() == null
                    || !existing.getIssueSummary().equals(update.updatedIssueSummary())) {
                caseFileService.updateIssueSummary(caseFileId, update.updatedIssueSummary());
            }
        }

        // Update customer goal
        if (update.customerGoal() != null && !update.customerGoal().isBlank()) {
            caseFileService.updateCustomerGoal(caseFileId, update.customerGoal());
        }

        // Record attempted actions (avoid duplicates — record only new ones)
        if (update.attemptedActions() != null) {
            for (String action : update.attemptedActions()) {
                caseFileService.recordAttemptedAction(
                        caseFileId, ActionType.OTHER, action,
                        ActionOutcome.PENDING, ActionSource.AI);
            }
        }

        // Record open questions
        if (update.openQuestions() != null) {
            for (String question : update.openQuestions()) {
                caseFileService.recordOpenQuestion(caseFileId, question, ActionSource.AI);
            }
        }
    }

    public record TurnResult(
            Message assistantMessage,
            String resolutionMode,
            boolean escalated,
            UUID caseFileId
    ) {}
}
