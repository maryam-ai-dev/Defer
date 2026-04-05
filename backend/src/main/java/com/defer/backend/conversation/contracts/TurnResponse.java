package com.defer.backend.conversation.contracts;

import java.util.UUID;

public record TurnResponse(
        MessageResponse assistantMessage,
        String resolutionMode,
        boolean escalated,
        UUID caseFileId,
        UUID traceId
) {}
