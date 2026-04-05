package com.defer.backend.casefile.infrastructure;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "customer_state_snapshots")
public class CustomerStateSnapshotEntity {

    @Id
    private UUID id;

    @Column(name = "case_file_id")
    private UUID caseFileId;

    @Column(name = "message_id")
    private UUID messageId;

    @Column(name = "frustration_score")
    private BigDecimal frustrationScore;

    @Column(name = "confusion_score")
    private BigDecimal confusionScore;

    @Column(name = "effort_score")
    private BigDecimal effortScore;

    @Column(name = "trust_risk_score")
    private BigDecimal trustRiskScore;

    @Column(name = "degradation_score")
    private BigDecimal degradationScore;

    private String notes;

    @Column(name = "created_at")
    private Instant createdAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getCaseFileId() { return caseFileId; }
    public void setCaseFileId(UUID caseFileId) { this.caseFileId = caseFileId; }

    public UUID getMessageId() { return messageId; }
    public void setMessageId(UUID messageId) { this.messageId = messageId; }

    public BigDecimal getFrustrationScore() { return frustrationScore; }
    public void setFrustrationScore(BigDecimal frustrationScore) { this.frustrationScore = frustrationScore; }

    public BigDecimal getConfusionScore() { return confusionScore; }
    public void setConfusionScore(BigDecimal confusionScore) { this.confusionScore = confusionScore; }

    public BigDecimal getEffortScore() { return effortScore; }
    public void setEffortScore(BigDecimal effortScore) { this.effortScore = effortScore; }

    public BigDecimal getTrustRiskScore() { return trustRiskScore; }
    public void setTrustRiskScore(BigDecimal trustRiskScore) { this.trustRiskScore = trustRiskScore; }

    public BigDecimal getDegradationScore() { return degradationScore; }
    public void setDegradationScore(BigDecimal degradationScore) { this.degradationScore = degradationScore; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
