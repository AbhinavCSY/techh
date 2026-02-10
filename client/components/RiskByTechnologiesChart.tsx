import { techStackDatabase } from "@/data/mockData";
import { useMemo } from "react";

interface RiskByTechnologiesChartProps {
  compact?: boolean;
}

export function RiskByTechnologiesChart({
  compact = false,
}: RiskByTechnologiesChartProps) {
  // Technology vulnerability data
  const technologyData = [
    { name: "Java", vulnerabilities: 68200, color: "#3b82f6" },
    { name: "Go", vulnerabilities: 48300, color: "#f97316" },
    { name: ".NET", vulnerabilities: 33500, color: "#a855f7" },
    { name: "Python", vulnerabilities: 28700, color: "#ec4899" },
    { name: "Node JS", vulnerabilities: 14100, color: "#06b6d4" },
    { name: "Rust", vulnerabilities: 9200, color: "#eab308" },
    { name: "Ruby", vulnerabilities: 5100, color: "#d946ef" },
    { name: "PHP", vulnerabilities: 4900, color: "#8b5cf6" },
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
    <div className="flex flex-col gap-2 h-full">
      {/* Title */}
      <div className="flex-shrink-0">
        <h4 className="font-semibold text-gray-900 text-sm">
          Risk by Tech Stacks
        </h4>
      </div>

      {/* Chart and Legend Container - Side by Side */}
      <div className="flex items-start gap-3 flex-1 min-h-0">
        {/* Donut Chart */}
        <div className="flex-shrink-0">
          <svg
            width="100"
            height="100"
            viewBox="0 0 200 200"
            className="drop-shadow-sm"
          >
            {chartData.map((slice, index) => (
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
        </div>

        {/* Scrollable Legend */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="space-y-1">
            {chartData.map((tech, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-xs px-2 py-1 whitespace-nowrap"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tech.color }}
                  />
                  <span className="text-gray-700 font-medium text-xs truncate">{tech.name}</span>
                </div>
                <span className="text-gray-900 font-semibold text-xs flex-shrink-0 ml-1">
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
