package com.defer.backend.policy.contracts;

import java.math.BigDecimal;
import java.util.UUID;

public record PolicySimulationRequest(
        UUID conversationId,
        PolicyOverride policyOverride
) {
    public record PolicyOverride(
            BigDecimal escalationFrustrationThreshold,
            BigDecimal escalationEffortThreshold,
            Integer escalationRepetitionCount,
            BigDecimal minConfidenceForDirectAnswer,
            BigDecimal requiresReviewConfidenceFloor,
            Boolean sensitiveTopicsEnabled
    ) {}
}
