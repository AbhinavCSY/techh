import { techStackDatabase } from "@/data/mockData";
import { Shield } from "lucide-react";
import { useState } from "react";

interface VulnerableLibrariesWidgetProps {
  compact?: boolean;
}

export function VulnerableLibrariesWidget({
  compact = false,
}: VulnerableLibrariesWidgetProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  // Calculate vulnerable libraries by severity
  const vulnerableByType = {
    critical: 3,
    high: 5,
    medium: 8,
    low: 12,
  };

  const totalVulnerable = Object.values(vulnerableByType).reduce(
    (a, b) => a + b,
    0,
  );

  // Open Issues trend data with severity breakdown
  const issuesData = [
    { date: "29 May", issues: 450, critical: 18, high: 67, medium: 180, low: 185 },
    { date: "02 Jun", issues: 445, critical: 17, high: 65, medium: 178, low: 185 },
    { date: "05 Jun", issues: 440, critical: 16, high: 63, medium: 176, low: 185 },
    { date: "08 Jun", issues: 435, critical: 15, high: 62, medium: 174, low: 184 },
    { date: "10 Jun", issues: 440, critical: 16, high: 63, medium: 176, low: 185 },
    { date: "12 Jun", issues: 495, critical: 22, high: 85, medium: 198, low: 190 },
  ];

  const minIssues = Math.min(...issuesData.map((d) => d.issues));
  const maxIssues = Math.max(...issuesData.map((d) => d.issues));
  let range = maxIssues - minIssues;

  // Ensure minimum range for better visualization
  if (range < 50) {
    range = 50;
  }

  // Create SVG path for the line chart
  const width = 200;
  const height = 80;
  const padding = 10;

  // Calculate midpoint for centering small ranges
  const midPoint = (minIssues + maxIssues) / 2;
  const displayMin = midPoint - range / 2;
  const displayMax = midPoint + range / 2;

  const points = issuesData.map((data, index) => {
    const x = padding + (index / (issuesData.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((data.issues - displayMin) / (displayMax - displayMin)) * (height - 2 * padding);
    return { x, y };
  });

  // Calculate trend colors for each segment
  const getSegmentColor = (currentValue: number, nextValue: number) => {
    if (nextValue > currentValue) return "#ef4444"; // Red for uptrend
    if (nextValue < currentValue) return "#22c55e"; // Green for downtrend
    return "#9ca3af"; // Gray for flat
  };

  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-2">
        <Shield className="w-3 h-3 text-gray-600" />
        <h4 className="font-semibold text-gray-900 text-xs">
          Vulnerable Tech Stacks ({totalVulnerable})
        </h4>
      </div>

      <div className="grid grid-cols-3 gap-1">
        {/* High Severity */}
        <div className="flex flex-col items-center">
          <span className="text-sm font-bold text-red-600">
            {vulnerableByType.high}
          </span>
          <span className="text-xs text-gray-600">High</span>
        </div>

        {/* Medium Severity */}
        <div className="flex flex-col items-center">
          <span className="text-sm font-bold text-orange-600">
            {vulnerableByType.medium}
          </span>
          <span className="text-xs text-gray-600">Medium</span>
        </div>

        {/* Low Severity */}
        <div className="flex flex-col items-center">
          <span className="text-sm font-bold text-yellow-600">
            {vulnerableByType.low}
          </span>
          <span className="text-xs text-gray-600">Low</span>
        </div>
      </div>

      {/* Unaddressed Risks Line Chart */}
      <div className="border-t border-gray-200 pt-0.5 relative">
        <h5 className="text-xs font-semibold text-gray-700 mb-0.5">Unaddressed Risks</h5>
        <div className="h-16 w-full bg-gray-50 rounded relative">
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="xMidYMid meet"
            className="cursor-pointer"
          >
            {/* Grid lines */}
            <line
              x1={padding}
              y1={height - padding}
              x2={width - padding}
              y2={height - padding}
              stroke="#e5e7eb"
              strokeWidth="0.5"
            />

            {/* Line segments with trend-based colors */}
            {points.map((point, index) => {
              if (index === points.length - 1) return null;
              const nextPoint = points[index + 1];
              const currentValue = issuesData[index].issues;
              const nextValue = issuesData[index + 1].issues;
              const color = getSegmentColor(currentValue, nextValue);

              return (
                <line
                  key={`segment-${index}`}
                  x1={point.x}
                  y1={point.y}
                  x2={nextPoint.x}
                  y2={nextPoint.y}
                  stroke={color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}

            {/* Data points with hover interaction */}
            {points.map((point, index) => (
              <g key={index}>
                {/* Invisible larger circle for better hover area */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="transparent"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer"
                />
                {/* Visible data point - always visible dots */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={hoveredIndex === index ? "2.5" : "1.5"}
                  fill={hoveredIndex === index ? "#1d4ed8" : "#ffffff"}
                  stroke={hoveredIndex === index ? "#1d4ed8" : "#6b7280"}
                  strokeWidth="1.5"
                  className="transition-all duration-200"
                />
              </g>
            ))}
          </svg>

          {/* Tooltip on hover */}
          {hoveredIndex !== null && (
            <div
              className="absolute bg-gray-900 text-white px-3 py-2 rounded-lg text-xs z-10 whitespace-normal w-48 shadow-lg"
              style={{
                left: `${(points[hoveredIndex].x / width) * 100}%`,
                top: `${(points[hoveredIndex].y / height) * 100 - 20}%`,
                transform: 'translate(-50%, -100%)',
              }}
            >
              <div className="font-semibold mb-1">{issuesData[hoveredIndex].date}</div>
              <div className="text-gray-300 mb-2">Total: {issuesData[hoveredIndex].issues} issues</div>
              <div className="space-y-1 border-t border-gray-700 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0"></div>
                  <span>Critical: {issuesData[hoveredIndex].critical}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0"></div>
                  <span>High: {issuesData[hoveredIndex].high}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0"></div>
                  <span>Medium: {issuesData[hoveredIndex].medium}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                  <span>Low: {issuesData[hoveredIndex].low}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>29 May</span>
          <span>12 Jun</span>
        </div>
      </div>
    </div>
  );
}
