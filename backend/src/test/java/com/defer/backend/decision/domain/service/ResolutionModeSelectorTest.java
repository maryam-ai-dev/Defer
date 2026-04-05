package com.defer.backend.decision.domain.service;

import com.defer.backend.casefile.domain.ResolutionMode;
import com.defer.backend.decision.domain.DecisionContext;
import com.defer.backend.decision.domain.DecisionOutcome;
import com.defer.backend.policy.domain.SupportPolicy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class ResolutionModeSelectorTest {

    private SupportPolicy policy;

    @BeforeEach
    void setUp() {
        policy = new SupportPolicy();
        policy.setId(UUID.randomUUID());
        policy.setEscalationFrustrationThreshold(0.75);
        policy.setEscalationEffortThreshold(0.70);
        policy.setEscalationRepetitionCount(2);
        policy.setMinConfidenceForDirectAnswer(0.45);
        policy.setRequiresReviewConfidenceFloor(0.55);
        policy.setSensitiveTopicsEnabled(true);
    }

    @Test
    void highFrustrationAndEffortAndRepetition_shouldEscalate() {
        DecisionContext ctx = new DecisionContext(
                UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID(),
                0.8, 0.85, 0.80, 0.6, 0.0, 3,
                "DIRECT_ANSWER", policy
        );

        DecisionOutcome outcome = ResolutionModeSelector.select(ctx);

        assertEquals(ResolutionMode.HUMAN_ESCALATION, outcome.selectedMode());
        assertTrue(outcome.escalationRequired());
    }

    @Test
    void lowConfidenceWithDistress_shouldEscalate() {
        // In-scope (confidence > 0.25), has distress (frustration > 0.3)
        DecisionContext ctx = new DecisionContext(
                UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID(),
                0.30, 0.5, 0.5, 0.3, 0.0, 1,
                "HUMAN_REVIEW_DRAFT", policy
        );

        DecisionOutcome outcome = ResolutionModeSelector.select(ctx);

        assertEquals(ResolutionMode.HUMAN_ESCALATION, outcome.selectedMode());
        assertTrue(outcome.escalationRequired());
    }

    @Test
    void lowConfidenceNoDistress_shouldReviewNotEscalate() {
        // In-scope but calm first turn — should NOT escalate
        DecisionContext ctx = new DecisionContext(
                UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID(),
                0.30, 0.1, 0.1, 0.1, 0.0, 0,
                "DIRECT_ANSWER", policy
        );

        DecisionOutcome outcome = ResolutionModeSelector.select(ctx);

        assertEquals(ResolutionMode.HUMAN_REVIEW_DRAFT, outcome.selectedMode());
        assertFalse(outcome.escalationRequired());
    }

    @Test
    void veryLowConfidenceNoDistress_shouldSafeRefuse() {
        // Off-topic: very low confidence, no frustration, first turn
        DecisionContext ctx = new DecisionContext(
                UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID(),
                0.15, 0.05, 0.1, 0.05, 0.0, 0,
                "DIRECT_ANSWER", policy
        );

        DecisionOutcome outcome = ResolutionModeSelector.select(ctx);

        assertEquals(ResolutionMode.SAFE_REFUSAL, outcome.selectedMode());
        assertFalse(outcome.escalationRequired());
    }

    @Test
    void lowConfidenceOutOfScope_shouldSafeRefuse() {
        DecisionContext ctx = new DecisionContext(
                UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID(),
                0.20, 0.1, 0.1, 0.1, 0.0, 0,
                "SAFE_REFUSAL", policy
        );

        DecisionOutcome outcome = ResolutionModeSelector.select(ctx);

        assertEquals(ResolutionMode.SAFE_REFUSAL, outcome.selectedMode());
        assertFalse(outcome.escalationRequired());
    }

    @Test
    void mediumConfidence_shouldRequireReview() {
        DecisionContext ctx = new DecisionContext(
                UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID(),
                0.50, 0.2, 0.2, 0.1, 0.0, 0,
                "DIRECT_ANSWER", policy
        );

        DecisionOutcome outcome = ResolutionModeSelector.select(ctx);

        assertEquals(ResolutionMode.HUMAN_REVIEW_DRAFT, outcome.selectedMode());
        assertFalse(outcome.escalationRequired());
    }

    @Test
    void highConfidenceNormal_shouldAcceptSuggestedMode() {
        DecisionContext ctx = new DecisionContext(
                UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID(),
                0.75, 0.2, 0.2, 0.1, 0.0, 0,
                "DIRECT_ANSWER", policy
        );

        DecisionOutcome outcome = ResolutionModeSelector.select(ctx);

        assertEquals(ResolutionMode.DIRECT_ANSWER, outcome.selectedMode());
        assertFalse(outcome.escalationRequired());
    }
}
