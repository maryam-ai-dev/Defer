package com.defer.backend.casefile.infrastructure;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "attempted_actions")
public class AttemptedActionEntity {

    @Id
    private UUID id;

    @Column(name = "case_file_id")
    private UUID caseFileId;

    @Column(name = "action_type")
    private String actionType;

    @Column(name = "action_summary")
    private String actionSummary;

    private String outcome;

    private String source;

    @Column(name = "created_at")
    private Instant createdAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getCaseFileId() { return caseFileId; }
    public void setCaseFileId(UUID caseFileId) { this.caseFileId = caseFileId; }

    public String getActionType() { return actionType; }
    public void setActionType(String actionType) { this.actionType = actionType; }

    public String getActionSummary() { return actionSummary; }
    public void setActionSummary(String actionSummary) { this.actionSummary = actionSummary; }

    public String getOutcome() { return outcome; }
    public void setOutcome(String outcome) { this.outcome = outcome; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
