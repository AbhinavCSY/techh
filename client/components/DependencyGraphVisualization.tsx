import React, { useState, useEffect, useRef } from "react";
import { Package, Building2, Minimize2, X, ZoomIn, ZoomOut, Home, Maximize2 } from "lucide-react";
import { NodeDetailsPopup } from "./NodeDetailsPopup";
import { getTechDetails, Technology } from "@/data/dependencyGraphData";

interface GraphNode {
  id: string;
  label: string;
  type: "technology" | "vendor";
  subtype?: "direct" | "underlying" | "related" | "primary" | "parent";
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

  constructor(nodes: GraphNode[], edges: GraphEdge[], width: number, height: number) {
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
          const attraction = (distance * distance) / k * 0.1;
          source.vx! += (dx / distance) * attraction;
          source.vy! += (dy / distance) * attraction;
          target.vx! -= (dx / distance) * attraction;
          target.vy! -= (dy / distance) * attraction;
        }
      });

      nodeArray.forEach((node) => {
        node.vx! *= c;
        node.vy! *= c;
        node.x = Math.max(50, Math.min(this.width - 50, (node.x ?? 0) + node.vx!));
        node.y = Math.max(50, Math.min(this.height - 50, (node.y ?? 0) + node.vy!));
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
}

function GraphRenderer({ nodes, edges, width, height }: GraphRendererProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const graph = new ForceDirectedGraph(nodes, edges, width, height);
  const renderedNodes = graph.getNodes();

  const relationshipLabels: Record<string, string> = {
    uses: "Uses",
    related_to: "Related To",
    provided_by: "Provided By",
    subsidiary_of: "Subsidiary Of",
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
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
        className="w-full h-full cursor-move"
        style={{ backgroundColor: "#f9fafb" }}
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
          <g className="edges">
            {edges.map((edge, idx) => {
              const source = renderedNodes.find((n) => n.id === edge.source);
              const target = renderedNodes.find((n) => n.id === edge.target);

              if (!source || !target) return null;

              const isActive =
                selectedNode === null ||
                selectedNode === edge.source ||
                selectedNode === edge.target;

              return (
                <g key={idx}>
                  <line
                    x1={source.x ?? 0}
                    y1={source.y ?? 0}
                    x2={target.x ?? 0}
                    y2={target.y ?? 0}
                    stroke="#D1D5DB"
                    strokeWidth={isActive ? 2.5 : 1.5}
                    markerEnd="url(#arrowhead)"
                    opacity={isActive ? 0.8 : 0.2}
                    style={{ transition: "all 0.3s ease" }}
                  />

                  <rect
                    x={(source.x ?? 0 + (target.x ?? 0)) / 2 - 35}
                    y={(source.y ?? 0 + (target.y ?? 0)) / 2 - 12}
                    width="70"
                    height="20"
                    fill="white"
                    opacity={isActive ? 0.9 : 0}
                    rx="3"
                  />

                  <text
                    x={(source.x ?? 0 + (target.x ?? 0)) / 2}
                    y={(source.y ?? 0 + (target.y ?? 0)) / 2 + 3}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="500"
                    fill="#374151"
                    opacity={isActive ? 1 : 0}
                    style={{ transition: "opacity 0.3s ease", pointerEvents: "none" }}
                  >
                    {relationshipLabels[edge.relationship] || edge.relationship}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Nodes */}
          <g className="nodes">
            {renderedNodes.map((node) => {
              const isSelected = selectedNode === node.id;
              const isTech = node.type === "technology";
              const isDirectAffected = node.subtype === "direct";

              return (
                <g
                  key={node.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedNode(isSelected ? null : node.id)}
                >
                  <circle
                    cx={node.x ?? 0}
                    cy={node.y ?? 0}
                    r={isSelected ? 36 : 30}
                    fill={
                      isTech
                        ? isDirectAffected
                          ? "#3B82F6"
                          : "#818CF8"
                        : isSelected
                          ? "#9333EA"
                          : "#A78BFA"
                    }
                    opacity={selectedNode === null || isSelected ? 0.95 : 0.4}
                    style={{ transition: "all 0.2s ease" }}
                    stroke={isSelected ? "#1F2937" : "none"}
                    strokeWidth={isSelected ? 3 : 0}
                  />

                  <circle
                    cx={node.x ?? 0}
                    cy={node.y ?? 0}
                    r={22}
                    fill="white"
                    opacity={0.95}
                  />

                  {isTech ? (
                    <g
                      transform={`translate(${(node.x ?? 0) - 8}, ${(node.y ?? 0) - 8})`}
                    >
                      <Package
                        width="16"
                        height="16"
                        stroke="#3B82F6"
                        fill="none"
                        strokeWidth="1.5"
                      />
                    </g>
                  ) : (
                    <g
                      transform={`translate(${(node.x ?? 0) - 8}, ${(node.y ?? 0) - 8})`}
                    >
                      <Building2
                        width="16"
                        height="16"
                        stroke="#9333EA"
                        fill="none"
                        strokeWidth="1.5"
                      />
                    </g>
                  )}

                  <text
                    x={node.x ?? 0}
                    y={(node.y ?? 0) + 48}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight={isSelected ? "700" : "500"}
                    fill="#1F2937"
                    style={{
                      pointerEvents: "none",
                      userSelect: "none",
                      transition: "font-weight 0.2s ease",
                    }}
                  >
                    {node.label.split(" ").slice(0, 2).join(" ")}
                  </text>

                  <text
                    x={node.x ?? 0}
                    y={(node.y ?? 0) + 62}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#6B7280"
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    {node.subtype}
                  </text>
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      {/* Controls Overlay */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 bg-white rounded-lg shadow-lg p-2">
        <button
          onClick={zoomIn}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Zoom In"
        >
          <ZoomIn width="20" height="20" className="text-gray-600" />
        </button>
        <button
          onClick={zoomOut}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Zoom Out"
        >
          <ZoomOut width="20" height="20" className="text-gray-600" />
        </button>
        <div className="h-px bg-gray-200" />
        <button
          onClick={resetView}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Reset View"
        >
          <Home width="20" height="20" className="text-gray-600" />
        </button>
      </div>

      {/* Zoom Level Indicator */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow px-3 py-1 text-sm text-gray-600">
        {Math.round(zoom * 100)}%
      </div>
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
        { source: "tech-main", target: "tech-underlying", relationship: "uses" },
        { source: "tech-main", target: "tech-related", relationship: "related_to" },
        { source: "tech-main", target: "vendor-primary", relationship: "provided_by" },
        { source: "tech-underlying", target: "vendor-primary", relationship: "provided_by" },
        { source: "vendor-primary", target: "vendor-parent", relationship: "subsidiary_of" },
      ];

      setGraphData({ nodes: defaultNodes, edges: defaultEdges });
    }
  }, []);

  if (!graphData) return <div className="h-96 bg-gray-50 rounded-lg animate-pulse" />;

  return (
    <>
      {/* Normal View */}
      {!isFullscreen && (
        <div className="space-y-4">
          {/* Header with Expand Button */}
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Dependency Graph</h3>
              <p className="text-sm text-gray-600">
                Force-directed visualization of {techStack.name} ecosystem
              </p>
            </div>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 width="18" height="18" />
                  <span className="text-sm font-medium">Exit Fullscreen</span>
                </>
              ) : (
                <>
                  <Maximize2 width="18" height="18" />
                  <span className="text-sm font-medium">Fullscreen</span>
                </>
              )}
            </button>
          </div>

          {/* Graph Container */}
          <div className="border border-gray-200 rounded-lg bg-white overflow-hidden h-96">
            <GraphRenderer
              nodes={graphData.nodes}
              edges={graphData.edges}
              width={WIDTH}
              height={500}
            />
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500" />
              <span>Direct Tech</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-indigo-500" />
              <span>Related Tech</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-purple-500" />
              <span>Primary Vendor</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-violet-500" />
              <span>Parent Company</span>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            <p className="font-medium mb-1">💡 Interactive Graph</p>
            <p>Click on any node to highlight connections. Use Fullscreen mode for pan/zoom.</p>
          </div>
        </div>
      )}

      {/* Fullscreen View */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Dependency Graph - {techStack.name}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Drag to pan • Scroll to zoom • Click nodes to highlight
              </p>
            </div>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Exit fullscreen"
            >
              <X width="24" height="24" className="text-gray-600" />
            </button>
          </div>

          {/* Graph Container */}
          <div className="flex-1 overflow-hidden">
            <GraphRenderer
              nodes={graphData.nodes}
              edges={graphData.edges}
              width={windowSize.width}
              height={windowSize.height - 80}
            />
          </div>
        </div>
      )}
    </>
  );
}
