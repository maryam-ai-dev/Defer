package com.defer.backend.casefile.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface CaseFileRepositoryJpa extends JpaRepository<CaseFileEntity, UUID> {
    Optional<CaseFileEntity> findByConversationId(UUID conversationId);
}
