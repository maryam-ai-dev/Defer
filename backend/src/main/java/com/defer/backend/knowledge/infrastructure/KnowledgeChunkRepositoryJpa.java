package com.defer.backend.knowledge.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface KnowledgeChunkRepositoryJpa extends JpaRepository<KnowledgeChunkEntity, UUID> {
    List<KnowledgeChunkEntity> findByDocumentId(UUID documentId);
}
