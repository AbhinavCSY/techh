import React, { useMemo } from "react";
import { Package, AlertCircle } from "lucide-react";
import { buildGraphForTech, getTechDetails, dependencyGraphData } from "@/data/dependencyGraphData";

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
  // Build graph for this tech stack
  const graphData = useMemo(() => {
    return buildGraphForTech(techId, dependencyGraphData);
  }, [techId]);

  const getRiskColor = (cveCount?: number) => {
    if (cveCount === 0) return "#10B981"; // Green
    if (cveCount && cveCount >= 5) return "#DC2626"; // Red
    if (cveCount && cveCount >= 3) return "#EA580C"; // Orange
    if (cveCount && cveCount >= 1) return "#D97706"; // Amber
    return "#10B981"; // Green
  };

  const borderColor = getRiskColor(cveCount);

  // Extract only technology nodes (not issues or vendors) for internal visualization
  const techNodes = graphData.nodes.filter((n) => n.type === "technology");
  const techEdges = graphData.edges.filter((e) => {
    const sourceIsInTechs = techNodes.some((n) => n.id === e.source);
    const targetIsInTechs = techNodes.some((n) => n.id === e.target);
    return sourceIsInTechs && targetIsInTechs;
  });

  // Simple layout for internal dependencies
  const padding = 8;
  const innerWidth = width - 2 * padding;
  const innerHeight = height - 35; // Leave space for title

  // Position nodes in a simple vertical layout
  const nodePositions = new Map<string, { x: number; y: number }>();
  const nodeRadius = 8;

  // Main node at top
  nodePositions.set(techId, {
    x: padding + innerWidth / 2,
    y: padding + 15,
  });

  // Dependency nodes below
  let depIndex = 0;
  techNodes.forEach((node) => {
    if (node.id !== techId) {
      const nodesPerRow = Math.max(1, Math.floor(innerWidth / 30));
      const col = depIndex % nodesPerRow;
      const row = Math.floor(depIndex / nodesPerRow);
      nodePositions.set(node.id, {
        x: padding + 15 + (col * (innerWidth - 30)) / Math.max(1, nodesPerRow - 1),
        y: padding + 35 + row * 20,
      });
      depIndex++;
    }
  });

  return (
    <g className="tech-stack-box">
      {/* Box background */}
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

      {/* Header background */}
      <rect
        x={x}
        y={y}
        width={width}
        height={32}
        fill="#F9FAFB"
        stroke={borderColor}
        strokeWidth="2"
        rx="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Header content */}
      <g>
        {/* Icon */}
        <g transform={`translate(${x + 6}, ${y + 5})`}>
          <Package
            width="16"
            height="16"
            stroke={borderColor}
            fill="none"
            strokeWidth="2"
          />
        </g>

        {/* Title */}
        <text
          x={x + 26}
          y={y + 18}
          fontSize="11"
          fontWeight="600"
          fill="#1F2937"
          dominantBaseline="middle"
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          {techName.length > 16 ? techName.substring(0, 13) + "..." : techName}
        </text>

        {/* CVE Count */}
        {cveCount > 0 && (
          <g transform={`translate(${x + width - 18}, ${y + 16})`}>
            <circle
              cx="0"
              cy="0"
              r="7"
              fill={borderColor}
              opacity="0.9"
            />
            <text
              x="0"
              y="2"
              textAnchor="middle"
              fontSize="8"
              fontWeight="bold"
              fill="white"
              dominantBaseline="middle"
            >
              {cveCount}
            </text>
          </g>
        )}
      </g>

      {/* Internal dependency visualization */}
      <g clipPath={`url(#clip-${techId})`}>
        {/* Defs for clipping */}
        <defs>
          <clipPath id={`clip-${techId}`}>
            <rect
              x={x + 1}
              y={y + 33}
              width={width - 2}
              height={height - 34}
            />
          </clipPath>
        </defs>

        {/* Dependency edges */}
        {techEdges.map((edge, idx) => {
          const source = nodePositions.get(edge.source);
          const target = nodePositions.get(edge.target);
          if (!source || !target) return null;

          return (
            <line
              key={`edge-${idx}`}
              x1={x + source.x}
              y1={y + source.y}
              x2={x + target.x}
              y2={y + target.y}
              stroke="#D1D5DB"
              strokeWidth="1"
              opacity="0.6"
            />
          );
        })}

        {/* Dependency nodes */}
        {techNodes.map((node) => {
          const pos = nodePositions.get(node.id);
          if (!pos) return null;

          const isMain = node.id === techId;

          return (
            <g key={node.id}>
              {/* Node circle */}
              <circle
                cx={x + pos.x}
                cy={y + pos.y}
                r={isMain ? nodeRadius + 2 : nodeRadius}
                fill="white"
                stroke={isMain ? borderColor : "#D1D5DB"}
                strokeWidth={isMain ? 2 : 1}
                style={{ transition: "all 0.2s ease" }}
              />

              {/* Node label (abbreviated) */}
              {isMain && (
                <text
                  x={x + pos.x}
                  y={y + pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="7"
                  fontWeight="600"
                  fill="#374151"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {node.label.substring(0, 2).toUpperCase()}
                </text>
              )}
            </g>
          );
        })}
      </g>

      {/* Dependency count indicator */}
      {techNodes.length > 1 && (
        <text
          x={x + width - 8}
          y={y + height - 4}
          textAnchor="end"
          fontSize="8"
          fill="#9CA3AF"
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          +{techNodes.length - 1}
        </text>
      )}
    </g>
  );
}
