import { useEffect, useRef, useState, useCallback, useMemo } from "react";

// Types
interface GraphNode {
  id: string;
  label: string;
  type: "identity" | "compute" | "storage" | "database" | "internet";
  critical: boolean;
  riskScore: number;
  vulnerabilities: number;
  permissions: string[];
  relatedAssets: string[];
  internetExposed: boolean;
  severity: "critical" | "high" | "medium" | "low";
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface GraphEdge {
  source: string;
  target: string;
  type: "network" | "iam" | "attack";
  strength: number;
}

interface NodePosition {
  id: string;
  x: number;
  y: number;
}

type ViewMode = "radial" | "explore" | "cluster" | "attack-chain" | "architecture";

export function CloudSecurityGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("explore");
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // Filters
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [assetTypeFilter, setAssetTypeFilter] = useState<string>("all");
  const [internetExposedFilter, setInternetExposedFilter] = useState(false);
  const [identityFilter, setIdentityFilter] = useState(false);

  // Mock data - Cloud infrastructure
  const mockNodes: GraphNode[] = useMemo(() => [
    // Internet/External
    { id: "internet-1", label: "Attacker", type: "internet", critical: false, riskScore: 95, vulnerabilities: 0, permissions: [], relatedAssets: [], internetExposed: true, severity: "critical", x: 100, y: 100 },
    
    // Identity
    { id: "identity-1", label: "Admin Role", type: "identity", critical: true, riskScore: 85, vulnerabilities: 3, permissions: ["*"], relatedAssets: ["compute-1", "compute-2", "database-1"], internetExposed: false, severity: "critical", x: 300, y: 100 },
    { id: "identity-2", label: "App Service Account", type: "identity", critical: false, riskScore: 62, vulnerabilities: 1, permissions: ["ReadWrite"], relatedAssets: ["storage-1"], internetExposed: false, severity: "high", x: 300, y: 200 },
    { id: "identity-3", label: "CI/CD Pipeline", type: "identity", critical: false, riskScore: 45, vulnerabilities: 2, permissions: ["Deploy"], relatedAssets: ["compute-1"], internetExposed: true, severity: "medium", x: 300, y: 300 },

    // Compute
    { id: "compute-1", label: "Web Server (k8s-prod)", type: "compute", critical: true, riskScore: 78, vulnerabilities: 5, permissions: ["network"], relatedAssets: ["database-1", "storage-1", "internet-1"], internetExposed: true, severity: "critical", x: 500, y: 150 },
    { id: "compute-2", label: "API Gateway", type: "compute", critical: false, riskScore: 55, vulnerabilities: 2, permissions: ["network"], relatedAssets: ["compute-3"], internetExposed: true, severity: "medium", x: 500, y: 250 },
    { id: "compute-3", label: "Worker Node", type: "compute", critical: false, riskScore: 48, vulnerabilities: 1, permissions: ["storage"], relatedAssets: ["storage-1"], internetExposed: false, severity: "medium", x: 500, y: 350 },

    // Storage
    { id: "storage-1", label: "S3 Bucket (prod-data)", type: "storage", critical: true, riskScore: 72, vulnerabilities: 4, permissions: ["ReadWrite"], relatedAssets: ["compute-1", "compute-3"], internetExposed: true, severity: "critical", x: 700, y: 200 },
    { id: "storage-2", label: "Blob Storage", type: "storage", critical: false, riskScore: 38, vulnerabilities: 0, permissions: ["Read"], relatedAssets: ["compute-2"], internetExposed: false, severity: "low", x: 700, y: 300 },

    // Database
    { id: "database-1", label: "PostgreSQL (prod)", type: "database", critical: true, riskScore: 81, vulnerabilities: 6, permissions: ["Execute"], relatedAssets: ["compute-1", "identity-1"], internetExposed: false, severity: "critical", x: 900, y: 200 },
    { id: "database-2", label: "Redis Cache", type: "database", critical: false, riskScore: 42, vulnerabilities: 1, permissions: ["Write"], relatedAssets: ["compute-2"], internetExposed: false, severity: "low", x: 900, y: 350 },
  ], []);

  const mockEdges: GraphEdge[] = useMemo(() => [
    // Attack paths
    { source: "internet-1", target: "compute-1", type: "attack", strength: 1 },
    { source: "compute-1", target: "database-1", type: "network", strength: 1 },
    { source: "compute-1", target: "storage-1", type: "network", strength: 1 },
    
    // IAM relationships
    { source: "identity-1", target: "compute-1", type: "iam", strength: 1 },
    { source: "identity-1", target: "database-1", type: "iam", strength: 1 },
    { source: "identity-2", target: "storage-1", type: "iam", strength: 1 },
    { source: "identity-3", target: "compute-1", type: "iam", strength: 1 },
    
    // Network relationships
    { source: "compute-2", target: "compute-1", type: "network", strength: 1 },
    { source: "compute-3", target: "storage-1", type: "network", strength: 1 },
    { source: "compute-2", target: "database-2", type: "network", strength: 1 },
  ], []);

  // Filter nodes
  const filteredNodes = useMemo(() => {
    return mockNodes.filter(node => {
      if (severityFilter !== "all" && node.severity !== severityFilter) return false;
      if (assetTypeFilter !== "all" && node.type !== assetTypeFilter) return false;
      if (internetExposedFilter && !node.internetExposed) return false;
      if (identityFilter && node.type !== "identity") return false;
      return true;
    });
  }, [severityFilter, assetTypeFilter, internetExposedFilter, identityFilter]);

  const filteredEdges = useMemo(() => {
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    return mockEdges.filter(e => nodeIds.has(e.source) && nodeIds.has(e.target));
  }, [filteredNodes, mockEdges]);

  // Node colors
  const getNodeColor = (node: GraphNode): string => {
    const colorMap = {
      identity: "#a78bfa",      // Purple
      compute: "#3b82f6",       // Blue
      storage: "#fbbf24",       // Yellow
      database: "#10b981",      // Green
      internet: "#ef4444",      // Red
    };
    return colorMap[node.type];
  };

  // Simple force-directed layout calculation (simplified)
  const calculateLayout = useCallback(() => {
    const nodes = JSON.parse(JSON.stringify(filteredNodes)) as (GraphNode & { x: number; y: number; vx: number; vy: number })[];
    
    if (viewMode === "radial") {
      // Radial layout - centered
      const centerX = 600;
      const centerY = 300;
      const radius = 250;
      const criticalNodes = nodes.filter(n => n.critical);
      const normalNodes = nodes.filter(n => !n.critical);

      criticalNodes.forEach((node, i) => {
        const angle = (i / (criticalNodes.length || 1)) * 2 * Math.PI;
        node.x = centerX + radius * 0.6 * Math.cos(angle);
        node.y = centerY + radius * 0.6 * Math.sin(angle);
      });

      normalNodes.forEach((node, i) => {
        const angle = (i / (normalNodes.length || 1)) * 2 * Math.PI;
        node.x = centerX + radius * Math.cos(angle);
        node.y = centerY + radius * Math.sin(angle);
      });
    } else if (viewMode === "attack-chain") {
      // Linear left-to-right chain
      const types = ["internet", "identity", "compute", "storage", "database"];
      const columns: { [key: string]: GraphNode[] } = {};
      
      types.forEach(type => {
        columns[type] = nodes.filter(n => n.type === type).sort((a, b) => b.riskScore - a.riskScore);
      });

      let xPos = 100;
      Object.entries(columns).forEach(([type, typeNodes]) => {
        const spacing = 300 / (typeNodes.length || 1);
        typeNodes.forEach((node, i) => {
          node.x = xPos;
          node.y = 150 + i * spacing;
        });
        xPos += 200;
      });
    } else if (viewMode === "cluster") {
      // Grouped clusters
      const typeMap: { [key: string]: GraphNode[] } = {};
      nodes.forEach(node => {
        if (!typeMap[node.type]) typeMap[node.type] = [];
        typeMap[node.type].push(node);
      });

      const types = Object.keys(typeMap);
      let clusterIdx = 0;
      
      types.forEach(type => {
        const typeNodes = typeMap[type];
        const clusterCenterX = 150 + (clusterIdx % 3) * 350;
        const clusterCenterY = 150 + Math.floor(clusterIdx / 3) * 350;
        
        typeNodes.forEach((node, i) => {
          const angle = (i / typeNodes.length) * 2 * Math.PI;
          node.x = clusterCenterX + 100 * Math.cos(angle);
          node.y = clusterCenterY + 100 * Math.sin(angle);
        });
        clusterIdx++;
      });
    } else if (viewMode === "architecture") {
      // Layered architecture tiers
      const tierMap: { [key: string]: GraphNode[] } = {
        external: [],
        identity: [],
        compute: [],
        data: [],
      };

      nodes.forEach(node => {
        if (node.type === "internet") tierMap.external.push(node);
        else if (node.type === "identity") tierMap.identity.push(node);
        else if (node.type === "compute") tierMap.compute.push(node);
        else tierMap.data.push(node);
      });

      const tierHeights = [100, 200, 300, 400];
      Object.entries(tierMap).forEach(([tier, tierNodes], tierIdx) => {
        const spacing = 1000 / (tierNodes.length || 1);
        tierNodes.forEach((node, i) => {
          node.x = 100 + i * spacing;
          node.y = tierHeights[tierIdx];
        });
      });
    } else {
      // Explore mode - force-directed (basic implementation)
      nodes.forEach((node, i) => {
        node.x = node.x || 100 + Math.random() * 1000;
        node.y = node.y || 100 + Math.random() * 400;
        node.vx = node.vx || (Math.random() - 0.5) * 2;
        node.vy = node.vy || (Math.random() - 0.5) * 2;
      });
    }

    return nodes;
  }, [filteredNodes, viewMode]);

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

    const layoutNodes = calculateLayout();

    // Clear canvas
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    filteredEdges.forEach(edge => {
      const sourceNode = layoutNodes.find(n => n.id === edge.source);
      const targetNode = layoutNodes.find(n => n.id === edge.target);
      if (!sourceNode || !targetNode) return;

      const x1 = sourceNode.x * zoom + pan.x;
      const y1 = sourceNode.y * zoom + pan.y;
      const x2 = targetNode.x * zoom + pan.x;
      const y2 = targetNode.y * zoom + pan.y;

      ctx.strokeStyle = 
        edge.type === "attack" ? "#ef4444" :
        edge.type === "iam" ? "#a78bfa" :
        "#64748b";
      
      if (edge.type === "iam") {
        // Dashed line for IAM
        ctx.setLineDash([5, 5]);
      } else if (edge.type === "attack") {
        // Arrowed line for attack paths
        ctx.setLineDash([]);
      } else {
        ctx.setLineDash([]);
      }

      ctx.lineWidth = edge.type === "attack" ? 2 : 1;
      ctx.globalAlpha = highlightedPath.includes(edge.source) || highlightedPath.includes(edge.target) ? 1 : 0.3;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Draw arrowhead for attack paths
      if (edge.type === "attack") {
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const arrowSize = 8;
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - arrowSize * Math.cos(angle - Math.PI / 6), y2 - arrowSize * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(x2 - arrowSize * Math.cos(angle + Math.PI / 6), y2 - arrowSize * Math.sin(angle + Math.PI / 6));
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
      const nodeRadius = 20;
      const isSelected = selectedNode?.id === node.id;
      const isHovered = hoveredNode === node.id;

      // Draw glow for critical nodes
      if (node.critical) {
        ctx.fillStyle = "rgba(239, 68, 68, 0.3)";
        ctx.beginPath();
        ctx.arc(x, y, nodeRadius + 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(239, 68, 68, 0.15)";
        ctx.beginPath();
        ctx.arc(x, y, nodeRadius + 20, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw node
      ctx.fillStyle = getNodeColor(node);
      ctx.strokeStyle = isSelected ? "#fbbf24" : isHovered ? "#ffffff" : "#e2e8f0";
      ctx.lineWidth = isSelected ? 3 : isHovered ? 2 : 1;

      ctx.beginPath();
      ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw critical indicator
      if (node.critical) {
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(x + 12, y - 12, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw label
      ctx.fillStyle = "#f1f5f9";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.label.split(" ")[0], x, y + 35);
    });

    // Draw legend
    const legendX = 20;
    const legendY = 20;
    ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
    ctx.fillRect(legendX, legendY, 200, 200);
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 1;
    ctx.strokeRect(legendX, legendY, 200, 200);

    ctx.fillStyle = "#f1f5f9";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Legend", legendX + 10, legendY + 20);

    const legendItems = [
      { label: "Identity", color: "#a78bfa", y: legendY + 40 },
      { label: "Compute", color: "#3b82f6", y: legendY + 60 },
      { label: "Storage", color: "#fbbf24", y: legendY + 80 },
      { label: "Database", color: "#10b981", y: legendY + 100 },
      { label: "Internet", color: "#ef4444", y: legendY + 120 },
    ];

    legendItems.forEach(item => {
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.arc(legendX + 15, item.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "11px sans-serif";
      ctx.fillText(item.label, legendX + 30, item.y + 2);
    });
  }, [filteredNodes, filteredEdges, zoom, pan, selectedNode, hoveredNode, highlightedPath, viewMode]);

  // Mouse interactions
  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    const layoutNodes = calculateLayout();
    let found = false;

    for (const node of layoutNodes) {
      const distance = Math.hypot(node.x - x, node.y - y);
      if (distance < 25) {
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

    const layoutNodes = calculateLayout();

    for (const node of layoutNodes) {
      const distance = Math.hypot(node.x - x, node.y - y);
      if (distance < 25) {
        const fullNode = filteredNodes.find(n => n.id === node.id);
        if (fullNode) {
          setSelectedNode(fullNode);
          // Highlight attack path
          if (fullNode.type === "internet") {
            const path: string[] = [fullNode.id];
            // Simple path finding - BFS
            const queue = [[fullNode.id, path]];
            const visited = new Set([fullNode.id]);
            while (queue.length > 0) {
              const [current, currentPath] = queue.shift() as [string, string[]];
              const edges = filteredEdges.filter(e => e.source === current);
              if (edges.length > 0) {
                edges.forEach(edge => {
                  if (!visited.has(edge.target)) {
                    visited.add(edge.target);
                    queue.push([edge.target, [...currentPath, edge.target]]);
                  }
                });
              }
            }
            setHighlightedPath(Array.from(visited));
          }
        }
        return;
      }
    }

    setSelectedNode(null);
    setHighlightedPath([]);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newZoom = Math.max(0.5, Math.min(3, zoom - e.deltaY * 0.001));
    setZoom(newZoom);
  };

  const handleMouseDown = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const handleDragStart = (e: React.MouseEvent) => {
    handleMouseDown.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (e.buttons === 2) {
      const dx = e.clientX - handleMouseDown.current.x;
      const dy = e.clientY - handleMouseDown.current.y;
      setPan({ x: handleMouseDown.current.panX + dx, y: handleMouseDown.current.panY + dy });
    }
  };

  return (
    <div className="flex h-full bg-slate-950 text-slate-50">
      {/* Left Filter Panel */}
      <div className="w-56 border-r border-slate-700 p-4 overflow-y-auto space-y-4">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Filters</h3>

        {/* Severity Filter */}
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-2 block">Severity</label>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-xs text-slate-300 hover:border-slate-500 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Asset Type Filter */}
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-2 block">Asset Type</label>
          <select
            value={assetTypeFilter}
            onChange={(e) => setAssetTypeFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-xs text-slate-300 hover:border-slate-500 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Assets</option>
            <option value="identity">Identity</option>
            <option value="compute">Compute</option>
            <option value="storage">Storage</option>
            <option value="database">Database</option>
            <option value="internet">Internet</option>
          </select>
        </div>

        {/* Internet Exposed Filter */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={internetExposedFilter}
              onChange={(e) => setInternetExposedFilter(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-900 border border-slate-700 checked:bg-blue-600 checked:border-blue-600"
            />
            <span className="text-xs font-semibold text-slate-400">Internet Exposed Only</span>
          </label>
        </div>

        {/* Identity Filter */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={identityFilter}
              onChange={(e) => setIdentityFilter(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-900 border border-slate-700 checked:bg-blue-600 checked:border-blue-600"
            />
            <span className="text-xs font-semibold text-slate-400">Identities Only</span>
          </label>
        </div>

        {/* Node Count */}
        <div className="pt-4 border-t border-slate-700">
          <div className="text-xs text-slate-500">
            <div className="mb-1">Showing {filteredNodes.length} nodes</div>
            <div className="mb-1">{filteredEdges.length} relationships</div>
          </div>
        </div>
      </div>

      {/* Center Canvas */}
      <div className="flex-1 flex flex-col bg-slate-950">
        {/* Top Toggle Bar */}
        <div className="border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <div className="flex gap-2">
            {(["radial", "explore", "cluster", "attack-chain", "architecture"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === mode
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                {mode.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500">
            Zoom: {(zoom * 100).toFixed(0)}%
          </div>
        </div>

        {/* Canvas */}
        <div ref={containerRef} className="flex-1 relative overflow-hidden">
          <canvas
            ref={canvasRef}
            onMouseMove={handleCanvasMouseMove}
            onClick={handleCanvasClick}
            onWheel={handleWheel}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            className="cursor-grab active:cursor-grabbing"
          />
        </div>
      </div>

      {/* Right Details Drawer */}
      {selectedNode && (
        <div className="w-72 border-l border-slate-700 bg-slate-900/50 p-4 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200">Node Details</h3>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-slate-500 hover:text-slate-300 text-lg"
            >
              ×
            </button>
          </div>

          {/* Node Identity */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: getNodeColor(selectedNode) }}
              />
              <span className="text-xs font-mono text-slate-500">{selectedNode.type.toUpperCase()}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-100">{selectedNode.label}</h2>
            <div className="text-xs text-slate-500">{selectedNode.id}</div>
          </div>

          <div className="border-t border-slate-700 pt-4">
            {/* Risk Score */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-400">Risk Score</span>
                <span className="text-lg font-bold text-orange-400">{selectedNode.riskScore}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-red-600 h-2 rounded-full"
                  style={{ width: `${selectedNode.riskScore}%` }}
                />
              </div>
            </div>

            {/* Vulnerabilities */}
            <div className="mb-4">
              <div className="text-xs font-semibold text-slate-400 mb-1">Vulnerabilities</div>
              <div className="text-2xl font-bold text-red-500">{selectedNode.vulnerabilities}</div>
            </div>

            {/* Severity */}
            <div className="mb-4">
              <div className="text-xs font-semibold text-slate-400 mb-1">Severity</div>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                selectedNode.severity === "critical" ? "bg-red-900 text-red-200" :
                selectedNode.severity === "high" ? "bg-orange-900 text-orange-200" :
                selectedNode.severity === "medium" ? "bg-yellow-900 text-yellow-200" :
                "bg-green-900 text-green-200"
              }`}>
                {selectedNode.severity.toUpperCase()}
              </div>
            </div>

            {/* Critical Status */}
            {selectedNode.critical && (
              <div className="mb-4 p-2 bg-red-900/30 border border-red-700/50 rounded text-xs text-red-200">
                🚨 Critical Asset - Requires Immediate Attention
              </div>
            )}

            {/* Internet Exposed */}
            {selectedNode.internetExposed && (
              <div className="mb-4 p-2 bg-orange-900/30 border border-orange-700/50 rounded text-xs text-orange-200">
                🌐 Internet Exposed - Direct External Access
              </div>
            )}
          </div>

          {/* Permissions */}
          {selectedNode.permissions.length > 0 && (
            <div className="border-t border-slate-700 pt-4">
              <div className="text-xs font-semibold text-slate-400 mb-2">Permissions</div>
              <div className="space-y-1">
                {selectedNode.permissions.map((perm, i) => (
                  <div key={i} className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">
                    {perm}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Assets */}
          {selectedNode.relatedAssets.length > 0 && (
            <div className="border-t border-slate-700 pt-4">
              <div className="text-xs font-semibold text-slate-400 mb-2">Related Assets</div>
              <div className="space-y-1">
                {selectedNode.relatedAssets.map((assetId, i) => {
                  const asset = filteredNodes.find(n => n.id === assetId);
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        if (asset) setSelectedNode(asset);
                      }}
                      className="w-full text-left text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1.5 rounded text-slate-300 transition-colors"
                    >
                      {asset?.label || assetId}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="border-t border-slate-700 pt-4 space-y-2">
            <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-xs font-semibold transition-colors">
              View Details
            </button>
            <button className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-xs font-semibold transition-colors">
              Create Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
