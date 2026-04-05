package com.defer.backend.workspace;

import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/workspaces")
public class WorkspaceController {

    private final WorkspaceService service;

    public WorkspaceController(WorkspaceService service) {
        this.service = service;
    }

    @GetMapping("/{conversationId}")
    public WorkspaceResponse getWorkspace(@PathVariable UUID conversationId) {
        return service.getWorkspace(conversationId);
    }
}
