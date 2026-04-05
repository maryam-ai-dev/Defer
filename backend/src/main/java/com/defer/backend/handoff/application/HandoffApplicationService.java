package com.defer.backend.handoff.application;

import com.defer.backend.casefile.application.CaseFileApplicationService;
import com.defer.backend.casefile.domain.CaseFile;
import com.defer.backend.casefile.domain.CaseStatus;
import com.defer.backend.casefile.infrastructure.*;
import com.defer.backend.handoff.domain.HandoffPacket;
import com.defer.backend.handoff.domain.HandoffReason;
import com.defer.backend.handoff.infrastructure.HandoffPacketEntity;
import com.defer.backend.handoff.infrastructure.HandoffRepositoryJpa;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

@Service
public class HandoffApplicationService {

    private final HandoffRepositoryJpa handoffRepo;
    private final CaseFileApplicationService caseFileService;
    private final CaseFileRepositoryJpa caseFileRepo;
    private final CaseFileMapper caseFileMapper;
    private final AttemptedActionRepositoryJpa attemptedActionRepo;
    private final OpenQuestionRepositoryJpa openQuestionRepo;
    private final CustomerStateSnapshotRepositoryJpa snapshotRepo;
    private final ObjectMapper objectMapper;

    public HandoffApplicationService(HandoffRepositoryJpa handoffRepo,
                                      CaseFileApplicationService caseFileService,
                                      CaseFileRepositoryJpa caseFileRepo,
                                      CaseFileMapper caseFileMapper,
                                      AttemptedActionRepositoryJpa attemptedActionRepo,
                                      OpenQuestionRepositoryJpa openQuestionRepo,
                                      CustomerStateSnapshotRepositoryJpa snapshotRepo,
                                      ObjectMapper objectMapper) {
        this.handoffRepo = handoffRepo;
        this.caseFileService = caseFileService;
        this.caseFileRepo = caseFileRepo;
        this.caseFileMapper = caseFileMapper;
        this.attemptedActionRepo = attemptedActionRepo;
        this.openQuestionRepo = openQuestionRepo;
        this.snapshotRepo = snapshotRepo;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public HandoffPacket createHandoffPacket(UUID caseFileId, HandoffReason reason,
                                              String suggestedNextAction) {
        // 1. Load CaseFile
        CaseFile caseFile = caseFileService.getCaseFile(caseFileId);

        // 2. Load attempted actions
        List<String> stepsAttempted = attemptedActionRepo
                .findByCaseFileIdOrderByCreatedAtAsc(caseFileId)
                .stream()
                .map(AttemptedActionEntity::getActionSummary)
                .toList();

        // 3. Load open questions
        List<String> unresolvedItems = openQuestionRepo
                .findByCaseFileIdOrderByCreatedAtAsc(caseFileId)
                .stream()
                .map(OpenQuestionEntity::getQuestionText)
                .toList();

        // 4. Load latest customer state
        Map<String, Double> customerState = new LinkedHashMap<>();
        customerState.put("frustration", caseFile.getCurrentFrustrationScore());
        customerState.put("confusion", caseFile.getCurrentConfusionScore());
        customerState.put("effort", caseFile.getCurrentEffortScore());
        customerState.put("trustRisk", caseFile.getCurrentTrustRiskScore());

        // 5. Compose HandoffPacket
        Instant now = Instant.now();
        HandoffPacket packet = new HandoffPacket(
                UUID.randomUUID(),
                caseFileId,
                caseFile.getConversationId(),
                reason.name(),
                caseFile.getIssueSummary(),
                caseFile.getCustomerGoal(),
                stepsAttempted,
                unresolvedItems,
                customerState,
                suggestedNextAction,
                now
        );

        // 6. Persist
        HandoffPacketEntity entity = toEntity(packet);
        handoffRepo.save(entity);

        // 7. Update CaseFile status to ESCALATED
        CaseFileEntity caseFileEntity = caseFileRepo.findById(caseFileId)
                .orElseThrow(() -> new IllegalArgumentException("CaseFile not found: " + caseFileId));
        caseFileEntity.setStatus(CaseStatus.ESCALATED.name());
        caseFileEntity.setUpdatedAt(Instant.now());
        caseFileRepo.save(caseFileEntity);

        return packet;
    }

    @Transactional(readOnly = true)
    public HandoffPacket getHandoff(UUID handoffId) {
        HandoffPacketEntity entity = handoffRepo.findById(handoffId)
                .orElseThrow(() -> new IllegalArgumentException("Handoff not found: " + handoffId));
        return toDomain(entity);
    }

    @Transactional(readOnly = true)
    public HandoffPacket getHandoffByCaseFile(UUID caseFileId) {
        HandoffPacketEntity entity = handoffRepo.findByCaseFileId(caseFileId)
                .orElseThrow(() -> new IllegalArgumentException("Handoff not found for case: " + caseFileId));
        return toDomain(entity);
    }

    private HandoffPacketEntity toEntity(HandoffPacket p) {
        HandoffPacketEntity e = new HandoffPacketEntity();
        e.setId(p.getId());
        e.setCaseFileId(p.getCaseFileId());
        e.setConversationId(p.getConversationId());
        e.setEscalationReason(p.getEscalationReason());
        e.setIssueSummary(p.getIssueSummary());
        e.setCustomerGoal(p.getCustomerGoal());
        e.setSuggestedNextAction(p.getSuggestedNextAction());
        e.setCreatedAt(p.getCreatedAt());

        try {
            e.setStepsAttemptedJson(objectMapper.writeValueAsString(p.getStepsAttempted()));
            e.setUnresolvedItemsJson(objectMapper.writeValueAsString(p.getUnresolvedItems()));
            e.setCustomerStateJson(objectMapper.writeValueAsString(p.getCustomerState()));
        } catch (JsonProcessingException ex) {
            e.setStepsAttemptedJson("[]");
            e.setUnresolvedItemsJson("[]");
            e.setCustomerStateJson("{}");
        }

        return e;
    }

    @SuppressWarnings("unchecked")
    private HandoffPacket toDomain(HandoffPacketEntity e) {
        List<String> steps;
        List<String> unresolved;
        Map<String, Double> state;

        try {
            steps = objectMapper.readValue(e.getStepsAttemptedJson(),
                    objectMapper.getTypeFactory().constructCollectionType(List.class, String.class));
            unresolved = objectMapper.readValue(e.getUnresolvedItemsJson(),
                    objectMapper.getTypeFactory().constructCollectionType(List.class, String.class));
            state = objectMapper.readValue(e.getCustomerStateJson(), Map.class);
        } catch (JsonProcessingException ex) {
            steps = List.of();
            unresolved = List.of();
            state = Map.of();
        }

        return new HandoffPacket(
                e.getId(), e.getCaseFileId(), e.getConversationId(),
                e.getEscalationReason(), e.getIssueSummary(), e.getCustomerGoal(),
                steps, unresolved, state, e.getSuggestedNextAction(), e.getCreatedAt()
        );
    }
}
