import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Package,
  Building2,
  Minimize2,
  X,
  ZoomIn,
  ZoomOut,
  Home,
  Maximize2,
  Info,
  AlertTriangle,
} from "lucide-react";
import { NodeDetailsPopup } from "./NodeDetailsPopup";
import { NodeQuickInfo } from "./NodeQuickInfo";
import { LegendModal } from "./LegendModal";
import {
  getTechDetails,
  Technology,
  dependencyGraphData,
} from "@/data/dependencyGraphData";

interface GraphNode {
  id: string;
  label: string;
  type: "technology" | "vendor" | "issue";
  subtype?:
    | "direct"
    | "underlying"
    | "related"
    | "primary"
    | "parent"
    | "critical"
    | "high"
    | "medium"
    | "low";
  category?: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface GraphEdge {
  source: string;
  target: string;
  relationship: string;
}

interface DependencyGraphVisualizationProps {
  techStack: {
    name: string;
    version?: string;
    logo?: string;
  };
  nodes?: GraphNode[];
  edges?: GraphEdge[];
}

// Force-directed graph simulation
class ForceDirectedGraph {
  nodes: Map<string, GraphNode>;
  edges: GraphEdge[];
  width: number;
  height: number;

  constructor(
    nodes: GraphNode[],
    edges: GraphEdge[],
    width: number,
    height: number,
  ) {
    this.width = Math.max(width, 400);
    this.height = Math.max(height, 500);
    this.edges = edges;

    this.nodes = new Map(
      nodes.map((node) => {
        const initializedNode: GraphNode = {
          id: node.id,
          label: node.label,
          type: node.type,
          subtype: node.subtype,
          x: node.x ?? Math.random() * this.width,
          y: node.y ?? Math.random() * this.height,
          vx: 0,
          vy: 0,
        };
        return [node.id, initializedNode];
      }),
    );

    this.simulate(30);
  }

  simulate(iterations: number) {
    const k = Math.sqrt((this.width * this.height) / this.nodes.size);
    const c = 0.05;

    for (let iter = 0; iter < iterations; iter++) {
      const nodeArray = Array.from(this.nodes.values());
      nodeArray.forEach((node1) => {
        node1.vx = 0;
        node1.vy = 0;
        nodeArray.forEach((node2) => {
          if (node1.id !== node2.id) {
            const dx = (node2.x ?? 0) - (node1.x ?? 0);
            const dy = (node2.y ?? 0) - (node1.y ?? 0);
            const distance = Math.sqrt(dx * dx + dy * dy) || 0.1;
            const repulsion = (k * k) / distance;
            node1.vx! -= (dx / distance) * repulsion;
            node1.vy! -= (dy / distance) * repulsion;
          }
        });
      });

      this.edges.forEach((edge) => {
        const source = this.nodes.get(edge.source);
        const target = this.nodes.get(edge.target);
        if (source && target) {
          const dx = (target.x ?? 0) - (source.x ?? 0);
          const dy = (target.y ?? 0) - (source.y ?? 0);
          const distance = Math.sqrt(dx * dx + dy * dy) || 0.1;
          const attraction = ((distance * distance) / k) * 0.1;
          source.vx! += (dx / distance) * attraction;
          source.vy! += (dy / distance) * attraction;
          target.vx! -= (dx / distance) * attraction;
          target.vy! -= (dy / distance) * attraction;
        }
      });

      nodeArray.forEach((node) => {
        node.vx! *= c;
        node.vy! *= c;
        node.x = Math.max(
          50,
          Math.min(this.width - 50, (node.x ?? 0) + node.vx!),
        );
        node.y = Math.max(
          50,
          Math.min(this.height - 50, (node.y ?? 0) + node.vy!),
        );
      });
    }
  }

  getNodes() {
    return Array.from(this.nodes.values());
  }
}

// Interactive Graph Renderer with Pan and Zoom
interface GraphRendererProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  width: number;
  height: number;
  onTechNodeClick?: (
    nodeId: string,
    position: { x: number; y: number },
  ) => void;
  showTooltips?: boolean;
}

function GraphRenderer({
  nodes,
  edges,
  width,
  height,
  onTechNodeClick,
  showTooltips = false,
}: GraphRendererProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const spacePressed = useRef(false);

  // Create graph only once and cache it - prevents nodes from jumping
  const renderedNodes = useMemo(() => {
    const graph = new ForceDirectedGraph(nodes, edges, width, height);
    return graph.getNodes();
  }, [nodes, edges, width, height]);

  const relationshipLabels: Record<string, string> = {
    uses: "Uses",
    related_to: "Related To",
    provided_by: "Provided By",
    subsidiary_of: "Subsidiary Of",
    found_in: "Found In",
    provides_by: "Provides",
    implements: "Implements",
    derived_from: "Derived From",
    parent_of: "Parent Of",
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    const target = e.target as SVGElement;

    // Check if click is on a node (circle, text inside node, or node group)
    const nodeElement = target.closest('.node-group');
    const isOnNode = !!nodeElement;

    // Allow dragging if:
    // 1. Middle mouse button (button 1) - always allows drag
    // 2. Left click (button 0) on empty area (not on a node)
    // 3. Left click with Space key held - always allows drag
    const shouldDrag =
      e.button === 1 ||
      (e.button === 0 && !isOnNode) ||
      (e.button === 0 && spacePressed.current);

    if (shouldDrag) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      e.preventDefault();
    }
  };

  // Track Space key for dragging
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        spacePressed.current = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        spacePressed.current = false;
        setIsDragging(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

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
    const newZoom = Math.min(Math.max(zoom * delta, 0.5), 3);
    setZoom(newZoom);
  };

  const zoomIn = () => setZoom((z) => Math.min(z + 0.2, 3));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.5));
  const resetView = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <div className="relative w-full h-full bg-gray-50">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{
          backgroundColor: "#f9fafb",
          touchAction: "none",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="20"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#9CA3AF" />
          </marker>
        </defs>

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Edges */}
          <g className="edges" style={{ pointerEvents: "none" }}>
            {edges.map((edge, idx) => {
              const source = renderedNodes.find((n) => n.id === edge.source);
              const target = renderedNodes.find((n) => n.id === edge.target);

              if (!source || !target) return null;

              const midX = ((source.x ?? 0) + (target.x ?? 0)) / 2;
              const midY = ((source.y ?? 0) + (target.y ?? 0)) / 2;
              const label =
                relationshipLabels[edge.relationship] || edge.relationship;

              // Get label color based on relationship type
              const getLabelColor = () => {
                switch (edge.relationship) {
                  case "uses":
                    return "#0EA5E9"; // Cyan
                  case "related_to":
                    return "#F97316"; // Orange
                  case "provided_by":
                    return "#A855F7"; // Purple
                  case "subsidiary_of":
                    return "#EAB308"; // Yellow
                  case "found_in":
                    return "#EF4444"; // Red - Vulnerability
                  case "provides_by":
                    return "#A855F7"; // Purple
                  case "implements":
                    return "#06B6D4"; // Cyan
                  case "derived_from":
                    return "#8B5CF6"; // Violet
                  case "parent_of":
                    return "#EC4899"; // Pink
                  default:
                    return "#6B7280"; // Gray
                }
              };

              return (
                <g key={idx}>
                  {/* Edge line with gradient effect */}
                  <line
                    x1={source.x ?? 0}
                    y1={source.y ?? 0}
                    x2={target.x ?? 0}
                    y2={target.y ?? 0}
                    stroke={getLabelColor()}
                    strokeWidth={2}
                    markerEnd="url(#arrowhead)"
                    opacity={0.4}
                  />

                  {/* Shadow for label background */}
                  <rect
                    x={midX - 55}
                    y={midY - 16}
                    width="110"
                    height="32"
                    fill="white"
                    opacity={0.95}
                    rx="5"
                    filter="drop-shadow(0 1px 3px rgba(0,0,0,0.1))"
                  />

                  {/* Label text - bold and prominent */}
                  <text
                    x={midX}
                    y={midY + 5}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="700"
                    fill={getLabelColor()}
                    opacity={1}
                    style={{ pointerEvents: "none" }}
                  >
                    {label}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Nodes */}
          <g className="nodes">
            {renderedNodes.map((node) => {
              const isTech = node.type === "technology";
              const isVendor = node.type === "vendor";
              const isIssue = node.type === "issue";
              const isDirectAffected = node.subtype === "direct";

              const handleNodeClick = (e: React.MouseEvent<SVGGElement>) => {
                if (isTech) {
                  onTechNodeClick?.(node.id, {
                    x: e.clientX,
                    y: e.clientY,
                  });
                }
              };

              const handleMouseEnter = (e: React.MouseEvent<SVGGElement>) => {
                if (showTooltips) {
                  setHoveredNode(node.id);
                  const svg = svgRef.current;
                  if (svg) {
                    const rect = svg.getBoundingClientRect();
                    setTooltipPos({
                      x: e.clientX - rect.left + 10,
                      y: e.clientY - rect.top - 10,
                    });
                  }
                }
              };

              const handleMouseLeave = () => {
                setHoveredNode(null);
              };

              // Enhanced node sizing based on severity and type
              const getNodeRadius = () => {
                if (isIssue) return 20;
                if (isTech) {
                  const tech = getTechDetails(node.id, dependencyGraphData);
                  if (tech) {
                    const totalCVEs = tech.versions.reduce(
                      (sum, v) => sum + v.cves.length,
                      0,
                    );
                    // Larger for nodes with more vulnerabilities
                    if (totalCVEs >= 5) return 36;
                    if (totalCVEs >= 3) return 33;
                  }
                }
                return isDirectAffected ? 32 : 28;
              };

              // Get CVE severity color for tech nodes (PRIMARY COLOR)
              const getSeverityColor = () => {
                if (isTech) {
                  const tech = getTechDetails(node.id, dependencyGraphData);
                  if (tech) {
                    const totalCVEs = tech.versions.reduce(
                      (sum, v) => sum + v.cves.length,
                      0,
                    );
                    // Return bright colors based on severity
                    if (totalCVEs === 0) return "#10B981"; // Green - no CVEs
                    if (totalCVEs >= 5) return "#DC2626"; // Bright Red - CRITICAL
                    if (totalCVEs >= 3) return "#EA580C"; // Orange - HIGH
                    if (totalCVEs >= 1) return "#D97706"; // Amber - MEDIUM
                  }
                }
                return null; // Use default color
              };

              // Determine node color based on type and subtype with better colors
              const getNodeColor = () => {
                if (isIssue) {
                  switch (node.subtype) {
                    case "critical":
                      return "#DC2626"; // Bright Red
                    case "high":
                      return "#EA580C"; // Orange
                    case "medium":
                      return "#D97706"; // Amber
                    case "low":
                      return "#10B981"; // Green
                    default:
                      return "#8B5CF6"; // Purple
                  }
                } else if (isVendor) {
                  return isDirectAffected ? "#A855F7" : "#D8B4FE"; // Purple variants
                } else if (isTech) {
                  // For tech nodes, use severity color if available, otherwise use blue
                  const severityColor = getSeverityColor();
                  if (severityColor) return severityColor;
                  return isDirectAffected ? "#0EA5E9" : "#60A5FA"; // Blue variants (fallback)
                }
                return "#6B7280";
              };

              const radius = getNodeRadius();
              const innerRadius = Math.max(radius - 8, 12);

              return (
                <g
                  key={node.id}
                  className="cursor-pointer node-group"
                  style={{ pointerEvents: "auto" }}
                  onClick={handleNodeClick}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Outer colored circle */}
                  <circle
                    cx={node.x ?? 0}
                    cy={node.y ?? 0}
                    r={radius}
                    fill={getNodeColor()}
                    opacity={0.9}
                  />


                  {/* Inner white circle */}
                  <circle
                    cx={node.x ?? 0}
                    cy={node.y ?? 0}
                    r={innerRadius}
                    fill="white"
                    opacity={0.98}
                  />

                  {/* Node icon */}
                  {isIssue ? (
                    <g
                      transform={`translate(${(node.x ?? 0) - 8}, ${(node.y ?? 0) - 8})`}
                    >
                      <text
                        x="8"
                        y="12"
                        textAnchor="middle"
                        fontSize="14"
                        fontWeight="bold"
                        fill="#EF4444"
                      >
                        !
                      </text>
                    </g>
                  ) : isTech ? (
                    <g
                      transform={`translate(${(node.x ?? 0) - 8}, ${(node.y ?? 0) - 8})`}
                    >
                      <Package
                        width="16"
                        height="16"
                        stroke={isDirectAffected ? "#0EA5E9" : "#60A5FA"}
                        fill="none"
                        strokeWidth="2"
                      />
                    </g>
                  ) : (
                    <g
                      transform={`translate(${(node.x ?? 0) - 8}, ${(node.y ?? 0) - 8})`}
                    >
                      <Building2
                        width="16"
                        height="16"
                        stroke="#A855F7"
                        fill="none"
                        strokeWidth="2"
                      />
                    </g>
                  )}

                  {/* Primary label */}
                  <text
                    x={node.x ?? 0}
                    y={(node.y ?? 0) + (radius + 18)}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="700"
                    fill="#1F2937"
                    style={{
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  >
                    {isIssue ? node.label : node.label.split(" ").slice(0, 1).join(" ")}
                  </text>

                  {/* Secondary label/type */}
                  {!isIssue && (
                    <text
                      x={node.x ?? 0}
                      y={(node.y ?? 0) + (radius + 32)}
                      textAnchor="middle"
                      fontSize="11"
                      fill="#6B7280"
                      style={{ pointerEvents: "none", userSelect: "none" }}
                    >
                      {node.subtype || "node"}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      {/* Controls Overlay - Bottom Left Corner */}
      <div className="absolute bottom-4 left-4 flex flex-row gap-1 bg-white rounded-lg shadow-lg p-1 items-center">
        <button
          onClick={zoomIn}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Zoom In"
        >
          <ZoomIn width="14" height="14" className="text-gray-600" />
        </button>
        <button
          onClick={zoomOut}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Zoom Out"
        >
          <ZoomOut width="14" height="14" className="text-gray-600" />
        </button>
        <div className="w-px h-4 bg-gray-200" />
        <button
          onClick={resetView}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Reset View"
        >
          <Home width="14" height="14" className="text-gray-600" />
        </button>

        <div className="w-px h-4 bg-gray-200" />
        {/* Zoom Level Indicator */}
        <div className="flex justify-center px-1 py-0.5 text-xs text-gray-600 font-medium min-w-[28px]">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Tooltip */}
      {showTooltips && hoveredNode && (
        <div
          className="fixed bg-gray-900 text-white text-sm px-3 py-2 rounded shadow-lg pointer-events-none"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
            maxWidth: "200px",
            wordWrap: "break-word",
          }}
        >
          {nodes.find((n) => n.id === hoveredNode)?.label}
        </div>
      )}
    </div>
  );
}

export function DependencyGraphVisualization({
  techStack,
  nodes: initialNodes,
  edges: initialEdges,
}: DependencyGraphVisualizationProps) {
  const [graphData, setGraphData] = useState<{
    nodes: GraphNode[];
    edges: GraphEdge[];
  } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 700 });
  const [selectedTechNode, setSelectedTechNode] = useState<Technology | null>(
    null,
  );
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [quickInfoNode, setQuickInfoNode] = useState<Technology | null>(null);
  const [quickInfoPos, setQuickInfoPos] = useState({ x: 0, y: 0 });
  const [showLegend, setShowLegend] = useState(false);
  const graphContainerRef = React.useRef<HTMLDivElement>(null);

  const handleTechNodeClick = (
    nodeId: string,
    position: { x: number; y: number },
  ) => {
    console.log(`=== Node Click ===`);
    console.log(`Clicked node ID: ${nodeId}`);

    let tech = getTechDetails(nodeId, dependencyGraphData);
    console.log(`getTechDetails result:`, tech);

    // If tech is not found, try to find it by matching against the graph data
    if (!tech && initialNodes) {
      const clickedNode = initialNodes.find((n) => n.id === nodeId);
      console.log(`Found node in initialNodes:`, clickedNode);

      if (clickedNode) {
        // Look for tech by name in the dependencyGraphData
        tech = dependencyGraphData.technologies.find(
          (t) =>
            t.product.toLowerCase() === clickedNode.label.toLowerCase() ||
            t.id === clickedNode.label.toLowerCase().replace(/\s+/g, "-")
        );
        console.log(`Searched by label "${clickedNode.label}", Found:`, tech);
      }
    }

    if (tech) {
      console.log(`Setting tech node:`, tech.product);
      console.log(`CVEs:`, tech.versions.flatMap(v => v.cves));
    } else {
      console.log(`WARNING: Tech not found for node ${nodeId}`);
    }

    setSelectedTechNode(tech);
    setQuickInfoNode(tech);
    setQuickInfoPos(position);
    setShowFullDetails(false);
  };

  const handleExpandClick = () => {
    setShowFullDetails(true);
  };

  const handleCloseQuickInfo = () => {
    setQuickInfoNode(null);
  };

  const handleFullscreenClick = () => {
    setIsFullscreen(true);
  };

  const WIDTH = 800;
  const HEIGHT = 500;

  useEffect(() => {
    // Update window size on mount and resize
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize(); // Set initial size
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (initialNodes && initialEdges) {
      setGraphData({ nodes: initialNodes, edges: initialEdges });
    } else {
      const defaultNodes: GraphNode[] = [
        {
          id: "tech-main",
          label: techStack.name,
          type: "technology",
          subtype: "direct",
        },
        {
          id: "tech-underlying",
          label: `${techStack.name} Runtime`,
          type: "technology",
          subtype: "underlying",
        },
        {
          id: "tech-related",
          label: "Related Framework",
          type: "technology",
          subtype: "related",
        },
        {
          id: "vendor-primary",
          label: "Primary Vendor",
          type: "vendor",
          subtype: "primary",
        },
        {
          id: "vendor-parent",
          label: "Parent Company",
          type: "vendor",
          subtype: "parent",
        },
      ];

      const defaultEdges: GraphEdge[] = [
        {
          source: "tech-main",
          target: "tech-underlying",
          relationship: "uses",
        },
        {
          source: "tech-main",
          target: "tech-related",
          relationship: "related_to",
        },
        {
          source: "tech-main",
          target: "vendor-primary",
          relationship: "provided_by",
        },
        {
          source: "tech-underlying",
          target: "vendor-primary",
          relationship: "provided_by",
        },
        {
          source: "vendor-primary",
          target: "vendor-parent",
          relationship: "subsidiary_of",
        },
      ];

      setGraphData({ nodes: defaultNodes, edges: defaultEdges });
    }
  }, []);

  if (!graphData)
    return <div className="h-96 bg-gray-50 rounded-lg animate-pulse" />;

  return (
    <>
      {/* Normal View */}
      {!isFullscreen && (
        <div>
          {/* Graph Container */}
          <div
            ref={graphContainerRef}
            className="border border-gray-200 rounded-lg bg-white overflow-hidden h-[600px] relative"
          >
            <GraphRenderer
              nodes={graphData.nodes}
              edges={graphData.edges}
              width={WIDTH}
              height={500}
              onTechNodeClick={handleTechNodeClick}
              showTooltips={true}
            />

            {/* Quick Info Dropdown */}
            {quickInfoNode && !showFullDetails && (
              <NodeQuickInfo
                tech={quickInfoNode}
                position={quickInfoPos}
                onExpand={handleExpandClick}
                onClose={handleCloseQuickInfo}
                containerRef={graphContainerRef}
              />
            )}

            {/* Floating Buttons on Graph Frame */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={() => setShowLegend(true)}
                className="p-2 hover:bg-gray-200 bg-white text-gray-600 rounded-lg transition-colors shadow-md"
                title="Show legend"
              >
                <Info width="20" height="20" />
              </button>
              <button
                onClick={handleFullscreenClick}
                className="p-2 hover:bg-blue-600 bg-blue-500 text-white rounded-lg transition-colors shadow-md"
                title="Open fullscreen"
              >
                <Maximize2 width="20" height="20" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen View */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 flex items-center justify-between shadow-lg">
            <h2 className="text-lg font-bold">
              Dependency Graph - {techStack.name}
            </h2>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2 hover:bg-blue-500 rounded-lg transition-colors bg-blue-500 bg-opacity-50"
              title="Exit fullscreen"
            >
              <X width="24" height="24" className="text-white" />
            </button>
          </div>

          {/* Graph Container */}
          <div
            ref={graphContainerRef}
            className="flex-1 overflow-hidden bg-gray-50 relative"
          >
            <GraphRenderer
              nodes={graphData.nodes}
              edges={graphData.edges}
              width={windowSize.width}
              height={windowSize.height - 100}
              onTechNodeClick={handleTechNodeClick}
              showTooltips={true}
            />

            {/* Quick Info Dropdown */}
            {quickInfoNode && !showFullDetails && (
              <NodeQuickInfo
                tech={quickInfoNode}
                position={quickInfoPos}
                onExpand={handleExpandClick}
                onClose={handleCloseQuickInfo}
                containerRef={graphContainerRef}
              />
            )}
          </div>
        </div>
      )}

      {/* Node Details Popup */}
      {showFullDetails && (
        <NodeDetailsPopup
          tech={selectedTechNode}
          onClose={() => {
            setShowFullDetails(false);
            setSelectedTechNode(null);
            setQuickInfoNode(null);
          }}
          containerRef={graphContainerRef}
        />
      )}

      {/* Legend Modal */}
      <LegendModal isOpen={showLegend} onClose={() => setShowLegend(false)} />
    </>
  );
}
