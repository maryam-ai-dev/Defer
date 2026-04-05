package com.defer.backend.policy.contracts;

import java.util.List;

public record PolicySimulationResponse(
        List<TurnComparison> turns
) {
    public record TurnComparison(
            int turnIndex,
            String suggestedMode,
            String selectedMode,
            String simulatedMode,
            boolean changed
    ) {}
}
