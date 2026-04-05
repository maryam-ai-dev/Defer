package com.defer.backend.casefile.infrastructure;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "case_files")
public class CaseFileEntity {

    @Id
    private UUID id;

    @Column(name = "conversation_id")
    private UUID conversationId;

    @Column(name = "customer_id")
    private UUID customerId;

    private String status;

    @Column(name = "issue_summary")
    private String issueSummary;

    @Column(name = "customer_goal")
    private String customerGoal;

    @Column(name = "current_resolution_mode")
    private String currentResolutionMode;

    @Column(name = "escalation_candidate")
    private boolean escalationCandidate;

    @Column(name = "current_frustration_score")
    private BigDecimal currentFrustrationScore;

    @Column(name = "current_confusion_score")
    private BigDecimal currentConfusionScore;

    @Column(name = "current_effort_score")
    private BigDecimal currentEffortScore;

    @Column(name = "current_trust_risk_score")
    private BigDecimal currentTrustRiskScore;

    @Column(name = "repetition_count")
    private int repetitionCount;

    @Column(name = "last_ai_action_summary")
    private String lastAiActionSummary;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getConversationId() { return conversationId; }
    public void setConversationId(UUID conversationId) { this.conversationId = conversationId; }

    public UUID getCustomerId() { return customerId; }
    public void setCustomerId(UUID customerId) { this.customerId = customerId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getIssueSummary() { return issueSummary; }
    public void setIssueSummary(String issueSummary) { this.issueSummary = issueSummary; }

    public String getCustomerGoal() { return customerGoal; }
    public void setCustomerGoal(String customerGoal) { this.customerGoal = customerGoal; }

    public String getCurrentResolutionMode() { return currentResolutionMode; }
    public void setCurrentResolutionMode(String currentResolutionMode) { this.currentResolutionMode = currentResolutionMode; }

    public boolean isEscalationCandidate() { return escalationCandidate; }
    public void setEscalationCandidate(boolean escalationCandidate) { this.escalationCandidate = escalationCandidate; }

    public BigDecimal getCurrentFrustrationScore() { return currentFrustrationScore; }
    public void setCurrentFrustrationScore(BigDecimal currentFrustrationScore) { this.currentFrustrationScore = currentFrustrationScore; }

    public BigDecimal getCurrentConfusionScore() { return currentConfusionScore; }
    public void setCurrentConfusionScore(BigDecimal currentConfusionScore) { this.currentConfusionScore = currentConfusionScore; }

    public BigDecimal getCurrentEffortScore() { return currentEffortScore; }
    public void setCurrentEffortScore(BigDecimal currentEffortScore) { this.currentEffortScore = currentEffortScore; }

    public BigDecimal getCurrentTrustRiskScore() { return currentTrustRiskScore; }
    public void setCurrentTrustRiskScore(BigDecimal currentTrustRiskScore) { this.currentTrustRiskScore = currentTrustRiskScore; }

    public int getRepetitionCount() { return repetitionCount; }
    public void setRepetitionCount(int repetitionCount) { this.repetitionCount = repetitionCount; }

    public String getLastAiActionSummary() { return lastAiActionSummary; }
    public void setLastAiActionSummary(String lastAiActionSummary) { this.lastAiActionSummary = lastAiActionSummary; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
