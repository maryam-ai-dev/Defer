package com.defer.backend.casefile.infrastructure;

import com.defer.backend.casefile.domain.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.math.BigDecimal;

@Mapper(componentModel = "spring", imports = {
        CaseStatus.class, ResolutionMode.class,
        ActionType.class, ActionOutcome.class, ActionSource.class,
        QuestionStatus.class, BigDecimal.class
})
public interface CaseFileMapper {

    // --- CaseFile ---
    @Mapping(target = "status", expression = "java(entity.getStatus() != null ? CaseStatus.valueOf(entity.getStatus()) : null)")
    @Mapping(target = "currentResolutionMode", expression = "java(entity.getCurrentResolutionMode() != null ? ResolutionMode.valueOf(entity.getCurrentResolutionMode()) : null)")
    @Mapping(target = "currentFrustrationScore", expression = "java(entity.getCurrentFrustrationScore() != null ? entity.getCurrentFrustrationScore().doubleValue() : 0.0)")
    @Mapping(target = "currentConfusionScore", expression = "java(entity.getCurrentConfusionScore() != null ? entity.getCurrentConfusionScore().doubleValue() : 0.0)")
    @Mapping(target = "currentEffortScore", expression = "java(entity.getCurrentEffortScore() != null ? entity.getCurrentEffortScore().doubleValue() : 0.0)")
    @Mapping(target = "currentTrustRiskScore", expression = "java(entity.getCurrentTrustRiskScore() != null ? entity.getCurrentTrustRiskScore().doubleValue() : 0.0)")
    CaseFile toDomain(CaseFileEntity entity);

    @Mapping(target = "status", expression = "java(domain.getStatus() != null ? domain.getStatus().name() : null)")
    @Mapping(target = "currentResolutionMode", expression = "java(domain.getCurrentResolutionMode() != null ? domain.getCurrentResolutionMode().name() : null)")
    @Mapping(target = "currentFrustrationScore", expression = "java(BigDecimal.valueOf(domain.getCurrentFrustrationScore()))")
    @Mapping(target = "currentConfusionScore", expression = "java(BigDecimal.valueOf(domain.getCurrentConfusionScore()))")
    @Mapping(target = "currentEffortScore", expression = "java(BigDecimal.valueOf(domain.getCurrentEffortScore()))")
    @Mapping(target = "currentTrustRiskScore", expression = "java(BigDecimal.valueOf(domain.getCurrentTrustRiskScore()))")
    CaseFileEntity toEntity(CaseFile domain);

    // --- AttemptedAction ---
    @Mapping(target = "actionType", expression = "java(entity.getActionType() != null ? ActionType.valueOf(entity.getActionType()) : null)")
    @Mapping(target = "outcome", expression = "java(entity.getOutcome() != null ? ActionOutcome.valueOf(entity.getOutcome()) : null)")
    @Mapping(target = "source", expression = "java(entity.getSource() != null ? ActionSource.valueOf(entity.getSource()) : null)")
    AttemptedAction toDomain(AttemptedActionEntity entity);

    @Mapping(target = "actionType", expression = "java(domain.getActionType() != null ? domain.getActionType().name() : null)")
    @Mapping(target = "outcome", expression = "java(domain.getOutcome() != null ? domain.getOutcome().name() : null)")
    @Mapping(target = "source", expression = "java(domain.getSource() != null ? domain.getSource().name() : null)")
    AttemptedActionEntity toEntity(AttemptedAction domain);

    // --- OpenQuestion ---
    @Mapping(target = "status", expression = "java(entity.getStatus() != null ? QuestionStatus.valueOf(entity.getStatus()) : null)")
    @Mapping(target = "source", expression = "java(entity.getSource() != null ? ActionSource.valueOf(entity.getSource()) : null)")
    OpenQuestion toDomain(OpenQuestionEntity entity);

    @Mapping(target = "status", expression = "java(domain.getStatus() != null ? domain.getStatus().name() : null)")
    @Mapping(target = "source", expression = "java(domain.getSource() != null ? domain.getSource().name() : null)")
    OpenQuestionEntity toEntity(OpenQuestion domain);

    // --- CustomerStateSnapshot ---
    @Mapping(target = "frustrationScore", expression = "java(entity.getFrustrationScore() != null ? entity.getFrustrationScore().doubleValue() : 0.0)")
    @Mapping(target = "confusionScore", expression = "java(entity.getConfusionScore() != null ? entity.getConfusionScore().doubleValue() : 0.0)")
    @Mapping(target = "effortScore", expression = "java(entity.getEffortScore() != null ? entity.getEffortScore().doubleValue() : 0.0)")
    @Mapping(target = "trustRiskScore", expression = "java(entity.getTrustRiskScore() != null ? entity.getTrustRiskScore().doubleValue() : 0.0)")
    @Mapping(target = "degradationScore", expression = "java(entity.getDegradationScore() != null ? entity.getDegradationScore().doubleValue() : 0.0)")
    CustomerStateSnapshot toDomain(CustomerStateSnapshotEntity entity);

    @Mapping(target = "frustrationScore", expression = "java(BigDecimal.valueOf(domain.getFrustrationScore()))")
    @Mapping(target = "confusionScore", expression = "java(BigDecimal.valueOf(domain.getConfusionScore()))")
    @Mapping(target = "effortScore", expression = "java(BigDecimal.valueOf(domain.getEffortScore()))")
    @Mapping(target = "trustRiskScore", expression = "java(BigDecimal.valueOf(domain.getTrustRiskScore()))")
    @Mapping(target = "degradationScore", expression = "java(BigDecimal.valueOf(domain.getDegradationScore()))")
    @Mapping(target = "notes", ignore = true)
    CustomerStateSnapshotEntity toEntity(CustomerStateSnapshot domain);
}
