import React from "react";
import { Package } from "lucide-react";

interface TechStackDependencyBoxProps {
  techId: string;
  techName: string;
  x: number;
  y: number;
  width: number;
  height: number;
  cveCount?: number;
  riskLevel?: string;
}

export function TechStackDependencyBox({
  techId,
  techName,
  x,
  y,
  width,
  height,
  cveCount = 0,
  riskLevel = "low",
}: TechStackDependencyBoxProps) {
  const getRiskColor = (cveCount?: number) => {
    if (cveCount === 0) return "#10B981"; // Green
    if (cveCount && cveCount >= 5) return "#DC2626"; // Red
    if (cveCount && cveCount >= 3) return "#EA580C"; // Orange
    if (cveCount && cveCount >= 1) return "#D97706"; // Amber
    return "#10B981"; // Green
  };

  const borderColor = getRiskColor(cveCount);

  return (
    <g className="tech-stack-box">
      {/* Main box background */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="white"
        stroke={borderColor}
        strokeWidth="2"
        rx="6"
        style={{
          filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.1))",
        }}
      />

      {/* Header section with gradient */}
      <rect
        x={x}
        y={y}
        width={width}
        height={40}
        fill="#F9FAFB"
        stroke={borderColor}
        strokeWidth="2"
        rx="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Icon */}
      <g transform={`translate(${x + 8}, ${y + 10})`}>
        <Package
          width="18"
          height="18"
          stroke={borderColor}
          fill="none"
          strokeWidth="2"
        />
      </g>

      {/* Tech name text */}
      <text
        x={x + 32}
        y={y + 22}
        fontSize="12"
        fontWeight="600"
        fill="#1F2937"
        dominantBaseline="middle"
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        {techName.length > 18 ? techName.substring(0, 15) + "..." : techName}
      </text>

      {/* CVE badge on top right */}
      {cveCount > 0 && (
        <g transform={`translate(${x + width - 20}, ${y + 12})`}>
          <circle
            cx="0"
            cy="0"
            r="8"
            fill={borderColor}
            opacity="0.9"
          />
          <text
            x="0"
            y="3"
            textAnchor="middle"
            fontSize="9"
            fontWeight="bold"
            fill="white"
            dominantBaseline="middle"
          >
            {cveCount}
          </text>
        </g>
      )}

      {/* Info section - simple text showing dependencies count */}
      <text
        x={x + 10}
        y={y + 65}
        fontSize="10"
        fill="#6B7280"
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        Tech Stack
      </text>

      {/* Bottom border line */}
      <line
        x1={x}
        y1={y + 45}
        x2={x + width}
        y2={y + 45}
        stroke={borderColor}
        strokeWidth="1"
        opacity="0.2"
      />
    </g>
  );
}
