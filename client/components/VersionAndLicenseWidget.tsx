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

  // Version Summary Data
  const eolTechStacks = techStackDatabase.filter((ts) => ts.isEOL).length;
  const nonEolTechStacks = techStackDatabase.length - eolTechStacks;
  const totalTechStacks = techStackDatabase.length;
  const eolPercent = (eolTechStacks / totalTechStacks) * 100;
  const nonEolPercent = (nonEolTechStacks / totalTechStacks) * 100;

  // License Risk Data
  const licenseRisk = {
    high: Math.floor(Math.random() * 10),
    medium: Math.floor(Math.random() * 20),
    low: techStackDatabase.length - 15,
    unknown: 4,
  };

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

  // License risk distribution
  const licenseRiskTotal = licenseRisk.high + licenseRisk.medium + licenseRisk.low + licenseRisk.unknown;
  let currentAngle = 0;
  
  const licenseChartData = [
    { label: "High", value: licenseRisk.high, color: "#ef4444", angle: (licenseRisk.high / licenseRiskTotal) * 360 },
    { label: "Medium", value: licenseRisk.medium, color: "#f97316", angle: (licenseRisk.medium / licenseRiskTotal) * 360 },
    { label: "Low", value: licenseRisk.low, color: "#22c55e", angle: (licenseRisk.low / licenseRiskTotal) * 360 },
    { label: "Unknown", value: licenseRisk.unknown, color: "#9ca3af", angle: (licenseRisk.unknown / licenseRiskTotal) * 360 },
  ].map((item) => {
    const start = currentAngle;
    currentAngle += item.angle;
    return { ...item, startAngle: start, endAngle: currentAngle };
  });

  const CompactContent = () => (
    <div className="flex flex-col gap-4">
      {/* Version Summary - Top */}
      <div className="flex flex-col items-center">
        <p className="text-xs font-semibold text-gray-700 mb-2">Version Status</p>
        <div className="relative w-28 h-28 mb-2">
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
            />
            <text
              x="60"
              y="60"
              textAnchor="middle"
              dy="0.3em"
              className="text-sm font-bold fill-gray-900"
              fontSize="14"
            >
              {totalTechStacks}
            </text>
          </svg>
        </div>
        <div className="space-y-1 text-xs w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-gray-600">EOL</span>
            </div>
            <span className="font-semibold">{eolTechStacks}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-gray-600">Active</span>
            </div>
            <span className="font-semibold">{nonEolTechStacks}</span>
          </div>
        </div>
      </div>

      {/* License Risk - Bottom */}
      <div className="flex flex-col items-center">
        <p className="text-xs font-semibold text-gray-700 mb-2">License Risk</p>
        <div className="relative w-28 h-28 mb-2">
          <svg
            width="96"
            height="96"
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
              />
            ))}
            <text
              x="100"
              y="95"
              textAnchor="middle"
              className="text-xs font-bold fill-gray-900"
            >
              Risk
            </text>
            <text
              x="100"
              y="110"
              textAnchor="middle"
              className="text-xs font-bold fill-gray-900"
            >
              {licenseRiskTotal}
            </text>
          </svg>
        </div>
        <div className="space-y-1 text-xs w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-gray-600">High</span>
            </div>
            <span className="font-semibold">{licenseRisk.high}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <span className="text-gray-600">Medium</span>
            </div>
            <span className="font-semibold">{licenseRisk.medium}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-gray-600">Low</span>
            </div>
            <span className="font-semibold">{licenseRisk.low}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const ExpandedContent = () => (
    <div className="flex flex-col gap-8">
      {/* Version Summary Section */}
      <div className="flex flex-col items-center">
        <h4 className="font-semibold text-gray-900 text-sm mb-4">Version Status</h4>
        <div className="flex flex-col items-center">
          <div className="relative w-56 h-56 mb-4">
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
      <div className="flex flex-col items-center">
        <h4 className="font-semibold text-gray-900 text-sm mb-4">License Risk Distribution</h4>
        <div className="flex flex-col items-center">
          <div className="relative w-56 h-56 mb-4">
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
                {licenseRiskTotal}
              </text>
            </svg>
          </div>
          <div className="space-y-2 w-full">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-xs text-gray-700">High Risk</span>
              </div>
              <span className="font-bold text-red-900 text-xs">{licenseRisk.high}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                <span className="text-xs text-gray-700">Medium Risk</span>
              </div>
              <span className="font-bold text-orange-900 text-xs">{licenseRisk.medium}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-700">Low Risk</span>
              </div>
              <span className="font-bold text-green-900 text-xs">{licenseRisk.low}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                <span className="text-xs text-gray-700">Unknown</span>
              </div>
              <span className="font-bold text-gray-900 text-xs">{licenseRisk.unknown}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (compact) {
    return (
      <>
        <div className="bg-white rounded-lg border border-gray-200 p-3 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-700">
              📋 Version & License
            </p>
            <button
              onClick={() => setIsExpanded(true)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Expand"
            >
              <Maximize2 className="w-4 h-4 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <CompactContent />
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
