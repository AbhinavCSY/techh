import React, { useState, useEffect } from "react";
import { Package, Building2, Maximize2, X } from "lucide-react";

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

// Graph Renderer Component
interface GraphRendererProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  width: number;
  height: number;
}

function GraphRenderer({ nodes, edges, width, height }: GraphRendererProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const graph = new ForceDirectedGraph(nodes, edges, width, height);
  const renderedNodes = graph.getNodes();

  const relationshipLabels: Record<string, string> = {
    uses: "Uses",
    related_to: "Related To",
    provided_by: "Provided By",
    subsidiary_of: "Subsidiary Of",
  };

  return (
    <svg width={width} height={height} className="w-full" style={{ maxWidth: "100%" }}>
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
    </svg>
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const WIDTH = 800;
  const HEIGHT = 500;
  const MODAL_WIDTH = 1200;
  const MODAL_HEIGHT = 700;

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
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          title="Expand to fullscreen"
        >
          <Maximize2 width="18" height="18" />
          <span className="text-sm font-medium">Expand</span>
        </button>
      </div>

      {/* Graph Container */}
      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <GraphRenderer
          nodes={graphData.nodes}
          edges={graphData.edges}
          width={WIDTH}
          height={HEIGHT}
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

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Dependency Graph - {techStack.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Full view of technology and vendor relationships
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Close"
              >
                <X width="24" height="24" className="text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-auto bg-gray-50 p-6">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <GraphRenderer
                  nodes={graphData.nodes}
                  edges={graphData.edges}
                  width={MODAL_WIDTH}
                  height={MODAL_HEIGHT}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
        <p className="font-medium mb-1">💡 Interactive Graph</p>
        <p>Click on any node to highlight connections. Use the Expand button to view the full graph in a larger window.</p>
      </div>
    </div>
  );
}
