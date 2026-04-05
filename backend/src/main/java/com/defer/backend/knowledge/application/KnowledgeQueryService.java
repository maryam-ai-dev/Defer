package com.defer.backend.knowledge.application;

import com.defer.backend.knowledge.domain.KnowledgeChunk;
import com.defer.backend.knowledge.domain.KnowledgeDocument;
import com.defer.backend.knowledge.infrastructure.KnowledgeChunkEntity;
import com.defer.backend.knowledge.infrastructure.KnowledgeChunkRepositoryJpa;
import com.defer.backend.knowledge.infrastructure.KnowledgeDocumentEntity;
import com.defer.backend.knowledge.infrastructure.KnowledgeDocumentRepositoryJpa;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class KnowledgeQueryService {

    private final KnowledgeDocumentRepositoryJpa documentRepo;
    private final KnowledgeChunkRepositoryJpa chunkRepo;

    public KnowledgeQueryService(KnowledgeDocumentRepositoryJpa documentRepo,
                                  KnowledgeChunkRepositoryJpa chunkRepo) {
        this.documentRepo = documentRepo;
        this.chunkRepo = chunkRepo;
    }

    @Transactional(readOnly = true)
    public List<KnowledgeDocument> listDocuments() {
        return documentRepo.findAll().stream().map(this::toDomain).toList();
    }

    @Transactional(readOnly = true)
    public List<KnowledgeChunk> getChunksByDocument(UUID documentId) {
        return chunkRepo.findByDocumentId(documentId).stream().map(this::toChunkDomain).toList();
    }

    private KnowledgeDocument toDomain(KnowledgeDocumentEntity e) {
        KnowledgeDocument d = new KnowledgeDocument();
        d.setId(e.getId());
        d.setSourceType(e.getSourceType());
        d.setTitle(e.getTitle());
        d.setVersion(e.getVersion());
        d.setUri(e.getUri());
        d.setActive(e.isActive());
        d.setCreatedAt(e.getCreatedAt());
        return d;
    }

    private KnowledgeChunk toChunkDomain(KnowledgeChunkEntity e) {
        KnowledgeChunk c = new KnowledgeChunk();
        c.setId(e.getId());
        c.setDocumentId(e.getDocumentId());
        c.setChunkText(e.getChunkText());
        c.setMetadataJson(e.getMetadataJson());
        c.setCreatedAt(e.getCreatedAt());
        return c;
    }
}
