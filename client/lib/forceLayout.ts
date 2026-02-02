import { GraphNode, GraphEdge, Cluster } from "./dependencyGraphTransformer";

export interface LayoutNode extends GraphNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface LayoutResult {
  nodes: LayoutNode[];
  edges: GraphEdge[];
}

export class ForceLayout {
  nodes: LayoutNode[];
  edges: GraphEdge[];
  clusters: Map<string, Cluster>;
  width: number;
  height: number;
  iterations: number = 2000;
  cooldown: number = 0.1;

  constructor(
    nodes: GraphNode[],
    edges: GraphEdge[],
    clusters: Cluster[],
    width: number,
    height: number,
  ) {
    this.nodes = nodes.map((node) => ({
      ...node,
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0,
    }));

    this.edges = edges;
    this.clusters = new Map(clusters.map((c) => [c.id, c]));
    this.width = width;
    this.height = height;

    // Initialize cluster positions
    this.initializeClusterPositions();
  }

  private initializeClusterPositions() {
    // Position clusters with massive spacing across entire canvas
    const clusterArray = Array.from(this.clusters.values());
    // Calculate spacing to use full canvas width
    const clusterSpacing = this.width / (clusterArray.length + 0.5);

    clusterArray.forEach((cluster, idx) => {
      // Position clusters across the full width with large offset
      const cx = 300 + idx * clusterSpacing;
      // Distribute vertically for more variation
      const cy = (idx % 2 === 0) ? this.height * 0.3 : this.height * 0.7;

      // Get nodes in this cluster
      const clusterNodes = this.nodes.filter((n) => n.cluster === cluster.id);

      // Position nodes in very large circles
      if (clusterNodes.length > 0) {
        const radius = Math.max(200, clusterSpacing / 2); // Very large radius for good spacing

        clusterNodes.forEach((node, nodeIdx) => {
          const angle = (nodeIdx / clusterNodes.length) * Math.PI * 2;
          node.x = cx + Math.cos(angle) * radius;
          node.y = cy + Math.sin(angle) * radius + (Math.random() - 0.5) * 150;
        });
      }
    });

    // Position vendor nodes (non-clustered) at the bottom with even more space
    const vendorNodes = this.nodes.filter((n) => !n.cluster);
    const vendorSpacing = this.width / (vendorNodes.length + 1);
    vendorNodes.forEach((node, idx) => {
      node.x = (idx + 1) * vendorSpacing;
      node.y = this.height - 200 + (Math.random() - 0.5) * 150;
    });
  }

  simulate(): LayoutResult {
    for (let i = 0; i < this.iterations; i++) {
      this.applyForces();
      this.updatePositions();

      // Cool down
      const temp = 1 - i / this.iterations;
      this.nodes.forEach((node) => {
        node.vx *= 0.99 * temp;
        node.vy *= 0.99 * temp;
      });
    }

    return { nodes: this.nodes, edges: this.edges };
  }

  private applyForces() {
    const nodeMap = new Map(this.nodes.map((n) => [n.id, n]));
    const minDistance = 220; // Strict 6cm minimum distance between all nodes (~220px at 96 DPI)

    // Repulsive forces between nodes (strong to keep clusters apart)
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const node1 = this.nodes[i];
        const node2 = this.nodes[j];

        const dx = node2.x - node1.x;
        const dy = node2.y - node1.y;
        const dist = Math.hypot(dx, dy) || 1;

        // If nodes are closer than minimum distance, push them apart VERY strongly
        if (dist < minDistance) {
          const repulsionStrength = Math.max(2000, (minDistance / dist) * 3000); // Extremely strong when too close
          const fx = (dx / dist) * repulsionStrength;
          const fy = (dy / dist) * repulsionStrength;

          node1.vx -= fx;
          node1.vy -= fy;
          node2.vx += fx;
          node2.vy += fy;
        } else {
          // Normal repulsion between clusters, mild within
          const sameCluster =
            node1.cluster && node2.cluster && node1.cluster === node2.cluster;
          const strength = sameCluster ? 150 : 1000; // Very strong repulsion to maintain distance

          const fx = (dx / dist) * (-strength / dist);
          const fy = (dy / dist) * (-strength / dist);

          node1.vx += fx;
          node1.vy += fy;
          node2.vx -= fx;
          node2.vy -= fy;
        }
      }
    }

    // Attractive forces for edges (very weak to respect minimum distance)
    this.edges.forEach((edge) => {
      const source = nodeMap.get(edge.source);
      const target = nodeMap.get(edge.target);

      if (!source || !target) return;

      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const dist = Math.hypot(dx, dy) || 1;

      // Prefer 450px distance to respect 220px minimum distance with safety margin
      const restLength = 450;
      const strength = 0.02; // Very weak to not pull nodes too close

      // Only apply attraction if distance is greater than minimum
      if (dist >= 220) {
        const fx = (dx / dist) * strength * (dist - restLength);
        const fy = (dy / dist) * strength * (dist - restLength);

        source.vx += fx;
        source.vy += fy;
        target.vx -= fx;
        target.vy -= fy;
      }
    });

    // Cluster gravity - keep nodes within their cluster region (weaker to allow spreading)
    this.nodes.forEach((node) => {
      if (!node.cluster) return;

      // Find cluster center
      const clusterNodes = this.nodes.filter((n) => n.cluster === node.cluster);
      const cx =
        clusterNodes.reduce((sum, n) => sum + n.x, 0) / clusterNodes.length;
      const cy =
        clusterNodes.reduce((sum, n) => sum + n.y, 0) / clusterNodes.length;

      const dx = cx - node.x;
      const dy = cy - node.y;
      const dist = Math.hypot(dx, dy) || 1;

      // Weaker clustering to respect minimum distance constraint
      const strength = 0.02;
      const fx = (dx / dist) * strength;
      const fy = (dy / dist) * strength;

      node.vx += fx;
      node.vy += fy;
    });

    // Boundary forces - keep nodes in canvas
    this.nodes.forEach((node) => {
      const margin = 50;
      if (node.x < margin) node.vx += 1;
      if (node.x > this.width - margin) node.vx -= 1;
      if (node.y < margin) node.vy += 1;
      if (node.y > this.height - margin) node.vy -= 1;
    });
  }

  private updatePositions() {
    this.nodes.forEach((node) => {
      // Limit velocity
      const vel = Math.hypot(node.vx, node.vy);
      if (vel > 5) {
        node.vx = (node.vx / vel) * 5;
        node.vy = (node.vy / vel) * 5;
      }

      // Update position
      node.x += node.vx;
      node.y += node.vy;

      // Boundary conditions
      node.x = Math.max(0, Math.min(this.width, node.x));
      node.y = Math.max(0, Math.min(this.height, node.y));
    });
  }
}
