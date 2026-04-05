export interface TraceSpan {
  id: string;
  conversationId: string;
  spanType: string;
  spanName: string;
  metadataJson: string | null;
  startedAt: string;
  endedAt: string | null;
}

export interface ParsedMetadata {
  [key: string]: unknown;
}
