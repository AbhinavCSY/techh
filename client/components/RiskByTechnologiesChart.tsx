import { useMemo, useState } from "react";

interface RiskByTechnologiesChartProps {
  compact?: boolean;
}

interface TechData {
  name: string;
  vulnerabilities: number;
  color: string;
  critical?: number;
  high?: number;
  medium?: number;
  low?: number;
}

interface SeveritySegment {
  severity: "critical" | "high" | "medium" | "low";
  count: number;
  color: string;
  percentage: number;
}

export function RiskByTechnologiesChart({
  compact = false,
}: RiskByTechnologiesChartProps) {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  // Technology vulnerability data with severity breakdown
  const technologyData: TechData[] = [
    { name: "Java", vulnerabilities: 68200, color: "#3b82f6", critical: 320, high: 850, medium: 1205, low: 965 },
    { name: "Go", vulnerabilities: 48300, color: "#f97316", critical: 215, high: 680, medium: 920, low: 745 },
    { name: ".NET", vulnerabilities: 33500, color: "#a855f7", critical: 155, high: 520, medium: 670, low: 540 },
    { name: "Python", vulnerabilities: 28700, color: "#ec4899", critical: 125, high: 450, medium: 575, low: 465 },
    { name: "Node JS", vulnerabilities: 14100, color: "#06b6d4", critical: 68, high: 220, medium: 280, low: 225 },
    { name: "Rust", vulnerabilities: 9200, color: "#eab308", critical: 38, high: 140, medium: 185, low: 150 },
    { name: "Ruby", vulnerabilities: 5100, color: "#d946ef", critical: 22, high: 78, medium: 100, low: 82 },
    { name: "PHP", vulnerabilities: 4900, color: "#8b5cf6", critical: 20, high: 75, medium: 98, low: 79 },
  ];

  const total = useMemo(
    () => technologyData.reduce((sum, tech) => sum + tech.vulnerabilities, 0),
    [],
  );

  const severityColors = {
    critical: "#dc2626",
    high: "#f97316",
    medium: "#eab308",
    low: "#16a34a",
  };

  const chartData = useMemo(() => {
    let currentAngle = 0;
    return technologyData.map((tech) => {
      const percentage = (tech.vulnerabilities / total) * 100;
      const sliceAngle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;

      // Calculate severity breakdown
      const severitySegments: SeveritySegment[] = [
        { severity: "critical", count: tech.critical || 0, color: severityColors.critical, percentage: 0 },
        { severity: "high", count: tech.high || 0, color: severityColors.high, percentage: 0 },
        { severity: "medium", count: tech.medium || 0, color: severityColors.medium, percentage: 0 },
        { severity: "low", count: tech.low || 0, color: severityColors.low, percentage: 0 },
      ];

      // Calculate percentages for each severity within this tech
      severitySegments.forEach((segment) => {
        segment.percentage = (segment.count / tech.vulnerabilities) * 100;
      });

      currentAngle = endAngle;

      return {
        ...tech,
        percentage,
        startAngle,
        endAngle,
        severitySegments,
      };
    });
  }, []);

  const createArcPath = (
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

  return (
    <div className="space-y-2">
      {/* Title */}
      <h4 className="font-semibold text-gray-900 text-xs">
        Risk by Tech Stacks
      </h4>

      {/* Chart Container */}
      <div className="flex flex-col items-center relative">
        {/* Burst Pie Chart */}
        <div className="flex-shrink-0 relative">
          {/* Tooltip on hover */}
          {hoveredSegment && (
            <div className="absolute -top-40 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg p-2.5 w-48 shadow-lg whitespace-normal z-50">
              {(() => {
                const [techName, severity] = hoveredSegment.split("|");
                const tech = chartData.find((t) => t.name === techName);
                if (!tech) return null;
                const segment = tech.severitySegments.find((s) => s.severity === severity);
                if (!segment) return null;
                return (
                  <div className="space-y-1">
                    <div className="font-semibold">{tech.name}</div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: segment.color }}
                      />
                      <span className="capitalize">{severity}: {segment.count}</span>
                    </div>
                    <div className="text-gray-300 text-xs">
                      {segment.percentage.toFixed(1)}% of {tech.name}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          <svg
            width="140"
            height="140"
            viewBox="0 0 280 280"
            className="drop-shadow-sm"
          >
            {/* Inner ring: Tech stacks */}
            {chartData.map((tech, index) => (
              <g key={`inner-${index}`}>
                <path
                  d={createArcPath(140, 140, 70, 45, tech.startAngle, tech.endAngle)}
                  fill={tech.color}
                  stroke="white"
                  strokeWidth="1.5"
                  className="cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
                  onMouseEnter={() => setHoveredSegment(`${tech.name}|inner`)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  style={{ filter: hoveredSegment?.startsWith(tech.name) ? "brightness(1.15)" : "none" }}
                />
              </g>
            ))}

            {/* Outer ring: Severity breakdown */}
            {chartData.map((tech, techIndex) => {
              let severityStartAngle = tech.startAngle;
              const techSliceAngle = tech.endAngle - tech.startAngle;

              return tech.severitySegments.map((segment, segIndex) => {
                const severitySliceAngle = (segment.percentage / 100) * techSliceAngle;
                const severityEndAngle = severityStartAngle + severitySliceAngle;
                const segmentId = `${tech.name}|${segment.severity}`;

                const path = createArcPath(
                  140,
                  140,
                  110,
                  75,
                  severityStartAngle,
                  severityEndAngle,
                );

                severityStartAngle = severityEndAngle;

                return (
                  <g key={`outer-${techIndex}-${segIndex}`}>
                    <path
                      d={path}
                      fill={segment.color}
                      stroke="white"
                      strokeWidth="1"
                      className="cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
                      onMouseEnter={() => setHoveredSegment(segmentId)}
                      onMouseLeave={() => setHoveredSegment(null)}
                      style={{ filter: hoveredSegment === segmentId ? "brightness(1.2)" : "none" }}
                    />
                  </g>
                );
              });
            })}

            {/* Center text */}
            <circle cx="140" cy="140" r="42" fill="white" stroke="#f3f4f6" strokeWidth="1" />
            <text
              x="140"
              y="133"
              textAnchor="middle"
              className="text-xs font-bold fill-gray-900"
            >
              Total
            </text>
            <text
              x="140"
              y="150"
              textAnchor="middle"
              className="text-sm font-bold fill-gray-900"
            >
              {(total / 1000).toFixed(0)}K
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="w-full mt-2">
          <div className="space-y-1.5">
            {/* Tech Stacks Legend */}
            <div className="text-xs font-semibold text-gray-700 px-1">Tech Stacks</div>
            <div className="grid grid-cols-2 gap-1">
              {chartData.map((tech, index) => (
                <div
                  key={`tech-${index}`}
                  className="flex items-center gap-1.5 px-1.5 py-1 rounded text-xs cursor-pointer transition-colors hover:bg-gray-50"
                  onMouseEnter={() => setHoveredSegment(`${tech.name}|inner`)}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tech.color }}
                  />
                  <span className="text-gray-700 font-medium">{tech.name}</span>
                  <span className="text-gray-600 ml-auto">
                    {(tech.vulnerabilities / 1000).toFixed(1)}K
                  </span>
                </div>
              ))}
            </div>

            {/* Severity Legend */}
            <div className="text-xs font-semibold text-gray-700 px-1 mt-2">Severity</div>
            <div className="flex gap-3 px-1.5">
              {Object.entries(severityColors).map(([severity, color]) => (
                <div key={severity} className="flex items-center gap-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-gray-600 capitalize">{severity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
