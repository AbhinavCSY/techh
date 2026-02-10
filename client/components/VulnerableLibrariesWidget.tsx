import { techStackDatabase } from "@/data/mockData";
import { Shield } from "lucide-react";

interface VulnerableLibrariesWidgetProps {
  compact?: boolean;
}

export function VulnerableLibrariesWidget({
  compact = false,
}: VulnerableLibrariesWidgetProps) {
  // Calculate vulnerable libraries by severity
  const vulnerableByType = {
    critical: techStackDatabase.filter((ts) =>
      ts.cves.some((c) => c.severity === "critical"),
    ).length,
    high: techStackDatabase.filter((ts) =>
      ts.cves.some((c) => c.severity === "high"),
    ).length,
    medium: techStackDatabase.filter((ts) =>
      ts.cves.some((c) => c.severity === "medium"),
    ).length,
    low: techStackDatabase.filter((ts) =>
      ts.cves.some((c) => c.severity === "low"),
    ).length,
  };

  const totalVulnerable = Object.values(vulnerableByType).reduce(
    (a, b) => a + b,
    0,
  );

  // Open Issues trend data
  const issuesData = [
    { date: "29 May", issues: 450 },
    { date: "02 Jun", issues: 445 },
    { date: "05 Jun", issues: 440 },
    { date: "08 Jun", issues: 435 },
    { date: "10 Jun", issues: 440 },
    { date: "12 Jun", issues: 495 },
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

  const pathData = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

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

      {/* Open Issues Line Chart */}
      <div className="border-t border-gray-200 pt-0.5">
        <h5 className="text-xs font-semibold text-gray-700 mb-0.5">Open Issues</h5>
        <div className="h-16 w-full bg-gray-50 rounded">
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="xMidYMid meet"
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

            {/* Line chart path */}
            <path
              d={pathData}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {points.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="0.8"
                fill="#3b82f6"
              />
            ))}
          </svg>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>29 May</span>
          <span>12 Jun</span>
        </div>
      </div>
    </div>
  );
}
