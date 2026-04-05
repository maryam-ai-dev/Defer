package com.defer.backend.knowledge.api;

import com.defer.backend.knowledge.application.KnowledgeQueryService;
import com.defer.backend.knowledge.domain.KnowledgeChunk;
import com.defer.backend.knowledge.domain.KnowledgeDocument;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/knowledge")
public class KnowledgeController {

    private final KnowledgeQueryService service;

    public KnowledgeController(KnowledgeQueryService service) {
        this.service = service;
    }

    @GetMapping("/documents")
    public List<KnowledgeDocument> listDocuments() {
        return service.listDocuments();
    }

    @GetMapping("/documents/{documentId}/chunks")
    public List<KnowledgeChunk> getChunks(@PathVariable UUID documentId) {
        return service.getChunksByDocument(documentId);
    }
}
