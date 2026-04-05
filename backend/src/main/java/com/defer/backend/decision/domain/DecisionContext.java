package com.defer.backend.decision.domain;

import com.defer.backend.policy.domain.SupportPolicy;

import java.util.UUID;

public record DecisionContext(
        UUID conversationId,
        UUID caseFileId,
        UUID messageId,
        double retrievalConfidence,
        double frustrationScore,
        double effortScore,
        double trustRiskScore,
        double loopScore,
        int repetitionCount,
        String suggestedMode,
        SupportPolicy policy
) {}
