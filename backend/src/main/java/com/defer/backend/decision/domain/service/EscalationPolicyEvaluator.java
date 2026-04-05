package com.defer.backend.decision.domain.service;

import com.defer.backend.decision.domain.DecisionContext;
import com.defer.backend.policy.domain.SupportPolicy;

public class EscalationPolicyEvaluator {

    /**
     * Check if frustration + effort + repetition triggers escalation.
     * Only escalate on genuine distress signals, not first-turn low-confidence.
     */
    public static boolean shouldEscalate(DecisionContext ctx) {
        SupportPolicy policy = ctx.policy();

        boolean highFrustration = ctx.frustrationScore() > policy.getEscalationFrustrationThreshold();
        boolean highEffort = ctx.effortScore() > policy.getEscalationEffortThreshold();
        boolean repeatedFailure = ctx.repetitionCount() >= policy.getEscalationRepetitionCount();

        // Escalate if frustration AND effort are high AND repeated
        if (highFrustration && highEffort && repeatedFailure) {
            return true;
        }

        // Also escalate if any two of three are triggered and trust risk is high
        int triggers = (highFrustration ? 1 : 0) + (highEffort ? 1 : 0) + (repeatedFailure ? 1 : 0);
        return triggers >= 2 && ctx.trustRiskScore() > 0.7;
    }

    /**
     * Determine if the query is in-scope (customer has a legitimate support issue)
     * vs out-of-scope (query is unrelated to supported topics).
     *
     * Uses multiple signals:
     * - AI suggested SAFE_REFUSAL → definitely out of scope
     * - Very low confidence + no frustration + first turn → likely out of scope
     * - Any frustration/effort signals → treat as in-scope (customer has a real issue)
     */
    public static boolean isInScope(DecisionContext ctx) {
        // If the AI explicitly suggested SAFE_REFUSAL, it's out of scope
        if ("SAFE_REFUSAL".equals(ctx.suggestedMode())) {
            return false;
        }

        // Very low confidence with no distress signals = likely off-topic
        // Only trigger for truly unrelated queries (confidence < 0.15)
        boolean veryLowConfidence = ctx.retrievalConfidence() < 0.15;
        boolean noDistressSignals = ctx.frustrationScore() < 0.05
                && ctx.effortScore() < 0.15
                && ctx.repetitionCount() == 0;

        if (veryLowConfidence && noDistressSignals) {
            return false;
        }

        return true;
    }
}
