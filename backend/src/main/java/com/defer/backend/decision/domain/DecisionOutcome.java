package com.defer.backend.decision.domain;

import com.defer.backend.casefile.domain.ResolutionMode;

import java.util.List;

public record DecisionOutcome(
        ResolutionMode selectedMode,
        List<String> rationale,
        boolean escalationRequired
) {}
