package com.defer.backend.conversation.api;

import com.defer.backend.conversation.application.ConversationApplicationService;
import com.defer.backend.conversation.contracts.*;
import com.defer.backend.conversation.domain.Conversation;
import com.defer.backend.conversation.domain.Message;
import com.defer.backend.conversation.domain.SenderType;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/conversations")
public class ConversationController {

    private final ConversationApplicationService service;

    public ConversationController(ConversationApplicationService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ConversationResponse startConversation(@RequestBody StartConversationRequest request) {
        Conversation c = service.startConversation(request.channel(), request.customerId());
        return toResponse(c);
    }

    @GetMapping("/{conversationId}")
    public ConversationResponse getConversation(@PathVariable UUID conversationId) {
        Conversation c = service.loadConversation(conversationId);
        return toResponse(c);
    }

    @PostMapping("/{conversationId}/messages")
    @ResponseStatus(HttpStatus.CREATED)
    public MessageResponse appendMessage(@PathVariable UUID conversationId,
                                         @RequestBody AppendMessageRequest request) {
        Message m = service.appendMessage(
                conversationId,
                SenderType.valueOf(request.senderType()),
                request.body()
        );
        return toMessageResponse(m);
    }

    @GetMapping("/{conversationId}/messages")
    public List<MessageResponse> getMessages(@PathVariable UUID conversationId) {
        return service.loadMessages(conversationId)
                .stream()
                .map(this::toMessageResponse)
                .toList();
    }

    private ConversationResponse toResponse(Conversation c) {
        return new ConversationResponse(
                c.getId(), c.getChannel(), c.getCustomerId(),
                c.getStatus().name(), c.getCreatedAt(), c.getUpdatedAt()
        );
    }

    private MessageResponse toMessageResponse(Message m) {
        return new MessageResponse(
                m.getId(), m.getConversationId(), m.getSenderType().name(),
                m.getBody(), m.getTurnIndex(), m.getCreatedAt()
        );
    }
}
