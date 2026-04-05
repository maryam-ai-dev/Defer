package com.defer.backend.casefile.api;

import com.defer.backend.casefile.application.CaseFileApplicationService;
import com.defer.backend.casefile.contracts.*;
import com.defer.backend.casefile.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class CaseFileController {

    private final CaseFileApplicationService service;

    public CaseFileController(CaseFileApplicationService service) {
        this.service = service;
    }

    @PostMapping("/conversations/{conversationId}/case-file")
    @ResponseStatus(HttpStatus.CREATED)
    public CaseFileResponse createCaseFile(@PathVariable UUID conversationId,
                                            @RequestBody CreateCaseFileRequest request) {
        return toResponse(service.createOrLoadCaseFile(conversationId, request.customerId()));
    }

    @GetMapping("/case-files/{caseFileId}")
    public CaseFileResponse getCaseFile(@PathVariable UUID caseFileId) {
        return toResponse(service.getCaseFile(caseFileId));
    }

    @GetMapping("/conversations/{conversationId}/case-file")
    public CaseFileResponse getCaseFileByConversation(@PathVariable UUID conversationId) {
        return toResponse(service.getCaseFileByConversationId(conversationId));
    }

    @PatchMapping("/case-files/{caseFileId}/issue-summary")
    public void updateIssueSummary(@PathVariable UUID caseFileId,
                                    @RequestBody UpdateIssueSummaryRequest request) {
        service.updateIssueSummary(caseFileId, request.issueSummary());
    }

    @PatchMapping("/case-files/{caseFileId}/customer-goal")
    public void updateCustomerGoal(@PathVariable UUID caseFileId,
                                    @RequestBody UpdateCustomerGoalRequest request) {
        service.updateCustomerGoal(caseFileId, request.customerGoal());
    }

    @PostMapping("/case-files/{caseFileId}/attempted-actions")
    @ResponseStatus(HttpStatus.CREATED)
    public void recordAttemptedAction(@PathVariable UUID caseFileId,
                                       @RequestBody RecordAttemptedActionRequest request) {
        service.recordAttemptedAction(
                caseFileId,
                ActionType.valueOf(request.actionType()),
                request.actionSummary(),
                ActionOutcome.valueOf(request.outcome()),
                ActionSource.valueOf(request.source())
        );
    }

    @PostMapping("/case-files/{caseFileId}/open-questions")
    @ResponseStatus(HttpStatus.CREATED)
    public void recordOpenQuestion(@PathVariable UUID caseFileId,
                                    @RequestBody RecordOpenQuestionRequest request) {
        service.recordOpenQuestion(
                caseFileId,
                request.questionText(),
                ActionSource.valueOf(request.source())
        );
    }

    @PostMapping("/case-files/{caseFileId}/state-snapshots")
    @ResponseStatus(HttpStatus.CREATED)
    public void snapshotCustomerState(@PathVariable UUID caseFileId,
                                       @RequestBody SnapshotCustomerStateRequest request) {
        service.snapshotCustomerState(
                caseFileId,
                request.messageId(),
                request.frustrationScore(),
                request.confusionScore(),
                request.effortScore(),
                request.trustRiskScore(),
                request.degradationScore()
        );
    }

    private CaseFileResponse toResponse(CaseFile cf) {
        return new CaseFileResponse(
                cf.getId(),
                cf.getConversationId(),
                cf.getCustomerId(),
                cf.getStatus().name(),
                cf.getIssueSummary(),
                cf.getCustomerGoal(),
                cf.getCurrentResolutionMode() != null ? cf.getCurrentResolutionMode().name() : null,
                cf.isEscalationCandidate(),
                cf.getRepetitionCount(),
                cf.getCurrentFrustrationScore(),
                cf.getCurrentConfusionScore(),
                cf.getCurrentEffortScore(),
                cf.getCurrentTrustRiskScore(),
                cf.getLastAiActionSummary(),
                cf.getCreatedAt(),
                cf.getUpdatedAt()
        );
    }
}
