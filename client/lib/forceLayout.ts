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
  iterations: number = 300;
  cooldown: number = 0.1;

  constructor(
    nodes: GraphNode[],
    edges: GraphEdge[],
    clusters: Cluster[],
    width: number,
    height: number
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
    const clusterPositions = new Map<string, { cx: number; cy: number; count: number }>();

    // Calculate cluster centers
    this.nodes.forEach((node) => {
      if (!node.cluster) return;

      if (!clusterPositions.has(node.cluster)) {
        clusterPositions.set(node.cluster, { cx: 0, cy: 0, count: 0 });
      }

      const pos = clusterPositions.get(node.cluster)!;
      pos.cx += node.x;
      pos.cy += node.y;
      pos.count++;
    });

    // Position clusters around the canvas
    const clusterArray = Array.from(this.clusters.values());
    clusterArray.forEach((cluster, idx) => {
      const angle = (idx / clusterArray.length) * Math.PI * 2;
      const distance = 250;
      const cx = this.width / 2 + Math.cos(angle) * distance;
      const cy = this.height / 2 + Math.sin(angle) * distance;

      // Position all nodes in this cluster around its center
      this.nodes.forEach((node) => {
        if (node.cluster === cluster.id) {
          const r = Math.random() * 80;
          const theta = Math.random() * Math.PI * 2;
          node.x = cx + Math.cos(theta) * r;
          node.y = cy + Math.sin(theta) * r;
        }
      });
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

    // Repulsive forces between all nodes
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const node1 = this.nodes[i];
        const node2 = this.nodes[j];

        const dx = node2.x - node1.x;
        const dy = node2.y - node1.y;
        const dist = Math.hypot(dx, dy) || 1;
        const strength = 150; // Increased repulsion

        const fx = (dx / dist) * (-strength / dist);
        const fy = (dy / dist) * (-strength / dist);

        node1.vx += fx;
        node1.vy += fy;
        node2.vx -= fx;
        node2.vy -= fy;
      }
    }

    // Attractive forces for edges
    this.edges.forEach((edge) => {
      const source = nodeMap.get(edge.source);
      const target = nodeMap.get(edge.target);

      if (!source || !target) return;

      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const dist = Math.hypot(dx, dy) || 1;

      const restLength = 150; // Target distance
      const strength = 0.1;

      const fx = (dx / dist) * strength * (dist - restLength);
      const fy = (dy / dist) * strength * (dist - restLength);

      source.vx += fx;
      source.vy += fy;
      target.vx -= fx;
      target.vy -= fy;
    });

    // Cluster gravity - keep nodes within their cluster region
    this.nodes.forEach((node) => {
      if (!node.cluster) return;

      // Find cluster center
      const clusterNodes = this.nodes.filter((n) => n.cluster === node.cluster);
      const cx = clusterNodes.reduce((sum, n) => sum + n.x, 0) / clusterNodes.length;
      const cy = clusterNodes.reduce((sum, n) => sum + n.y, 0) / clusterNodes.length;

      const dx = cx - node.x;
      const dy = cy - node.y;
      const dist = Math.hypot(dx, dy) || 1;

      const strength = 0.05;
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
