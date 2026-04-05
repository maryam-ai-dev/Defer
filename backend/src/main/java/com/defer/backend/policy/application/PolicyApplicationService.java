package com.defer.backend.policy.application;

import com.defer.backend.decision.domain.DecisionContext;
import com.defer.backend.decision.domain.DecisionOutcome;
import com.defer.backend.decision.domain.service.ResolutionModeSelector;
import com.defer.backend.decision.infrastructure.DecisionLogEntity;
import com.defer.backend.decision.infrastructure.DecisionRepositoryJpa;
import com.defer.backend.policy.contracts.PolicySimulationRequest;
import com.defer.backend.policy.contracts.PolicySimulationResponse;
import com.defer.backend.policy.contracts.SupportPolicyUpdateRequest;
import com.defer.backend.policy.domain.SupportPolicy;
import com.defer.backend.policy.infrastructure.PolicyRepositoryJpa;
import com.defer.backend.policy.infrastructure.SupportPolicyEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class PolicyApplicationService {

    private final PolicyRepositoryJpa repo;
    private final DecisionRepositoryJpa decisionLogRepo;

    public PolicyApplicationService(PolicyRepositoryJpa repo, DecisionRepositoryJpa decisionLogRepo) {
        this.repo = repo;
        this.decisionLogRepo = decisionLogRepo;
    }

    @Transactional(readOnly = true)
    public SupportPolicy getActivePolicy() {
        SupportPolicyEntity entity = repo.findByActiveTrue()
                .orElseThrow(() -> new IllegalStateException("No active support policy found"));
        return toDomain(entity);
    }

    @Transactional
    public SupportPolicy updatePolicy(SupportPolicyUpdateRequest request) {
        SupportPolicyEntity entity = repo.findByActiveTrue()
                .orElseThrow(() -> new IllegalStateException("No active support policy found"));

        if (request.escalationFrustrationThreshold() != null)
            entity.setEscalationFrustrationThreshold(request.escalationFrustrationThreshold());
        if (request.escalationEffortThreshold() != null)
            entity.setEscalationEffortThreshold(request.escalationEffortThreshold());
        if (request.escalationRepetitionCount() != null)
            entity.setEscalationRepetitionCount(request.escalationRepetitionCount());
        if (request.minConfidenceForDirectAnswer() != null)
            entity.setMinConfidenceForDirectAnswer(request.minConfidenceForDirectAnswer());
        if (request.requiresReviewConfidenceFloor() != null)
            entity.setRequiresReviewConfidenceFloor(request.requiresReviewConfidenceFloor());
        if (request.sensitiveTopicsEnabled() != null)
            entity.setSensitiveTopicsEnabled(request.sensitiveTopicsEnabled());

        entity.setUpdatedAt(Instant.now());
        repo.save(entity);
        return toDomain(entity);
    }

    @Transactional(readOnly = true)
    public PolicySimulationResponse simulate(PolicySimulationRequest request) {
        // Build override policy from request
        SupportPolicy overridePolicy = getActivePolicy();
        PolicySimulationRequest.PolicyOverride o = request.policyOverride();
        if (o.escalationFrustrationThreshold() != null)
            overridePolicy.setEscalationFrustrationThreshold(o.escalationFrustrationThreshold().doubleValue());
        if (o.escalationEffortThreshold() != null)
            overridePolicy.setEscalationEffortThreshold(o.escalationEffortThreshold().doubleValue());
        if (o.escalationRepetitionCount() != null)
            overridePolicy.setEscalationRepetitionCount(o.escalationRepetitionCount());
        if (o.minConfidenceForDirectAnswer() != null)
            overridePolicy.setMinConfidenceForDirectAnswer(o.minConfidenceForDirectAnswer().doubleValue());
        if (o.requiresReviewConfidenceFloor() != null)
            overridePolicy.setRequiresReviewConfidenceFloor(o.requiresReviewConfidenceFloor().doubleValue());
        if (o.sensitiveTopicsEnabled() != null)
            overridePolicy.setSensitiveTopicsEnabled(o.sensitiveTopicsEnabled());

        // Load stored decision logs for this conversation
        List<DecisionLogEntity> logs = decisionLogRepo
                .findByConversationIdOrderByCreatedAtDesc(request.conversationId());
        // Reverse to chronological order
        List<DecisionLogEntity> chronological = new ArrayList<>(logs);
        java.util.Collections.reverse(chronological);

        List<PolicySimulationResponse.TurnComparison> turns = new ArrayList<>();
        for (int i = 0; i < chronological.size(); i++) {
            DecisionLogEntity log = chronological.get(i);

            // Rebuild DecisionContext from stored inputs
            DecisionContext ctx = new DecisionContext(
                    log.getConversationId(),
                    null, // caseFileId not needed for simulation
                    log.getMessageId(),
                    log.getRetrievalConfidence() != null ? log.getRetrievalConfidence().doubleValue() : 0.0,
                    log.getFrustrationScore() != null ? log.getFrustrationScore().doubleValue() : 0.0,
                    log.getEffortScore() != null ? log.getEffortScore().doubleValue() : 0.0,
                    log.getTrustRiskScore() != null ? log.getTrustRiskScore().doubleValue() : 0.0,
                    log.getLoopScore() != null ? log.getLoopScore().doubleValue() : 0.0,
                    log.getRepetitionCount() != null ? log.getRepetitionCount() : 0,
                    log.getSuggestedMode(),
                    overridePolicy
            );

            // Re-run selector with override policy
            DecisionOutcome simulated = ResolutionModeSelector.select(ctx);
            String simulatedMode = simulated.selectedMode().name();
            String originalSelected = log.getSelectedMode();

            turns.add(new PolicySimulationResponse.TurnComparison(
                    i,
                    log.getSuggestedMode(),
                    originalSelected,
                    simulatedMode,
                    !simulatedMode.equals(originalSelected)
            ));
        }

        return new PolicySimulationResponse(turns);
    }

    private SupportPolicy toDomain(SupportPolicyEntity e) {
        SupportPolicy p = new SupportPolicy();
        p.setId(e.getId());
        p.setEscalationFrustrationThreshold(e.getEscalationFrustrationThreshold().doubleValue());
        p.setEscalationEffortThreshold(e.getEscalationEffortThreshold().doubleValue());
        p.setEscalationRepetitionCount(e.getEscalationRepetitionCount());
        p.setMinConfidenceForDirectAnswer(e.getMinConfidenceForDirectAnswer().doubleValue());
        p.setRequiresReviewConfidenceFloor(e.getRequiresReviewConfidenceFloor().doubleValue());
        p.setSensitiveTopicsEnabled(e.isSensitiveTopicsEnabled());
        p.setActive(e.isActive());
        p.setCreatedAt(e.getCreatedAt());
        p.setUpdatedAt(e.getUpdatedAt());
        return p;
    }
}
