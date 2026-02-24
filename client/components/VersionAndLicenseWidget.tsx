import { useState } from "react";
import { useState } from "react";
import { techStackDatabase } from "@/data/mockData";
import { Maximize2, X } from "lucide-react";

interface VersionAndLicenseWidgetProps {
  compact?: boolean;
}

export function VersionAndLicenseWidget({
  compact = false,
}: VersionAndLicenseWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredVersionType, setHoveredVersionType] = useState<string | null>(null);
  const [hoveredLicense, setHoveredLicense] = useState<string | null>(null);

  // Version Summary Data
  const eolTechStacks = techStackDatabase.filter((ts) => ts.isEOL).length;
  const nonEolTechStacks = techStackDatabase.length - eolTechStacks;
  const totalTechStacks = techStackDatabase.length;
  const eolPercent = (eolTechStacks / totalTechStacks) * 100;
  const nonEolPercent = (nonEolTechStacks / totalTechStacks) * 100;

  // Top Risky Licenses Data
  const riskyLicenses = [
    { name: "LGPL 3.0", count: 12, riskLevel: "high" },
    { name: "Mozilla 2.0", count: 9, riskLevel: "high" },
    { name: "MIT", count: 28, riskLevel: "medium" },
    { name: "Apache 2.0", count: 15, riskLevel: "medium" },
    { name: "BSD 2", count: 8, riskLevel: "low" },
    { name: "BSD 3", count: 10, riskLevel: "low" },
    { name: "ISC", count: 6, riskLevel: "low" },
  ];

  const licenseTotal = riskyLicenses.reduce((sum, l) => sum + l.count, 0);

  const createDonutSlice = (
    centerX: number,
    centerY: number,
    radius: number,
    innerRadius: number,
    startAngle: number,
    endAngle: number,
  ) => {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const cos = Math.cos;
    const sin = Math.sin;

    const x1 = centerX + radius * cos(toRad(startAngle));
    const y1 = centerY + radius * sin(toRad(startAngle));
    const x2 = centerX + radius * cos(toRad(endAngle));
    const y2 = centerY + radius * sin(toRad(endAngle));

    const ix1 = centerX + innerRadius * cos(toRad(startAngle));
    const iy1 = centerY + innerRadius * sin(toRad(startAngle));
    const ix2 = centerX + innerRadius * cos(toRad(endAngle));
    const iy2 = centerY + innerRadius * sin(toRad(endAngle));

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${ix1} ${iy1} Z`;
  };

  // License color based on risk level
  const getLicenseColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return "#f59e0b"; // amber for high risk
      case "medium":
        return "#9ca3af"; // gray for medium
      case "low":
        return "#d1d5db"; // light gray for low
      default:
        return "#9ca3af";
    }
  };

  // License chart data
  let currentAngle = 0;

  const licenseChartData = riskyLicenses.map((license) => {
    const percentage = (license.count / licenseTotal) * 100;
    const angle = (percentage / 100) * 360;
    const start = currentAngle;
    currentAngle += angle;
    return {
      ...license,
      color: getLicenseColor(license.riskLevel),
      angle,
      percentage,
      startAngle: start,
      endAngle: currentAngle,
    };
  });

  const CompactContent = () => (
    <div className="space-y-3">
      {/* Charts Row - Side by Side */}
      <div className="flex items-start justify-center gap-6">
        {/* Version Summary */}
        <div className="flex flex-col items-center relative">
          <p className="text-xs font-semibold text-gray-700 mb-2">Version</p>
          <div className="relative w-24 h-24">
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
                className="cursor-pointer transition-opacity hover:opacity-80"
                onMouseEnter={() => setHoveredVersionType("eol")}
                onMouseLeave={() => setHoveredVersionType(null)}
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
                className="cursor-pointer transition-opacity hover:opacity-80"
                onMouseEnter={() => setHoveredVersionType("active")}
                onMouseLeave={() => setHoveredVersionType(null)}
              />
              <text
                x="60"
                y="60"
                textAnchor="middle"
                dy="0.3em"
                className="text-xs font-bold fill-gray-900"
                fontSize="12"
              >
                {totalTechStacks}
              </text>
            </svg>
          </div>
          {/* Version Tooltip */}
          {hoveredVersionType && (
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg p-2 w-40 shadow-lg z-50 whitespace-normal">
              <div className="font-semibold mb-1">
                {hoveredVersionType === "eol" ? "End of Life" : "Active"}
              </div>
              <div className="text-gray-200">
                Count: {hoveredVersionType === "eol" ? eolTechStacks : nonEolTechStacks}
              </div>
              <div className="text-gray-300 text-xs mt-1">
                {hoveredVersionType === "eol"
                  ? `${eolPercent.toFixed(1)}% of total`
                  : `${nonEolPercent.toFixed(1)}% of total`}
              </div>
            </div>
          )}
        </div>

        {/* License Risk */}
        <div className="flex flex-col items-center relative">
          <p className="text-xs font-semibold text-gray-700 mb-2">License</p>
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 200 200" className="drop-shadow-sm w-full h-full">
              {licenseChartData.map((slice, index) => (
                <path
                  key={index}
                  d={createDonutSlice(
                    100,
                    100,
                    70,
                    45,
                    slice.startAngle,
                    slice.endAngle,
                  )}
                  fill={slice.color}
                  stroke="white"
                  strokeWidth="1"
                  className="cursor-pointer transition-opacity hover:opacity-80"
                  onMouseEnter={() => setHoveredLicense(slice.name)}
                  onMouseLeave={() => setHoveredLicense(null)}
                />
              ))}
              <text
                x="100"
                y="105"
                textAnchor="middle"
                className="text-xs font-bold fill-gray-900"
                fontSize="11"
              >
                {licenseTotal}
              </text>
            </svg>
          </div>
          {/* License Tooltip */}
          {hoveredLicense && (
            <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg p-2 w-40 shadow-lg z-50 whitespace-normal">
              {(() => {
                const license = licenseChartData.find((l) => l.name === hoveredLicense);
                if (!license) return null;
                return (
                  <>
                    <div className="font-semibold mb-1">{license.name}</div>
                    <div className="text-gray-200">Count: {license.count}</div>
                    <div className="text-gray-300 text-xs mt-1">
                      {license.percentage.toFixed(1)}% of total
                    </div>
                    <div className="text-gray-400 text-xs mt-1 capitalize">
                      Risk: {license.riskLevel}
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Legends Below */}
      <div className="grid grid-cols-2 gap-4 mt-3 px-2">
        {/* Version Legend */}
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-700 mb-1">Status</p>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></div>
              <span className="text-gray-600" style={{ fontSize: '11px' }}>EOL: {eolTechStacks}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></div>
              <span className="text-gray-600" style={{ fontSize: '11px' }}>Active: {nonEolTechStacks}</span>
            </div>
          </div>
        </div>

        {/* License Legend */}
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-700 mb-1">Top Licenses</p>
          <div className="space-y-0.5">
            {licenseChartData.slice(0, 4).map((license, index) => (
              <div key={index} className="flex items-center gap-1">
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: license.color }}
                ></div>
                <span className="text-gray-600 truncate" style={{ fontSize: '11px' }}>
                  {license.name}: {license.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ExpandedContent = () => (
    <div className="flex gap-8">
      {/* Version Summary Section */}
      <div className="flex-1 flex flex-col items-center">
        <h4 className="font-semibold text-gray-900 text-sm mb-4">Version Status</h4>
        <div className="flex flex-col items-center relative">
          <div className="relative w-40 h-40 mb-4">
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
                className="cursor-pointer transition-opacity hover:opacity-80"
                onMouseEnter={() => setHoveredVersionType("eol")}
                onMouseLeave={() => setHoveredVersionType(null)}
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
                className="cursor-pointer transition-opacity hover:opacity-80"
                onMouseEnter={() => setHoveredVersionType("active")}
                onMouseLeave={() => setHoveredVersionType(null)}
              />
              <text
                x="60"
                y="55"
                textAnchor="middle"
                className="text-lg font-bold fill-gray-900"
                fontSize="20"
              >
                {totalTechStacks}
              </text>
              <text
                x="60"
                y="75"
                textAnchor="middle"
                className="text-xs fill-gray-600"
                fontSize="12"
              >
                Total
              </text>
            </svg>
          </div>
          {/* Version Tooltip */}
          {hoveredVersionType && (
            <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg p-3 w-48 shadow-lg z-50 whitespace-normal">
              <div className="font-semibold mb-2">
                {hoveredVersionType === "eol" ? "End of Life" : "Active"}
              </div>
              <div className="text-gray-200">
                Count: {hoveredVersionType === "eol" ? eolTechStacks : nonEolTechStacks}
              </div>
              <div className="text-gray-300 text-xs mt-2">
                {hoveredVersionType === "eol"
                  ? `${eolPercent.toFixed(1)}% of total`
                  : `${nonEolPercent.toFixed(1)}% of total`}
              </div>
            </div>
          )}
          <div className="space-y-2 w-full">
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
              <span className="font-bold text-green-900 text-xs">{nonEolTechStacks}</span>
            </div>
          </div>
        </div>
      </div>

      {/* License Risk Section */}
      <div className="flex-1 flex flex-col items-center">
        <h4 className="font-semibold text-gray-900 text-sm mb-4">Top 7 Risky Licenses</h4>
        <div className="flex flex-col items-center relative">
          <div className="relative w-40 h-40 mb-4">
            <svg
              width="192"
              height="192"
              viewBox="0 0 200 200"
              className="drop-shadow-sm"
            >
              {licenseChartData.map((slice, index) => (
                <path
                  key={index}
                  d={createDonutSlice(
                    100,
                    100,
                    70,
                    45,
                    slice.startAngle,
                    slice.endAngle,
                  )}
                  fill={slice.color}
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-pointer transition-opacity hover:opacity-80"
                  onMouseEnter={() => setHoveredLicense(slice.name)}
                  onMouseLeave={() => setHoveredLicense(null)}
                />
              ))}
              <text
                x="100"
                y="95"
                textAnchor="middle"
                className="text-sm font-bold fill-gray-900"
              >
                Total
              </text>
              <text
                x="100"
                y="115"
                textAnchor="middle"
                className="text-lg font-bold fill-gray-900"
              >
                {licenseTotal}
              </text>
            </svg>
          </div>
          {/* License Tooltip */}
          {hoveredLicense && (
            <div className="absolute -bottom-44 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg p-3 w-48 shadow-lg z-50 whitespace-normal">
              {(() => {
                const license = licenseChartData.find((l) => l.name === hoveredLicense);
                if (!license) return null;
                return (
                  <>
                    <div className="font-semibold mb-2">{license.name}</div>
                    <div className="text-gray-200">Count: {license.count}</div>
                    <div className="text-gray-300 text-xs mt-2">
                      {license.percentage.toFixed(1)}% of total
                    </div>
                    <div className="text-gray-400 text-xs mt-2 capitalize">
                      Risk: {license.riskLevel}
                    </div>
                  </>
                );
              })()}
            </div>
          )}
          <div className="space-y-2 w-full max-h-64 overflow-y-auto">
            {licenseChartData.map((license, index) => {
              const bgColor = license.riskLevel === "high"
                ? "bg-amber-50 border-amber-200"
                : license.riskLevel === "medium"
                ? "bg-gray-50 border-gray-200"
                : "bg-gray-50 border-gray-200";

              const textColor = license.riskLevel === "high"
                ? "text-amber-900"
                : "text-gray-900";

              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${bgColor}`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: license.color }}
                    ></div>
                    <span className={`text-xs ${textColor}`}>{license.name}</span>
                  </div>
                  <span className={`font-bold text-xs ${textColor}`}>{license.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  if (compact) {
    return (
      <>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-700">
              📋 Version & License
            </p>
            <button
              onClick={() => setIsExpanded(true)}
              className="p-0.5 hover:bg-gray-100 rounded transition-colors"
              title="Expand"
            >
              <Maximize2 className="w-3 h-3 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
          <CompactContent />
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
                  📋 Version & License Summary
                </h2>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6">
                <ExpandedContent />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-6">📋 Version & License Summary</h3>
      <ExpandedContent />
    </div>
  );
}
