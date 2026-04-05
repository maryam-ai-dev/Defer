package com.defer.backend.conversation.contracts;

import java.util.UUID;

public record StartConversationRequest(
        String channel,
        UUID customerId
) {}
