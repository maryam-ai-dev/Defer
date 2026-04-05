package com.defer.backend.knowledge.infrastructure;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "knowledge_documents")
public class KnowledgeDocumentEntity {

    @Id
    private UUID id;

    @Column(name = "source_type")
    private String sourceType;

    private String title;
    private String version;
    private String uri;
    private boolean active;

    @Column(name = "created_at")
    private Instant createdAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getSourceType() { return sourceType; }
    public void setSourceType(String sourceType) { this.sourceType = sourceType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getUri() { return uri; }
    public void setUri(String uri) { this.uri = uri; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
