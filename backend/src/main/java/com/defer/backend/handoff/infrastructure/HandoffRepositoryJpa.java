package com.defer.backend.handoff.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface HandoffRepositoryJpa extends JpaRepository<HandoffPacketEntity, UUID> {
    Optional<HandoffPacketEntity> findByCaseFileId(UUID caseFileId);
}
