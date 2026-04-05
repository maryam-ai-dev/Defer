package com.defer.backend.decision.domain.service;

import com.defer.backend.decision.domain.DecisionContext;
import com.defer.backend.policy.domain.SupportPolicy;

public class EscalationPolicyEvaluator {

    /**
     * Check if frustration + effort + repetition triggers escalation.
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
     * For MVP: if confidence is extremely low AND suggested mode is not an
     * escalation-type mode, treat as potentially out of scope.
     */
    public static boolean isInScope(DecisionContext ctx) {
        // If the AI suggested any mode other than SAFE_REFUSAL, the topic is in-scope
        return !"SAFE_REFUSAL".equals(ctx.suggestedMode());
    }
}
