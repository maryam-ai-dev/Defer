package com.defer.backend.casefile.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface AttemptedActionRepositoryJpa extends JpaRepository<AttemptedActionEntity, UUID> {
    List<AttemptedActionEntity> findByCaseFileIdOrderByCreatedAtAsc(UUID caseFileId);
}
