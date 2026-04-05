package com.defer.backend.policy.api;

import com.defer.backend.policy.application.PolicyApplicationService;
import com.defer.backend.policy.contracts.PolicySimulationRequest;
import com.defer.backend.policy.contracts.PolicySimulationResponse;
import com.defer.backend.policy.contracts.SupportPolicyResponse;
import com.defer.backend.policy.contracts.SupportPolicyUpdateRequest;
import com.defer.backend.policy.domain.SupportPolicy;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/policies")
public class PolicyController {

    private final PolicyApplicationService service;

    public PolicyController(PolicyApplicationService service) {
        this.service = service;
    }

    @GetMapping("/active")
    public SupportPolicyResponse getActivePolicy() {
        return toResponse(service.getActivePolicy());
    }

    @PutMapping("/active")
    public SupportPolicyResponse updatePolicy(@RequestBody SupportPolicyUpdateRequest request) {
        return toResponse(service.updatePolicy(request));
    }

    @PostMapping("/simulate")
    public PolicySimulationResponse simulate(@RequestBody PolicySimulationRequest request) {
        return service.simulate(request);
    }

    private SupportPolicyResponse toResponse(SupportPolicy p) {
        return new SupportPolicyResponse(
                p.getId(),
                p.getEscalationFrustrationThreshold(),
                p.getEscalationEffortThreshold(),
                p.getEscalationRepetitionCount(),
                p.getMinConfidenceForDirectAnswer(),
                p.getRequiresReviewConfidenceFloor(),
                p.isSensitiveTopicsEnabled(),
                p.getCreatedAt(),
                p.getUpdatedAt()
        );
    }
}
