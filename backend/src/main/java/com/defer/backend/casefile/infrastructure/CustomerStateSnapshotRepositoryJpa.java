package com.defer.backend.casefile.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface CustomerStateSnapshotRepositoryJpa extends JpaRepository<CustomerStateSnapshotEntity, UUID> {
    List<CustomerStateSnapshotEntity> findByCaseFileIdOrderByCreatedAtAsc(UUID caseFileId);
}
