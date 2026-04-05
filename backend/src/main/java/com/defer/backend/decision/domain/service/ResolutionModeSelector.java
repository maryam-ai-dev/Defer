package com.defer.backend.decision.domain.service;

import com.defer.backend.casefile.domain.ResolutionMode;
import com.defer.backend.decision.domain.DecisionContext;
import com.defer.backend.decision.domain.DecisionOutcome;
import com.defer.backend.policy.domain.SupportPolicy;

import java.util.ArrayList;
import java.util.List;

public class ResolutionModeSelector {

    /**
     * Apply policy rules to select the final ResolutionMode.
     * All thresholds come from the loaded SupportPolicy — never hardcoded.
     */
    public static DecisionOutcome select(DecisionContext ctx) {
        SupportPolicy policy = ctx.policy();
        List<String> rationale = new ArrayList<>();

        // Rule 1: Escalation triggered by frustration + effort + repetition
        if (EscalationPolicyEvaluator.shouldEscalate(ctx)) {
            rationale.add("Escalation triggered: frustration=" + ctx.frustrationScore()
                    + " (threshold=" + policy.getEscalationFrustrationThreshold() + ")"
                    + ", effort=" + ctx.effortScore()
                    + " (threshold=" + policy.getEscalationEffortThreshold() + ")"
                    + ", repetitions=" + ctx.repetitionCount()
                    + " (threshold=" + policy.getEscalationRepetitionCount() + ")");
            return new DecisionOutcome(ResolutionMode.HUMAN_ESCALATION, rationale, true);
        }

        // Rule 2: Low confidence handling
        if (ctx.retrievalConfidence() < policy.getMinConfidenceForDirectAnswer()) {
            boolean inScope = EscalationPolicyEvaluator.isInScope(ctx);

            if (!inScope) {
                // Out of scope — refuse safely, don't waste human agent time
                rationale.add("Low confidence (" + ctx.retrievalConfidence()
                        + " < " + policy.getMinConfidenceForDirectAnswer()
                        + ") on out-of-scope topic — safe refusal");
                return new DecisionOutcome(ResolutionMode.SAFE_REFUSAL, rationale, false);
            }

            // In-scope but low confidence — only escalate if there are distress signals
            boolean hasDistress = ctx.frustrationScore() > 0.1
                    || ctx.effortScore() > 0.2
                    || ctx.repetitionCount() > 0;

            if (hasDistress) {
                rationale.add("Low confidence (" + ctx.retrievalConfidence()
                        + " < " + policy.getMinConfidenceForDirectAnswer()
                        + ") with distress signals — escalating to human");
                return new DecisionOutcome(ResolutionMode.HUMAN_ESCALATION, rationale, true);
            } else {
                rationale.add("Low confidence (" + ctx.retrievalConfidence()
                        + " < " + policy.getMinConfidenceForDirectAnswer()
                        + ") but no distress — draft for human review");
                return new DecisionOutcome(ResolutionMode.HUMAN_REVIEW_DRAFT, rationale, false);
            }
        }

        // Rule 3: Medium confidence — requires review
        if (ctx.retrievalConfidence() < policy.getRequiresReviewConfidenceFloor()) {
            rationale.add("Medium confidence (" + ctx.retrievalConfidence()
                    + " < review floor " + policy.getRequiresReviewConfidenceFloor()
                    + ") — draft requires human review");
            return new DecisionOutcome(ResolutionMode.HUMAN_REVIEW_DRAFT, rationale, false);
        }

        // Rule 4: Use suggested mode from AI
        ResolutionMode suggested;
        try {
            suggested = ResolutionMode.valueOf(ctx.suggestedMode());
        } catch (IllegalArgumentException e) {
            rationale.add("Unknown suggested mode '" + ctx.suggestedMode() + "' — defaulting to HUMAN_REVIEW_DRAFT");
            return new DecisionOutcome(ResolutionMode.HUMAN_REVIEW_DRAFT, rationale, false);
        }

        rationale.add("Confidence=" + ctx.retrievalConfidence()
                + " meets thresholds — accepting AI suggested mode: " + suggested);
        boolean escalation = suggested == ResolutionMode.HUMAN_ESCALATION;
        return new DecisionOutcome(suggested, rationale, escalation);
    }
}
