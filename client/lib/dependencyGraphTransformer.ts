import { dependencyGraphData } from "@/data/dependencyGraphData";

export interface GraphNode {
  id: string;
  type: "technology" | "version" | "issue" | "vendor";
  label: string;
  cluster?: string;
  category?: string;
  severity?: "critical" | "high" | "medium" | "low";
  cveCount?: number;
  vendor?: string;
  eol?: boolean;
  confidenceScore?: number;
  affectedTechs?: string[];
}

export interface GraphEdge {
  source: string;
  target: string;
  type:
    | "uses"
    | "implements"
    | "derived_from"
    | "found_in"
    | "provided_by"
    | "runs_on"
    | "parent_of";
}

export interface Cluster {
  id: string;
  label: string;
}

export interface DependencyGraph {
  clusters: Cluster[];
  nodes: GraphNode[];
  edges: GraphEdge[];
}

/**
 * Transform dependency graph data into interactive graph schema
 */
export function transformToDependencyGraph(): DependencyGraph {
  const clusters = new Map<string, Cluster>();
  const nodesMap = new Map<string, GraphNode>();
  const edges: GraphEdge[] = [];

  // Create clusters based on categories
  const categoryToCluster: Record<string, string> = {
    framework: "stack-frameworks",
    runtime: "stack-runtimes",
    database: "stack-databases",
    "cloud-service": "stack-cloud",
    container: "stack-container",
    standard: "stack-standards",
    panel: "stack-panels",
  };

  const categoryLabels: Record<string, string> = {
    framework: "Web Frameworks & Libraries",
    runtime: "Runtime Environments",
    database: "Database Stack",
    "cloud-service": "Cloud Services",
    container: "Container & Orchestration",
    standard: "Standards & Specifications",
    panel: "Control Panels",
  };

  // Initialize clusters
  Object.entries(categoryLabels).forEach(([key, label]) => {
    const clusterId = categoryToCluster[key];
    clusters.set(clusterId, {
      id: clusterId,
      label,
    });
  });

  // Add technology nodes
  dependencyGraphData.technologies.forEach((tech) => {
    const techId = tech.id;
    const clusterId =
      categoryToCluster[tech.category || "framework"] || "stack-frameworks";
    const cveCount = tech.versions.reduce((sum, v) => sum + v.cves.length, 0);

    // Technology node
    nodesMap.set(techId, {
      id: techId,
      type: "technology",
      label: tech.product,
      cluster: clusterId,
      category: tech.category,
      cveCount,
      vendor: tech.vendor,
    });

    // Version nodes
    tech.versions.forEach((version) => {
      const versionId = `${techId}-v${version.version}`;
      const eol = version.eol || false;
      const cveCount = version.cves.length;

      nodesMap.set(versionId, {
        id: versionId,
        type: "version",
        label: `${tech.product} ${version.version}`,
        cluster: clusterId,
        cveCount,
        eol,
        vendor: tech.vendor,
      });

      // Edge from tech to version
      edges.push({
        source: techId,
        target: versionId,
        type: "uses",
      });
    });
  });

  // Add issue nodes
  dependencyGraphData.issues.forEach((issue) => {
    const severityMap: Record<string, "critical" | "high" | "medium" | "low"> =
      {
        critical: "critical",
        high: "high",
        medium: "medium",
        low: "low",
      };

    // Find which techs this issue affects
    const affectedTechs = dependencyGraphData.relationships
      .filter((rel) => rel.from === issue.id && rel.type === "found_in")
      .map((rel) => rel.to);

    const firstAffectedTech = affectedTechs[0];
    const clusterId = firstAffectedTech
      ? nodesMap.get(firstAffectedTech)?.cluster || "stack-frameworks"
      : "stack-frameworks";

    nodesMap.set(issue.id, {
      id: issue.id,
      type: "issue",
      label: issue.title,
      cluster: clusterId,
      severity: severityMap[issue.severity],
      confidenceScore: issue.confidence_score,
      affectedTechs,
    });
  });

  // Add vendor nodes (not in clusters)
  dependencyGraphData.vendors.forEach((vendor) => {
    nodesMap.set(vendor.id, {
      id: vendor.id,
      type: "vendor",
      label: vendor.name,
    });
  });

  // Add edges from relationship data
  dependencyGraphData.relationships.forEach((rel) => {
    const edgeTypeMap: Record<string, GraphEdge["type"]> = {
      uses: "uses",
      implements: "implements",
      derived_from: "derived_from",
      found_in: "found_in",
      provides_by: "provided_by",
      provided_by: "provided_by",
      runs_on: "runs_on",
      parent_of: "parent_of",
    };

    const edgeType = edgeTypeMap[rel.type] || "uses";

    // Only add edges if both nodes exist
    if (nodesMap.has(rel.from) && nodesMap.has(rel.to)) {
      // Check if edge already exists
      const edgeExists = edges.some(
        (e) => e.source === rel.from && e.target === rel.to,
      );
      if (!edgeExists) {
        edges.push({
          source: rel.from,
          target: rel.to,
          type: edgeType,
        });
      }
    }
  });

  return {
    clusters: Array.from(clusters.values()),
    nodes: Array.from(nodesMap.values()),
    edges,
  };
}

/**
 * Get affected technologies for an issue (direct and transitive)
 */
export function getAffectedTechnologies(
  issueId: string,
  graph: DependencyGraph,
): { direct: string[]; transitive: string[] } {
  const direct = graph.edges
    .filter((e) => e.source === issueId && e.type === "found_in")
    .map((e) => e.target);

  const transitive = new Set<string>();
  const visited = new Set<string>();

  const traverse = (nodeId: string) => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    // Find all nodes that depend on this node
    graph.edges.forEach((edge) => {
      if (edge.target === nodeId && edge.type !== "found_in") {
        if (!direct.includes(edge.source)) {
          transitive.add(edge.source);
        }
        traverse(edge.source);
      }
    });
  };

  direct.forEach((techId) => traverse(techId));

  return {
    direct,
    transitive: Array.from(transitive),
  };
}

/**
 * Get blast radius - all nodes affected by removing a technology
 */
export function getBlastRadius(
  techId: string,
  graph: DependencyGraph,
): { direct: string[]; transitive: string[] } {
  const direct = graph.edges
    .filter(
      (e) =>
        e.target === techId &&
        (e.type === "uses" || e.type === "runs_on" || e.type === "implements"),
    )
    .map((e) => e.source);

  const transitive = new Set<string>();
  const visited = new Set<string>();

  const traverse = (nodeId: string) => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    graph.edges.forEach((edge) => {
      if (
        edge.target === nodeId &&
        (edge.type === "uses" ||
          edge.type === "runs_on" ||
          edge.type === "implements")
      ) {
        if (!direct.includes(edge.source)) {
          transitive.add(edge.source);
        }
        traverse(edge.source);
      }
    });
  };

  direct.forEach((techId) => traverse(techId));

  return {
    direct,
    transitive: Array.from(transitive),
  };
}
