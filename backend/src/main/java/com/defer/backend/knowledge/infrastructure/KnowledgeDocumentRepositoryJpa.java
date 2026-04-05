package com.defer.backend.knowledge.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface KnowledgeDocumentRepositoryJpa extends JpaRepository<KnowledgeDocumentEntity, UUID> {
}
