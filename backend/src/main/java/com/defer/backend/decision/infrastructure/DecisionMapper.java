package com.defer.backend.decision.infrastructure;

import com.defer.backend.casefile.domain.ResolutionMode;

import java.util.List;
import java.util.UUID;

public class DecisionMapper {

    public record DecisionLogView(
            UUID id,
            UUID conversationId,
            UUID messageId,
            double retrievalConfidence,
            double frustrationScore,
            double effortScore,
            double trustRiskScore,
            double loopScore,
            int repetitionCount,
            String suggestedMode,
            String selectedMode,
            List<String> rationale,
            java.time.Instant createdAt
    ) {}

    public static DecisionLogView toView(DecisionLogEntity entity, com.fasterxml.jackson.databind.ObjectMapper objectMapper) {
        List<String> rationale;
        try {
            rationale = objectMapper.readValue(
                    entity.getRationaleJson(),
                    objectMapper.getTypeFactory().constructCollectionType(List.class, String.class)
            );
        } catch (Exception e) {
            rationale = List.of();
        }

        return new DecisionLogView(
                entity.getId(),
                entity.getConversationId(),
                entity.getMessageId(),
                entity.getRetrievalConfidence() != null ? entity.getRetrievalConfidence().doubleValue() : 0.0,
                entity.getFrustrationScore() != null ? entity.getFrustrationScore().doubleValue() : 0.0,
                entity.getEffortScore() != null ? entity.getEffortScore().doubleValue() : 0.0,
                entity.getTrustRiskScore() != null ? entity.getTrustRiskScore().doubleValue() : 0.0,
                entity.getLoopScore() != null ? entity.getLoopScore().doubleValue() : 0.0,
                entity.getRepetitionCount() != null ? entity.getRepetitionCount() : 0,
                entity.getSuggestedMode(),
                entity.getSelectedMode(),
                rationale,
                entity.getCreatedAt()
        );
    }
}
