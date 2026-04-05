package com.defer.backend.casefile.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface OpenQuestionRepositoryJpa extends JpaRepository<OpenQuestionEntity, UUID> {
    List<OpenQuestionEntity> findByCaseFileIdOrderByCreatedAtAsc(UUID caseFileId);
}
