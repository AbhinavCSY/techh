import React from "react";
import { DependencyGraphVisualization } from "./DependencyGraphVisualization";

interface Technology {
  name: string;
  version?: string;
  type: "direct" | "underlying" | "related";
  cpeEntries?: Array<{
    cpeNameId: string;
    cpeName: string;
  }>;
}

interface Vendor {
  name: string;
  type: "primary" | "parent";
  products?: string[];
}

interface DependencyNode {
  id: string;
  technology?: Technology;
  vendor?: Vendor;
  relationships: Array<{
    type:
      | "uses"
      | "provides"
      | "plugin_for"
      | "connector_for"
      | "framework_for"
      | "ptaas_for"
      | "parent_company";
    targetId: string;
  }>;
}

interface DependencyGraphProps {
  techStack: {
    name: string;
    version?: string;
    type?: string;
    logo?: string;
    cveCount?: number;
  };
  // Graph data structure representing the technology-vendor relationships
  graphData?: {
    nodes: DependencyNode[];
    edges: Array<{
      source: string;
      target: string;
      type: string;
      label?: string;
    }>;
  };
}

export function DependencyGraph({ techStack, graphData }: DependencyGraphProps) {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Generate default graph data from tech stack if not provided
  const defaultGraphData: typeof graphData = {
    nodes: [
      {
        id: `tech-${techStack.name}`,
        technology: {
          name: techStack.name,
          version: techStack.version,
          type: "direct",
          cpeEntries: [],
        },
        relationships: [
          { type: "provides", targetId: `vendor-primary` },
          { type: "uses", targetId: `tech-underlying` },
        ],
      },
      {
        id: `tech-underlying`,
        technology: {
          name: `${techStack.name} Runtime/Framework`,
          type: "underlying",
          cpeEntries: [],
        },
        relationships: [
          { type: "provides", targetId: `vendor-secondary` },
        ],
      },
      {
        id: `vendor-primary`,
        vendor: {
          name: "Primary Vendor",
          type: "primary",
          products: [techStack.name],
        },
        relationships: [
          { type: "parent_company", targetId: `vendor-parent` },
        ],
      },
      {
        id: `vendor-secondary`,
        vendor: {
          name: "Foundation/Runtime Provider",
          type: "primary",
          products: [`${techStack.name} Runtime`],
        },
        relationships: [],
      },
      {
        id: `vendor-parent`,
        vendor: {
          name: "Parent Company",
          type: "parent",
          products: ["Primary Vendor"],
        },
        relationships: [],
      },
    ],
    edges: [
      {
        source: `tech-${techStack.name}`,
        target: `vendor-primary`,
        type: "provides",
        label: "Provided by",
      },
      {
        source: `tech-${techStack.name}`,
        target: `tech-underlying`,
        type: "uses",
        label: "Built on",
      },
      {
        source: `tech-underlying`,
        target: `vendor-secondary`,
        type: "provides",
        label: "Provided by",
      },
      {
        source: `vendor-primary`,
        target: `vendor-parent`,
        type: "parent_company",
        label: "Subsidiary of",
      },
    ],
  };

  const graph = graphData || defaultGraphData;
  const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]));

  const toggleNodeExpanded = (nodeId: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const getRelatedNodes = (nodeId: string) => {
    const node = nodeMap.get(nodeId);
    if (!node) return [];

    return node.relationships
      .map((rel) => ({
        relationshipType: rel.type,
        node: nodeMap.get(rel.targetId),
      }))
      .filter((item) => item.node);
  };

  const relationshipLabels: Record<string, string> = {
    uses: "Uses/Depends on",
    provides: "Provided by",
    plugin_for: "Plugin for",
    connector_for: "Connector for",
    framework_for: "Framework for",
    ptaas_for: "Platform-as-a-Service for",
    parent_company: "Subsidiary of",
  };

  const relationshipColors: Record<string, string> = {
    uses: "border-l-blue-500 bg-blue-50",
    provides: "border-l-purple-500 bg-purple-50",
    plugin_for: "border-l-green-500 bg-green-50",
    connector_for: "border-l-orange-500 bg-orange-50",
    framework_for: "border-l-pink-500 bg-pink-50",
    ptaas_for: "border-l-indigo-500 bg-indigo-50",
    parent_company: "border-l-gray-500 bg-gray-50",
  };

  const NodeCard = ({
    nodeId,
    depth = 0,
  }: {
    nodeId: string;
    depth?: number;
  }) => {
    const node = nodeMap.get(nodeId);
    if (!node) return null;

    const isExpanded = expandedNodes[nodeId];
    const relatedNodes = getRelatedNodes(nodeId);
    const isSelected = selectedNode === nodeId;
    const marginLeft = `${depth * 20}px`;

    return (
      <div key={nodeId} style={{ marginLeft }} className="space-y-2">
        <div
          className={cn(
            "p-3 rounded-lg border-l-4 cursor-pointer transition-all",
            isSelected
              ? "bg-blue-100 border-l-blue-600 ring-2 ring-blue-400"
              : node.technology
                ? relationshipColors[graph.edges.find((e) => e.source === nodeId)?.type || "uses"]
                : relationshipColors.provides,
          )}
          onClick={() => {
            setSelectedNode(isSelected ? null : nodeId);
            if (relatedNodes.length > 0) {
              toggleNodeExpanded(nodeId);
            }
          }}
        >
          <div className="flex items-start gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {node.technology ? (
                  <Package className="w-4 h-4 flex-shrink-0 text-blue-600" />
                ) : (
                  <Building2 className="w-4 h-4 flex-shrink-0 text-purple-600" />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-gray-900 truncate">
                    {node.technology?.name || node.vendor?.name}
                  </h4>
                  {node.technology?.version && (
                    <p className="text-xs text-gray-500">
                      v{node.technology.version}
                    </p>
                  )}
                </div>
              </div>

              {/* Type Badge */}
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={cn(
                    "inline-block px-2 py-0.5 rounded text-xs font-medium",
                    node.technology
                      ? {
                          direct: "bg-blue-100 text-blue-800",
                          underlying: "bg-indigo-100 text-indigo-800",
                          related: "bg-cyan-100 text-cyan-800",
                        }[node.technology.type]
                      : {
                          primary: "bg-purple-100 text-purple-800",
                          parent: "bg-orange-100 text-orange-800",
                        }[node.vendor?.type || "primary"],
                  )}
                >
                  {node.technology
                    ? node.technology.type.replace("_", " ")
                    : node.vendor?.type} {node.technology ? "Technology" : "Vendor"}
                </span>

                {relatedNodes.length > 0 && (
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-gray-600 transition-transform",
                      isExpanded && "rotate-180",
                    )}
                  />
                )}
              </div>

              {/* CPE Entries for Technologies */}
              {node.technology?.cpeEntries && node.technology.cpeEntries.length > 0 && isExpanded && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs font-medium text-gray-600">CPE Entries:</p>
                  {node.technology.cpeEntries.slice(0, 2).map((cpe) => (
                    <p key={cpe.cpeNameId} className="text-xs text-gray-600 truncate font-mono">
                      {cpe.cpeName}
                    </p>
                  ))}
                  {node.technology.cpeEntries.length > 2 && (
                    <p className="text-xs text-gray-500">
                      +{node.technology.cpeEntries.length - 2} more
                    </p>
                  )}
                </div>
              )}

              {/* Products for Vendors */}
              {node.vendor?.products && node.vendor.products.length > 0 && isExpanded && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs font-medium text-gray-600">Products:</p>
                  {node.vendor.products.slice(0, 2).map((product) => (
                    <p key={product} className="text-xs text-gray-600">
                      • {product}
                    </p>
                  ))}
                  {node.vendor.products.length > 2 && (
                    <p className="text-xs text-gray-500">
                      +{node.vendor.products.length - 2} more
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Nodes */}
        {isExpanded && relatedNodes.length > 0 && (
          <div className="space-y-2 ml-4">
            {relatedNodes.map(({ relationshipType, node: relatedNode }) => (
              relatedNode && (
                <div key={relatedNode.id} className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Link2 className="w-3 h-3" />
                    <span className="font-medium">
                      {relationshipLabels[relationshipType]}
                    </span>
                  </div>
                  <NodeCard nodeId={relatedNode.id} depth={depth + 1} />
                </div>
              )
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2">Dependency Graph</h3>
        <p className="text-sm text-gray-600">
          Visualize the relationship between {techStack.name} and its underlying
          technologies, vendors, and dependencies.
        </p>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-blue-600" />
          <span>Technology/Product</span>
        </div>
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-purple-600" />
          <span>Vendor/Company</span>
        </div>
      </div>

      {/* Graph Nodes */}
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        <NodeCard nodeId={`tech-${techStack.name}`} />
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
        <p className="font-medium mb-1">💡 Click on any node to expand relationships</p>
        <p>Explore the full dependency chain to understand vulnerabilities in underlying technologies.</p>
      </div>
    </div>
  );
}
