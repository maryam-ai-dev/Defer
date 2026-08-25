"use client";

import { useState } from "react";
import { PolicyOverride } from "../api/policy-api";

function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.05,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-[#A9908D] uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
          {label}
        </span>
        <span className="text-xs text-[#2F2624] font-[family-name:var(--font-geist-mono)]">
          {Number.isInteger(step) ? value : value.toFixed(2)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-[#EADAD6] rounded-full appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#A24B50]"
      />
    </div>
  );
}

export function PolicyEditorPanel({
  onSimulate,
  simulating,
}: {
  onSimulate: (override: PolicyOverride) => void;
  simulating: boolean;
}) {
  const [frustration, setFrustration] = useState(0.75);
  const [effort, setEffort] = useState(0.7);
  const [confidence, setConfidence] = useState(0.45);
  const [repetition, setRepetition] = useState(2);

  const handleSimulate = () => {
    onSimulate({
      escalationFrustrationThreshold: frustration,
      escalationEffortThreshold: effort,
      minConfidenceForDirectAnswer: confidence,
      escalationRepetitionCount: repetition,
      requiresReviewConfidenceFloor: null,
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-medium text-[#7A6664] uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
        Policy Overrides
      </h3>
      <div className="space-y-3">
        <Slider label="Frustration Threshold" value={frustration} onChange={setFrustration} />
        <Slider label="Effort Threshold" value={effort} onChange={setEffort} />
        <Slider label="Min Confidence" value={confidence} onChange={setConfidence} />
        <Slider label="Repetition Count" value={repetition} onChange={setRepetition} min={1} max={5} step={1} />
      </div>
      <button
        onClick={handleSimulate}
        disabled={simulating}
        className="w-full py-2 rounded-md text-sm font-medium bg-[#A24B50] text-white hover:bg-[#B5686D] transition-colors disabled:opacity-40"
      >
        {simulating ? "Simulating..." : "Simulate"}
      </button>
    </div>
  );
}
