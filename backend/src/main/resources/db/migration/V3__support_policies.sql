-- V3: Support policies table with default thresholds

CREATE TABLE support_policies (
    id UUID PRIMARY KEY,
    escalation_frustration_threshold NUMERIC(4,3) NOT NULL DEFAULT 0.75,
    escalation_effort_threshold NUMERIC(4,3) NOT NULL DEFAULT 0.70,
    escalation_repetition_count INT NOT NULL DEFAULT 2,
    min_confidence_for_direct_answer NUMERIC(4,3) NOT NULL DEFAULT 0.45,
    requires_review_confidence_floor NUMERIC(4,3) NOT NULL DEFAULT 0.55,
    sensitive_topics_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

INSERT INTO support_policies (id, created_at, updated_at) VALUES (gen_random_uuid(), now(), now());
