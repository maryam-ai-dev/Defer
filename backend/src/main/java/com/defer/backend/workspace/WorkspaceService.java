package com.defer.backend.workspace;

import com.defer.backend.casefile.domain.CaseFile;
import com.defer.backend.casefile.infrastructure.*;
import com.defer.backend.conversation.domain.Conversation;
import com.defer.backend.conversation.domain.Message;
import com.defer.backend.conversation.infrastructure.ConversationMapper;
import com.defer.backend.conversation.infrastructure.ConversationRepositoryJpa;
import com.defer.backend.conversation.infrastructure.MessageRepositoryJpa;
import com.defer.backend.decision.infrastructure.DecisionLogEntity;
import com.defer.backend.decision.infrastructure.DecisionMapper;
import com.defer.backend.decision.infrastructure.DecisionRepositoryJpa;
import com.defer.backend.handoff.domain.HandoffPacket;
import com.defer.backend.handoff.infrastructure.HandoffPacketEntity;
import com.defer.backend.handoff.infrastructure.HandoffRepositoryJpa;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class WorkspaceService {

    private final ConversationRepositoryJpa conversationRepo;
    private final ConversationMapper conversationMapper;
    private final MessageRepositoryJpa messageRepo;
    private final CaseFileRepositoryJpa caseFileRepo;
    private final CaseFileMapper caseFileMapper;
    private final AttemptedActionRepositoryJpa attemptedActionRepo;
    private final OpenQuestionRepositoryJpa openQuestionRepo;
    private final CustomerStateSnapshotRepositoryJpa snapshotRepo;
    private final DecisionRepositoryJpa decisionRepo;
    private final HandoffRepositoryJpa handoffRepo;
    private final ObjectMapper objectMapper;

    public WorkspaceService(ConversationRepositoryJpa conversationRepo,
                             ConversationMapper conversationMapper,
                             MessageRepositoryJpa messageRepo,
                             CaseFileRepositoryJpa caseFileRepo,
                             CaseFileMapper caseFileMapper,
                             AttemptedActionRepositoryJpa attemptedActionRepo,
                             OpenQuestionRepositoryJpa openQuestionRepo,
                             CustomerStateSnapshotRepositoryJpa snapshotRepo,
                             DecisionRepositoryJpa decisionRepo,
                             HandoffRepositoryJpa handoffRepo,
                             ObjectMapper objectMapper) {
        this.conversationRepo = conversationRepo;
        this.conversationMapper = conversationMapper;
        this.messageRepo = messageRepo;
        this.caseFileRepo = caseFileRepo;
        this.caseFileMapper = caseFileMapper;
        this.attemptedActionRepo = attemptedActionRepo;
        this.openQuestionRepo = openQuestionRepo;
        this.snapshotRepo = snapshotRepo;
        this.decisionRepo = decisionRepo;
        this.handoffRepo = handoffRepo;
        this.objectMapper = objectMapper;
    }

    @Transactional(readOnly = true)
    public WorkspaceResponse getWorkspace(UUID conversationId) {
        // Conversation
        Conversation conv = conversationRepo.findById(conversationId)
                .map(conversationMapper::toDomain)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found: " + conversationId));

        var convSummary = new WorkspaceResponse.ConversationSummary(
                conv.getId(), conv.getStatus().name(), conv.getChannel(), conv.getCreatedAt());

        // Messages
        List<WorkspaceResponse.MessageItem> messages = messageRepo
                .findByConversationIdOrderByTurnIndexAsc(conversationId)
                .stream()
                .map(m -> new WorkspaceResponse.MessageItem(
                        m.getId(), m.getSenderType(), m.getBody(), m.getTurnIndex(), m.getCreatedAt()))
                .toList();

        // CaseFile
        CaseFileEntity caseFileEntity = caseFileRepo.findByConversationId(conversationId).orElse(null);
        WorkspaceResponse.CaseFileSummary caseFileSummary = null;
        List<WorkspaceResponse.AttemptedActionItem> actions = List.of();
        List<WorkspaceResponse.OpenQuestionItem> questions = List.of();
        WorkspaceResponse.CustomerStateSummary latestState = null;

        if (caseFileEntity != null) {
            CaseFile cf = caseFileMapper.toDomain(caseFileEntity);
            caseFileSummary = new WorkspaceResponse.CaseFileSummary(
                    cf.getId(), cf.getStatus().name(), cf.getIssueSummary(), cf.getCustomerGoal(),
                    cf.getCurrentResolutionMode() != null ? cf.getCurrentResolutionMode().name() : null,
                    cf.isEscalationCandidate(), cf.getRepetitionCount(),
                    cf.getCurrentFrustrationScore(), cf.getCurrentConfusionScore(),
                    cf.getCurrentEffortScore(), cf.getCurrentTrustRiskScore(),
                    cf.getUpdatedAt());

            actions = attemptedActionRepo.findByCaseFileIdOrderByCreatedAtAsc(cf.getId())
                    .stream()
                    .map(a -> new WorkspaceResponse.AttemptedActionItem(
                            a.getId(), a.getActionType(), a.getActionSummary(),
                            a.getOutcome(), a.getSource(), a.getCreatedAt()))
                    .toList();

            questions = openQuestionRepo.findByCaseFileIdOrderByCreatedAtAsc(cf.getId())
                    .stream()
                    .map(q -> new WorkspaceResponse.OpenQuestionItem(
                            q.getId(), q.getQuestionText(), q.getStatus(),
                            q.getSource(), q.getCreatedAt()))
                    .toList();

            // Latest snapshot
            var snapshots = snapshotRepo.findByCaseFileIdOrderByCreatedAtAsc(cf.getId());
            if (!snapshots.isEmpty()) {
                var latest = snapshots.get(snapshots.size() - 1);
                latestState = new WorkspaceResponse.CustomerStateSummary(
                        latest.getFrustrationScore() != null ? latest.getFrustrationScore().doubleValue() : 0,
                        latest.getConfusionScore() != null ? latest.getConfusionScore().doubleValue() : 0,
                        latest.getEffortScore() != null ? latest.getEffortScore().doubleValue() : 0,
                        latest.getTrustRiskScore() != null ? latest.getTrustRiskScore().doubleValue() : 0,
                        latest.getDegradationScore() != null ? latest.getDegradationScore().doubleValue() : 0,
                        latest.getCreatedAt());
            }
        }

        // Latest decision
        WorkspaceResponse.DecisionSummary latestDecision = null;
        var decisions = decisionRepo.findByConversationIdOrderByCreatedAtDesc(conversationId);
        if (!decisions.isEmpty()) {
            DecisionLogEntity d = decisions.get(0);
            DecisionMapper.DecisionLogView view = DecisionMapper.toView(d, objectMapper);
            latestDecision = new WorkspaceResponse.DecisionSummary(
                    view.selectedMode(), view.rationale(), view.retrievalConfidence(), view.createdAt());
        }

        // Handoff
        WorkspaceResponse.HandoffSummary handoffSummary = null;
        if (caseFileEntity != null) {
            handoffRepo.findByCaseFileId(caseFileEntity.getId()).ifPresent(h -> {
                // can't assign to local from lambda, use a workaround
            });
            var handoffOpt = handoffRepo.findByCaseFileId(caseFileEntity.getId());
            if (handoffOpt.isPresent()) {
                HandoffPacketEntity h = handoffOpt.get();
                Map<String, Double> state;
                try {
                    state = objectMapper.readValue(h.getCustomerStateJson(), Map.class);
                } catch (Exception e) {
                    state = Map.of();
                }
                handoffSummary = new WorkspaceResponse.HandoffSummary(
                        h.getId(), h.getEscalationReason(), h.getIssueSummary(),
                        h.getSuggestedNextAction(), state, h.getCreatedAt());
            }
        }

        return new WorkspaceResponse(
                convSummary, messages, caseFileSummary, actions, questions,
                latestState, latestDecision, handoffSummary);
    }
}
