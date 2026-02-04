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
    <div className="flex flex-col gap-6">
      {/* Scan Status Bars */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4 text-xs">
          Scan Status
        </h4>
        <div className="space-y-4">
          {/* Scanned Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-xs text-gray-700 font-medium">Scanned</span>
              </div>
              <span className="text-xs font-bold text-gray-900">{scannedCVEs}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6">
              <div
                className="bg-red-500 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${scannedPercent}%` }}
              >
                {scannedPercent > 15 && (
                  <span className="text-xs font-bold text-white">{scannedPercent.toFixed(0)}%</span>
                )}
              </div>
            </div>
          </div>

          {/* Unscanned Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-amber-400"></div>
                <span className="text-xs text-gray-700 font-medium">Unscanned</span>
              </div>
              <span className="text-xs font-bold text-gray-900">{unscannedCVEs}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6">
              <div
                className="bg-amber-400 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${unscannedPercent}%` }}
              >
                {unscannedPercent > 15 && (
                  <span className="text-xs font-bold text-gray-900">{unscannedPercent.toFixed(0)}%</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Severity Breakdown Bars */}
      {scannedCVEs > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-4 text-xs">
            Severity Breakdown (Scanned: {scannedCVEs})
          </h4>
          <div className="space-y-4">
            {[
              { label: "Critical", value: severityBreakdown.critical, color: "bg-red-600" },
              { label: "High", value: severityBreakdown.high, color: "bg-orange-500" },
              { label: "Medium", value: severityBreakdown.medium, color: "bg-yellow-500" },
              { label: "Low", value: severityBreakdown.low, color: "bg-green-500" },
            ].map(({ label, value, color }) => {
              const percentage = scannedCVEs > 0 ? (value / scannedCVEs) * 100 : 0;
              return (
                <div key={label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-700 font-medium">{label}</span>
                    <span className="text-xs font-bold text-gray-900">{value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-6">
                    <div
                      className={`${color} h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                      style={{ width: `${percentage}%` }}
                    >
                      {percentage > 8 && (
                        <span className="text-xs font-bold text-white">{percentage.toFixed(0)}%</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Total Stats */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-around text-center">
          <div>
            <p className="text-xs text-gray-600 font-medium mb-1">Total CVEs</p>
            <p className="text-2xl font-bold text-gray-900">{totalCVEs}</p>
          </div>
          <div className="border-l border-gray-300"></div>
          <div>
            <p className="text-xs text-gray-600 font-medium mb-1">Scanned</p>
            <p className="text-xl font-bold text-red-600">{scannedCVEs}</p>
          </div>
          <div className="border-l border-gray-300"></div>
          <div>
            <p className="text-xs text-gray-600 font-medium mb-1">Unscanned</p>
            <p className="text-xl font-bold text-amber-600">{unscannedCVEs}</p>
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
              🛡️ Threat Summary
            </p>
            <button
              onClick={() => setIsExpanded(true)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Expand"
            >
              <Maximize2 className="w-4 h-4 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
          <div className="flex-1 space-y-2">
            {/* Scanned Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></div>
                  <span className="text-gray-700 font-medium">Scanned</span>
                </div>
                <span className="font-bold text-gray-900">{scannedCVEs}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-red-500 h-4 rounded-full transition-all"
                  style={{ width: `${scannedPercent}%` }}
                />
              </div>
            </div>

            {/* Unscanned Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0"></div>
                  <span className="text-gray-700 font-medium">Unscanned</span>
                </div>
                <span className="font-bold text-gray-900">{unscannedCVEs}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-amber-400 h-4 rounded-full transition-all"
                  style={{ width: `${unscannedPercent}%` }}
                />
              </div>
            </div>

            {/* Severity Breakdown */}
            <div className="text-xs pt-2 border-t border-gray-200 space-y-1">
              <div className="flex gap-1.5 items-center text-gray-600">
                <div className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0"></div>
                <span className="flex-1">Critical: {severityBreakdown.critical}</span>
              </div>
              <div className="flex gap-1.5 items-center text-gray-600">
                <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0"></div>
                <span className="flex-1">High: {severityBreakdown.high}</span>
              </div>
              <div className="flex gap-1.5 items-center text-gray-600">
                <div className="w-2 h-2 rounded-full bg-yellow-500 flex-shrink-0"></div>
                <span className="flex-1">Medium: {severityBreakdown.medium}</span>
              </div>
              <div className="flex gap-1.5 items-center text-gray-600">
                <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                <span className="flex-1">Low: {severityBreakdown.low}</span>
              </div>
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
                  🛡️ Threat Summary
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
      <h3 className="font-semibold text-gray-900 mb-6">🛡️ Threat Summary</h3>

      <ChartContent />
    </div>
  );
}
