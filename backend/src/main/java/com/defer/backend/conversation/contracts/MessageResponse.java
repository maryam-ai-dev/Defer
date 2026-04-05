package com.defer.backend.conversation.contracts;

import java.time.Instant;
import java.util.UUID;

public record MessageResponse(
        UUID id,
        UUID conversationId,
        String senderType,
        String body,
        int turnIndex,
        Instant createdAt
) {}
