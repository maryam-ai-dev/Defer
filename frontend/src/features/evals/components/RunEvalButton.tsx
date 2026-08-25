"use client";

export function RunEvalButton({
  onRun,
  running,
}: {
  onRun: () => void;
  running: boolean;
}) {
  return (
    <button
      onClick={onRun}
      disabled={running}
      className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-[#A24B50] text-white hover:bg-[#B5686D] transition-colors disabled:opacity-60 disabled:cursor-wait"
    >
      {running && (
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {running ? "Running..." : "Run Eval Suite"}
    </button>
  );
}
