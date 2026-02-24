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
  startAngle?: number;
  endAngle?: number;
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

  const severityOrder = ["critical", "high", "medium", "low"] as const;

  const chartData = useMemo(() => {
    let currentAngle = 0;
    return technologyData.map((tech) => {
      const percentage = (tech.vulnerabilities / total) * 100;
      const sliceAngle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;

      // Calculate severity breakdown in order
      const severitySegments: SeveritySegment[] = severityOrder.map((severity) => ({
        severity,
        count: tech[severity] || 0,
        color: severityColors[severity],
        percentage: 0,
      }));

      // Calculate percentages for each severity within this tech
      severitySegments.forEach((segment) => {
        segment.percentage = (segment.count / tech.vulnerabilities) * 100;
      });

      // Assign angles to severity segments
      let severityStartAngle = startAngle;
      const techSliceAngle = endAngle - startAngle;
      severitySegments.forEach((segment) => {
        const severitySliceAngle = (segment.percentage / 100) * techSliceAngle;
        segment.startAngle = severityStartAngle;
        segment.endAngle = severityStartAngle + severitySliceAngle;
        severityStartAngle = segment.endAngle;
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
    outerRadius: number,
    innerRadius: number,
    startAngle: number,
    endAngle: number,
  ) => {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const cos = Math.cos;
    const sin = Math.sin;

    const x1 = centerX + outerRadius * cos(toRad(startAngle));
    const y1 = centerY + outerRadius * sin(toRad(startAngle));
    const x2 = centerX + outerRadius * cos(toRad(endAngle));
    const y2 = centerY + outerRadius * sin(toRad(endAngle));

    const ix1 = centerX + innerRadius * cos(toRad(startAngle));
    const iy1 = centerY + innerRadius * sin(toRad(startAngle));
    const ix2 = centerX + innerRadius * cos(toRad(endAngle));
    const iy2 = centerY + innerRadius * sin(toRad(endAngle));

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${ix1} ${iy1} Z`;
  };

  const getLabelPosition = (
    centerX: number,
    centerY: number,
    radius: number,
    startAngle: number,
    endAngle: number,
  ) => {
    const midAngle = (startAngle + endAngle) / 2;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const x = centerX + radius * Math.cos(toRad(midAngle));
    const y = centerY + radius * Math.sin(toRad(midAngle));
    return { x, y, midAngle };
  };

  return (
    <div className="space-y-3">
      {/* Title */}
      <h4 className="font-semibold text-gray-900 text-xs">
        Risk by Tech Stacks
      </h4>

      {/* Chart Container */}
      <div className="flex flex-col items-center relative">
        {/* Sunburst Chart */}
        <div className="flex-shrink-0 relative">
          {/* Tooltip on hover */}
          {hoveredSegment && (
            <div className="absolute -top-52 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white rounded-lg p-3 w-56 shadow-xl whitespace-normal z-50">
              {(() => {
                const [techName, severity] = hoveredSegment.split("|");
                const tech = chartData.find((t) => t.name === techName);
                if (!tech) return null;
                const segment = tech.severitySegments.find((s) => s.severity === severity);

                if (!segment) return null;

                return (
                  <div className="space-y-3">
                    {/* Tech Stack Title */}
                    <div className="border-b border-gray-700 pb-2">
                      <div className="font-bold text-sm text-white">{tech.name}</div>
                      <div className="text-gray-300 text-xs mt-1">
                        Total Issues: <span className="font-semibold text-white">{tech.vulnerabilities.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Selected Severity */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: segment.color }}
                        />
                        <span className="capitalize font-semibold text-white">{severity}</span>
                      </div>
                      <div className="ml-5 space-y-1 text-xs text-gray-200">
                        <div className="flex justify-between">
                          <span>Count:</span>
                          <span className="font-semibold">{segment.count.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Percentage:</span>
                          <span className="font-semibold">{segment.percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>

                    {/* All Severities Breakdown */}
                    <div className="border-t border-gray-700 pt-2">
                      <div className="text-xs font-semibold text-gray-300 mb-2">Severity Breakdown</div>
                      <div className="space-y-1.5">
                        {severityOrder.map((sev) => {
                          const seg = tech.severitySegments.find((s) => s.severity === sev);
                          if (!seg) return null;
                          const isSelected = sev === severity;
                          return (
                            <div
                              key={sev}
                              className={`flex items-center justify-between text-xs px-2 py-1 rounded transition-colors ${
                                isSelected ? "bg-gray-800" : "hover:bg-gray-800/50"
                              }`}
                            >
                              <div className="flex items-center gap-2 flex-1">
                                <div
                                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: seg.color }}
                                />
                                <span className="capitalize text-gray-300">{sev}</span>
                              </div>
                              <div className="flex items-center gap-3 flex-shrink-0">
                                <span className="text-gray-400 font-medium w-10 text-right">{seg.count}</span>
                                <span className="text-gray-500 w-12 text-right">{seg.percentage.toFixed(1)}%</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          <svg
            width="240"
            height="240"
            viewBox="0 0 480 480"
            className="drop-shadow-md"
          >
            {/* Inner ring: Tech stacks (radius 50-90) */}
            {chartData.map((tech, index) => (
              <g key={`inner-${index}`}>
                <path
                  d={createArcPath(240, 240, 90, 50, tech.startAngle, tech.endAngle)}
                  fill={tech.color}
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredSegment(`${tech.name}|inner`)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  style={{
                    opacity: hoveredSegment?.startsWith(tech.name) ? 1 : 0.85,
                    filter: hoveredSegment?.startsWith(tech.name) ? "brightness(1.2)" : "none",
                  }}
                />
                {/* Tech name label on inner ring */}
                {tech.endAngle - tech.startAngle > 20 && (
                  <g>
                    {(() => {
                      const { x, y, midAngle } = getLabelPosition(240, 240, 68, tech.startAngle, tech.endAngle);
                      const isRight = midAngle > 270 || midAngle < 90;
                      return (
                        <text
                          x={x}
                          y={y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-xs font-bold fill-white pointer-events-none"
                          style={{
                            textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                          }}
                        >
                          {tech.name}
                        </text>
                      );
                    })()}
                  </g>
                )}
              </g>
            ))}

            {/* Outer ring: Severity breakdown (radius 90-160) */}
            {chartData.map((tech, techIndex) => {
              return tech.severitySegments.map((segment, segIndex) => {
                if (!segment.startAngle || !segment.endAngle) return null;
                const segmentId = `${tech.name}|${segment.severity}`;

                return (
                  <g key={`outer-${techIndex}-${segIndex}`}>
                    <path
                      d={createArcPath(240, 240, 160, 95, segment.startAngle, segment.endAngle)}
                      fill={segment.color}
                      stroke="white"
                      strokeWidth="1.5"
                      className="cursor-pointer transition-all"
                      onMouseEnter={() => setHoveredSegment(segmentId)}
                      onMouseLeave={() => setHoveredSegment(null)}
                      style={{
                        opacity: hoveredSegment === segmentId ? 1 : 0.8,
                        filter: hoveredSegment === segmentId ? "brightness(1.15)" : "none",
                      }}
                    />
                    {/* Severity label on outer ring */}
                    {segment.endAngle - segment.startAngle > 8 && segment.percentage > 8 && (
                      <g>
                        {(() => {
                          const { x, y, midAngle } = getLabelPosition(240, 240, 125, segment.startAngle, segment.endAngle);
                          return (
                            <text
                              x={x}
                              y={y}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="text-xs fill-white pointer-events-none font-semibold"
                              style={{
                                textShadow: "0 1px 2px rgba(0,0,0,0.6)",
                              }}
                            >
                              {segment.count > 0 ? segment.count : ""}
                            </text>
                          );
                        })()}
                      </g>
                    )}
                  </g>
                );
              });
            })}

            {/* Center circle */}
            <circle cx="240" cy="240" r="45" fill="white" stroke="#e5e7eb" strokeWidth="2" />
            <text
              x="240"
              y="232"
              textAnchor="middle"
              className="text-xs font-semibold fill-gray-700"
            >
              Total
            </text>
            <text
              x="240"
              y="252"
              textAnchor="middle"
              className="text-lg font-bold fill-gray-900"
            >
              {(total / 1000).toFixed(0)}K
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="w-full mt-3 space-y-2">
          {/* Tech Stacks Legend */}
          <div>
            <div className="text-xs font-semibold text-gray-700 mb-1.5 px-1">Tech Stacks</div>
            <div className="grid grid-cols-2 gap-1.5">
              {chartData.map((tech, index) => (
                <div
                  key={`tech-${index}`}
                  className="flex items-center gap-1.5 px-2 py-1 rounded text-xs cursor-pointer transition-colors hover:bg-gray-50"
                  onMouseEnter={() => setHoveredSegment(`${tech.name}|inner`)}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tech.color }}
                  />
                  <span className="text-gray-700 font-medium truncate">{tech.name}</span>
                  <span className="text-gray-600 ml-auto flex-shrink-0 text-xs">
                    {(tech.vulnerabilities / 1000).toFixed(1)}K
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Severity Legend */}
          <div>
            <div className="text-xs font-semibold text-gray-700 mb-1.5 px-1">Severity</div>
            <div className="flex flex-wrap gap-3 px-1">
              {severityOrder.map((severity) => (
                <div key={severity} className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: severityColors[severity] }}
                  />
                  <span className="text-xs text-gray-700 font-medium capitalize">{severity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
