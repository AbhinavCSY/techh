export interface Technology {
  id: string;
  product: string;
  versions: string[];
}

export interface Vendor {
  id: string;
  name: string;
  products: string[];
  parent_vendor?: string;
}

export interface Relationship {
  from: string;
  to: string;
  type: string;
}

export interface DependencyGraphDataType {
  technologies: Technology[];
  vendors: Vendor[];
  relationships: Relationship[];
}

export const dependencyGraphData: DependencyGraphDataType = {
  technologies: [
    {
      id: "tech-log4j",
      product: "Log4j",
      versions: ["2.13.0", "2.14.1", "2.15.0"],
    },
    {
      id: "tech-spring",
      product: "Spring Framework",
      versions: ["5.2.0", "5.3.15", "6.0.0"],
    },
    {
      id: "tech-httpd",
      product: "Apache HTTP Server",
      versions: ["2.4.52"],
    },
    {
      id: "tech-tomcat",
      product: "Apache Tomcat",
      versions: ["9.0.70"],
    },
    {
      id: "tech-curl",
      product: "curl",
      versions: ["7.88.1"],
    },
    {
      id: "tech-openssl",
      product: "OpenSSL",
      versions: ["1.1.1k"],
    },
    {
      id: "tech-nodejs",
      product: "Node.js",
      versions: ["18.12.0"],
    },
    {
      id: "tech-express",
      product: "Express.js",
      versions: ["4.17.1"],
    },
    {
      id: "tech-react",
      product: "React",
      versions: ["18.2.0"],
    },
    {
      id: "tech-django",
      product: "Django",
      versions: ["3.2.18"],
    },
    {
      id: "tech-boto3",
      product: "AWS SDK for Python (boto3)",
      versions: ["1.26.0"],
    },
    {
      id: "tech-nginx",
      product: "Nginx",
      versions: ["1.24.0"],
    },
    {
      id: "tech-postgres",
      product: "PostgreSQL",
      versions: ["13.10"],
    },
    {
      id: "tech-mysql",
      product: "MySQL",
      versions: ["5.7.44"],
    },
    {
      id: "tech-mongodb",
      product: "MongoDB",
      versions: ["5.0.10"],
    },
    {
      id: "tech-redis",
      product: "Redis",
      versions: ["6.2.11"],
    },
    {
      id: "tech-docker",
      product: "Docker",
      versions: ["20.10.12"],
    },
    {
      id: "tech-containerd",
      product: "containerd",
      versions: ["1.7.0"],
    },
    {
      id: "tech-kubernetes",
      product: "Kubernetes",
      versions: ["1.27.0"],
    },
  ],

  vendors: [
    {
      id: "vendor-apache",
      name: "Apache Software Foundation",
      products: ["tech-log4j", "tech-spring", "tech-httpd", "tech-tomcat"],
    },
    {
      id: "vendor-openjs",
      name: "OpenJS Foundation",
      products: ["tech-nodejs", "tech-express"],
    },
    {
      id: "vendor-nginx",
      name: "F5 (NGINX)",
      products: ["tech-nginx"],
    },
    {
      id: "vendor-haxx",
      name: "Haxx",
      products: ["tech-curl"],
    },
    {
      id: "vendor-oracle",
      name: "Oracle",
      products: ["tech-mysql"],
    },
    {
      id: "vendor-redis",
      name: "Redis Ltd.",
      products: ["tech-redis"],
    },
    {
      id: "vendor-mongodb",
      name: "MongoDB Inc.",
      products: ["tech-mongodb"],
    },
    {
      id: "vendor-docker",
      name: "Docker Inc.",
      products: ["tech-docker"],
    },
    {
      id: "vendor-cncf",
      name: "Cloud Native Computing Foundation",
      products: ["tech-kubernetes", "tech-containerd"],
    },
    {
      id: "vendor-aws",
      name: "Amazon Web Services",
      parent_vendor: "Amazon",
      products: ["tech-boto3"],
    },
    {
      id: "vendor-meta",
      name: "Meta",
      products: ["tech-react"],
    },
  ],

  relationships: [
    { from: "tech-spring", to: "tech-log4j", type: "uses" },
    { from: "tech-tomcat", to: "tech-log4j", type: "uses" },
    { from: "tech-express", to: "tech-nodejs", type: "uses" },
    { from: "tech-nodejs", to: "tech-openssl", type: "uses" },
    { from: "tech-curl", to: "tech-openssl", type: "uses" },
    { from: "tech-nginx", to: "tech-openssl", type: "uses" },
    { from: "tech-docker", to: "tech-containerd", type: "uses" },
    { from: "tech-kubernetes", to: "tech-containerd", type: "uses" },
  ],
};

/**
 * Get graph nodes and edges for a specific technology
 * This builds a graph starting from the main tech and includes:
 * - Related technologies (dependencies)
 * - Vendors that provide the tech
 * - Parent vendors of those vendors
 */
export function buildGraphForTech(
  techId: string,
  data: DependencyGraphDataType,
): {
  nodes: Array<{ id: string; label: string; type: string; subtype: string }>;
  edges: Array<{ source: string; target: string; relationship: string }>;
} {
  const nodes: Array<{
    id: string;
    label: string;
    type: string;
    subtype: string;
  }> = [];
  const edges: Array<{ source: string; target: string; relationship: string }> =
    [];
  const visitedNodes = new Set<string>();

  // Find the main technology
  const mainTech = data.technologies.find((t) => t.id === techId);
  if (!mainTech) {
    return { nodes: [], edges: [] };
  }

  // Add main tech node
  nodes.push({
    id: techId,
    label: mainTech.product,
    type: "technology",
    subtype: "direct",
  });
  visitedNodes.add(techId);

  // Find technologies that depend on this tech
  const dependentTechs = data.relationships
    .filter((r) => r.to === techId)
    .map((r) => r.from);

  dependentTechs.forEach((depTechId) => {
    const depTech = data.technologies.find((t) => t.id === depTechId);
    if (depTech && !visitedNodes.has(depTechId)) {
      nodes.push({
        id: depTechId,
        label: depTech.product,
        type: "technology",
        subtype: "related",
      });
      edges.push({
        source: depTechId,
        target: techId,
        relationship: "uses",
      });
      visitedNodes.add(depTechId);
    }
  });

  // Find technologies this tech depends on
  const dependsOnTechs = data.relationships
    .filter((r) => r.from === techId)
    .map((r) => r.to);

  dependsOnTechs.forEach((depOnTechId) => {
    const depOnTech = data.technologies.find((t) => t.id === depOnTechId);
    if (depOnTech && !visitedNodes.has(depOnTechId)) {
      nodes.push({
        id: depOnTechId,
        label: depOnTech.product,
        type: "technology",
        subtype: "underlying",
      });
      edges.push({
        source: techId,
        target: depOnTechId,
        relationship: "uses",
      });
      visitedNodes.add(depOnTechId);
    }
  });

  // Find vendors that provide this tech
  const providingVendors = data.vendors.filter((v) =>
    v.products.includes(techId),
  );

  providingVendors.forEach((vendor) => {
    if (!visitedNodes.has(vendor.id)) {
      nodes.push({
        id: vendor.id,
        label: vendor.name,
        type: "vendor",
        subtype: "primary",
      });
      edges.push({
        source: techId,
        target: vendor.id,
        relationship: "provided_by",
      });
      visitedNodes.add(vendor.id);

      // Add parent vendor if exists
      if (vendor.parent_vendor) {
        const parentVendorId = `vendor-parent-${vendor.id}`;
        if (!visitedNodes.has(parentVendorId)) {
          nodes.push({
            id: parentVendorId,
            label: vendor.parent_vendor,
            type: "vendor",
            subtype: "parent",
          });
          edges.push({
            source: vendor.id,
            target: parentVendorId,
            relationship: "subsidiary_of",
          });
          visitedNodes.add(parentVendorId);
        }
      }
    }
  });

  // Find vendors for underlying techs
  dependsOnTechs.forEach((depOnTechId) => {
    const vendorsForDepTech = data.vendors.filter((v) =>
      v.products.includes(depOnTechId),
    );

    vendorsForDepTech.forEach((vendor) => {
      if (!visitedNodes.has(vendor.id)) {
        nodes.push({
          id: vendor.id,
          label: vendor.name,
          type: "vendor",
          subtype: "primary",
        });
        edges.push({
          source: depOnTechId,
          target: vendor.id,
          relationship: "provided_by",
        });
        visitedNodes.add(vendor.id);

        // Add parent vendor if exists
        if (vendor.parent_vendor) {
          const parentVendorId = `vendor-parent-${vendor.id}`;
          if (!visitedNodes.has(parentVendorId)) {
            nodes.push({
              id: parentVendorId,
              label: vendor.parent_vendor,
              type: "vendor",
              subtype: "parent",
            });
            edges.push({
              source: vendor.id,
              target: parentVendorId,
              relationship: "subsidiary_of",
            });
            visitedNodes.add(parentVendorId);
          }
        }
      }
    });
  });

  return { nodes, edges };
}
