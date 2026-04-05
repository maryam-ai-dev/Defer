package com.defer.backend.casefile.application;

import com.defer.backend.casefile.domain.*;
import com.defer.backend.casefile.infrastructure.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
public class CaseFileApplicationService {

    private final CaseFileRepositoryJpa caseFileRepo;
    private final AttemptedActionRepositoryJpa attemptedActionRepo;
    private final OpenQuestionRepositoryJpa openQuestionRepo;
    private final CustomerStateSnapshotRepositoryJpa snapshotRepo;
    private final CaseFileMapper mapper;

    public CaseFileApplicationService(CaseFileRepositoryJpa caseFileRepo,
                                       AttemptedActionRepositoryJpa attemptedActionRepo,
                                       OpenQuestionRepositoryJpa openQuestionRepo,
                                       CustomerStateSnapshotRepositoryJpa snapshotRepo,
                                       CaseFileMapper mapper) {
        this.caseFileRepo = caseFileRepo;
        this.attemptedActionRepo = attemptedActionRepo;
        this.openQuestionRepo = openQuestionRepo;
        this.snapshotRepo = snapshotRepo;
        this.mapper = mapper;
    }

    @Transactional
    public CaseFile createOrLoadCaseFile(UUID conversationId, UUID customerId) {
        return caseFileRepo.findByConversationId(conversationId)
                .map(mapper::toDomain)
                .orElseGet(() -> {
                    CaseFile cf = new CaseFile(UUID.randomUUID(), conversationId, customerId);
                    caseFileRepo.save(mapper.toEntity(cf));
                    return cf;
                });
    }

    @Transactional
    public void updateIssueSummary(UUID caseFileId, String summary) {
        CaseFileEntity entity = findEntityById(caseFileId);
        CaseFile cf = mapper.toDomain(entity);
        cf.updateIssueSummary(summary);
        caseFileRepo.save(mapper.toEntity(cf));
    }

    @Transactional
    public void updateCustomerGoal(UUID caseFileId, String goal) {
        CaseFileEntity entity = findEntityById(caseFileId);
        CaseFile cf = mapper.toDomain(entity);
        cf.updateCustomerGoal(goal);
        caseFileRepo.save(mapper.toEntity(cf));
    }

    @Transactional
    public void recordAttemptedAction(UUID caseFileId, ActionType type, String summary,
                                       ActionOutcome outcome, ActionSource source) {
        Instant now = Instant.now();
        AttemptedAction action = new AttemptedAction(
                UUID.randomUUID(), caseFileId, type, summary, outcome, source, now
        );
        attemptedActionRepo.save(mapper.toEntity(action));
        touchUpdatedAt(caseFileId);
    }

    @Transactional
    public void recordOpenQuestion(UUID caseFileId, String questionText, ActionSource source) {
        Instant now = Instant.now();
        OpenQuestion question = new OpenQuestion(
                UUID.randomUUID(), caseFileId, questionText,
                QuestionStatus.OPEN, source, now, now
        );
        openQuestionRepo.save(mapper.toEntity(question));
        touchUpdatedAt(caseFileId);
    }

    @Transactional
    public void snapshotCustomerState(UUID caseFileId, UUID messageId,
                                       double frustration, double confusion,
                                       double effort, double trustRisk, double degradation) {
        CustomerStateSnapshot snapshot = new CustomerStateSnapshot(
                UUID.randomUUID(), caseFileId, messageId,
                frustration, confusion, effort, trustRisk, degradation, Instant.now()
        );
        snapshotRepo.save(mapper.toEntity(snapshot));

        CaseFileEntity entity = findEntityById(caseFileId);
        CaseFile cf = mapper.toDomain(entity);
        cf.applyStateSnapshot(snapshot);
        caseFileRepo.save(mapper.toEntity(cf));
    }

    @Transactional
    public void incrementRepetition(UUID caseFileId) {
        CaseFileEntity entity = findEntityById(caseFileId);
        CaseFile cf = mapper.toDomain(entity);
        cf.incrementRepetition();
        caseFileRepo.save(mapper.toEntity(cf));
    }

    @Transactional
    public void setResolutionMode(UUID caseFileId, ResolutionMode mode) {
        CaseFileEntity entity = findEntityById(caseFileId);
        CaseFile cf = mapper.toDomain(entity);
        cf.setResolutionMode(mode);
        caseFileRepo.save(mapper.toEntity(cf));
    }

    @Transactional
    public void markEscalationCandidate(UUID caseFileId) {
        CaseFileEntity entity = findEntityById(caseFileId);
        CaseFile cf = mapper.toDomain(entity);
        cf.markEscalationCandidate();
        caseFileRepo.save(mapper.toEntity(cf));
    }

    @Transactional(readOnly = true)
    public CaseFile getCaseFile(UUID caseFileId) {
        return mapper.toDomain(findEntityById(caseFileId));
    }

    @Transactional(readOnly = true)
    public CaseFile getCaseFileByConversationId(UUID conversationId) {
        return caseFileRepo.findByConversationId(conversationId)
                .map(mapper::toDomain)
                .orElseThrow(() -> new IllegalArgumentException(
                        "CaseFile not found for conversation: " + conversationId));
    }

    private CaseFileEntity findEntityById(UUID caseFileId) {
        return caseFileRepo.findById(caseFileId)
                .orElseThrow(() -> new IllegalArgumentException("CaseFile not found: " + caseFileId));
    }

    private void touchUpdatedAt(UUID caseFileId) {
        CaseFileEntity entity = findEntityById(caseFileId);
        entity.setUpdatedAt(Instant.now());
        caseFileRepo.save(entity);
    }
}
