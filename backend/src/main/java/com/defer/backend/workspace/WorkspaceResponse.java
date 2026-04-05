package com.defer.backend.workspace;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record WorkspaceResponse(
        ConversationSummary conversation,
        List<MessageItem> messages,
        CaseFileSummary caseFile,
        List<AttemptedActionItem> attemptedActions,
        List<OpenQuestionItem> openQuestions,
        CustomerStateSummary latestCustomerState,
        DecisionSummary latestDecision,
        HandoffSummary handoffPacket
) {
    public record ConversationSummary(
            UUID id,
            String status,
            String channel,
            Instant createdAt
    ) {}

    public record MessageItem(
            UUID id,
            String senderType,
            String body,
            int turnIndex,
            Instant createdAt
    ) {}

    public record CaseFileSummary(
            UUID id,
            String status,
            String issueSummary,
            String customerGoal,
            String currentResolutionMode,
            boolean escalationCandidate,
            int repetitionCount,
            double frustrationScore,
            double confusionScore,
            double effortScore,
            double trustRiskScore,
            Instant updatedAt
    ) {}

    public record AttemptedActionItem(
            UUID id,
            String actionType,
            String actionSummary,
            String outcome,
            String source,
            Instant createdAt
    ) {}

    public record OpenQuestionItem(
            UUID id,
            String questionText,
            String status,
            String source,
            Instant createdAt
    ) {}

    public record CustomerStateSummary(
            double frustrationScore,
            double confusionScore,
            double effortScore,
            double trustRiskScore,
            double degradationScore,
            Instant createdAt
    ) {}

    public record DecisionSummary(
            String selectedMode,
            List<String> rationale,
            double retrievalConfidence,
            Instant createdAt
    ) {}

    public record HandoffSummary(
            UUID id,
            String escalationReason,
            String issueSummary,
            String suggestedNextAction,
            Map<String, Double> customerState,
            Instant createdAt
    ) {}
}
