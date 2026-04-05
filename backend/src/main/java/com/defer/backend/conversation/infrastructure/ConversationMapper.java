package com.defer.backend.conversation.infrastructure;

import com.defer.backend.conversation.domain.Conversation;
import com.defer.backend.conversation.domain.ConversationStatus;
import com.defer.backend.conversation.domain.Message;
import com.defer.backend.conversation.domain.SenderType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", imports = {ConversationStatus.class, SenderType.class})
public interface ConversationMapper {

    @Mapping(target = "status", expression = "java(entity.getStatus() != null ? ConversationStatus.valueOf(entity.getStatus()) : null)")
    Conversation toDomain(ConversationEntity entity);

    @Mapping(target = "status", expression = "java(domain.getStatus() != null ? domain.getStatus().name() : null)")
    ConversationEntity toEntity(Conversation domain);

    @Mapping(target = "senderType", expression = "java(entity.getSenderType() != null ? SenderType.valueOf(entity.getSenderType()) : null)")
    Message toDomain(MessageEntity entity);

    @Mapping(target = "senderType", expression = "java(domain.getSenderType() != null ? domain.getSenderType().name() : null)")
    MessageEntity toEntity(Message domain);
}
