import React, { useState, useEffect, useRef } from "react";
import { Package, Building2, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GraphNode {
  id: string;
  label: string;
  type: "technology" | "vendor";
  subtype?: "direct" | "underlying" | "related" | "primary" | "parent";
  x?: number;
  y?: number;
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
  nodes: Map<string, GraphNode & { vx: number; vy: number }>;
  edges: GraphEdge[];
  width: number;
  height: number;
  iterations: number = 50;

  constructor(nodes: GraphNode[], edges: GraphEdge[], width: number, height: number) {
    this.width = width;
    this.height = height;
    this.edges = edges;

    this.nodes = new Map(
      nodes.map((node) => [
        node.id,
        {
          ...node,
          x: node.x || Math.random() * width,
          y: node.y || Math.random() * height,
          vx: 0,
          vy: 0,
        },
      ]),
    );

    this.simulate();
  }

  simulate() {
    const k = Math.sqrt((this.width * this.height) / this.nodes.size);
    const c = 0.1; // Damping coefficient

    for (let iter = 0; iter < this.iterations; iter++) {
      // Repulsive forces (nodes push each other)
      this.nodes.forEach((node1) => {
        this.nodes.forEach((node2) => {
          if (node1.id !== node2.id) {
            const dx = node2.x! - node1.x!;
            const dy = node2.y! - node1.y!;
            const distance = Math.sqrt(dx * dx + dy * dy) || 0.1;
            const repulsion = (k * k) / distance;
            node1.vx -= (dx / distance) * repulsion;
            node1.vy -= (dy / distance) * repulsion;
          }
        });
      });

      // Attractive forces (connected nodes pull each other)
      this.edges.forEach((edge) => {
        const source = this.nodes.get(edge.source);
        const target = this.nodes.get(edge.target);
        if (source && target) {
          const dx = target.x! - source.x!;
          const dy = target.y! - source.y!;
          const distance = Math.sqrt(dx * dx + dy * dy) || 0.1;
          const attraction = (distance * distance) / k;
          source.vx += (dx / distance) * attraction;
          source.vy += (dy / distance) * attraction;
          target.vx -= (dx / distance) * attraction;
          target.vy -= (dy / distance) * attraction;
        }
      });

      // Update positions
      this.nodes.forEach((node) => {
        node.vx *= c;
        node.vy *= c;
        node.x = Math.max(40, Math.min(this.width - 40, node.x + node.vx));
        node.y = Math.max(40, Math.min(this.height - 40, node.y + node.vy));
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
  const canvasRef = useRef<SVGSVGElement>(null);
  const [graph, setGraph] = useState<ForceDirectedGraph | null>(null);

  // Generate default graph if not provided
  const getDefaultGraph = () => {
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

    return { nodes: defaultNodes, edges: defaultEdges };
  };

  const { nodes: graphNodes, edges: graphEdges } = initialNodes
    ? { nodes: initialNodes, edges: initialEdges || [] }
    : getDefaultGraph();

  useEffect(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const graph = new ForceDirectedGraph(graphNodes, graphEdges, rect.width, rect.height);
      setGraph(graph);
    }
  }, [graphNodes, graphEdges]);

  if (!graph) return <div className="h-96 bg-gray-50 rounded-lg animate-pulse" />;

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

      {/* SVG Graph */}
      <svg
        ref={canvasRef}
        className="w-full border border-gray-200 rounded-lg bg-white"
        style={{ height: "500px" }}
      >
        <defs>
          {/* Arrow markers for edges */}
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#9CA3AF" />
          </marker>
          <marker
            id="arrowhead-active"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#3B82F6" />
          </marker>
        </defs>

        {/* Edges */}
        <g className="edges">
          {graphEdges.map((edge, idx) => {
            const source = nodes.find((n) => n.id === edge.source);
            const target = nodes.find((n) => n.id === edge.target);

            if (!source || !target) return null;

            const isActive =
              selectedNode === edge.source ||
              selectedNode === edge.target ||
              selectedNode === null;

            return (
              <g key={idx}>
                {/* Edge line */}
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke="#D1D5DB"
                  strokeWidth={isActive ? 2 : 1}
                  markerEnd="url(#arrowhead)"
                  opacity={isActive ? 1 : 0.3}
                  className="transition-all"
                />

                {/* Edge label */}
                <text
                  x={(source.x + target.x) / 2}
                  y={(source.y + target.y) / 2 - 5}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#6B7280"
                  className="pointer-events-none select-none"
                  opacity={isActive ? 0.8 : 0.3}
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
                className="cursor-pointer transition-all"
                onClick={() => setSelectedNode(isSelected ? null : node.id)}
              >
                {/* Node circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isSelected ? 32 : 28}
                  fill={
                    isTech
                      ? isDirectAffected
                        ? "#3B82F6"
                        : "#818CF8"
                      : isSelected
                        ? "#9333EA"
                        : "#A78BFA"
                  }
                  opacity={selectedNode === null || isSelected ? 1 : 0.5}
                  className="transition-all"
                  stroke={isSelected ? "#1F2937" : "none"}
                  strokeWidth={isSelected ? 3 : 0}
                />

                {/* Node icon background */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={20}
                  fill="white"
                  opacity={0.9}
                />

                {/* Node icon */}
                {isTech ? (
                  <g transform={`translate(${node.x - 8}, ${node.y - 8})`}>
                    <Package width="16" height="16" stroke="#3B82F6" fill="none" />
                  </g>
                ) : (
                  <g transform={`translate(${node.x - 8}, ${node.y - 8})`}>
                    <Building2 width="16" height="16" stroke="#9333EA" fill="none" />
                  </g>
                )}

                {/* Node label */}
                <text
                  x={node.x}
                  y={node.y + 42}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight={isSelected ? "bold" : "normal"}
                  fill="#1F2937"
                  className="pointer-events-none select-none max-w-24 truncate"
                >
                  {node.label.split(" ").slice(0, 2).join(" ")}
                </text>

                {/* Node type label */}
                <text
                  x={node.x}
                  y={node.y + 56}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#6B7280"
                  className="pointer-events-none select-none"
                >
                  {node.subtype || node.type}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500" />
          <span>Direct Technology</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-indigo-500" />
          <span>Related Technology</span>
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
        <p>Click on any node to highlight connections. Nodes are positioned using force-directed layout to minimize edge crossings.</p>
      </div>
    </div>
  );
}
