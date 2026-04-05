package com.defer.backend.conversation.contracts;

import java.time.Instant;
import java.util.UUID;

public record ConversationResponse(
        UUID id,
        String channel,
        UUID customerId,
        String status,
        Instant createdAt,
        Instant updatedAt
) {}
