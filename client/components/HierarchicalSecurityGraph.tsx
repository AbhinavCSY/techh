import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { ChevronRight, X, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

// Types - Hierarchical Schema
interface HierarchicalNode {
  id: string;
  label: string;
  type: "org" | "cloud_account" | "asset" | "tech_stack" | "dependency" | "cve" | "exploit";
  subtype?: string;
  parent_id?: string;
  risk_score: number;
  severity: "critical" | "high" | "medium" | "low" | "info";
  public_exposure: boolean;
  exploit_available: boolean;
  fix_available: boolean;
  ai_related: boolean;
  cve_count?: number;
  vulnerability_count?: number;
  dependency_count?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface HierarchicalEdge {
  id: string;
  source: string;
  target: string;
  relationship:
    | "contains"
    | "runs"
    | "resolves_to"
    | "built_with"
    | "depends_on"
    | "has_vulnerability"
    | "exploitable_via"
    | "attack_path";
  hierarchy_level: number;
  attack_path: boolean;
}

// Sample Hierarchical Data
const SAMPLE_HIERARCHICAL_DATA = {
  nodes: [
    // Level 0: Organization
    { id: "org-1", type: "org" as const, label: "Acme Corp", risk_score: 72, severity: "high" as const, public_exposure: false, exploit_available: false, fix_available: false, ai_related: false },

    // Level 1: Cloud Accounts
    { id: "cloud-1", type: "cloud_account" as const, label: "AWS-Prod", parent_id: "org-1", risk_score: 78, severity: "high" as const, public_exposure: true, exploit_available: false, fix_available: false, ai_related: false },
    { id: "cloud-2", type: "cloud_account" as const, label: "Azure-Staging", parent_id: "org-1", risk_score: 45, severity: "medium" as const, public_exposure: false, exploit_available: false, fix_available: false, ai_related: false },

    // Level 2: Assets
    { id: "asset-1", type: "asset" as const, subtype: "webapp", label: "app.acme.com", parent_id: "cloud-1", risk_score: 88, severity: "critical" as const, public_exposure: true, exploit_available: true, fix_available: false, ai_related: false, vulnerability_count: 12 },
    { id: "asset-2", type: "asset" as const, subtype: "vm", label: "prod-web-ec2", parent_id: "cloud-1", risk_score: 82, severity: "critical" as const, public_exposure: true, exploit_available: true, fix_available: true, ai_related: false, vulnerability_count: 8 },
    { id: "asset-3", type: "asset" as const, subtype: "container", label: "api-service:prod", parent_id: "cloud-1", risk_score: 65, severity: "high" as const, public_exposure: true, exploit_available: false, fix_available: true, ai_related: false, vulnerability_count: 5 },
    { id: "asset-4", type: "asset" as const, subtype: "database", label: "prod-db-cluster", parent_id: "cloud-1", risk_score: 55, severity: "high" as const, public_exposure: false, exploit_available: false, fix_available: true, ai_related: false, vulnerability_count: 3 },
    { id: "asset-5", type: "asset" as const, subtype: "storage", label: "s3-backups", parent_id: "cloud-1", risk_score: 48, severity: "medium" as const, public_exposure: true, exploit_available: false, fix_available: false, ai_related: false, vulnerability_count: 1 },

    // Level 3: Tech Stack (from asset-2)
    { id: "tech-1", type: "tech_stack" as const, subtype: "os", label: "Ubuntu 20.04 LTS", parent_id: "asset-2", risk_score: 42, severity: "medium" as const, public_exposure: false, exploit_available: false, fix_available: true, ai_related: false },
    { id: "tech-2", type: "tech_stack" as const, subtype: "runtime", label: "Node.js 16.x", parent_id: "asset-2", risk_score: 65, severity: "high" as const, public_exposure: false, exploit_available: true, fix_available: true, ai_related: false, dependency_count: 248 },
    { id: "tech-3", type: "tech_stack" as const, subtype: "framework", label: "Express.js 4.17", parent_id: "asset-2", risk_score: 58, severity: "high" as const, public_exposure: false, exploit_available: false, fix_available: true, ai_related: false, dependency_count: 45 },

    // Level 4: Dependencies (from tech-2)
    { id: "dep-1", type: "dependency" as const, subtype: "library", label: "log4j-core 2.14.1", parent_id: "tech-2", risk_score: 95, severity: "critical" as const, public_exposure: false, exploit_available: true, fix_available: true, ai_related: false, vulnerability_count: 3 },
    { id: "dep-2", type: "dependency" as const, subtype: "library", label: "jackson-databind 2.9.8", parent_id: "tech-2", risk_score: 82, severity: "critical" as const, public_exposure: false, exploit_available: true, fix_available: true, ai_related: false, vulnerability_count: 2 },
    { id: "dep-3", type: "dependency" as const, subtype: "library", label: "axios 0.27.2", parent_id: "tech-2", risk_score: 35, severity: "low" as const, public_exposure: false, exploit_available: false, fix_available: true, ai_related: false },
    { id: "dep-4", type: "dependency" as const, subtype: "library", label: "lodash 4.17.20", parent_id: "tech-2", risk_score: 52, severity: "medium" as const, public_exposure: false, exploit_available: false, fix_available: true, ai_related: false, vulnerability_count: 1 },

    // Level 5: CVEs (from dep-1)
    { id: "cve-1", type: "cve" as const, label: "CVE-2021-44228", severity: "critical" as const, risk_score: 100, public_exposure: false, exploit_available: true, fix_available: true, ai_related: false, parent_id: "dep-1" },
    { id: "cve-2", type: "cve" as const, label: "CVE-2021-45046", severity: "high" as const, risk_score: 88, public_exposure: false, exploit_available: true, fix_available: true, ai_related: false, parent_id: "dep-1" },
    { id: "cve-3", type: "cve" as const, label: "CVE-2015-4852", severity: "critical" as const, risk_score: 92, public_exposure: false, exploit_available: true, fix_available: true, ai_related: false, parent_id: "dep-2" },
  ] as HierarchicalNode[],

  edges: [
    // Level 0 -> 1
    { id: "e1", source: "org-1", target: "cloud-1", relationship: "contains" as const, hierarchy_level: 0, attack_path: false },
    { id: "e2", source: "org-1", target: "cloud-2", relationship: "contains" as const, hierarchy_level: 0, attack_path: false },

    // Level 1 -> 2 (Assets)
    { id: "e3", source: "cloud-1", target: "asset-1", relationship: "contains" as const, hierarchy_level: 1, attack_path: true },
    { id: "e4", source: "cloud-1", target: "asset-2", relationship: "contains" as const, hierarchy_level: 1, attack_path: true },
    { id: "e5", source: "cloud-1", target: "asset-3", relationship: "contains" as const, hierarchy_level: 1, attack_path: false },
    { id: "e6", source: "cloud-1", target: "asset-4", relationship: "contains" as const, hierarchy_level: 1, attack_path: false },
    { id: "e7", source: "cloud-1", target: "asset-5", relationship: "contains" as const, hierarchy_level: 1, attack_path: false },

    // Asset relationships
    { id: "e8", source: "asset-1", target: "asset-2", relationship: "runs" as const, hierarchy_level: 2, attack_path: true },

    // Level 2 -> 3 (Tech Stack)
    { id: "e9", source: "asset-2", target: "tech-1", relationship: "built_with" as const, hierarchy_level: 2, attack_path: false },
    { id: "e10", source: "asset-2", target: "tech-2", relationship: "built_with" as const, hierarchy_level: 2, attack_path: true },
    { id: "e11", source: "asset-2", target: "tech-3", relationship: "built_with" as const, hierarchy_level: 2, attack_path: false },

    // Level 3 -> 4 (Dependencies)
    { id: "e12", source: "tech-2", target: "dep-1", relationship: "depends_on" as const, hierarchy_level: 3, attack_path: true },
    { id: "e13", source: "tech-2", target: "dep-2", relationship: "depends_on" as const, hierarchy_level: 3, attack_path: true },
    { id: "e14", source: "tech-2", target: "dep-3", relationship: "depends_on" as const, hierarchy_level: 3, attack_path: false },
    { id: "e15", source: "tech-2", target: "dep-4", relationship: "depends_on" as const, hierarchy_level: 3, attack_path: false },

    // Level 4 -> 5 (CVEs)
    { id: "e16", source: "dep-1", target: "cve-1", relationship: "has_vulnerability" as const, hierarchy_level: 4, attack_path: true },
    { id: "e17", source: "dep-1", target: "cve-2", relationship: "has_vulnerability" as const, hierarchy_level: 4, attack_path: true },
    { id: "e18", source: "dep-2", target: "cve-3", relationship: "has_vulnerability" as const, hierarchy_level: 4, attack_path: true },
  ] as HierarchicalEdge[],
};

export function HierarchicalSecurityGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [allNodes, setAllNodes] = useState<HierarchicalNode[]>(SAMPLE_HIERARCHICAL_DATA.nodes);
  const [allEdges, setAllEdges] = useState<HierarchicalEdge[]>(SAMPLE_HIERARCHICAL_DATA.edges);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["org-1", "cloud-1"]));
  const [selectedNode, setSelectedNode] = useState<HierarchicalNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<HierarchicalNode[]>([]);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // Get visible nodes and edges based on expansion state
  const { visibleNodes, visibleEdges } = useMemo(() => {
    const visible = new Set<string>();
    const queue = ["org-1"];

    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      visible.add(nodeId);

      if (expandedNodes.has(nodeId)) {
        const children = allEdges
          .filter(e => e.source === nodeId && e.relationship === "contains")
          .map(e => e.target);
        queue.push(...children);
      }
    }

    // Add specifically expanded nodes and their children
    expandedNodes.forEach(nodeId => {
      if (!visible.has(nodeId)) visible.add(nodeId);
      allEdges
        .filter(e => e.source === nodeId)
        .forEach(e => visible.add(e.target));
    });

    const visibleNodeList = allNodes.filter(n => visible.has(n.id));
    const visibleEdgeList = allEdges.filter(e => visible.has(e.source) && visible.has(e.target));

    return { visibleNodes: visibleNodeList, visibleEdges: visibleEdgeList };
  }, [allNodes, allEdges, expandedNodes]);

  // Calculate hierarchical layout
  const layoutNodes = useMemo(() => {
    const positioned = new Map<string, { x: number; y: number }>();
    const levels = new Map<string, number>();

    // Assign hierarchy levels
    const assignLevels = (nodeId: string, level: number) => {
      if (levels.has(nodeId)) return;
      levels.set(nodeId, level);
      const children = allEdges
        .filter(e => e.source === nodeId && expandedNodes.has(nodeId))
        .map(e => e.target);
      children.forEach(child => assignLevels(child, level + 1));
    };

    assignLevels("org-1", 0);

    // Position nodes by level (concentric/hierarchical)
    const levelMap = new Map<number, string[]>();
    visibleNodes.forEach(node => {
      const level = levels.get(node.id) ?? 0;
      if (!levelMap.has(level)) levelMap.set(level, []);
      levelMap.get(level)!.push(node.id);
    });

    const centerX = 600;
    const centerY = 300;

    levelMap.forEach((nodeIds, level) => {
      const radius = 100 + level * 120;
      const angleStep = (2 * Math.PI) / nodeIds.length;

      nodeIds.forEach((nodeId, index) => {
        const angle = index * angleStep;
        positioned.set(nodeId, {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
        });
      });
    });

    return visibleNodes.map(node => ({
      ...node,
      x: positioned.get(node.id)?.x ?? 300,
      y: positioned.get(node.id)?.y ?? 150,
    }));
  }, [visibleNodes, expandedNodes, allEdges]);

  // Node color mapping
  const getNodeColor = (node: HierarchicalNode): string => {
    const typeColors: Record<string, string> = {
      org: "#1e40af",
      cloud_account: "#0891b2",
      asset: "#059669",
      tech_stack: "#7c3aed",
      dependency: "#ea580c",
      cve: "#dc2626",
      exploit: "#991b1b",
    };
    return typeColors[node.type] || "#6b7280";
  };

  const getSeverityColor = (severity: string): string => {
    const colors: Record<string, string> = {
      critical: "#dc2626",
      high: "#f97316",
      medium: "#eab308",
      low: "#22c55e",
      info: "#3b82f6",
    };
    return colors[severity] || "#6b7280";
  };

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const container = containerRef.current;
    if (!container) return;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    // Clear canvas
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    visibleEdges.forEach(edge => {
      const sourceNode = layoutNodes.find(n => n.id === edge.source);
      const targetNode = layoutNodes.find(n => n.id === edge.target);
      if (!sourceNode || !targetNode) return;

      const x1 = sourceNode.x * zoom + pan.x;
      const y1 = sourceNode.y * zoom + pan.y;
      const x2 = targetNode.x * zoom + pan.x;
      const y2 = targetNode.y * zoom + pan.y;

      // Edge styling
      ctx.strokeStyle = edge.attack_path ? "#ef4444" : "#64748b";
      ctx.lineWidth = edge.attack_path ? 2.5 : 1.5;

      if (edge.relationship === "depends_on" || edge.relationship === "has_vulnerability") {
        ctx.setLineDash([5, 5]);
      } else {
        ctx.setLineDash([]);
      }

      ctx.globalAlpha = hoveredNode === edge.source || hoveredNode === edge.target ? 1 : 0.4;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Arrow for attack paths
      if (edge.attack_path) {
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const arrowSize = 10;
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(
          x2 - arrowSize * Math.cos(angle - Math.PI / 6),
          y2 - arrowSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          x2 - arrowSize * Math.cos(angle + Math.PI / 6),
          y2 - arrowSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.setLineDash([]);
    });

    // Draw nodes
    layoutNodes.forEach(node => {
      const x = node.x * zoom + pan.x;
      const y = node.y * zoom + pan.y;
      const baseRadius = node.type === "org" ? 28 : node.type === "cloud_account" ? 24 : 18;
      const isSelected = selectedNode?.id === node.id;
      const isHovered = hoveredNode === node.id;

      // Critical CVE glow
      if (node.type === "cve" && node.severity === "critical") {
        ctx.fillStyle = "rgba(220, 38, 38, 0.3)";
        ctx.beginPath();
        ctx.arc(x, y, baseRadius + 15, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(220, 38, 38, 0.1)";
        ctx.beginPath();
        ctx.arc(x, y, baseRadius + 25, 0, Math.PI * 2);
        ctx.fill();
      }

      // Public exposure ring
      if (node.public_exposure) {
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, baseRadius + 6, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Node circle
      ctx.fillStyle = getNodeColor(node);
      ctx.strokeStyle = isSelected ? "#fbbf24" : isHovered ? "#ffffff" : "#e2e8f0";
      ctx.lineWidth = isSelected ? 3 : isHovered ? 2 : 1;

      ctx.beginPath();
      ctx.arc(x, y, baseRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Risk indicator ring (sized by risk score)
      const riskRing = (node.risk_score / 100) * baseRadius;
      ctx.strokeStyle = getSeverityColor(node.severity);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, riskRing, 0, Math.PI * 2);
      ctx.stroke();

      // Exploit indicator
      if (node.exploit_available && node.type === "cve") {
        ctx.fillStyle = "#fbbf24";
        ctx.beginPath();
        ctx.arc(x + 12, y - 10, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Label
      ctx.fillStyle = "#f1f5f9";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const label = node.label.split(" ")[0];
      ctx.fillText(label, x, y + 30);

      // Expanded indicator
      if (expandedNodes.has(node.id) && (node.type !== "cve" && node.type !== "dependency")) {
        ctx.fillStyle = "#10b981";
        ctx.beginPath();
        ctx.arc(x + 14, y + 14, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw legend
    const legendX = 20;
    const legendY = 20;
    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.fillRect(legendX, legendY, 180, 240);

    ctx.fillStyle = "#f1f5f9";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Legend", legendX + 10, legendY + 20);

    const legendItems = [
      { label: "Organization", color: "#1e40af", y: legendY + 45 },
      { label: "Cloud Account", color: "#0891b2", y: legendY + 65 },
      { label: "Asset", color: "#059669", y: legendY + 85 },
      { label: "Tech Stack", color: "#7c3aed", y: legendY + 105 },
      { label: "Dependency", color: "#ea580c", y: legendY + 125 },
      { label: "CVE", color: "#dc2626", y: legendY + 145 },
    ];

    legendItems.forEach(item => {
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.arc(legendX + 15, item.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "10px sans-serif";
      ctx.fillText(item.label, legendX + 28, item.y + 2);
    });

    // Info
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "10px sans-serif";
    ctx.fillText(`Nodes: ${layoutNodes.length}`, legendX + 10, legendY + 170);
    ctx.fillText(`Edges: ${visibleEdges.length}`, legendX + 10, legendY + 190);
  }, [layoutNodes, visibleEdges, zoom, pan, selectedNode, hoveredNode, expandedNodes]);

  // Mouse interactions
  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    let found = false;
    for (const node of layoutNodes) {
      const distance = Math.hypot(node.x - x, node.y - y);
      if (distance < 30) {
        setHoveredNode(node.id);
        found = true;
        break;
      }
    }

    if (!found) setHoveredNode(null);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    for (const node of layoutNodes) {
      const distance = Math.hypot(node.x - x, node.y - y);
      if (distance < 25) {
        setSelectedNode(node);
        // Build breadcrumb
        const path: HierarchicalNode[] = [];
        let current: HierarchicalNode | undefined = node;
        while (current) {
          path.unshift(current);
          current = allNodes.find(n => n.id === current!.parent_id);
        }
        setBreadcrumb(path);

        // Auto-expand selected node
        if (node.type !== "cve" && node.type !== "dependency") {
          setExpandedNodes(prev => new Set([...prev, node.id]));
        }
        return;
      }
    }

    setSelectedNode(null);
    setBreadcrumb([]);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newZoom = Math.max(0.5, Math.min(3, zoom - e.deltaY * 0.001));
    setZoom(newZoom);
  };

  const toggleNodeExpansion = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  return (
    <div className="flex h-full bg-slate-950 text-slate-50">
      {/* Left Panel - Hierarchy Navigation */}
      <div className="w-64 border-r border-slate-700 bg-slate-900/50 p-4 overflow-y-auto space-y-4">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Hierarchy</h3>

        {/* Breadcrumb */}
        {breadcrumb.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-slate-400 font-semibold">Path:</div>
            <div className="space-y-1">
              {breadcrumb.map((node, idx) => (
                <div key={node.id} className="flex items-center gap-1 text-xs">
                  {idx > 0 && <ChevronRight size={12} className="text-slate-600" />}
                  <button
                    onClick={() => {
                      setSelectedNode(node);
                      if (node.type !== "cve") {
                        setExpandedNodes(prev => new Set([...prev, node.id]));
                      }
                    }}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 truncate transition-colors"
                  >
                    {node.label}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hierarchy Tree */}
        <div className="space-y-2 border-t border-slate-700 pt-4">
          <div className="text-xs text-slate-400 font-semibold">Explore:</div>
          {visibleNodes
            .filter(n => !n.parent_id)
            .map(node => (
              <div key={node.id} className="space-y-1">
                <button
                  onClick={() => {
                    setSelectedNode(node);
                    toggleNodeExpansion(node.id);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center justify-between transition-colors"
                >
                  <span className="truncate">{node.label}</span>
                  {expandedNodes.has(node.id) && <span className="text-green-400">▼</span>}
                </button>

                {/* Children */}
                {expandedNodes.has(node.id) && (
                  <div className="ml-3 space-y-1 border-l border-slate-700 pl-2">
                    {visibleNodes
                      .filter(n => n.parent_id === node.id)
                      .map(child => (
                        <button
                          key={child.id}
                          onClick={() => {
                            setSelectedNode(child);
                            toggleNodeExpansion(child.id);
                          }}
                          className="w-full text-left px-2 py-1 rounded hover:bg-slate-700 text-xs text-slate-400 transition-colors truncate"
                        >
                          {child.label}
                          {expandedNodes.has(child.id) && <span className="text-green-400 ml-1">▼</span>}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Center Canvas */}
      <div className="flex-1 flex flex-col bg-slate-950">
        {/* Top Toolbar */}
        <div className="border-b border-slate-700 px-4 py-3 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-300">Hierarchical Security Graph</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setZoom(z => Math.min(z + 0.2, 3));
              }}
              className="p-1.5 hover:bg-slate-700 rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={() => {
                setZoom(z => Math.max(z - 0.2, 0.5));
              }}
              className="p-1.5 hover:bg-slate-700 rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className="p-1.5 hover:bg-slate-700 rounded transition-colors"
              title="Reset"
            >
              <Maximize2 size={16} />
            </button>
            <span className="text-xs text-slate-500 ml-2">{(zoom * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* Canvas */}
        <div ref={containerRef} className="flex-1 relative overflow-hidden">
          <canvas
            ref={canvasRef}
            onMouseMove={handleCanvasMouseMove}
            onClick={handleCanvasClick}
            onWheel={handleWheel}
            className="cursor-grab active:cursor-grabbing"
          />
        </div>
      </div>

      {/* Right Panel - Node Details */}
      {selectedNode && (
        <div className="w-80 border-l border-slate-700 bg-slate-900/50 p-4 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200">Node Details</h3>
            <button
              onClick={() => {
                setSelectedNode(null);
                setBreadcrumb([]);
              }}
              className="text-slate-500 hover:text-slate-300"
            >
              <X size={18} />
            </button>
          </div>

          {/* Node Identity */}
          <div className="space-y-2 pb-4 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getNodeColor(selectedNode) }}
              />
              <span className="text-xs font-mono text-slate-500">{selectedNode.type.toUpperCase()}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-100">{selectedNode.label}</h2>
            <div className="text-xs text-slate-500">{selectedNode.id}</div>
          </div>

          {/* Risk Metrics */}
          <div className="space-y-3 pb-4 border-b border-slate-700">
            {/* Risk Score */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-400">Risk Score</span>
                <span className="text-xl font-bold" style={{ color: getSeverityColor(selectedNode.severity) }}>
                  {selectedNode.risk_score}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${selectedNode.risk_score}%`,
                    backgroundColor: getSeverityColor(selectedNode.severity),
                  }}
                />
              </div>
            </div>

            {/* Severity */}
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-400">Severity</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  selectedNode.severity === "critical" ? "bg-red-900 text-red-200" :
                  selectedNode.severity === "high" ? "bg-orange-900 text-orange-200" :
                  selectedNode.severity === "medium" ? "bg-yellow-900 text-yellow-200" :
                  "bg-green-900 text-green-200"
                }`}
              >
                {selectedNode.severity.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Indicators */}
          <div className="space-y-2 pb-4 border-b border-slate-700">
            {selectedNode.public_exposure && (
              <div className="p-2 bg-red-900/30 border border-red-700/50 rounded text-xs text-red-200 flex items-center gap-2">
                <span>🌐</span>
                <span>Publicly Exposed</span>
              </div>
            )}
            {selectedNode.exploit_available && (
              <div className="p-2 bg-orange-900/30 border border-orange-700/50 rounded text-xs text-orange-200 flex items-center gap-2">
                <span>⚡</span>
                <span>Exploit Available</span>
              </div>
            )}
            {selectedNode.fix_available && (
              <div className="p-2 bg-green-900/30 border border-green-700/50 rounded text-xs text-green-200 flex items-center gap-2">
                <span>✓</span>
                <span>Fix Available</span>
              </div>
            )}
            {selectedNode.ai_related && (
              <div className="p-2 bg-blue-900/30 border border-blue-700/50 rounded text-xs text-blue-200 flex items-center gap-2">
                <span>🤖</span>
                <span>AI-Related</span>
              </div>
            )}
          </div>

          {/* Metrics */}
          <div className="space-y-2">
            {selectedNode.vulnerability_count !== undefined && (
              <div className="flex justify-between items-center p-2 bg-slate-800 rounded">
                <span className="text-xs text-slate-400">Vulnerabilities</span>
                <span className="text-sm font-bold text-red-400">{selectedNode.vulnerability_count}</span>
              </div>
            )}
            {selectedNode.dependency_count !== undefined && (
              <div className="flex justify-between items-center p-2 bg-slate-800 rounded">
                <span className="text-xs text-slate-400">Dependencies</span>
                <span className="text-sm font-bold text-slate-300">{selectedNode.dependency_count}</span>
              </div>
            )}
            {selectedNode.cve_count !== undefined && (
              <div className="flex justify-between items-center p-2 bg-slate-800 rounded">
                <span className="text-xs text-slate-400">CVEs</span>
                <span className="text-sm font-bold text-red-500">{selectedNode.cve_count}</span>
              </div>
            )}
          </div>

          {/* Related Assets (for expansion) */}
          {selectedNode.type !== "cve" && selectedNode.type !== "dependency" && (
            <div className="pt-4 border-t border-slate-700">
              <button
                onClick={() => toggleNodeExpansion(selectedNode.id)}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-xs font-semibold transition-colors"
              >
                {expandedNodes.has(selectedNode.id) ? "Collapse" : "Expand"} Node
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
