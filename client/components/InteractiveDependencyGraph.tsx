import React, { useState, useEffect, useRef, useMemo } from "react";
import { ZoomIn, ZoomOut, Home, Info, AlertCircle } from "lucide-react";
import {
  transformToDependencyGraph,
  getAffectedTechnologies,
  getBlastRadius,
} from "@/lib/dependencyGraphTransformer";
import { ForceLayout } from "@/lib/forceLayout";

const WIDTH = 5000;
const HEIGHT = 2200;

export function InteractiveDependencyGraph() {
  const [pan, setPan] = useState({ x: 0, y: 50 });
  const [zoom, setZoom] = useState(0.35);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [expandedClusters, setExpandedClusters] = useState(new Set<string>());
  const [showLegend, setShowLegend] = useState(false);
  const [showOnlyCritical, setShowOnlyCritical] = useState(false);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});
  const svgRef = useRef<SVGSVGElement>(null);

  const layoutResult = useMemo(() => {
    const graph = transformToDependencyGraph();
    const layout = new ForceLayout(
      graph.nodes,
      graph.edges,
      graph.clusters,
      WIDTH,
      HEIGHT,
    );
    return {
      ...layout.simulate(),
      clusters: graph.clusters,
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.min(Math.max(zoom * delta, 0.3), 3);
    setZoom(newZoom);
  };

  const zoomIn = () => setZoom((z) => Math.min(z + 0.1, 3));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.3));
  const resetView = () => {
    setPan({ x: 0, y: 50 });
    setZoom(0.35);
  };

  const getNodeColor = (node: (typeof layoutResult.nodes)[0]) => {
    switch (node.type) {
      case "technology":
        return "#3B82F6"; // Blue
      case "version":
        return node.eol ? "#EF4444" : "#D1D5DB"; // Red if EOL, else gray
      case "issue":
        switch (node.severity) {
          case "critical":
            return "#DC2626"; // Red
          case "high":
            return "#EA580C"; // Orange
          case "medium":
            return "#FBBF24"; // Yellow
          case "low":
            return "#10B981"; // Green
          default:
            return "#6B7280";
        }
      case "vendor":
        return "#A855F7"; // Purple
      default:
        return "#6B7280";
    }
  };

  const getNodeSize = (node: (typeof layoutResult.nodes)[0]) => {
    switch (node.type) {
      case "technology":
        return 18;
      case "version":
        return 10;
      case "issue":
        return 12;
      case "vendor":
        return 14;
      default:
        return 10;
    }
  };

  // Filter nodes for critical issues
  const filteredNodes = useMemo(() => {
    if (!showOnlyCritical) return layoutResult.nodes;

    const criticalIssueIds = new Set(
      layoutResult.nodes
        .filter((n) => n.type === "issue" && n.severity === "critical")
        .map((n) => n.id),
    );

    const affectedTechIds = new Set<string>();
    layoutResult.edges.forEach((edge) => {
      if (criticalIssueIds.has(edge.source) && edge.type === "found_in") {
        affectedTechIds.add(edge.target);
      }
    });

    return layoutResult.nodes.filter(
      (n) =>
        (n.type === "issue" && n.severity === "critical") ||
        affectedTechIds.has(n.id) ||
        (n.type === "technology" && n.cveCount && n.cveCount > 0),
    );
  }, [showOnlyCritical, layoutResult.nodes, layoutResult.edges]);

  // Filter edges based on visible nodes
  const filteredEdges = useMemo(() => {
    if (!showOnlyCritical) return layoutResult.edges;

    const visibleNodeIds = new Set(filteredNodes.map((n) => n.id));
    return layoutResult.edges.filter(
      (e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target),
    );
  }, [showOnlyCritical, filteredNodes, layoutResult.edges]);

  const selectedNode = selectedNodeId
    ? filteredNodes.find((n) => n.id === selectedNodeId)
    : null;

  const blastRadius =
    selectedNode && selectedNode.type === "technology"
      ? getBlastRadius(selectedNode.id, {
          clusters: layoutResult.clusters,
          nodes: filteredNodes,
          edges: filteredEdges,
        })
      : null;

  const affectedTechs =
    selectedNode && selectedNode.type === "issue"
      ? getAffectedTechnologies(selectedNode.id, {
          clusters: layoutResult.clusters,
          nodes: filteredNodes,
          edges: filteredEdges,
        })
      : null;

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100">
      <svg
        ref={svgRef}
        width={WIDTH}
        height={HEIGHT}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ backgroundColor: "transparent", touchAction: "none" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <defs>
          <marker
            id="arrowhead-default"
            markerWidth="10"
            markerHeight="10"
            refX="12"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#60A5FA" />
          </marker>
          <marker
            id="arrowhead-highlight"
            markerWidth="10"
            markerHeight="10"
            refX="12"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#1D4ED8" />
          </marker>
          <filter id="node-shadow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
        </defs>

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Draw cluster boundaries */}
          {layoutResult.clusters.map((cluster) => {
            const clusterNodes = filteredNodes.filter(
              (n) => n.cluster === cluster.id,
            );
            if (clusterNodes.length === 0) return null;

            // Calculate bounding box
            const xs = clusterNodes.map((n) => n.x);
            const ys = clusterNodes.map((n) => n.y);
            const minX = Math.min(...xs);
            const maxX = Math.max(...xs);
            const minY = Math.min(...ys);
            const maxY = Math.max(...ys);
            // Padding to ensure proper spacing with 220px minimum distance
            const padding = 250;

            return (
              <g key={`cluster-${cluster.id}`}>
                {/* Cluster boundary */}
                <rect
                  x={minX - padding}
                  y={minY - padding}
                  width={maxX - minX + 2 * padding}
                  height={maxY - minY + 2 * padding}
                  fill="none"
                  stroke="#94A3B8"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  rx="8"
                  opacity="0.5"
                />

                {/* Cluster label background */}
                <rect
                  x={minX - padding + 8}
                  y={minY - padding - 28}
                  width={cluster.label.length * 6 + 12}
                  height="22"
                  fill="white"
                  stroke="#94A3B8"
                  strokeWidth="1.5"
                  rx="4"
                  opacity="0.95"
                  style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
                />
                <text
                  x={minX - padding + 14}
                  y={minY - padding - 17}
                  fontSize="12"
                  fontWeight="700"
                  fill="#1F2937"
                  dominantBaseline="middle"
                  style={{ userSelect: "none" }}
                >
                  {cluster.label}
                </text>
              </g>
            );
          })}

          {/* Draw edges */}
          {filteredEdges.map((edge, idx) => {
            const source = filteredNodes.find((n) => n.id === edge.source);
            const target = filteredNodes.find((n) => n.id === edge.target);

            if (!source || !target) return null;

            // Determine if edge is directly connected or transitive
            const isDirectlyConnectedEdge =
              selectedNode &&
              (selectedNode.id === source.id || selectedNode.id === target.id);

            const isTransitiveEdge =
              selectedNode &&
              !isDirectlyConnectedEdge &&
              ((selectedNode.type === "technology" &&
                blastRadius &&
                (blastRadius.direct.includes(source.id) ||
                  blastRadius.direct.includes(target.id) ||
                  blastRadius.transitive.includes(source.id) ||
                  blastRadius.transitive.includes(target.id))) ||
                (selectedNode.type === "issue" &&
                  affectedTechs &&
                  (affectedTechs.direct.includes(source.id) ||
                    affectedTechs.direct.includes(target.id) ||
                    affectedTechs.transitive.includes(source.id) ||
                    affectedTechs.transitive.includes(target.id))));

            const isHighlighted = isDirectlyConnectedEdge || isTransitiveEdge;
            const hasAnySelection = !!selectedNode;

            const midX = (source.x + target.x) / 2;
            const midY = (source.y + target.y) / 2;

            // Map edge type to display label
            const edgeLabel =
              edge.type === "found_in"
                ? "Found In"
                : edge.type === "depends_on"
                  ? "Depends On"
                  : edge.type === "uses"
                    ? "Uses"
                    : edge.type === "affects"
                      ? "Affects"
                      : edge.type === "requires"
                        ? "Requires"
                        : edge.type;

            return (
              <g key={`edge-${idx}`}>
                {/* Edge glow for directly connected edges */}
                {isDirectlyConnectedEdge && (
                  <line
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke="#1E40AF"
                    strokeWidth={8}
                    opacity={0.2}
                    pointerEvents="none"
                    style={{ transition: "all 0.2s ease" }}
                  />
                )}
                {/* Edge glow for transitive edges */}
                {isTransitiveEdge && (
                  <line
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke="#60A5FA"
                    strokeWidth={5}
                    opacity={0.15}
                    pointerEvents="none"
                    style={{ transition: "all 0.2s ease" }}
                  />
                )}
                {/* Main edge */}
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={
                    isDirectlyConnectedEdge
                      ? "#1E40AF"
                      : isTransitiveEdge
                        ? "#2563EB"
                        : hasAnySelection
                          ? "#E0E7FF"
                          : "#D1D5DB"
                  }
                  strokeWidth={
                    isDirectlyConnectedEdge
                      ? 4
                      : isTransitiveEdge
                        ? 2.5
                        : hasAnySelection
                          ? 1
                          : 1.5
                  }
                  opacity={
                    isDirectlyConnectedEdge
                      ? 1
                      : isTransitiveEdge
                        ? 0.8
                        : hasAnySelection
                          ? 0.15
                          : 0.3
                  }
                  markerEnd={
                    isDirectlyConnectedEdge
                      ? "url(#arrowhead-highlight)"
                      : isTransitiveEdge
                        ? "url(#arrowhead-default)"
                        : "url(#arrowhead-default)"
                  }
                  style={{ transition: "all 0.2s ease", pointerEvents: "none" }}
                />

                {/* Edge label */}
                {(isDirectlyConnectedEdge || isTransitiveEdge) && (
                  <g pointerEvents="none">
                    {/* Background for label */}
                    <rect
                      x={midX - 35}
                      y={midY - 10}
                      width="70"
                      height="20"
                      fill="white"
                      stroke={
                        isDirectlyConnectedEdge ? "#1E40AF" : "#2563EB"
                      }
                      strokeWidth="1.5"
                      rx="3"
                      opacity={isDirectlyConnectedEdge ? 0.95 : 0.9}
                    />
                    {/* Label text */}
                    <text
                      x={midX}
                      y={midY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="10"
                      fontWeight={isDirectlyConnectedEdge ? "700" : "600"}
                      fill={isDirectlyConnectedEdge ? "#1E40AF" : "#2563EB"}
                      style={{ userSelect: "none", pointerEvents: "none" }}
                    >
                      {edgeLabel}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Draw nodes */}
          {filteredNodes.map((node) => {
            const color = getNodeColor(node);
            const size = getNodeSize(node);
            const isHovered = hoveredNodeId === node.id;
            const isSelected = selectedNodeId === node.id;

            // When a node is selected, highlight ALL nodes with varying intensities
            const isDirectlyConnected =
              selectedNode &&
              (selectedNode.id === node.id ||
                filteredEdges.some(
                  (e) =>
                    (e.source === selectedNode.id && e.target === node.id) ||
                    (e.source === node.id && e.target === selectedNode.id),
                ));

            const isAffected =
              selectedNode &&
              (selectedNode.id === node.id ||
                isDirectlyConnected ||
                (selectedNode.type === "technology" &&
                  blastRadius &&
                  (blastRadius.direct.includes(node.id) ||
                    blastRadius.transitive.includes(node.id))) ||
                (selectedNode.type === "issue" &&
                  affectedTechs &&
                  (affectedTechs.direct.includes(node.id) ||
                    affectedTechs.transitive.includes(node.id))));

            // All nodes should have some visual feedback when a node is selected
            const hasAnySelection = !!selectedNode;

            return (
              <g
                key={node.id}
                style={{
                  cursor: node.type !== "vendor" ? "pointer" : "default",
                }}
                opacity={
                  isSelected ? 1 : hasAnySelection && isDirectlyConnected ? 1 : hasAnySelection ? 0.8 : 1
                }
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                onClick={() => {
                  if (node.type !== "vendor") {
                    setSelectedNodeId(
                      selectedNodeId === node.id ? null : node.id,
                    );
                  }
                }}
              >
                {/* Node glow for all nodes when something is selected */}
                {hasAnySelection && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={size + 8}
                    fill={
                      isSelected ? "#1E40AF" : isDirectlyConnected ? "#2563EB" : "#93C5FD"
                    }
                    opacity={
                      isSelected ? 0.35 : isDirectlyConnected ? 0.25 : 0.1
                    }
                    style={{ pointerEvents: "none" }}
                  />
                )}

                {/* Node shadow */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={size + 2}
                  fill="black"
                  opacity={isHovered || isSelected ? 0.3 : isAffected ? 0.15 : 0.05}
                  filter="url(#node-shadow)"
                />

                {/* Main node */}
                {node.type === "vendor" ? (
                  // Square for vendor nodes
                  <rect
                    x={node.x - size}
                    y={node.y - size}
                    width={size * 2}
                    height={size * 2}
                    fill={color}
                    stroke={
                      isSelected
                        ? "#1E40AF"
                        : hasAnySelection && isDirectlyConnected
                          ? "#3B82F6"
                          : hasAnySelection && isAffected
                            ? "#60A5FA"
                            : hasAnySelection
                              ? "#BFDBFE"
                              : isHovered
                                ? "#6B7280"
                                : color
                    }
                    strokeWidth={
                      isSelected
                        ? 4
                        : hasAnySelection && isDirectlyConnected
                          ? 3
                          : hasAnySelection && isAffected
                            ? 2.5
                            : hasAnySelection
                              ? 2
                              : isHovered
                                ? 2
                                : 1.5
                    }
                    opacity={0.9}
                    rx="3"
                  />
                ) : (
                  // Circle for other nodes
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={size}
                    fill={color}
                    stroke={
                      isSelected
                        ? "#FFF"
                        : hasAnySelection && isDirectlyConnected
                          ? "#60A5FA"
                          : hasAnySelection && isAffected
                            ? "#93C5FD"
                            : hasAnySelection
                              ? "#DBEAFE"
                              : isHovered
                                ? "#FFF"
                                : color
                    }
                    strokeWidth={
                      isSelected
                        ? 4
                        : hasAnySelection && isDirectlyConnected
                          ? 3
                          : hasAnySelection && isAffected
                            ? 2.5
                            : hasAnySelection
                              ? 2
                              : isHovered
                                ? 2
                                : 1.5
                    }
                    opacity={0.9}
                  />
                )}

                {/* Node label - positioned above or below to reduce overlap */}
                <text
                  x={node.x}
                  y={node.y + (node.id.charCodeAt(0) % 2 === 0 ? size + 18 : -size - 6)}
                  textAnchor="middle"
                  fontSize={node.type === "technology" ? "11" : "9"}
                  fontWeight={
                    isSelected
                      ? "900"
                      : hasAnySelection && isDirectlyConnected
                        ? "800"
                        : hasAnySelection
                          ? "700"
                          : "600"
                  }
                  fill={
                    isSelected
                      ? "#1E40AF"
                      : hasAnySelection && isDirectlyConnected
                        ? "#2563EB"
                        : hasAnySelection && isAffected
                          ? "#3B82F6"
                          : hasAnySelection
                            ? "#60A5FA"
                            : "#1F2937"
                  }
                  dominantBaseline="middle"
                  pointerEvents="none"
                  style={{
                    userSelect: "none",
                    maxWidth: "100px",
                    textOverflow: "ellipsis",
                  }}
                >
                  {node.label.length > 16
                    ? node.label.substring(0, 13) + "..."
                    : node.label}
                </text>

                {/* CVE badge for technology nodes */}
                {node.type === "technology" &&
                  node.cveCount &&
                  node.cveCount > 0 && (
                    <g
                      transform={`translate(${node.x + size + 5}, ${node.y - size - 2})`}
                    >
                      <circle
                        cx="0"
                        cy="0"
                        r="6"
                        fill="#EF4444"
                        opacity="0.9"
                      />
                      <text
                        x="0"
                        y="2"
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="bold"
                        fill="white"
                        dominantBaseline="middle"
                      >
                        {node.cveCount}
                      </text>
                    </g>
                  )}

                {/* Hover tooltip */}
                {isHovered && (
                  <g style={{ pointerEvents: "none" }}>
                    {/* Shadow background */}
                    <rect
                      x={node.x + size + 8}
                      y={node.y - 55}
                      width="220"
                      height="100"
                      fill="black"
                      opacity="0.15"
                      rx="6"
                    />
                    {/* Main tooltip background */}
                    <rect
                      x={node.x + size + 10}
                      y={node.y - 53}
                      width="220"
                      height="100"
                      fill="white"
                      stroke="#2563EB"
                      strokeWidth="2"
                      rx="6"
                    />
                    {/* Type badge */}
                    <rect
                      x={node.x + size + 16}
                      y={node.y - 48}
                      width="80"
                      height="18"
                      fill={
                        node.type === "issue"
                          ? "#FEE2E2"
                          : node.type === "technology"
                            ? "#DBEAFE"
                            : "#F3E8FF"
                      }
                      rx="3"
                    />
                    <text
                      x={node.x + size + 56}
                      y={node.y - 39}
                      fontSize="10"
                      fontWeight="800"
                      fill={
                        node.type === "issue"
                          ? "#DC2626"
                          : node.type === "technology"
                            ? "#1E40AF"
                            : "#7C3AED"
                      }
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ pointerEvents: "none" }}
                    >
                      {node.type === "technology"
                        ? "TECH"
                        : node.type === "issue"
                          ? "CVE"
                          : node.type.toUpperCase()}
                    </text>

                    {/* Title */}
                    <text
                      x={node.x + size + 16}
                      y={node.y - 19}
                      fontSize="12"
                      fontWeight="800"
                      fill="#0F172A"
                      style={{ pointerEvents: "none" }}
                    >
                      {node.label.length > 20
                        ? node.label.substring(0, 17) + "..."
                        : node.label}
                    </text>

                    {/* Type description */}
                    <text
                      x={node.x + size + 16}
                      y={node.y - 5}
                      fontSize="9"
                      fontWeight="600"
                      fill="#666666"
                      style={{ pointerEvents: "none" }}
                    >
                      Type: {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
                    </text>

                    {/* CVE count */}
                    {node.cveCount !== undefined && node.cveCount > 0 && (
                      <text
                        x={node.x + size + 16}
                        y={node.y + 12}
                        fontSize="10"
                        fontWeight="700"
                        fill="#DC2626"
                        style={{ pointerEvents: "none" }}
                      >
                        CVEs: {node.cveCount}
                      </text>
                    )}
                    {/* Severity if issue */}
                    {node.type === "issue" && node.severity && (
                      <text
                        x={node.x + size + 16}
                        y={node.y + 12}
                        fontSize="10"
                        fontWeight="700"
                        fill="#EA580C"
                        style={{ pointerEvents: "none" }}
                      >
                        Severity: {node.severity}
                      </text>
                    )}
                    {/* Version if version type */}
                    {node.type === "version" && node.label && (
                      <text
                        x={node.x + size + 16}
                        y={node.y + 27}
                        fontSize="9"
                        fontWeight="600"
                        fill="#475569"
                        style={{ pointerEvents: "none" }}
                      >
                        Version Info
                      </text>
                    )}
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Control Sidebar */}
      <div className="absolute left-6 bottom-8 flex flex-col gap-2 bg-white rounded-lg shadow-xl p-3 border border-gray-300 z-50">
        <button
          onClick={() => setShowOnlyCritical(!showOnlyCritical)}
          className={`p-3 rounded-md transition-all font-bold text-sm ${
            showOnlyCritical
              ? "bg-red-100 text-red-700 hover:bg-red-200"
              : "hover:bg-red-50 text-gray-700 hover:text-red-600"
          }`}
          title="Show only Critical Issues"
        >
          🔴
        </button>
        <div className="w-8 h-px bg-gray-300 mx-auto" />
        <button
          onClick={zoomIn}
          className="p-3 hover:bg-blue-50 rounded-md transition-all text-gray-700 hover:text-blue-600"
          title="Zoom In"
        >
          <ZoomIn width="18" height="18" />
        </button>
        <div className="flex flex-col items-center px-2 py-2 bg-gray-50 rounded-md border border-gray-300 min-w-12">
          <span className="text-sm font-bold text-gray-700">
            {Math.round(zoom * 100)}%
          </span>
        </div>
        <button
          onClick={zoomOut}
          className="p-3 hover:bg-blue-50 rounded-md transition-all text-gray-700 hover:text-blue-600"
          title="Zoom Out"
        >
          <ZoomOut width="18" height="18" />
        </button>
        <div className="w-8 h-px bg-gray-300 mx-auto" />
        <button
          onClick={resetView}
          className="p-3 hover:bg-green-50 rounded-md transition-all text-gray-700 hover:text-green-600"
          title="Reset View"
        >
          <Home width="18" height="18" />
        </button>
      </div>

      {/* Info Icon Button */}
      <button
        onClick={() => setShowLegend(!showLegend)}
        className="absolute top-6 right-6 p-3 bg-white rounded-lg shadow-xl border border-gray-300 hover:bg-blue-50 transition-all text-gray-700 hover:text-blue-600 z-50"
        title={showLegend ? "Hide Legend" : "Show Legend"}
      >
        <Info width="20" height="20" />
      </button>

      {/* Legend Panel */}
      {showLegend && (
        <div className="absolute top-20 right-6 bg-white rounded-lg shadow-xl p-5 border border-gray-300 max-w-sm z-50 max-h-96 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <Info width="18" height="18" className="text-blue-600" />
            <h3 className="font-bold text-sm text-gray-900">Legend</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <p className="font-semibold text-gray-700 mb-2">Node Types:</p>
              <div className="space-y-1 ml-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Technology (Main Component)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <span>Version (Active)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Version (End of Life)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-600"></div>
                  <span>Issue - Critical</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-600"></div>
                  <span>Issue - High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>Issue - Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Issue - Low</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 bg-purple-500"
                    style={{ width: "6px", height: "6px" }}
                  ></div>
                  <span>Vendor</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-300">
              <p className="font-semibold text-gray-700 mb-2">Interactions:</p>
              <div className="space-y-1 ml-2 text-gray-600">
                <p>
                  • <strong>Hover</strong> - View node details
                </p>
                <p>
                  • <strong>Click Tech</strong> - Highlight blast radius
                </p>
                <p>
                  • <strong>Click Issue</strong> - Show affected techs
                </p>
                <p>
                  • <strong>Drag</strong> - Pan the view
                </p>
                <p>
                  • <strong>Scroll</strong> - Zoom in/out
                </p>
                <p>
                  • <strong>🔴 Button</strong> - Filter critical issues
                </p>
              </div>
            </div>

            {selectedNode && (
              <div className="pt-3 border-t border-gray-300">
                <p className="font-semibold text-gray-700 mb-2">
                  Selected: {selectedNode.label}
                </p>
                {selectedNode.type === "technology" && blastRadius && (
                  <div className="ml-2 text-gray-600">
                    <p className="font-semibold text-sm mb-1">Blast Radius:</p>
                    <p>Direct: {blastRadius.direct.length}</p>
                    <p>Transitive: {blastRadius.transitive.length}</p>
                  </div>
                )}
                {selectedNode.type === "issue" && affectedTechs && (
                  <div className="ml-2 text-gray-600">
                    <p className="font-semibold text-sm mb-1">
                      Affected Techs:
                    </p>
                    <p>Direct: {affectedTechs.direct.length}</p>
                    <p>Transitive: {affectedTechs.transitive.length}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
