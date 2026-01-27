import React, { useState, useEffect } from "react";
import { Package, Building2 } from "lucide-react";

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

    // Initialize nodes with positions and velocities
    this.nodes = new Map(
      nodes.map((node) => ({
        ...node,
        id: node.id,
        x: node.x ?? Math.random() * this.width,
        y: node.y ?? Math.random() * this.height,
        vx: 0,
        vy: 0,
      } as GraphNode)),
    );

    this.simulate(30);
  }

  simulate(iterations: number) {
    const k = Math.sqrt((this.width * this.height) / this.nodes.size);
    const c = 0.05; // Damping

    for (let iter = 0; iter < iterations; iter++) {
      // Repulsive forces
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

      // Attractive forces
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

      // Update positions with damping
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

export function DependencyGraphVisualization({
  techStack,
  nodes: initialNodes,
  edges: initialEdges,
}: DependencyGraphVisualizationProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [graphData, setGraphData] = useState<{
    nodes: GraphNode[];
    edges: GraphEdge[];
  } | null>(null);

  const WIDTH = 800;
  const HEIGHT = 500;

  // Generate default graph if not provided
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

  const graph = new ForceDirectedGraph(graphData.nodes, graphData.edges, WIDTH, HEIGHT);
  const nodes = graph.getNodes();

  const relationshipLabels: Record<string, string> = {
    uses: "Uses",
    related_to: "Related To",
    provided_by: "Provided By",
    subsidiary_of: "Subsidiary Of",
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2">Dependency Graph</h3>
        <p className="text-sm text-gray-600">
          Force-directed visualization of {techStack.name} and its technology/vendor ecosystem
        </p>
      </div>

      {/* SVG Graph Container */}
      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <svg
          width={WIDTH}
          height={HEIGHT}
          className="w-full"
          style={{ maxWidth: "100%" }}
        >
          <defs>
            {/* Arrow markers for edges */}
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

          {/* Edges */}
          <g className="edges">
            {graphData.edges.map((edge, idx) => {
              const source = nodes.find((n) => n.id === edge.source);
              const target = nodes.find((n) => n.id === edge.target);

              if (!source || !target) return null;

              const isActive =
                selectedNode === null ||
                selectedNode === edge.source ||
                selectedNode === edge.target;

              return (
                <g key={idx}>
                  {/* Edge line */}
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

                  {/* Edge label background */}
                  <rect
                    x={(source.x ?? 0 + (target.x ?? 0)) / 2 - 35}
                    y={(source.y ?? 0 + (target.y ?? 0)) / 2 - 12}
                    width="70"
                    height="20"
                    fill="white"
                    opacity={isActive ? 0.9 : 0}
                    rx="3"
                  />

                  {/* Edge label */}
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
            {nodes.map((node) => {
              const isSelected = selectedNode === node.id;
              const isTech = node.type === "technology";
              const isDirectAffected = node.subtype === "direct";

              return (
                <g
                  key={node.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedNode(isSelected ? null : node.id)}
                >
                  {/* Node circle background */}
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

                  {/* Node inner circle (white background for icon) */}
                  <circle
                    cx={node.x ?? 0}
                    cy={node.y ?? 0}
                    r={22}
                    fill="white"
                    opacity={0.95}
                  />

                  {/* Node icon */}
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

                  {/* Node label */}
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

                  {/* Node type label */}
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
        </svg>
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
        <p>Click on any node to highlight connections. The layout automatically positions nodes to minimize overlaps.</p>
      </div>
    </div>
  );
}
