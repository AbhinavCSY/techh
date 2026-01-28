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

// Hierarchical graph layout
class HierarchicalGraph {
  nodes: Map<string, GraphNode>;
  edges: GraphEdge[];
  width: number;
  height: number;
  levels: Map<string, number>;

  constructor(
    nodes: GraphNode[],
    edges: GraphEdge[],
    width: number,
    height: number,
  ) {
    this.width = Math.max(width, 400);
    this.height = Math.max(height, 500);
    this.edges = edges;
    this.levels = new Map();

    // Calculate hierarchy levels using breadth-first search
    this.calculateLevels(nodes);

    this.nodes = new Map(
      nodes.map((node) => {
        const level = this.levels.get(node.id) ?? 0;
        const initializedNode: GraphNode = {
          id: node.id,
          label: node.label,
          type: node.type,
          subtype: node.subtype,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
        };
        return [node.id, initializedNode];
      }),
    );

    this.layoutHierarchical();
  }

  calculateLevels(nodes: GraphNode[]) {
    const visited = new Set<string>();
    const queue: { id: string; level: number }[] = [];

    // Find root nodes (nodes with no incoming edges or "direct" subtype)
    const hasIncoming = new Set<string>();
    this.edges.forEach((edge) => {
      hasIncoming.add(edge.target);
    });

    nodes.forEach((node) => {
      if (!hasIncoming.has(node.id) || node.subtype === "direct") {
        queue.push({ id: node.id, level: 0 });
        this.levels.set(node.id, 0);
        visited.add(node.id);
      }
    });

    // BFS to assign levels
    while (queue.length > 0) {
      const { id, level } = queue.shift()!;

      // Find all children (targets of this node's edges)
      this.edges.forEach((edge) => {
        if (edge.source === id && !visited.has(edge.target)) {
          this.levels.set(edge.target, level + 1);
          visited.add(edge.target);
          queue.push({ id: edge.target, level: level + 1 });
        }
      });

      // Also handle reverse relationships
      this.edges.forEach((edge) => {
        if (edge.target === id && !visited.has(edge.source)) {
          // Nodes that point to this node go to higher level
          const sourceLevel = this.levels.get(edge.source);
          if (sourceLevel === undefined || sourceLevel >= level) {
            this.levels.set(edge.source, level - 1);
            visited.add(edge.source);
            queue.push({ id: edge.source, level: level - 1 });
          }
        }
      });
    }

    // Assign unvisited nodes to appropriate levels
    nodes.forEach((node) => {
      if (!this.levels.has(node.id)) {
        this.levels.set(node.id, Math.floor(Math.random() * 3));
      }
    });
  }

  layoutHierarchical() {
    // Group nodes by level
    const levelGroups = new Map<number, string[]>();
    this.nodes.forEach((node) => {
      const level = this.levels.get(node.id) ?? 0;
      if (!levelGroups.has(level)) {
        levelGroups.set(level, []);
      }
      levelGroups.get(level)!.push(node.id);
    });

    // Calculate y positions based on levels
    const minLevel = Math.min(...Array.from(this.levels.values()));
    const maxLevel = Math.max(...Array.from(this.levels.values()));
    const levelRange = maxLevel - minLevel || 1;

    // Position nodes
    levelGroups.forEach((nodeIds, level) => {
      const adjustedLevel = level - minLevel;
      const y = (adjustedLevel / (levelRange || 1)) * (this.height - 160) + 80;

      // Distribute nodes horizontally at this level
      const spacing = this.width / (nodeIds.length + 1);
      nodeIds.forEach((nodeId, index) => {
        const node = this.nodes.get(nodeId)!;
        node.x = spacing * (index + 1);
        node.y = y;
      });
    });

    // Light force simulation to avoid overlaps while maintaining hierarchy
    this.refineLayout(30);
  }

  refineLayout(iterations: number) {
    const nodeArray = Array.from(this.nodes.values());
    const k = Math.sqrt((this.width * this.height) / nodeArray.length) * 0.8;

    for (let iter = 0; iter < iterations; iter++) {
      nodeArray.forEach((node1) => {
        node1.vx = 0;
        node1.vy = 0;

        nodeArray.forEach((node2) => {
          if (node1.id !== node2.id) {
            const dx = (node2.x ?? 0) - (node1.x ?? 0);
            const dy = (node2.y ?? 0) - (node1.y ?? 0);
            const distance = Math.sqrt(dx * dx + dy * dy) || 0.1;

            // Repulsion for spacing
            const repulsion = (k / distance) * 0.5;
            node1.vx! -= (dx / distance) * repulsion;
            // Much weaker vertical repulsion to preserve hierarchy
            node1.vy! -= (dy / distance) * repulsion * 0.1;
          }
        });

        // Weak attraction to edges while preserving hierarchy
        this.edges.forEach((edge) => {
          if (edge.source === node1.id) {
            const target = this.nodes.get(edge.target);
            if (target) {
              const dx = (target.x ?? 0) - (node1.x ?? 0);
              const dy = (target.y ?? 0) - (node1.y ?? 0);
              const distance = Math.sqrt(dx * dx + dy * dy) || 0.1;
              const attraction = (distance / k) * 0.02;
              node1.vx! += (dx / distance) * attraction;
              node1.vy! += (dy / distance) * attraction * 0.1;
            }
          }
        });
      });

      // Apply velocity damping and position updates
      nodeArray.forEach((node) => {
        node.vx! *= 0.7;
        node.vy! *= 0.7;
        node.x = Math.max(
          50,
          Math.min(this.width - 50, (node.x ?? 0) + node.vx!),
        );
        // Keep y from original level assignment
        const level = this.levels.get(node.id) ?? 0;
        const minLevel = Math.min(...Array.from(this.levels.values()));
        const maxLevel = Math.max(...Array.from(this.levels.values()));
        const levelRange = maxLevel - minLevel || 1;
        const adjustedLevel = level - minLevel;
        const targetY =
          (adjustedLevel / (levelRange || 1)) * (this.height - 160) + 80;
        node.y = targetY + (node.y! - targetY) * 0.95;
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
  selectedNodeId?: string | null;
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
  selectedNodeId: parentSelectedNodeId,
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
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [hoveredEdgeIndex, setHoveredEdgeIndex] = useState<number | null>(null);
  const [nodePositions, setNodePositions] = useState<
    Map<string, { x: number; y: number }>
  >(new Map());
  const svgRef = useRef<SVGSVGElement>(null);

  // Use parent's selectedNodeId if provided, otherwise use local state
  const effectiveSelectedNode = parentSelectedNodeId || selectedNode;
  const spacePressed = useRef(false);

  // Create graph only once and cache it - prevents nodes from jumping
  const renderedNodes = useMemo(() => {
    const graph = new HierarchicalGraph(nodes, edges, width, height);
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
    const nodeElement = target.closest(".node-group");
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

  // Initialize node positions - only once when renderedNodes first load
  useEffect(() => {
    // Only initialize if we haven't set positions yet
    if (nodePositions.size === 0 && renderedNodes.length > 0) {
      const positions = new Map<string, { x: number; y: number }>();
      renderedNodes.forEach((node) => {
        positions.set(node.id, { x: node.x ?? 0, y: node.y ?? 0 });
      });
      setNodePositions(positions);
    }
  }, [renderedNodes, nodePositions.size]);

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
    // Handle node dragging
    if (draggedNodeId) {
      const newX = (e.clientX - dragStart.x - pan.x) / zoom;
      const newY = (e.clientY - dragStart.y - pan.y) / zoom;

      setNodePositions((prev) => {
        const updated = new Map(prev);
        updated.set(draggedNodeId, { x: newX, y: newY });
        return updated;
      });
    }
    // Handle pan dragging
    else if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedNodeId(null);
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
    <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100">
      <style>{`
        @keyframes nodeHoverPulse {
          0% { filter: drop-shadow(0 0 0 rgba(59, 130, 246, 0)); }
          50% { filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.4)); }
          100% { filter: drop-shadow(0 0 0 rgba(59, 130, 246, 0)); }
        }
        @keyframes pulse {
          0% { stroke-width: 2; opacity: 0.4; }
          50% { stroke-width: 3; opacity: 0.2; }
          100% { stroke-width: 2; opacity: 0.4; }
        }
        .node-group:hover circle:first-child {
          animation: nodeHoverPulse 0.6s ease-in-out;
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
        }
        .node-group:hover {
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1));
        }
        .edge-line {
          transition: stroke-width 0.2s ease, opacity 0.2s ease;
        }
        .edge-line:hover {
          stroke-width: 3;
          opacity: 0.7;
        }
      `}</style>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{
          backgroundColor: "transparent",
          touchAction: "none",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <defs>
          {/* Gradient backgrounds for nodes */}
          <linearGradient
            id="criticalGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              style={{ stopColor: "#DC2626", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#991B1B", stopOpacity: 1 }}
            />
          </linearGradient>
          <linearGradient id="highGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#EA580C", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#C2410C", stopOpacity: 1 }}
            />
          </linearGradient>
          <linearGradient
            id="mediumGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              style={{ stopColor: "#D97706", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#92400E", stopOpacity: 1 }}
            />
          </linearGradient>
          <linearGradient id="lowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#10B981", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#065F46", stopOpacity: 1 }}
            />
          </linearGradient>

          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="20"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#9CA3AF" opacity="0.5" />
          </marker>
        </defs>

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Edges */}
          <g className="edges">
            {edges.map((edge, idx) => {
              const source = renderedNodes.find((n) => n.id === edge.source);
              const target = renderedNodes.find((n) => n.id === edge.target);

              if (!source || !target) return null;

              // Always use the latest positions from nodePositions state
              // This ensures edges always attach to current node positions
              let sourcePos = nodePositions.get(edge.source);
              let targetPos = nodePositions.get(edge.target);

              // Fallback to renderedNodes if positions not yet initialized
              if (!sourcePos) {
                sourcePos = { x: source.x ?? 0, y: source.y ?? 0 };
              }
              if (!targetPos) {
                targetPos = { x: target.x ?? 0, y: target.y ?? 0 };
              }

              const midX = (sourcePos.x + targetPos.x) / 2;
              const midY = (sourcePos.y + targetPos.y) / 2;
              const label =
                relationshipLabels[edge.relationship] || edge.relationship;
              const isEdgeHovered = hoveredEdgeIndex === idx;

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
                  {/* Invisible larger hitbox for easier hover detection */}
                  <line
                    x1={sourcePos.x}
                    y1={sourcePos.y}
                    x2={targetPos.x}
                    y2={targetPos.y}
                    stroke="transparent"
                    strokeWidth={20}
                    style={{ cursor: "pointer", pointerEvents: "auto" }}
                    onMouseEnter={() => setHoveredEdgeIndex(idx)}
                    onMouseLeave={() => setHoveredEdgeIndex(null)}
                  />

                  {/* Edge line with smooth styling */}
                  <line
                    className="edge-line"
                    x1={sourcePos.x}
                    y1={sourcePos.y}
                    x2={targetPos.x}
                    y2={targetPos.y}
                    stroke={getLabelColor()}
                    strokeWidth={2}
                    markerEnd="url(#arrowhead)"
                    opacity={0.45}
                    style={{ strokeLinecap: "round", pointerEvents: "none" }}
                  />

                  {/* Enhanced label background with shadow - Only show on hover */}
                  {isEdgeHovered && (
                    <g filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))">
                      <rect
                        x={midX - 55}
                        y={midY - 16}
                        width="110"
                        height="32"
                        fill="white"
                        opacity={0.97}
                        rx="6"
                        strokeWidth="1"
                        stroke={getLabelColor()}
                        strokeOpacity="0.15"
                      />
                    </g>
                  )}

                  {/* Label text - professional styling - Only show on hover */}
                  {isEdgeHovered && (
                    <text
                      x={midX}
                      y={midY + 4}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="600"
                      fill={getLabelColor()}
                      opacity={1}
                      style={{ pointerEvents: "none", letterSpacing: "0.2px" }}
                    >
                      {label}
                    </text>
                  )}
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

              const handleNodeMouseDown = (
                e: React.MouseEvent<SVGGElement>,
              ) => {
                // Start dragging the node
                setDraggedNodeId(node.id);
                // Use current position from nodePositions state, not the original node position
                const currentPos = nodePositions.get(node.id) || {
                  x: node.x ?? 0,
                  y: node.y ?? 0,
                };
                setDragStart({
                  x: e.clientX - (pan.x + currentPos.x * zoom),
                  y: e.clientY - (pan.y + currentPos.y * zoom),
                });
                e.preventDefault();
              };

              const handleMouseEnter = (e: React.MouseEvent<SVGGElement>) => {
                // Tooltips disabled - node labels show below nodes
              };

              const handleMouseLeave = () => {
                // Tooltips disabled
              };

              // Enhanced node sizing based on severity and type
              const getNodeRadius = () => {
                let baseRadius = 28;
                if (isIssue) baseRadius = 20;
                else if (isTech) {
                  const tech = getTechDetails(node.id, dependencyGraphData);
                  if (tech) {
                    const totalCVEs = tech.versions.reduce(
                      (sum, v) => sum + v.cves.length,
                      0,
                    );
                    // Larger for nodes with more vulnerabilities
                    if (totalCVEs >= 5) baseRadius = 36;
                    else if (totalCVEs >= 3) baseRadius = 33;
                  } else if (isDirectAffected) {
                    baseRadius = 32;
                  }
                } else if (isDirectAffected) {
                  baseRadius = 32;
                }

                // Double the size if selected
                if (effectiveSelectedNode === node.id) {
                  baseRadius *= 2;
                }

                return baseRadius;
              };

              // Get CVE severity color and gradient for tech nodes
              const getSeverityInfo = () => {
                if (isTech) {
                  const tech = getTechDetails(node.id, dependencyGraphData);
                  if (tech) {
                    const totalCVEs = tech.versions.reduce(
                      (sum, v) => sum + v.cves.length,
                      0,
                    );
                    // Return color and gradient ID based on severity
                    if (totalCVEs === 0)
                      return {
                        color: "#10B981",
                        gradient: "url(#lowGradient)",
                        severity: "low",
                      };
                    if (totalCVEs >= 5)
                      return {
                        color: "#DC2626",
                        gradient: "url(#criticalGradient)",
                        severity: "critical",
                      };
                    if (totalCVEs >= 3)
                      return {
                        color: "#EA580C",
                        gradient: "url(#highGradient)",
                        severity: "high",
                      };
                    if (totalCVEs >= 1)
                      return {
                        color: "#D97706",
                        gradient: "url(#mediumGradient)",
                        severity: "medium",
                      };
                  }
                }
                return { color: "#0EA5E9", gradient: "none", severity: "none" }; // Use default blue
              };

              // Determine node color and gradient based on type and subtype
              const getNodeColorInfo = () => {
                if (isIssue) {
                  switch (node.subtype) {
                    case "critical":
                      return {
                        color: "#DC2626",
                        gradient: "url(#criticalGradient)",
                      };
                    case "high":
                      return {
                        color: "#EA580C",
                        gradient: "url(#highGradient)",
                      };
                    case "medium":
                      return {
                        color: "#D97706",
                        gradient: "url(#mediumGradient)",
                      };
                    case "low":
                      return {
                        color: "#10B981",
                        gradient: "url(#lowGradient)",
                      };
                    default:
                      return { color: "#8B5CF6", gradient: "none" };
                  }
                } else if (isVendor) {
                  return {
                    color: isDirectAffected ? "#A855F7" : "#D8B4FE",
                    gradient: "none",
                  };
                } else if (isTech) {
                  // For tech nodes, use severity color if available, otherwise use blue
                  const severityInfo = getSeverityInfo();
                  return severityInfo;
                }
                return { color: "#6B7280", gradient: "none" };
              };

              const colorInfo = getNodeColorInfo();

              const radius = getNodeRadius();
              const innerRadius = Math.max(radius - 8, 12);
              const isSelected = effectiveSelectedNode === node.id;

              // Get position from nodePositions state if available, otherwise use node position
              const nodePos = nodePositions.get(node.id) || {
                x: node.x ?? 0,
                y: node.y ?? 0,
              };
              const nodeX = nodePos.x;
              const nodeY = nodePos.y;

              return (
                <g
                  key={node.id}
                  className={`cursor-move node-group transition-all duration-200 ${draggedNodeId === node.id ? "opacity-75" : ""}`}
                  style={{ pointerEvents: "auto" }}
                  onClick={handleNodeClick}
                  onMouseDown={handleNodeMouseDown}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Enhanced shadow effect for selected nodes */}
                  <circle
                    cx={nodeX + 1}
                    cy={nodeY + 2}
                    r={radius + (isSelected ? 4 : 2)}
                    fill="black"
                    opacity={isSelected ? "0.15" : "0.08"}
                    filter="blur(2px)"
                  />

                  {/* Glow effect for selected node */}
                  {isSelected && (
                    <circle
                      cx={nodeX}
                      cy={nodeY}
                      r={radius + 4}
                      fill="none"
                      stroke={colorInfo.color}
                      strokeWidth="2"
                      opacity="0.4"
                      style={{
                        animation: "pulse 2s ease-in-out infinite",
                      }}
                    />
                  )}

                  {/* Outer colored circle with gradient */}
                  <circle
                    cx={nodeX}
                    cy={nodeY}
                    r={radius}
                    fill={
                      colorInfo.gradient !== "none"
                        ? colorInfo.gradient
                        : colorInfo.color
                    }
                    opacity={isSelected ? 1 : 0.95}
                    style={{ transition: "all 0.2s ease" }}
                    filter={
                      isSelected
                        ? "drop-shadow(0 0 8px rgba(0,0,0,0.2))"
                        : "none"
                    }
                  />

                  {/* Prominent border ring for selected node */}
                  <circle
                    cx={nodeX}
                    cy={nodeY}
                    r={radius}
                    fill="none"
                    stroke={colorInfo.color}
                    strokeWidth={isSelected ? "2.5" : "0.5"}
                    opacity={isSelected ? "0.8" : "0.3"}
                    style={{ transition: "all 0.2s ease" }}
                  />

                  {/* Inner white circle */}
                  <circle
                    cx={nodeX}
                    cy={nodeY}
                    r={innerRadius}
                    fill="white"
                    opacity={0.99}
                    style={{ transition: "all 0.2s ease" }}
                  />

                  {/* Node icon */}
                  {isIssue ? (
                    <g transform={`translate(${nodeX - 8}, ${nodeY - 8})`}>
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
                    <g transform={`translate(${nodeX - 8}, ${nodeY - 8})`}>
                      <Package
                        width="16"
                        height="16"
                        stroke={isDirectAffected ? "#0EA5E9" : "#60A5FA"}
                        fill="none"
                        strokeWidth="2"
                      />
                    </g>
                  ) : (
                    <g transform={`translate(${nodeX - 8}, ${nodeY - 8})`}>
                      <Building2
                        width="16"
                        height="16"
                        stroke="#A855F7"
                        fill="none"
                        strokeWidth="2"
                      />
                    </g>
                  )}

                  {/* Primary label - Full name */}
                  <text
                    x={nodeX}
                    y={nodeY + (radius + 28)}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="600"
                    fill="#1F2937"
                    style={{
                      pointerEvents: "none",
                      userSelect: "none",
                      maxWidth: "150px",
                    }}
                  >
                    {node.label.length > 20
                      ? node.label.substring(0, 20) + "..."
                      : node.label}
                  </text>

                  {/* Secondary label/type */}
                  {!isIssue && (
                    <text
                      x={nodeX}
                      y={nodeY + (radius + 42)}
                      textAnchor="middle"
                      fontSize="9"
                      fill="#9CA3AF"
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

      {/* Professional Control Sidebar - Bottom Left */}
      <div
        className="absolute left-4 bottom-6 flex flex-col gap-1.5 bg-white rounded-lg shadow-lg p-1.5 backdrop-blur-sm border border-gray-200"
        style={{ transform: "scale(0.75)", transformOrigin: "bottom left" }}
      >
        {/* Zoom In Button */}
        <button
          onClick={zoomIn}
          className="p-2 hover:bg-blue-50 rounded-md transition-all duration-200 text-gray-600 hover:text-blue-600 hover:shadow-sm"
          title="Zoom In (Scroll)"
        >
          <ZoomIn width="14" height="14" />
        </button>

        {/* Zoom Level Indicator */}
        <div className="flex flex-col items-center justify-center px-1.5 py-0.5 bg-gray-50 rounded-md border border-gray-200">
          <span className="text-xs font-bold text-gray-700">
            {Math.round(zoom * 100)}
          </span>
          <span className="text-xxs text-gray-500">%</span>
        </div>

        {/* Zoom Out Button */}
        <button
          onClick={zoomOut}
          className="p-2 hover:bg-blue-50 rounded-md transition-all duration-200 text-gray-600 hover:text-blue-600 hover:shadow-sm"
          title="Zoom Out (Scroll)"
        >
          <ZoomOut width="14" height="14" />
        </button>

        {/* Divider */}
        <div className="w-6 h-px bg-gray-200 mx-auto" />

        {/* Reset View Button */}
        <button
          onClick={resetView}
          className="p-2 hover:bg-green-50 rounded-md transition-all duration-200 text-gray-600 hover:text-green-600 hover:shadow-sm"
          title="Reset View"
        >
          <Home width="14" height="14" />
        </button>
      </div>

      {/* Tooltip - Disabled, using node labels instead */}
      {/* Node labels now show below nodes with full text */}
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
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
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

    // Update selected node
    setSelectedNodeId(nodeId);

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
            t.id === clickedNode.label.toLowerCase().replace(/\s+/g, "-"),
        );
        console.log(`Searched by label "${clickedNode.label}", Found:`, tech);
      }
    }

    if (tech) {
      console.log(`Setting tech node:`, tech.product);
      console.log(
        `CVEs:`,
        tech.versions.flatMap((v) => v.cves),
      );
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
      // Auto-select the first direct/primary node
      const primaryNode = initialNodes.find(
        (n) => n.subtype === "direct" || n.type === "technology",
      );
      if (primaryNode) {
        setSelectedNodeId(primaryNode.id);
      }
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
      // Auto-select the main node by default (tech-main)
      setSelectedNodeId("tech-main");
    }
  }, []);

  if (!graphData)
    return <div className="h-96 bg-gray-50 rounded-lg animate-pulse" />;

  return (
    <>
      {/* Normal View */}
      {!isFullscreen && (
        <div>
          {/* Graph Container with Professional Styling */}
          <div
            ref={graphContainerRef}
            className="border border-gray-200 rounded-xl bg-gradient-to-br from-white to-gray-50 overflow-hidden h-[600px] relative shadow-lg hover:shadow-xl transition-shadow duration-300"
            onClick={() => {
              // Close popups when clicking on empty area
              handleCloseQuickInfo();
            }}
          >
            <GraphRenderer
              nodes={graphData.nodes}
              edges={graphData.edges}
              width={WIDTH}
              height={500}
              selectedNodeId={selectedNodeId}
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

            {/* Top Right Control Buttons */}
            <div className="absolute top-4 right-4 flex items-center gap-3">
              <button
                onClick={() => setShowLegend(true)}
                className="p-2.5 hover:bg-gray-100 bg-white text-gray-600 hover:text-gray-900 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg border border-gray-200"
                title="Show legend"
              >
                <Info width="20" height="20" />
              </button>
              <button
                onClick={handleFullscreenClick}
                className="p-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
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
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-white to-gray-50 flex flex-col">
          {/* Professional Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-2xl border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-10 rounded-lg">
                <Package width="20" height="20" className="text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Dependency Graph</h2>
                <p className="text-sm text-slate-400">{techStack.name}</p>
              </div>
            </div>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2 hover:bg-slate-700 rounded-lg transition-all duration-200 text-slate-300 hover:text-white"
              title="Exit fullscreen"
            >
              <X width="24" height="24" />
            </button>
          </div>

          {/* Graph Container */}
          <div
            ref={graphContainerRef}
            className="flex-1 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 relative"
            onClick={() => {
              // Close popups when clicking on empty area
              handleCloseQuickInfo();
            }}
          >
            <GraphRenderer
              nodes={graphData.nodes}
              edges={graphData.edges}
              width={windowSize.width}
              height={windowSize.height - 100}
              selectedNodeId={selectedNodeId}
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
