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
  abstraction_level?:
    | "application"
    | "service"
    | "framework"
    | "runtime"
    | "standard"
    | "panel";
  category?:
    | "framework"
    | "panel"
    | "cloud-service"
    | "standard"
    | "runtime"
    | "database"
    | "container";
  is_derived?: boolean;
  versions: VersionDetail[];
}

export interface Issue {
  id: string;
  title: string;
  type: "vuln" | "misconfig" | "exposure" | "weak-auth" | "cve";
  severity: "critical" | "high" | "medium" | "low";
  confidence_score: number;
  discovered_at: string;
  description?: string;
  cve_id?: string;
}

export interface Vendor {
  id: string;
  name: string;
  products: string[];
  parent_vendor?: string;
  vendor_depth?: "Primary" | "Parent";
  vendor_type?:
    | "cloud_provider"
    | "software_vendor"
    | "foundation"
    | "parent_company";
}

export interface Relationship {
  from: string;
  to: string;
  type:
    | "uses"
    | "provides"
    | "derived_from"
    | "implements"
    | "parent_of"
    | "found_in"
    | "provides_by";
}

export interface DependencyGraphDataType {
  technologies: Technology[];
  vendors: Vendor[];
  issues: Issue[];
  relationships: Relationship[];
}

export const dependencyGraphData: DependencyGraphDataType = {
  technologies: [
    // RFC Use Case 1: hPanel and cPanel
    {
      id: "tech-hpanel",
      product: "hPanel",
      vendor: "Hostinger",
      abstraction_level: "panel",
      category: "panel",
      is_derived: true,
      versions: [
        {
          version: "1.0.0",
          eol: false,
          cves: ["CVE-2023-45001"],
        },
      ],
    },
    {
      id: "tech-cpanel",
      product: "cPanel",
      vendor: "cPanel, Inc.",
      abstraction_level: "panel",
      category: "panel",
      versions: [
        {
          version: "116.0.0",
          eol: false,
          cves: ["CVE-2023-45001", "CVE-2023-46789"],
        },
      ],
    },

    // RFC Use Case 2: S3/AWS
    {
      id: "tech-s3",
      product: "Amazon S3",
      vendor: "Amazon Web Services",
      abstraction_level: "service",
      category: "cloud-service",
      versions: [
        {
          version: "v4",
          eol: false,
          cves: [],
        },
      ],
    },
    {
      id: "tech-aws",
      product: "AWS Cloud Services",
      vendor: "Amazon Web Services",
      master_node: true,
      abstraction_level: "service",
      category: "cloud-service",
      versions: [
        {
          version: "current",
          eol: false,
          cves: [],
        },
      ],
    },

    // RFC Use Case 3: Swagger/OpenAPI
    {
      id: "tech-swagger",
      product: "Swagger",
      vendor: "SmartBear Software",
      abstraction_level: "framework",
      category: "framework",
      versions: [
        {
          version: "2.0",
          eol: true,
          eol_date: "2017-01-01",
          cves: ["CVE-2021-12345"],
        },
        {
          version: "3.0",
          eol: false,
          cves: ["CVE-2021-12345", "CVE-2023-50123"],
        },
        {
          version: "3.1.0",
          eol: false,
          cves: ["CVE-2023-50123"],
        },
      ],
    },
    {
      id: "tech-openapi",
      product: "OpenAPI Specification",
      vendor: "Linux Foundation",
      master_node: true,
      abstraction_level: "standard",
      category: "standard",
      versions: [
        {
          version: "3.0.3",
          eol: false,
          cves: [],
        },
        {
          version: "3.1.0",
          eol: false,
          cves: [],
        },
      ],
    },

    // Original tech stack examples
    {
      id: "tech-log4j",
      product: "Log4j",
      vendor: "Apache Software Foundation",
      abstraction_level: "framework",
      category: "framework",
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
      abstraction_level: "framework",
      category: "framework",
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
      abstraction_level: "runtime",
      category: "framework",
      versions: [
        {
          version: "9.0.70",
          eol: false,
          cves: ["CVE-2023-45648", "CVE-2021-50129"],
        },
      ],
    },
    {
      id: "tech-httpd",
      product: "Apache HTTP Server",
      vendor: "Apache Software Foundation",
      abstraction_level: "service",
      category: "framework",
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
      master_node: true,
      abstraction_level: "framework",
      category: "framework",
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
      abstraction_level: "application",
      category: "framework",
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
      abstraction_level: "runtime",
      category: "runtime",
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
      abstraction_level: "framework",
      category: "framework",
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
      abstraction_level: "service",
      category: "framework",
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
      abstraction_level: "service",
      category: "database",
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
      abstraction_level: "service",
      category: "database",
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
      abstraction_level: "service",
      category: "database",
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
      abstraction_level: "service",
      category: "database",
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
      abstraction_level: "runtime",
      category: "container",
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
      abstraction_level: "runtime",
      category: "container",
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
      abstraction_level: "service",
      category: "container",
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
      abstraction_level: "framework",
      category: "framework",
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
      abstraction_level: "application",
      category: "framework",
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
      abstraction_level: "framework",
      category: "framework",
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
      id: "vendor-hostinger",
      name: "Hostinger",
      products: ["tech-hpanel"],
      vendor_type: "software_vendor",
    },
    {
      id: "vendor-cpanel",
      name: "cPanel, Inc.",
      products: ["tech-cpanel"],
      vendor_type: "software_vendor",
    },
    {
      id: "vendor-aws",
      name: "Amazon Web Services",
      products: ["tech-s3", "tech-aws", "tech-boto3"],
      parent_vendor: "vendor-amazon",
      vendor_depth: "Primary",
      vendor_type: "cloud_provider",
    },
    {
      id: "vendor-amazon",
      name: "Amazon",
      products: [],
      vendor_type: "parent_company",
    },
    {
      id: "vendor-smartbear",
      name: "SmartBear Software",
      products: ["tech-swagger"],
      vendor_depth: "Primary",
      vendor_type: "software_vendor",
    },
    {
      id: "vendor-lf",
      name: "Linux Foundation",
      products: ["tech-openapi"],
      vendor_depth: "Parent",
      vendor_type: "foundation",
    },
    {
      id: "vendor-apache",
      name: "Apache Software Foundation",
      products: ["tech-log4j", "tech-spring", "tech-httpd", "tech-tomcat"],
      vendor_type: "foundation",
    },
    {
      id: "vendor-openjs",
      name: "OpenJS Foundation",
      products: ["tech-nodejs", "tech-express"],
      vendor_type: "foundation",
    },
    {
      id: "vendor-f5",
      name: "F5",
      products: ["tech-nginx"],
      vendor_type: "software_vendor",
    },
    {
      id: "vendor-haxx",
      name: "Haxx",
      products: ["tech-curl"],
      vendor_type: "software_vendor",
    },
    {
      id: "vendor-oracle",
      name: "Oracle",
      products: ["tech-mysql"],
      vendor_type: "software_vendor",
    },
    {
      id: "vendor-redis",
      name: "Redis Ltd.",
      products: ["tech-redis"],
      vendor_type: "software_vendor",
    },
    {
      id: "vendor-mongodb",
      name: "MongoDB Inc.",
      products: ["tech-mongodb"],
      vendor_type: "software_vendor",
    },
    {
      id: "vendor-docker",
      name: "Docker Inc.",
      products: ["tech-docker"],
      vendor_type: "software_vendor",
    },
    {
      id: "vendor-cncf",
      name: "CNCF",
      products: ["tech-kubernetes", "tech-containerd"],
      vendor_type: "foundation",
    },
    {
      id: "vendor-meta",
      name: "Meta",
      products: ["tech-react"],
      vendor_type: "software_vendor",
    },
  ],

  issues: [
    {
      id: "issue-cpanel-1",
      title: "Authentication Bypass in cPanel",
      type: "vuln",
      severity: "critical",
      confidence_score: 0.95,
      discovered_at: "2023-11-15",
      description:
        "Critical authentication bypass vulnerability affecting cPanel and derived products",
      cve_id: "CVE-2023-45001",
    },
    {
      id: "issue-swagger-exposure",
      title: "Swagger documentation exposed",
      type: "exposure",
      severity: "medium",
      confidence_score: 0.92,
      discovered_at: "2026-01-27",
      description:
        "Publicly accessible Swagger documentation detected, exposing API structure and endpoints. Attackers can discover API endpoints, request/response schemas, and security weaknesses. This information disclosure can lead to targeted attacks on the API infrastructure.",
    },
    {
      id: "issue-swagger-1",
      title: "Insecure Deserialization in Swagger",
      type: "vuln",
      severity: "high",
      confidence_score: 0.88,
      discovered_at: "2023-10-20",
      cve_id: "CVE-2023-50123",
    },
    {
      id: "issue-swagger-ui-xss",
      title: "Improper Access Control in Swagger",
      type: "vuln",
      severity: "medium",
      confidence_score: 0.85,
      discovered_at: "2024-03-15",
      description:
        "CVE-2021-12345: Improper access control leading to exposure of API metadata. Affected versions: 2.0, 3.0. This vulnerability allows unauthorized access to sensitive API documentation and structures.",
      cve_id: "CVE-2021-12345",
    },
    {
      id: "issue-s3-1",
      title: "S3 Bucket Publicly Exposed",
      type: "exposure",
      severity: "high",
      confidence_score: 0.92,
      discovered_at: "2023-09-10",
      description: "AWS S3 bucket configured for public read access",
    },
    {
      id: "ISSUE-S3-FOUND-001",
      title: "S3 bucket found publicly accessible",
      type: "exposure",
      severity: "high",
      confidence_score: 0.95,
      discovered_at: "2026-01-27",
      description:
        "An accessible S3 bucket was identified, which may expose sensitive data and indicates a potential misconfiguration in the storage service or underlying cloud platform.",
    },
  ],

  relationships: [
    // RFC Use Case 1: hPanel derived from cPanel
    { from: "tech-hpanel", to: "tech-cpanel", type: "derived_from" },

    // RFC Use Case 2: S3 uses AWS
    { from: "tech-s3", to: "tech-aws", type: "uses" },

    // RFC Use Case 3: Swagger implements OpenAPI
    { from: "tech-swagger", to: "tech-openapi", type: "implements" },

    // Original relationships
    { from: "tech-spring", to: "tech-log4j", type: "uses" },
    { from: "tech-tomcat", to: "tech-log4j", type: "uses" },
    { from: "tech-nodejs", to: "tech-openssl", type: "uses" },
    { from: "tech-express", to: "tech-nodejs", type: "uses" },
    { from: "tech-nginx", to: "tech-openssl", type: "uses" },
    { from: "tech-curl", to: "tech-openssl", type: "uses" },
    { from: "tech-docker", to: "tech-containerd", type: "uses" },
    { from: "tech-kubernetes", to: "tech-containerd", type: "uses" },

    // Issue relationships
    { from: "issue-cpanel-1", to: "tech-cpanel", type: "found_in" },
    { from: "issue-cpanel-1", to: "tech-hpanel", type: "found_in" },
    { from: "issue-swagger-exposure", to: "tech-swagger", type: "found_in" },
    { from: "issue-swagger-1", to: "tech-swagger", type: "found_in" },
    { from: "issue-swagger-ui-xss", to: "tech-swagger", type: "found_in" },
    { from: "issue-s3-1", to: "tech-s3", type: "found_in" },
    { from: "ISSUE-S3-FOUND-001", to: "tech-s3", type: "found_in" },

    // Vendor relationships
    { from: "vendor-smartbear", to: "vendor-lf", type: "parent_of" },
  ],
};

/**
 * Get graph nodes and edges for a specific technology
 */
export function buildGraphForTech(
  techId: string,
  data: DependencyGraphDataType,
): {
  nodes: Array<{
    id: string;
    label: string;
    type: string;
    subtype: string;
    category?: string;
  }>;
  edges: Array<{ source: string; target: string; relationship: string }>;
} {
  const nodes: Array<{
    id: string;
    label: string;
    type: string;
    subtype: string;
    category?: string;
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
    category: mainTech.category,
  });
  visitedNodes.add(techId);

  // Find issues affecting this technology
  const affectingIssues = data.relationships
    .filter((r) => r.type === "found_in" && r.to === techId)
    .map((r) => r.from);

  affectingIssues.forEach((issueId) => {
    const issue = data.issues.find((i) => i.id === issueId);
    if (issue && !visitedNodes.has(issueId)) {
      nodes.push({
        id: issueId,
        label: `${issue.type.toUpperCase()}: ${issue.title}`,
        type: "issue",
        subtype: issue.severity,
      });
      edges.push({
        source: issueId,
        target: techId,
        relationship: "found_in",
      });
      visitedNodes.add(issueId);
    }
  });

  // Find technologies that depend on this tech
  const dependentTechs = data.relationships
    .filter(
      (r) =>
        r.to === techId && (r.type === "uses" || r.type === "derived_from"),
    )
    .map((r) => r.from);

  dependentTechs.forEach((depTechId) => {
    const depTech = data.technologies.find((t) => t.id === depTechId);
    if (depTech && !visitedNodes.has(depTechId)) {
      nodes.push({
        id: depTechId,
        label: depTech.product,
        type: "technology",
        subtype: "related",
        category: depTech.category,
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
    .filter(
      (r) =>
        r.from === techId && (r.type === "uses" || r.type === "implements"),
    )
    .map((r) => r.to);

  dependsOnTechs.forEach((depOnTechId) => {
    const depOnTech = data.technologies.find((t) => t.id === depOnTechId);
    if (depOnTech && !visitedNodes.has(depOnTechId)) {
      nodes.push({
        id: depOnTechId,
        label: depOnTech.product,
        type: "technology",
        subtype: "underlying",
        category: depOnTech.category,
      });
      edges.push({
        source: techId,
        target: depOnTechId,
        relationship: "uses",
      });
      visitedNodes.add(depOnTechId);
    }
  });

  // Find derived technologies (for cases like cPanel/hPanel)
  const derivedTechs = data.relationships
    .filter((r) => r.to === techId && r.type === "derived_from")
    .map((r) => r.from);

  derivedTechs.forEach((derivedTechId) => {
    const derivedTech = data.technologies.find((t) => t.id === derivedTechId);
    if (derivedTech && !visitedNodes.has(derivedTechId)) {
      nodes.push({
        id: derivedTechId,
        label: derivedTech.product,
        type: "technology",
        subtype: "related",
        category: derivedTech.category,
      });
      edges.push({
        source: derivedTechId,
        target: techId,
        relationship: "derived_from",
      });
      visitedNodes.add(derivedTechId);
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
        relationship: "provides_by",
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
            relationship: "parent_of",
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
          relationship: "provides_by",
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
              relationship: "parent_of",
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
 * Get technology details
 */
export function getTechDetails(techId: string, data: DependencyGraphDataType) {
  return data.technologies.find((t) => t.id === techId);
}

/**
 * Get all affected technologies for an issue (attribution analysis)
 */
export function getAffectedTechnologies(
  issueId: string,
  data: DependencyGraphDataType,
) {
  const directlyAffected = data.relationships
    .filter((r) => r.type === "found_in" && r.from === issueId)
    .map((r) => r.to);

  const indirectlyAffected: string[] = [];

  // Find dependent technologies that would be impacted
  directlyAffected.forEach((techId) => {
    const dependentTechs = data.relationships
      .filter(
        (r) =>
          r.to === techId && (r.type === "uses" || r.type === "derived_from"),
      )
      .map((r) => r.from);
    indirectlyAffected.push(...dependentTechs);
  });

  return {
    directly: directlyAffected,
    indirectly: Array.from(new Set(indirectlyAffected)),
  };
}

/**
 * Get primary vendor accountability for a technology
 */
export function getVendorAccountability(
  techId: string,
  data: DependencyGraphDataType,
) {
  const tech = data.technologies.find((t) => t.id === techId);
  if (!tech) return null;

  const primaryVendor = data.vendors.find((v) => v.products.includes(techId));

  return {
    primary: primaryVendor,
    parent: primaryVendor?.parent_vendor
      ? {
          name: primaryVendor.parent_vendor,
          id: `vendor-parent-${primaryVendor.id}`,
        }
      : null,
  };
}
