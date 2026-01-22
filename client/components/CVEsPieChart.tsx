import { techStackDatabase } from "@/data/mockData";

interface CVEsPieChartProps {
  compact?: boolean;
}

export function CVEsPieChart({ compact = false }: CVEsPieChartProps) {
  // Calculate CVE statistics
  const scannedCVEs = techStackDatabase.reduce((acc, ts) => acc + ts.cves.length, 0);
  
  // Calculate unscanned threats (estimate from unscannedThreatsCount)
  const unscannedCVEs = techStackDatabase.reduce((acc, ts) => acc + ts.unscannedThreatsCount, 0);
  
  const totalCVEs = scannedCVEs + unscannedCVEs;

  // Severity breakdown for scanned CVEs
  const severityBreakdown = {
    critical: techStackDatabase.reduce((acc, ts) => acc + ts.cves.filter(c => c.severity === 'critical').length, 0),
    high: techStackDatabase.reduce((acc, ts) => acc + ts.cves.filter(c => c.severity === 'high').length, 0),
    medium: techStackDatabase.reduce((acc, ts) => acc + ts.cves.filter(c => c.severity === 'medium').length, 0),
    low: techStackDatabase.reduce((acc, ts) => acc + ts.cves.filter(c => c.severity === 'low').length, 0),
  };

  // Calculate percentages
  const scannedPercent = totalCVEs > 0 ? (scannedCVEs / totalCVEs) * 100 : 0;
  const unscannedPercent = totalCVEs > 0 ? (unscannedCVEs / totalCVEs) * 100 : 0;

  if (compact) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <h4 className="font-semibold text-gray-900 text-sm">Critical CVEs</h4>
        
        {/* Concentric Pie Chart */}
        <div className="relative w-40 h-40">
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

            {/* Inner ring - Severity breakdown (only for scanned) */}
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
            <span className="text-2xl font-bold text-gray-900">{totalCVEs}</span>
            <span className="text-xs text-gray-600">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-gray-700">Scanned</span>
            </div>
            <span className="font-semibold text-gray-900">{scannedCVEs}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <span className="text-gray-700">Unscanned</span>
            </div>
            <span className="font-semibold text-gray-900">{unscannedCVEs}</span>
          </div>

          {/* Severity legend */}
          <div className="border-t border-gray-200 pt-2 mt-2">
            <p className="text-gray-600 font-medium mb-1">Severity (Scanned):</p>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-600"></div>
                  <span className="text-gray-600">Critical</span>
                </div>
                <span className="font-semibold">{severityBreakdown.critical}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-gray-600">High</span>
                </div>
                <span className="font-semibold">{severityBreakdown.high}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span className="text-gray-600">Medium</span>
                </div>
                <span className="font-semibold">{severityBreakdown.medium}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-gray-600">Low</span>
                </div>
                <span className="font-semibold">{severityBreakdown.low}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-6">Critical CVEs Analysis</h3>
      
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
              <span className="text-3xl font-bold text-gray-900">{totalCVEs}</span>
              <span className="text-sm text-gray-600">Total CVEs</span>
            </div>
          </div>
        </div>

        {/* Legend and Stats */}
        <div className="flex-1 space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Scan Status</h4>
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
                <span className="font-bold text-amber-900">{unscannedCVEs}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Severity Breakdown (Scanned)</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-600"></div>
                  <span className="text-xs text-gray-700">Critical</span>
                </div>
                <span className="text-xs font-bold text-gray-900">{severityBreakdown.critical}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-xs text-gray-700">High</span>
                </div>
                <span className="text-xs font-bold text-gray-900">{severityBreakdown.high}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-xs text-gray-700">Medium</span>
                </div>
                <span className="text-xs font-bold text-gray-900">{severityBreakdown.medium}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-700">Low</span>
                </div>
                <span className="text-xs font-bold text-gray-900">{severityBreakdown.low}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
