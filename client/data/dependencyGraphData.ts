export interface VersionDetail {
  version: string;
  eol: boolean;
  eol_date?: string;
  cves: string[];
}

export interface Technology {
  id: string;
  product: string;
  vendor: string;
  master_node?: boolean;
  versions: VersionDetail[];
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
      vendor: "Apache Software Foundation",
      versions: [
        {
          version: "2.13.0",
          eol: true,
          eol_date: "2021-12-10",
          cves: ["CVE-2021-44228", "CVE-2021-45046"],
        },
        {
          version: "2.14.1",
          eol: true,
          eol_date: "2021-12-17",
          cves: ["CVE-2021-44228", "CVE-2021-45105"],
        },
        {
          version: "2.15.0",
          eol: true,
          eol_date: "2021-12-20",
          cves: ["CVE-2021-45046"],
        },
      ],
    },
    {
      id: "tech-spring",
      product: "Spring Framework",
      vendor: "Apache Software Foundation",
      versions: [
        {
          version: "5.2.0",
          eol: true,
          eol_date: "2022-03-31",
          cves: ["CVE-2022-22965"],
        },
        {
          version: "5.3.15",
          eol: false,
          cves: ["CVE-2022-22968"],
        },
        {
          version: "6.0.0",
          eol: false,
          cves: [],
        },
      ],
    },
    {
      id: "tech-tomcat",
      product: "Apache Tomcat",
      vendor: "Apache Software Foundation",
      versions: [
        {
          version: "9.0.70",
          eol: false,
          cves: ["CVE-2022-42252"],
        },
      ],
    },
    {
      id: "tech-httpd",
      product: "Apache HTTP Server",
      vendor: "Apache Software Foundation",
      versions: [
        {
          version: "2.4.52",
          eol: false,
          cves: ["CVE-2021-44790"],
        },
      ],
    },
    {
      id: "tech-openssl",
      product: "OpenSSL",
      vendor: "OpenSSL Software Foundation",
      versions: [
        {
          version: "1.1.1k",
          eol: true,
          eol_date: "2023-09-11",
          cves: ["CVE-2021-3711", "CVE-2022-0778"],
        },
      ],
    },
    {
      id: "tech-curl",
      product: "curl",
      vendor: "Haxx",
      versions: [
        {
          version: "7.88.1",
          eol: false,
          cves: ["CVE-2023-23914"],
        },
      ],
    },
    {
      id: "tech-nodejs",
      product: "Node.js",
      vendor: "OpenJS Foundation",
      master_node: true,
      versions: [
        {
          version: "18.12.0",
          eol: false,
          cves: ["CVE-2023-30581"],
        },
      ],
    },
    {
      id: "tech-express",
      product: "Express.js",
      vendor: "OpenJS Foundation",
      versions: [
        {
          version: "4.17.1",
          eol: false,
          cves: ["CVE-2022-24999"],
        },
      ],
    },
    {
      id: "tech-nginx",
      product: "Nginx",
      vendor: "F5",
      versions: [
        {
          version: "1.24.0",
          eol: false,
          cves: ["CVE-2023-44487"],
        },
      ],
    },
    {
      id: "tech-postgres",
      product: "PostgreSQL",
      vendor: "PostgreSQL Global Development Group",
      versions: [
        {
          version: "13.10",
          eol: false,
          cves: ["CVE-2022-2625"],
        },
      ],
    },
    {
      id: "tech-mysql",
      product: "MySQL",
      vendor: "Oracle",
      versions: [
        {
          version: "5.7.44",
          eol: true,
          eol_date: "2023-10-21",
          cves: ["CVE-2022-21426"],
        },
      ],
    },
    {
      id: "tech-mongodb",
      product: "MongoDB",
      vendor: "MongoDB Inc.",
      versions: [
        {
          version: "5.0.10",
          eol: false,
          cves: ["CVE-2022-48282"],
        },
      ],
    },
    {
      id: "tech-redis",
      product: "Redis",
      vendor: "Redis Ltd.",
      versions: [
        {
          version: "6.2.11",
          eol: false,
          cves: ["CVE-2022-0543"],
        },
      ],
    },
    {
      id: "tech-docker",
      product: "Docker",
      vendor: "Docker Inc.",
      versions: [
        {
          version: "20.10.12",
          eol: false,
          cves: ["CVE-2022-24769"],
        },
      ],
    },
    {
      id: "tech-containerd",
      product: "containerd",
      vendor: "CNCF",
      master_node: true,
      versions: [
        {
          version: "1.7.0",
          eol: false,
          cves: ["CVE-2023-25153"],
        },
      ],
    },
    {
      id: "tech-kubernetes",
      product: "Kubernetes",
      vendor: "CNCF",
      versions: [
        {
          version: "1.27.0",
          eol: false,
          cves: ["CVE-2023-2728"],
        },
      ],
    },
    {
      id: "tech-django",
      product: "Django",
      vendor: "Django Software Foundation",
      versions: [
        {
          version: "3.2.18",
          eol: true,
          eol_date: "2024-04-01",
          cves: ["CVE-2023-24580"],
        },
      ],
    },
    {
      id: "tech-boto3",
      product: "AWS SDK for Python (boto3)",
      vendor: "Amazon Web Services",
      versions: [
        {
          version: "1.26.0",
          eol: false,
          cves: [],
        },
      ],
    },
    {
      id: "tech-react",
      product: "React",
      vendor: "Meta",
      versions: [
        {
          version: "18.2.0",
          eol: false,
          cves: ["CVE-2023-26136"],
        },
      ],
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
      id: "vendor-f5",
      name: "F5",
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
      name: "CNCF",
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
    { from: "tech-nodejs", to: "tech-openssl", type: "uses" },
    { from: "tech-express", to: "tech-nodejs", type: "uses" },
    { from: "tech-nginx", to: "tech-openssl", type: "uses" },
    { from: "tech-curl", to: "tech-openssl", type: "uses" },
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

/**
 * Get technology details including version info, CVEs, and EOL status
 */
export function getTechDetails(techId: string, data: DependencyGraphDataType) {
  return data.technologies.find((t) => t.id === techId);
}
