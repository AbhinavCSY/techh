import React, { useState, useEffect, useRef } from "react";
import {
  Package,
  ZoomIn,
  ZoomOut,
  Home,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { dependencyGraphData, getTechDetails } from "@/data/dependencyGraphData";

interface TechStack {
  id: string;
  name: string;
  version?: string;
  type?: string;
  logo?: string;
  cveCount?: number;
  riskLevel?: string;
  riskScore?: number;
}

interface GraphNode {
  id: string;
  label: string;
  type: "technology";
  x: number;
  y: number;
  cveCount?: number;
  riskLevel?: string;
  width: number;
  height: number;
}

interface GraphEdge {
  source: string;
  target: string;
  relationship: string;
}

interface CombinedDependencyGraphProps {
  techStacks: TechStack[];
}

class TreeGraphLayout {
  nodes: Map<string, GraphNode>;
  edges: GraphEdge[];
  width: number;
  height: number;
  levels: Map<string, number>;
  children: Map<string, string[]>;

  constructor(
    nodes: GraphNode[],
    edges: GraphEdge[],
    width: number,
    height: number,
  ) {
    this.width = Math.max(width, 1000);
    this.height = Math.max(height, 700);
    this.edges = edges;
    this.levels = new Map();
    this.children = new Map();

    // Build tree structure
    this.buildTreeStructure(nodes);

    this.nodes = new Map(
      nodes.map((node) => [
        node.id,
        { ...node, x: 0, y: 0 },
      ]),
    );

    this.layoutAsTree();
  }

  buildTreeStructure(nodes: GraphNode[]) {
    // Find root nodes (nodes with no incoming edges)
    const hasIncoming = new Set<string>();
    this.edges.forEach((edge) => {
      hasIncoming.add(edge.target);
    });

    const visited = new Set<string>();
    const queue: { id: string; level: number }[] = [];

    nodes.forEach((node) => {
      if (!hasIncoming.has(node.id)) {
        queue.push({ id: node.id, level: 0 });
        this.levels.set(node.id, 0);
        visited.add(node.id);
      }
    });

    // Build hierarchy tree
    while (queue.length > 0) {
      const { id, level } = queue.shift()!;

      this.edges.forEach((edge) => {
        if (edge.source === id && !visited.has(edge.target)) {
          this.levels.set(edge.target, level + 1);
          visited.add(edge.target);
          queue.push({ id: edge.target, level: level + 1 });

          if (!this.children.has(id)) {
            this.children.set(id, []);
          }
          this.children.get(id)!.push(edge.target);
        }
      });
    }

    // Assign remaining nodes to level 0
    nodes.forEach((node) => {
      if (!this.levels.has(node.id)) {
        this.levels.set(node.id, 0);
      }
    });
  }

  layoutAsTree() {
    const levels = new Map<number, string[]>();

    // Group nodes by level
    this.nodes.forEach((node, id) => {
      const level = this.levels.get(id) ?? 0;
      if (!levels.has(level)) {
        levels.set(level, []);
      }
      levels.get(level)!.push(id);
    });

    // Find root nodes
    const rootNodes = Array.from(this.nodes.keys()).filter(
      (id) => this.levels.get(id) === 0
    );

    // Position nodes recursively
    const minLevel = Math.min(...Array.from(this.levels.values()));
    const maxLevel = Math.max(...Array.from(this.levels.values()));
    const levelHeight = (this.height - 150) / Math.max(maxLevel - minLevel + 1, 1);

    // Position root nodes
    const rootSpacing = this.width / (rootNodes.length + 1);
    rootNodes.forEach((nodeId, index) => {
      const node = this.nodes.get(nodeId)!;
      node.x = rootSpacing * (index + 1);
      node.y = 60;
      this.positionChildrenRecursively(nodeId, node.x, node.y + levelHeight, levelHeight);
    });
  }

  positionChildrenRecursively(
    parentId: string,
    parentX: number,
    startY: number,
    levelHeight: number,
  ) {
    const children = this.children.get(parentId) || [];
    if (children.length === 0) return;

    const childSpacing = Math.min(140, 800 / (children.length + 1));
    const startX = parentX - (childSpacing * (children.length - 1)) / 2;

    children.forEach((childId, index) => {
      const child = this.nodes.get(childId)!;
      child.x = startX + childSpacing * index;
      child.y = startY;

      this.positionChildrenRecursively(childId, child.x, child.y + levelHeight, levelHeight);
    });
  }

  getNodes() {
    return Array.from(this.nodes.values());
  }
}

export function CombinedDependencyGraph({
  techStacks,
}: CombinedDependencyGraphProps) {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredEdgeIndex, setHoveredEdgeIndex] = useState<number | null>(null);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  const WIDTH = 1200;
  const HEIGHT = 700;

  // Build combined graph from all tech stacks using actual dependencies
  useEffect(() => {
    // Create nodes from tech stacks
    const graphNodes: GraphNode[] = techStacks.map((tech) => {
      const techId = tech.id || `tech-${tech.name.replace(/\s+/g, "-").toLowerCase()}`;
      const techDetails = getTechDetails(techId, dependencyGraphData);
      const cveCount = techDetails ?
        techDetails.versions.reduce((sum, v) => sum + v.cves.length, 0) :
        tech.cveCount || 0;

      return {
        id: techId,
        label: tech.name,
        type: "technology",
        x: 0,
        y: 0,
        cveCount,
        riskLevel: tech.riskLevel || "low",
        width: 160,
        height: 100,
      };
    });

    // Create edges from dependency graph relationships
    const graphEdges: GraphEdge[] = [];
    const nodeIds = new Set(graphNodes.map(n => n.id));

    // Find relationships between the tech stacks in our graph
    dependencyGraphData.relationships.forEach((rel) => {
      if (nodeIds.has(rel.from) && nodeIds.has(rel.to)) {
        graphEdges.push({
          source: rel.from,
          target: rel.to,
          relationship: rel.type,
        });
      }
    });

    // Layout the graph
    const layout = new TreeGraphLayout(graphNodes, graphEdges, WIDTH, HEIGHT);
    setNodes(layout.getNodes());
    setEdges(graphEdges);
  }, [techStacks]);

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
    const newZoom = Math.min(Math.max(zoom * delta, 0.5), 3);
    setZoom(newZoom);
  };

  const zoomIn = () => setZoom((z) => Math.min(z + 0.2, 3));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.5));
  const resetView = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  const getRiskColor = (riskLevel: string, cveCount?: number) => {
    if (cveCount === 0) return "#10B981"; // Green
    if (cveCount && cveCount >= 5) return "#DC2626"; // Red
    if (cveCount && cveCount >= 3) return "#EA580C"; // Orange
    if (cveCount && cveCount >= 1) return "#D97706"; // Amber
    switch (riskLevel.toLowerCase()) {
      case "critical":
        return "#DC2626";
      case "high":
        return "#EA580C";
      case "medium":
        return "#D97706";
      case "low":
        return "#10B981";
      default:
        return "#0EA5E9";
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100">
      <style>{`
        @keyframes nodeHoverPulse {
          0% { filter: drop-shadow(0 0 0 rgba(59, 130, 246, 0)); }
          50% { filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.4)); }
          100% { filter: drop-shadow(0 0 0 rgba(59, 130, 246, 0)); }
        }
        .node-group:hover circle:first-child {
          animation: nodeHoverPulse 0.6s ease-in-out;
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
        }
        .edge-line {
          transition: stroke-width 0.2s ease, opacity 0.2s ease;
        }
        .edge-line:hover {
          stroke-width: 3;
          opacity: 0.8;
        }
      `}</style>

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
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="18"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#60A5FA" opacity="0.7" />
          </marker>
        </defs>

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Edges */}
          <g className="edges">
            {edges.map((edge, idx) => {
              const source = nodes.find((n) => n.id === edge.source);
              const target = nodes.find((n) => n.id === edge.target);

              if (!source || !target) return null;

              const isEdgeHovered = hoveredEdgeIndex === idx;
              const midX = (source.x + target.x) / 2;
              const midY = (source.y + target.y) / 2;

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

              const label = relationshipLabels[edge.relationship] || edge.relationship;

              return (
                <g key={idx}>
                  {/* Invisible larger hitbox for easier hover detection */}
                  <line
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke="transparent"
                    strokeWidth={20}
                    style={{ cursor: "pointer", pointerEvents: "auto" }}
                    onMouseEnter={() => setHoveredEdgeIndex(idx)}
                    onMouseLeave={() => setHoveredEdgeIndex(null)}
                  />

                  {/* Edge line - curved path for tree layout */}
                  <path
                    className="edge-line"
                    d={`M ${source.x} ${source.y} L ${source.x} ${(source.y + target.y) / 2} L ${target.x} ${(source.y + target.y) / 2} L ${target.x} ${target.y}`}
                    stroke="#94A3B8"
                    strokeWidth={1.5}
                    fill="none"
                    opacity={isEdgeHovered ? 0.7 : 0.4}
                    style={{ strokeLinecap: "round", pointerEvents: "none" }}
                  />

                  {/* Label on hover */}
                  {isEdgeHovered && (
                    <g filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))">
                      <rect
                        x={midX - 50}
                        y={midY - 16}
                        width="100"
                        height="32"
                        fill="white"
                        opacity={0.97}
                        rx="4"
                        strokeWidth="1"
                        stroke="#60A5FA"
                        strokeOpacity="0.5"
                      />
                      <text
                        x={midX}
                        y={midY + 3}
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="600"
                        fill="#0EA5E9"
                        opacity={1}
                      >
                        {label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* Nodes as Circles */}
          <g className="nodes">
            {nodes.map((node) => {
              const radius = 45;
              const color = getRiskColor(node.riskLevel || "low", node.cveCount);

              return (
                <g key={node.id} className="node-group cursor-move hover:opacity-80 transition-opacity">
                  {/* Circle shadow */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius}
                    fill="black"
                    opacity="0.1"
                    filter="blur(3px)"
                  />

                  {/* Main circle with gradient background */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius}
                    fill="white"
                    stroke={color}
                    strokeWidth="3"
                    opacity={1}
                    style={{ transition: "all 0.2s ease" }}
                    filter="drop-shadow(0 2px 6px rgba(0,0,0,0.15))"
                  />

                  {/* Background colored circle (inner) */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius - 6}
                    fill={color}
                    opacity="0.08"
                  />

                  {/* Icon - Package */}
                  <g transform={`translate(${node.x - 9}, ${node.y - 25})`}>
                    <Package
                      width="18"
                      height="18"
                      stroke={color}
                      fill="none"
                      strokeWidth="2.5"
                    />
                  </g>

                  {/* Tech name - Abbreviated */}
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill="#1F2937"
                    style={{
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  >
                    {node.label.length > 12
                      ? node.label.substring(0, 12)
                      : node.label}
                  </text>

                  {/* CVE Badge - positioned at bottom right */}
                  {node.cveCount !== undefined && node.cveCount > 0 && (
                    <g transform={`translate(${node.x + 30}, ${node.y + 25})`}>
                      <circle
                        cx="0"
                        cy="0"
                        r="14"
                        fill={color}
                        opacity="0.9"
                        stroke="white"
                        strokeWidth="2"
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="bold"
                        fill="white"
                      >
                        {node.cveCount}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      {/* Control Sidebar */}
      <div
        className="absolute left-4 bottom-6 flex flex-col gap-1.5 bg-white rounded-lg shadow-lg p-1.5 backdrop-blur-sm border border-gray-200"
        style={{ transform: "scale(0.75)", transformOrigin: "bottom left" }}
      >
        <button
          onClick={zoomIn}
          className="p-2 hover:bg-blue-50 rounded-md transition-all duration-200 text-gray-600 hover:text-blue-600 hover:shadow-sm"
          title="Zoom In"
        >
          <ZoomIn width="14" height="14" />
        </button>

        <div className="flex flex-col items-center justify-center px-1.5 py-0.5 bg-gray-50 rounded-md border border-gray-200">
          <span className="text-xs font-bold text-gray-700">
            {Math.round(zoom * 100)}
          </span>
          <span className="text-xxs text-gray-500">%</span>
        </div>

        <button
          onClick={zoomOut}
          className="p-2 hover:bg-blue-50 rounded-md transition-all duration-200 text-gray-600 hover:text-blue-600 hover:shadow-sm"
          title="Zoom Out"
        >
          <ZoomOut width="14" height="14" />
        </button>

        <div className="w-6 h-px bg-gray-200 mx-auto" />

        <button
          onClick={resetView}
          className="p-2 hover:bg-green-50 rounded-md transition-all duration-200 text-gray-600 hover:text-green-600 hover:shadow-sm"
          title="Reset View"
        >
          <Home width="14" height="14" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200 max-w-xs">
        <div className="flex items-center gap-2 mb-3">
          <Info width="16" height="16" className="text-blue-600" />
          <h3 className="font-semibold text-sm text-gray-900">Legend</h3>
        </div>
        <div className="space-y-3 text-xs">
          <div>
            <p className="font-medium text-gray-700 mb-2">Risk Levels (Box Border):</p>
            <div className="space-y-1 ml-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border-2 border-red-500"></div>
                <span className="text-gray-700">Critical (5+ CVEs)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border-2 border-orange-500"></div>
                <span className="text-gray-700">High (3-4 CVEs)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border-2 border-amber-500"></div>
                <span className="text-gray-700">Medium (1-2 CVEs)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border-2 border-green-500"></div>
                <span className="text-gray-700">Low (No CVEs)</span>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-gray-200">
            <p className="text-gray-600">Boxes connected by lines show dependencies between tech stacks.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
