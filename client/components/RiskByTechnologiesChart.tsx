import { techStackDatabase } from "@/data/mockData";
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

export function RiskByTechnologiesChart({
  compact = false,
}: RiskByTechnologiesChartProps) {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

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

  const chartData = useMemo(() => {
    let currentAngle = 0;
    return technologyData.map((tech) => {
      const percentage = (tech.vulnerabilities / total) * 100;
      const sliceAngle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      currentAngle = endAngle;

      return {
        ...tech,
        percentage,
        startAngle,
        endAngle,
      };
    });
  }, []);

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

  return (
    <div className="space-y-2">
      {/* Title */}
      <h4 className="font-semibold text-gray-900 text-xs">
        Risk by Tech Stacks
      </h4>

      {/* Chart Container */}
      <div className="flex flex-col items-center relative">
        {/* Donut Chart */}
        <div className="flex-shrink-0 relative">
          <svg
            width="100"
            height="100"
            viewBox="0 0 200 200"
            className="drop-shadow-sm"
          >
            {chartData.map((slice, index) => (
              <g key={index}>
                <path
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
                  onMouseEnter={(e) => {
                    setHoveredTech(slice.name);
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltipPos({ x: rect.x + 50, y: rect.y - 80 });
                  }}
                  onMouseLeave={() => setHoveredTech(null)}
                  className="cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
                  style={{ filter: hoveredTech === slice.name ? "brightness(1.1)" : "none" }}
                />
              </g>
            ))}
            {/* Center text */}
            <text
              x="100"
              y="95"
              textAnchor="middle"
              className="text-xs font-bold fill-gray-900"
            >
              Total
            </text>
            <text
              x="100"
              y="110"
              textAnchor="middle"
              className="text-xs font-bold fill-gray-900"
            >
              {(total / 1000).toFixed(0)}K
            </text>
          </svg>

          {/* Tooltip on hover */}
          {hoveredTech && (
            <div
              className="absolute bg-gray-900 text-white text-xs rounded-lg p-3 w-48 shadow-lg pointer-events-none z-50"
              style={{
                left: `${tooltipPos.x}px`,
                top: `${tooltipPos.y}px`,
                transform: "translate(-50%, -10px)",
              }}
            >
              {(() => {
                const hoveredData = chartData.find((t) => t.name === hoveredTech);
                if (!hoveredData) return null;
                return (
                  <div className="space-y-2">
                    <div className="font-semibold">{hoveredData.name}</div>
                    <div className="text-gray-300">Total: {(hoveredData.vulnerabilities / 1000).toFixed(1)}K</div>
                    <div className="pt-1 border-t border-gray-700 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-600"></div>
                        <span>Critical: {hoveredData.critical}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <span>High: {hoveredData.high}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                        <span>Medium: {hoveredData.medium}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>Low: {hoveredData.low}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Scrollable Legend Below */}
        <div className="w-full mt-1 max-h-24 overflow-y-auto">
          <div className="space-y-0.5">
            {chartData.map((tech, index) => (
              <div
                key={index}
                className={`flex items-center justify-between px-1 py-0.5 whitespace-nowrap rounded cursor-pointer transition-colors ${
                  hoveredTech === tech.name ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
                style={{ fontSize: "11px" }}
                onMouseEnter={() => setHoveredTech(tech.name)}
                onMouseLeave={() => setHoveredTech(null)}
              >
                <div className="flex items-center gap-1 min-w-0">
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tech.color }}
                  />
                  <span className="text-gray-600 font-medium truncate">{tech.name}</span>
                </div>
                <span className="text-gray-800 font-semibold flex-shrink-0 ml-1">
                  {(tech.vulnerabilities / 1000).toFixed(1)}K
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
