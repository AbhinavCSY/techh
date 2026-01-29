import React, { useMemo } from "react";
import { Package } from "lucide-react";
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
  // Build graph for this tech stack's internal dependencies
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

  // Extract only technology nodes for internal visualization
  const techNodes = graphData.nodes.filter((n) => n.type === "technology");
  
  // Get edges between tech nodes only
  const techEdges = graphData.edges.filter((e) => {
    const sourceIsInTechs = techNodes.some((n) => n.id === e.source);
    const targetIsInTechs = techNodes.some((n) => n.id === e.target);
    return sourceIsInTechs && targetIsInTechs;
  });

  // Layout nodes within the box
  const padding = 6;
  const innerWidth = width - 2 * padding;
  const innerHeight = height - 40; // Space for header

  // Simple grid layout for internal nodes
  const nodePositions = new Map<string, { x: number; y: number }>();
  const nodeRadius = 5;
  const nodeSpacingX = Math.max(40, innerWidth / Math.max(2, Math.ceil(Math.sqrt(techNodes.length))));
  const nodeSpacingY = Math.max(30, innerHeight / Math.max(2, Math.ceil(Math.sqrt(techNodes.length))));

  let nodeIndex = 0;
  const cols = Math.max(1, Math.ceil(innerWidth / nodeSpacingX));
  techNodes.forEach((node) => {
    const col = nodeIndex % cols;
    const row = Math.floor(nodeIndex / cols);
    nodePositions.set(node.id, {
      x: padding + 20 + col * nodeSpacingX,
      y: padding + 32 + row * nodeSpacingY,
    });
    nodeIndex++;
  });

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
        rx="4"
        style={{
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))",
        }}
      />

      {/* Header section */}
      <rect
        x={x}
        y={y}
        width={width}
        height={36}
        fill="#F9FAFB"
        stroke={borderColor}
        strokeWidth="2"
        rx="4"
      />

      {/* Header content */}
      <g>
        {/* Icon */}
        <g transform={`translate(${x + 6}, ${y + 8})`}>
          <Package
            width="16"
            height="16"
            stroke={borderColor}
            fill="none"
            strokeWidth="2"
          />
        </g>

        {/* Tech name */}
        <text
          x={x + 26}
          y={y + 20}
          fontSize="11"
          fontWeight="700"
          fill="#1F2937"
          dominantBaseline="middle"
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          {techName.length > 15 ? techName.substring(0, 12) + "..." : techName}
        </text>

        {/* CVE count */}
        {cveCount > 0 && (
          <g transform={`translate(${x + width - 14}, ${y + 10})`}>
            <circle cx="0" cy="0" r="6" fill={borderColor} opacity="0.9" />
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

      {/* Internal dependency edges */}
      <g>
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
              stroke={borderColor}
              strokeWidth="1"
              opacity="0.5"
              strokeDasharray="2,2"
            />
          );
        })}
      </g>

      {/* Internal dependency nodes */}
      <g>
        {techNodes.map((node) => {
          const pos = nodePositions.get(node.id);
          if (!pos) return null;

          const isMainNode = node.id === techId;
          const nodeColor = isMainNode ? borderColor : "#9CA3AF";
          const nodeSize = isMainNode ? nodeRadius + 2 : nodeRadius;

          return (
            <g key={node.id}>
              {/* Node circle */}
              <circle
                cx={x + pos.x}
                cy={y + pos.y}
                r={nodeSize}
                fill={nodeColor}
                opacity={isMainNode ? 0.9 : 0.6}
                style={{ transition: "all 0.2s ease" }}
              />

              {/* Node label on hover (abbreviated) */}
              <title>{node.label}</title>
            </g>
          );
        })}
      </g>

      {/* Dependency count indicator at bottom */}
      {techNodes.length > 1 && (
        <text
          x={x + width - 6}
          y={y + height - 3}
          textAnchor="end"
          fontSize="9"
          fill="#9CA3AF"
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          +{techNodes.length - 1}
        </text>
      )}
    </g>
  );
}
