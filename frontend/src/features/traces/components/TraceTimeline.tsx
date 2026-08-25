import { TraceSpan } from "../types/trace";
import { TraceTimelineItem } from "./TraceTimelineItem";

export function TraceTimeline({ spans }: { spans: TraceSpan[] }) {
  if (spans.length === 0) {
    return <p className="text-sm text-[#A9908D] px-6 py-4">No trace spans found.</p>;
  }

  return (
    <div className="px-6 py-4">
      {spans.map((span) => (
        <TraceTimelineItem key={span.id} span={span} />
      ))}
    </div>
  );
}
