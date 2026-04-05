package com.defer.backend.handoff.infrastructure;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "handoff_packets")
public class HandoffPacketEntity {

    @Id
    private UUID id;

    @Column(name = "case_file_id")
    private UUID caseFileId;

    @Column(name = "conversation_id")
    private UUID conversationId;

    @Column(name = "escalation_reason")
    private String escalationReason;

    @Column(name = "issue_summary")
    private String issueSummary;

    @Column(name = "customer_goal")
    private String customerGoal;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "steps_attempted_json", columnDefinition = "jsonb")
    private String stepsAttemptedJson;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "unresolved_items_json", columnDefinition = "jsonb")
    private String unresolvedItemsJson;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "customer_state_json", columnDefinition = "jsonb")
    private String customerStateJson;

    @Column(name = "suggested_next_action")
    private String suggestedNextAction;

    @Column(name = "created_at")
    private Instant createdAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getCaseFileId() { return caseFileId; }
    public void setCaseFileId(UUID caseFileId) { this.caseFileId = caseFileId; }

    public UUID getConversationId() { return conversationId; }
    public void setConversationId(UUID conversationId) { this.conversationId = conversationId; }

    public String getEscalationReason() { return escalationReason; }
    public void setEscalationReason(String escalationReason) { this.escalationReason = escalationReason; }

    public String getIssueSummary() { return issueSummary; }
    public void setIssueSummary(String issueSummary) { this.issueSummary = issueSummary; }

    public String getCustomerGoal() { return customerGoal; }
    public void setCustomerGoal(String customerGoal) { this.customerGoal = customerGoal; }

    public String getStepsAttemptedJson() { return stepsAttemptedJson; }
    public void setStepsAttemptedJson(String stepsAttemptedJson) { this.stepsAttemptedJson = stepsAttemptedJson; }

    public String getUnresolvedItemsJson() { return unresolvedItemsJson; }
    public void setUnresolvedItemsJson(String unresolvedItemsJson) { this.unresolvedItemsJson = unresolvedItemsJson; }

    public String getCustomerStateJson() { return customerStateJson; }
    public void setCustomerStateJson(String customerStateJson) { this.customerStateJson = customerStateJson; }

    public String getSuggestedNextAction() { return suggestedNextAction; }
    public void setSuggestedNextAction(String suggestedNextAction) { this.suggestedNextAction = suggestedNextAction; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
