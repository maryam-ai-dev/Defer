package com.defer.backend.conversation.contracts;

public record AppendMessageRequest(
        String senderType,
        String body
) {}
