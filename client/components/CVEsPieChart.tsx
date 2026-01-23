import { useState } from "react";
import { techStackDatabase } from "@/data/mockData";
import { Maximize2, X } from "lucide-react";

interface CVEsPieChartProps {
  compact?: boolean;
}

export function CVEsPieChart({ compact = false }: CVEsPieChartProps) {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate CVE statistics
  const scannedCVEs = techStackDatabase.reduce(
    (acc, ts) => acc + ts.cves.length,
    0,
  );

  // Calculate unscanned threats
  const unscannedCVEs = techStackDatabase.reduce(
    (acc, ts) => acc + ts.unscannedThreatsCount,
    0,
  );

  const totalCVEs = scannedCVEs + unscannedCVEs;

  // Severity breakdown for scanned CVEs
  const severityBreakdown = {
    critical: techStackDatabase.reduce(
      (acc, ts) =>
        acc + ts.cves.filter((c) => c.severity === "critical").length,
      0,
    ),
    high: techStackDatabase.reduce(
      (acc, ts) => acc + ts.cves.filter((c) => c.severity === "high").length,
      0,
    ),
    medium: techStackDatabase.reduce(
      (acc, ts) => acc + ts.cves.filter((c) => c.severity === "medium").length,
      0,
    ),
    low: techStackDatabase.reduce(
      (acc, ts) => acc + ts.cves.filter((c) => c.severity === "low").length,
      0,
    ),
  };

  // Calculate percentages
  const scannedPercent = totalCVEs > 0 ? (scannedCVEs / totalCVEs) * 100 : 0;
  const unscannedPercent =
    totalCVEs > 0 ? (unscannedCVEs / totalCVEs) * 100 : 0;

  const ChartContent = () => (
    <div className="flex gap-8">
      {/* Chart */}
      <div className="flex-1 flex flex-col items-center">
        <div className="relative w-56 h-56">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            {/* Outer ring - Unscanned */}
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="12"
              strokeDasharray={`${(unscannedPercent / 100) * 282.7} 282.7`}
              transform="rotate(-90 60 60)"
            />
            {/* Outer ring - Scanned */}
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="#ef4444"
              strokeWidth="12"
              strokeDasharray={`${(scannedPercent / 100) * 282.7} 282.7`}
              strokeDashoffset={`${-((unscannedPercent / 100) * 282.7)}`}
              transform="rotate(-90 60 60)"
            />

            {/* Inner ring - Severity breakdown */}
            <circle
              cx="60"
              cy="60"
              r="25"
              fill="none"
              stroke="#dc2626"
              strokeWidth="8"
              strokeDasharray={`${(severityBreakdown.critical / scannedCVEs) * 157} 157`}
              transform="rotate(-90 60 60)"
            />
            <circle
              cx="60"
              cy="60"
              r="25"
              fill="none"
              stroke="#f97316"
              strokeWidth="8"
              strokeDasharray={`${(severityBreakdown.high / scannedCVEs) * 157} 157`}
              strokeDashoffset={`${-((severityBreakdown.critical / scannedCVEs) * 157)}`}
              transform="rotate(-90 60 60)"
            />
            <circle
              cx="60"
              cy="60"
              r="25"
              fill="none"
              stroke="#eab308"
              strokeWidth="8"
              strokeDasharray={`${(severityBreakdown.medium / scannedCVEs) * 157} 157`}
              strokeDashoffset={`${-(((severityBreakdown.critical + severityBreakdown.high) / scannedCVEs) * 157)}`}
              transform="rotate(-90 60 60)"
            />
            <circle
              cx="60"
              cy="60"
              r="25"
              fill="none"
              stroke="#22c55e"
              strokeWidth="8"
              strokeDasharray={`${(severityBreakdown.low / scannedCVEs) * 157} 157`}
              strokeDashoffset={`${-(((severityBreakdown.critical + severityBreakdown.high + severityBreakdown.medium) / scannedCVEs) * 157)}`}
              transform="rotate(-90 60 60)"
            />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">
              {totalCVEs}
            </span>
            <span className="text-sm text-gray-600">Total CVEs</span>
          </div>
        </div>
      </div>

      {/* Legend and Stats */}
      <div className="flex-1 space-y-6">
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 text-sm">
            Scan Status
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-700">Scanned</span>
              </div>
              <span className="font-bold text-red-900">{scannedCVEs}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-amber-400"></div>
                <span className="text-sm text-gray-700">Unscanned</span>
              </div>
              <span className="font-bold text-amber-900">
                {unscannedCVEs}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3 text-sm">
            Severity Breakdown (Scanned)
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-600"></div>
                <span className="text-xs text-gray-700">Critical</span>
              </div>
              <span className="text-xs font-bold text-gray-900">
                {severityBreakdown.critical}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-xs text-gray-700">High</span>
              </div>
              <span className="text-xs font-bold text-gray-900">
                {severityBreakdown.high}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-xs text-gray-700">Medium</span>
              </div>
              <span className="text-xs font-bold text-gray-900">
                {severityBreakdown.medium}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-700">Low</span>
              </div>
              <span className="text-xs font-bold text-gray-900">
                {severityBreakdown.low}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (compact) {
    return (
      <>
        <div className="bg-white rounded-lg border border-gray-200 p-1.5 flex flex-col h-20">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-semibold text-gray-700">🛡️ Threat Summary</p>
            <button
              onClick={() => setIsExpanded(true)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Expand"
            >
              <Maximize2 className="w-3.5 h-3.5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
          <div className="flex items-center gap-2 flex-1">
            {/* Pie Chart - Left Side (Compact) */}
            <div className="flex-shrink-0 relative w-16 h-16">
              <svg viewBox="0 0 120 120" className="w-full h-full">
                {/* Outer ring - Unscanned */}
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="10"
                  strokeDasharray={`${(unscannedPercent / 100) * 282.7} 282.7`}
                  transform="rotate(-90 60 60)"
                  onMouseEnter={() => setHoveredSegment("unscanned")}
                  onMouseLeave={() => setHoveredSegment(null)}
                  className="cursor-pointer transition-opacity hover:opacity-70"
                />
                {/* Outer ring - Scanned */}
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="10"
                  strokeDasharray={`${(scannedPercent / 100) * 282.7} 282.7`}
                  strokeDashoffset={`${-((unscannedPercent / 100) * 282.7)}`}
                  transform="rotate(-90 60 60)"
                  onMouseEnter={() => setHoveredSegment("scanned")}
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
                  {totalCVEs}
                </text>
              </svg>

              {/* Hover Tooltip */}
              {hoveredSegment && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                  {hoveredSegment === "scanned"
                    ? `Scanned: ${scannedCVEs}`
                    : `Unscanned: ${unscannedCVEs}`}
                </div>
              )}
            </div>

            {/* Legend - Right Side (Very Compact) */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-1 text-xs">
                <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></div>
                <span className="text-gray-700 flex-1">Scanned: {scannedCVEs}</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0"></div>
                <span className="text-gray-700 flex-1">
                  Unscanned: {unscannedCVEs}
                </span>
              </div>

              {/* Severity legend - very compact */}
              <div className="text-xs text-gray-600 mt-0.5 grid grid-cols-2 gap-0.5">
                <div className="flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0"></div>
                  <span>C:{severityBreakdown.critical}</span>
                </div>
                <div className="flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0"></div>
                  <span>H:{severityBreakdown.high}</span>
                </div>
                <div className="flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 flex-shrink-0"></div>
                  <span>M:{severityBreakdown.medium}</span>
                </div>
                <div className="flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></div>
                  <span>L:{severityBreakdown.low}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Modal */}
        {isExpanded && (
          <div className="fixed inset-0 z-50 overflow-hidden" onClick={() => setIsExpanded(false)}>
            <div className="absolute inset-0 bg-black bg-opacity-50" />
            <div
              className="absolute right-0 top-0 bottom-0 w-full max-w-4xl bg-white shadow-xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
                <h2 className="text-lg font-semibold text-gray-900">🛡️ Threat Summary</h2>
                <button onClick={() => setIsExpanded(false)} className="p-1 hover:bg-gray-100 rounded">
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
      <h3 className="font-semibold text-gray-900 mb-6">
        🛡️ Threat Summary
      </h3>

      <ChartContent />
    </div>
  );
}
