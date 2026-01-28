import { useState } from "react";
import { techStackDatabase } from "@/data/mockData";
import { Maximize2, X } from "lucide-react";

interface EOLPieChartProps {
  compact?: boolean;
}

export function EOLPieChart({ compact = false }: EOLPieChartProps) {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate EOL and upgrade statistics
  const eolTechStacks = techStackDatabase.filter((ts) => ts.isEOL).length;
  const nonEolTechStacks = techStackDatabase.length - eolTechStacks;

  // From EOL tech stacks, how many are upgradable
  const eolUpgradable = techStackDatabase.filter(
    (ts) => ts.isEOL && ts.isUpgradable,
  ).length;
  const eolNotUpgradable = eolTechStacks - eolUpgradable;

  // From non-EOL tech stacks, how many are upgradable
  const nonEolUpgradable = techStackDatabase.filter(
    (ts) => !ts.isEOL && ts.isUpgradable,
  ).length;
  const nonEolNotUpgradable = nonEolTechStacks - nonEolUpgradable;

  const totalTechStacks = techStackDatabase.length;
  const eolPercent = (eolTechStacks / totalTechStacks) * 100;
  const nonEolPercent = (nonEolTechStacks / totalTechStacks) * 100;

  const ChartContent = () => (
    <div className="flex gap-8">
      {/* Chart */}
      <div className="flex-1 flex flex-col items-center">
        <div className="relative w-56 h-56">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            {/* EOL ring */}
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="#ef4444"
              strokeWidth="14"
              strokeDasharray={`${(eolPercent / 100) * 282.7} 282.7`}
              transform="rotate(-90 60 60)"
            />
            {/* Non-EOL ring */}
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="#22c55e"
              strokeWidth="14"
              strokeDasharray={`${(nonEolPercent / 100) * 282.7} 282.7`}
              strokeDashoffset={`${-((eolPercent / 100) * 282.7)}`}
              transform="rotate(-90 60 60)"
            />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">
              {totalTechStacks}
            </span>
            <span className="text-sm text-gray-600">Total</span>
          </div>
        </div>
      </div>

      {/* Legend and Stats */}
      <div className="flex-1 space-y-6">
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 text-xs">
            EOL Status
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-xs text-gray-700">End of Life</span>
              </div>
              <span className="font-bold text-red-900 text-xs">{eolTechStacks}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-700">Active</span>
              </div>
              <span className="font-bold text-green-900 text-xs">
                {nonEolTechStacks}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3 text-sm">
            Upgrade Available
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded border border-blue-200">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm text-gray-700">Yes</span>
              </div>
              <span className="text-sm font-bold text-blue-900">
                {eolUpgradable + nonEolUpgradable}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-100 rounded border border-gray-300">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span className="text-sm text-gray-700">No</span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {eolNotUpgradable + nonEolNotUpgradable}
              </span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-semibold text-gray-600 mb-2">
              Breakdown:
            </p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">EOL + Upgradable:</span>
                <span className="font-semibold">{eolUpgradable}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">EOL + Not Upgradable:</span>
                <span className="font-semibold">{eolNotUpgradable}</span>
              </div>
              <div className="flex justify-between border-t border-gray-300 pt-1 mt-1">
                <span className="text-gray-600">Active + Upgradable:</span>
                <span className="font-semibold">{nonEolUpgradable}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active + Not Upgradable:</span>
                <span className="font-semibold">{nonEolNotUpgradable}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (compact) {
    return (
      <>
        <div className="bg-white rounded-lg border border-gray-200 p-3 flex flex-col h-48 overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-700">
              📦 Version Summary
            </p>
            <button
              onClick={() => setIsExpanded(true)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Expand"
            >
              <Maximize2 className="w-4 h-4 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
          <div className="flex items-center gap-3 flex-1 overflow-hidden">
            {/* Pie Chart - Left Side (Compact) */}
            <div className="flex-shrink-0 relative w-32 h-32">
              <svg viewBox="0 0 120 120" className="w-full h-full">
                {/* EOL ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="10"
                  strokeDasharray={`${(eolPercent / 100) * 282.7} 282.7`}
                  transform="rotate(-90 60 60)"
                  onMouseEnter={() => setHoveredSegment("eol")}
                  onMouseLeave={() => setHoveredSegment(null)}
                  className="cursor-pointer transition-opacity hover:opacity-70"
                />
                {/* Non-EOL ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="10"
                  strokeDasharray={`${(nonEolPercent / 100) * 282.7} 282.7`}
                  strokeDashoffset={`${-((eolPercent / 100) * 282.7)}`}
                  transform="rotate(-90 60 60)"
                  onMouseEnter={() => setHoveredSegment("active")}
                  onMouseLeave={() => setHoveredSegment(null)}
                  className="cursor-pointer transition-opacity hover:opacity-70"
                />

                {/* Center text */}
                <text
                  x="60"
                  y="60"
                  textAnchor="middle"
                  dy="0.3em"
                  className="text-lg font-bold fill-gray-900"
                  fontSize="18"
                >
                  {totalTechStacks}
                </text>
              </svg>

              {/* Hover Tooltip */}
              {hoveredSegment && (
                <div className="absolute top-1/2 left-full transform -translate-y-1/2 ml-2 bg-gray-900 text-white text-xs px-3 py-2 rounded shadow-lg z-50 whitespace-nowrap">
                  {hoveredSegment === "eol"
                    ? `⚠️ EOL: ${eolTechStacks}`
                    : `✓ Active: ${nonEolTechStacks}`}
                </div>
              )}
            </div>

            {/* Legend - Right Side */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0"></div>
                <span className="text-gray-700 flex-1">
                  EOL: {eolTechStacks}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></div>
                <span className="text-gray-700 flex-1">
                  Active: {nonEolTechStacks}
                </span>
              </div>

              {/* Upgrade legend - hidden to prevent overflow */}
            </div>
          </div>
        </div>

        {/* Expanded Modal */}
        {isExpanded && (
          <div
            className="fixed inset-0 z-50 overflow-hidden"
            onClick={() => setIsExpanded(false)}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50" />
            <div
              className="absolute right-0 top-0 bottom-0 w-full max-w-4xl bg-white shadow-xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
                <h2 className="text-lg font-semibold text-gray-900">
                  📦 Version Summary
                </h2>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6">
                <ChartContent />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-6">📦 Version Summary</h3>

      <ChartContent />
    </div>
  );
}
