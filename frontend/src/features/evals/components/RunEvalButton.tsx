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
      className="px-4 py-2 rounded-md text-sm font-medium bg-[#4a7ebb] text-white hover:bg-[#5a8ecc] transition-colors disabled:opacity-40"
    >
      {running ? "Running eval..." : "Run Eval Suite"}
    </button>
  );
}
