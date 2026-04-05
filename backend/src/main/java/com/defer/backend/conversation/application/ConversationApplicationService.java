package com.defer.backend.conversation.application;

import com.defer.backend.conversation.domain.Conversation;
import com.defer.backend.conversation.domain.ConversationStatus;
import com.defer.backend.conversation.domain.Message;
import com.defer.backend.conversation.domain.SenderType;
import com.defer.backend.conversation.infrastructure.ConversationMapper;
import com.defer.backend.conversation.infrastructure.ConversationRepositoryJpa;
import com.defer.backend.conversation.infrastructure.MessageRepositoryJpa;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class ConversationApplicationService {

    private final ConversationRepositoryJpa conversationRepo;
    private final MessageRepositoryJpa messageRepo;
    private final ConversationMapper mapper;

    public ConversationApplicationService(ConversationRepositoryJpa conversationRepo,
                                          MessageRepositoryJpa messageRepo,
                                          ConversationMapper mapper) {
        this.conversationRepo = conversationRepo;
        this.messageRepo = messageRepo;
        this.mapper = mapper;
    }

    @Transactional
    public Conversation startConversation(String channel, UUID customerId) {
        Instant now = Instant.now();
        Conversation conversation = new Conversation(
                UUID.randomUUID(),
                channel,
                customerId,
                ConversationStatus.ACTIVE,
                now,
                now
        );
        conversationRepo.save(mapper.toEntity(conversation));
        return conversation;
    }

    @Transactional
    public Message appendMessage(UUID conversationId, SenderType senderType, String body) {
        int nextIndex = messageRepo.countByConversationId(conversationId);
        Message message = new Message(
                UUID.randomUUID(),
                conversationId,
                senderType,
                body,
                nextIndex,
                Instant.now()
        );
        messageRepo.save(mapper.toEntity(message));
        return message;
    }

    @Transactional(readOnly = true)
    public Conversation loadConversation(UUID conversationId) {
        return conversationRepo.findById(conversationId)
                .map(mapper::toDomain)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found: " + conversationId));
    }

    @Transactional(readOnly = true)
    public List<Message> loadMessages(UUID conversationId) {
        return messageRepo.findByConversationIdOrderByTurnIndexAsc(conversationId)
                .stream()
                .map(mapper::toDomain)
                .toList();
    }
}
