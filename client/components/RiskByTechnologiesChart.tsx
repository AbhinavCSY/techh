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
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const [hoveredSeverity, setHoveredSeverity] = useState<string | null>(null);

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

  const severityColors = {
    critical: "#dc2626",
    high: "#f97316",
    medium: "#eab308",
    low: "#16a34a",
  };

  const severityOrder = ["critical", "high", "medium", "low"] as const;

  const total = useMemo(
    () => technologyData.reduce((sum, tech) => sum + tech.vulnerabilities, 0),
    [],
  );

  const chartData = useMemo(() => {
    return technologyData.map((tech) => {
      const percentage = (tech.vulnerabilities / total) * 100;

      const severitySegments: SeveritySegment[] = severityOrder.map((severity) => ({
        severity,
        count: tech[severity] || 0,
        color: severityColors[severity],
        percentage: (tech[severity] || 0) / tech.vulnerabilities * 100,
      }));

      return {
        ...tech,
        percentage,
        severitySegments,
      };
    });
  }, []);

  // Calculate node positions in a network layout
  const nodePositions = useMemo(() => {
    const radius = 140;
    const centerX = 300;
    const centerY = 180;

    return chartData.map((tech, index) => {
      const angle = (index / chartData.length) * 2 * Math.PI;
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        tech: tech.name,
      };
    });
  }, []);

  // Get severity badge count for a tech
  const getCriticalCount = (tech: TechData) => {
    return tech.severitySegments.find(s => s.severity === 'critical')?.count || 0;
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <h4 className="font-semibold text-gray-900 text-sm">
        Risk by Tech Stacks
      </h4>

      {/* Network Graph Container */}
      <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
        <div className="relative w-full" style={{ paddingBottom: '60%' }}>
          <svg
            viewBox="0 0 600 360"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 w-full h-full drop-shadow-sm"
          >
            {/* Connection lines between all techs */}
            {nodePositions.map((node1, idx1) =>
              nodePositions.map((node2, idx2) => {
                if (idx1 >= idx2) return null;
                const tech1 = chartData[idx1];
                const tech2 = chartData[idx2];
                const isHovered = hoveredTech === tech1.name || hoveredTech === tech2.name;

                return (
                  <line
                    key={`line-${idx1}-${idx2}`}
                    x1={node1.x}
                    y1={node1.y}
                    x2={node2.x}
                    y2={node2.y}
                    stroke="#cbd5e1"
                    strokeWidth={isHovered ? "2" : "1"}
                    opacity={hoveredTech ? (isHovered ? 0.6 : 0.15) : 0.3}
                    className="transition-all duration-200"
                  />
                );
              })
            )}

            {/* Tech stack nodes */}
            {nodePositions.map((pos, index) => {
              const tech = chartData[index];
              const isHovered = hoveredTech === tech.name;
              const criticalCount = getCriticalCount(tech);

              return (
                <g key={`tech-node-${index}`}>
                  {/* Node circle */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isHovered ? 28 : 24}
                    fill={tech.color}
                    stroke="white"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredTech(tech.name)}
                    onMouseLeave={() => setHoveredTech(null)}
                    style={{
                      opacity: hoveredTech ? (isHovered ? 1 : 0.4) : 0.85,
                      filter: isHovered ? "brightness(1.15) drop-shadow(0 4px 6px rgba(0,0,0,0.2))" : "none",
                    }}
                  />

                  {/* Critical severity badge */}
                  {criticalCount > 0 && (
                    <circle
                      cx={pos.x + 18}
                      cy={pos.y - 18}
                      r="12"
                      fill={severityColors.critical}
                      stroke="white"
                      strokeWidth="1.5"
                      className="cursor-pointer transition-all"
                      onMouseEnter={() => setHoveredTech(tech.name)}
                      onMouseLeave={() => setHoveredTech(null)}
                    />
                  )}

                  {/* Critical count text */}
                  {criticalCount > 0 && (
                    <text
                      x={pos.x + 18}
                      y={pos.y - 15}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xs font-bold fill-white pointer-events-none"
                    >
                      {criticalCount > 99 ? "99+" : criticalCount}
                    </text>
                  )}

                  {/* Tech name label */}
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs font-bold fill-white pointer-events-none"
                    style={{
                      fontSize: isHovered ? "12px" : "11px",
                    }}
                  >
                    {tech.name}
                  </text>

                  {/* Tooltip on hover */}
                  {isHovered && (
                    <g>
                      <rect
                        x={pos.x - 80}
                        y={pos.y - 130}
                        width="160"
                        height="110"
                        fill="white"
                        stroke="#e5e7eb"
                        strokeWidth="1"
                        rx="8"
                        className="drop-shadow-lg"
                      />

                      {/* Tech name in tooltip */}
                      <text
                        x={pos.x}
                        y={pos.y - 110}
                        textAnchor="middle"
                        className="text-sm font-bold fill-gray-900 pointer-events-none"
                      >
                        {tech.name}
                      </text>

                      {/* Total vulnerabilities */}
                      <text
                        x={pos.x - 70}
                        y={pos.y - 90}
                        className="text-xs fill-gray-600 pointer-events-none font-medium"
                      >
                        Total Issues:
                      </text>
                      <text
                        x={pos.x + 70}
                        y={pos.y - 90}
                        textAnchor="end"
                        className="text-xs fill-gray-900 pointer-events-none font-bold"
                      >
                        {tech.vulnerabilities.toLocaleString()}
                      </text>

                      {/* Severity breakdown */}
                      {severityOrder.map((severity, idx) => {
                        const segment = tech.severitySegments.find(s => s.severity === severity);
                        if (!segment || segment.count === 0) return null;

                        return (
                          <g key={`tooltip-sev-${severity}`}>
                            <circle
                              cx={pos.x - 68}
                              cy={pos.y - 70 + idx * 18}
                              r="3"
                              fill={segment.color}
                            />
                            <text
                              x={pos.x - 58}
                              y={pos.y - 67 + idx * 18}
                              className="text-xs fill-gray-700 pointer-events-none capitalize font-medium"
                            >
                              {severity}:
                            </text>
                            <text
                              x={pos.x + 70}
                              y={pos.y - 67 + idx * 18}
                              textAnchor="end"
                              className="text-xs fill-gray-900 pointer-events-none font-semibold"
                            >
                              {segment.count}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  )}
                </g>
              );
            })}

            {/* Center info card */}
            <g>
              <rect
                x="230"
                y="280"
                width="140"
                height="70"
                fill="white"
                stroke="#e5e7eb"
                strokeWidth="1.5"
                rx="8"
                className="drop-shadow-md"
              />
              <text
                x="300"
                y="300"
                textAnchor="middle"
                className="text-xs fill-gray-600 pointer-events-none font-medium"
              >
                Total Vulnerabilities
              </text>
              <text
                x="300"
                y="325"
                textAnchor="middle"
                className="text-2xl fill-gray-900 pointer-events-none font-bold"
              >
                {(total / 1000).toFixed(1)}K
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Severity Overview Bar */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-gray-700">Severity Distribution</div>
        <div className="flex gap-2">
          {severityOrder.map((severity) => {
            const count = chartData.reduce((sum, tech) => {
              const seg = tech.severitySegments.find(s => s.severity === severity);
              return sum + (seg?.count || 0);
            }, 0);
            const percentage = (count / total) * 100;

            return (
              <div
                key={severity}
                className="flex-1"
                onMouseEnter={() => setHoveredSeverity(severity)}
                onMouseLeave={() => setHoveredSeverity(null)}
              >
                <div
                  className="h-2 rounded-full transition-all cursor-pointer"
                  style={{
                    backgroundColor: severityColors[severity],
                    opacity: hoveredSeverity ? (hoveredSeverity === severity ? 1 : 0.4) : 0.8,
                  }}
                />
                <div className="text-xs text-gray-600 mt-1 flex justify-between">
                  <span className="capitalize font-medium">{severity}</span>
                  <span className="text-gray-700 font-semibold">{percentage.toFixed(0)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tech Stacks Table */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-gray-700">Tech Stacks Overview</div>
        <div className="space-y-1.5">
          {chartData.map((tech) => (
            <div
              key={tech.name}
              className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
              onMouseEnter={() => setHoveredTech(tech.name)}
              onMouseLeave={() => setHoveredTech(null)}
            >
              {/* Tech color indicator */}
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: tech.color }}
              />

              {/* Tech name */}
              <span className="text-sm font-medium text-gray-900 min-w-16">{tech.name}</span>

              {/* Critical badge */}
              {getCriticalCount(tech) > 0 && (
                <div className="ml-auto flex items-center gap-1.5 px-2 py-1 bg-red-100 rounded-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                  <span className="text-xs font-semibold text-red-700">{getCriticalCount(tech)}</span>
                </div>
              )}

              {/* Vulnerability count */}
              <div className="ml-auto text-right">
                <div className="text-sm font-bold text-gray-900">{(tech.vulnerabilities / 1000).toFixed(1)}K</div>
                <div className="text-xs text-gray-500">{tech.percentage.toFixed(1)}%</div>
              </div>

              {/* Severity indicators */}
              <div className="flex gap-0.5 flex-shrink-0">
                {severityOrder.map((severity) => {
                  const seg = tech.severitySegments.find(s => s.severity === severity);
                  if (!seg || seg.count === 0) return null;
                  return (
                    <div
                      key={severity}
                      className="w-1.5 h-5 rounded-sm"
                      style={{ backgroundColor: seg.color }}
                      title={`${severity}: ${seg.count}`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div>
          <div className="text-xs font-semibold text-gray-700 mb-2">Severity Levels</div>
          <div className="space-y-1.5">
            {severityOrder.map((severity) => (
              <div key={severity} className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: severityColors[severity] }}
                />
                <span className="text-xs text-gray-700 capitalize font-medium">{severity}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold text-gray-700 mb-2">Key Indicators</div>
          <div className="space-y-1.5 text-xs text-gray-600">
            <div>• Red badges show critical issues</div>
            <div>• Node size indicates severity</div>
            <div>• Lines show tech relationships</div>
            <div>• Hover for detailed info</div>
          </div>
        </div>
      </div>
    </div>
  );
}
