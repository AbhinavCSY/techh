export interface CVE {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  score: number;
}

export interface VersionHistory {
  version: string;
  releaseDate: Date;
  isEOL: boolean;
}

export interface Remediation {
  id: string;
  title: string;
  description: string;
  priority: "critical" | "high" | "medium" | "low";
  estimatedTime: string;
}

export interface PackageReliabilityIndicator {
  score: number;
  riskLevel: "no risk" | "low" | "medium" | "high" | "critical";
}

export interface PackageReliabilityIndicators {
  contributorReputation: PackageReliabilityIndicator;
  packageReliability: PackageReliabilityIndicator;
  behavioralIntegrity: PackageReliabilityIndicator;
}

export interface AssociatedComponent {
  component_name: string;
  component_version: string;
  component_type: string;
  directly_vulnerable: boolean;
  inherited_risk: boolean;
  risk_reason: string;
  dependency_depth: number;
}

export interface ImpactContext {
  execution_context: string;
  privilege_level: string;
  exposure_surface: string;
  blast_radius: string;
  lateral_movement_possible: boolean;
}

export interface TechStack {
  id: string;
  name: string;
  type: "framework" | "language" | "database" | "devops" | "library";
  version: string;
  logo: string;
  isEOL: boolean;
  isUpgradable: boolean;
  secureVersion?: string;
  cves: CVE[];
  unscannedThreatsCount: number;
  riskLevel: "critical" | "high" | "medium" | "low";
  riskScore: number;
  createdAt: Date;
  lastUpdated?: Date;
  license: string;
  effectiveLicense:
    | "MIT"
    | "Apache"
    | "BSD 3"
    | "LGPL"
    | "PostgreSQL License"
    | "Other";
  versionHistory: VersionHistory[];
  remediations: Remediation[];
  reliabilityIndicators: PackageReliabilityIndicators;
  associatedComponents?: AssociatedComponent[];
  impactContext?: ImpactContext;
}

export interface Asset {
  id: string;
  name: string;
  type: "ip" | "domain" | "app" | "cloud-resource";
  riskLevel: "critical" | "high" | "medium" | "low";
  techStacks: TechStack[];
  cveCount: number;
  topCriticalCVE?: CVE;
  lastUpdated: Date;
  isScanned: boolean;
}

const commonCVEs: Record<string, CVE[]> = {
  Log4j: [
    {
      id: "CVE-2021-44228",
      severity: "critical",
      title: "Log4j RCE",
      score: 10.0,
    },
    {
      id: "CVE-2021-45046",
      severity: "critical",
      title: "Log4j Bypass",
      score: 9.8,
    },
  ],
  "Spring Framework": [
    {
      id: "CVE-2022-22965",
      severity: "critical",
      title: "Spring4Shell RCE",
      score: 9.8,
    },
  ],
  React: [
    { id: "CVE-2020-5902", severity: "high", title: "DOM XSS", score: 8.2 },
  ],
  "Node.js": [
    {
      id: "CVE-2023-23936",
      severity: "high",
      title: "HTTP Request Smuggling",
      score: 8.1,
    },
  ],
  PostgreSQL: [
    {
      id: "CVE-2022-41862",
      severity: "high",
      title: "Logical Replication XSS",
      score: 7.5,
    },
  ],
  Django: [
    {
      id: "CVE-2023-23969",
      severity: "medium",
      title: "Regex DoS",
      score: 5.3,
    },
  ],
  "Express.js": [
    {
      id: "CVE-2022-24999",
      severity: "high",
      title: "Query Parser DoS",
      score: 7.5,
    },
  ],
};

const techStackDatabase: TechStack[] = [
  {
    id: "ts-1",
    name: "Log4j",
    type: "library",
    version: "2.14.1",
    logo: "📋",
    isEOL: false,
    isUpgradable: true,
    secureVersion: "2.20.0",
    cves: commonCVEs["Log4j"],
    unscannedThreatsCount: 6,
    riskLevel: "critical",
    riskScore: 9.2,
    createdAt: new Date("2024-01-15"),
    lastUpdated: new Date("2024-02-16"),
    license: "Apache License 2.0",
    effectiveLicense: "Apache",
    versionHistory: [
      { version: "2.14.1", releaseDate: new Date("2022-01-15"), isEOL: false },
      { version: "2.17.0", releaseDate: new Date("2021-12-28"), isEOL: false },
      { version: "2.20.0", releaseDate: new Date("2023-10-20"), isEOL: false },
    ],
    remediations: [
      {
        id: "rem-1",
        title: "Update to 2.20.0",
        description: "Upgrade Log4j to the latest stable version",
        priority: "critical",
        estimatedTime: "2-4 hours",
      },
      {
        id: "rem-2",
        title: "Implement input validation",
        description: "Add strict input validation for all user inputs",
        priority: "high",
        estimatedTime: "4-8 hours",
      },
    ],
    reliabilityIndicators: {
      contributorReputation: { score: 10, riskLevel: "no risk" },
      packageReliability: { score: 7, riskLevel: "low" },
      behavioralIntegrity: { score: 8, riskLevel: "low" },
    },
  },
  {
    id: "ts-2",
    name: "Spring Framework",
    type: "framework",
    version: "5.3.15",
    logo: "🍃",
    isEOL: true,
    isUpgradable: true,
    secureVersion: "6.1.0",
    cves: commonCVEs["Spring Framework"],
    unscannedThreatsCount: 5,
    riskLevel: "critical",
    riskScore: 9.0,
    createdAt: new Date("2024-01-10"),
    lastUpdated: new Date("2024-02-15"),
    license: "Apache License 2.0",
    effectiveLicense: "Apache",
    versionHistory: [
      { version: "5.3.15", releaseDate: new Date("2022-12-01"), isEOL: true },
      { version: "6.0.0", releaseDate: new Date("2023-09-30"), isEOL: false },
      { version: "6.1.0", releaseDate: new Date("2024-01-01"), isEOL: false },
    ],
    remediations: [
      {
        id: "rem-3",
        title: "Upgrade to Spring 6.1",
        description: "Migrate from EOL version 5.3 to current 6.1",
        priority: "critical",
        estimatedTime: "8-16 hours",
      },
    ],
    reliabilityIndicators: {
      contributorReputation: { score: 10, riskLevel: "no risk" },
      packageReliability: { score: 9, riskLevel: "no risk" },
      behavioralIntegrity: { score: 9, riskLevel: "no risk" },
    },
  },
  {
    id: "ts-3",
    name: "React",
    type: "framework",
    version: "18.2.0",
    logo: "⚛️",
    isEOL: false,
    isUpgradable: false,
    cves: commonCVEs["React"],
    unscannedThreatsCount: 3,
    riskLevel: "low",
    riskScore: 3.5,
    createdAt: new Date("2024-02-01"),
    lastUpdated: new Date("2024-02-14"),
    license: "MIT",
    effectiveLicense: "MIT",
    versionHistory: [
      { version: "18.2.0", releaseDate: new Date("2023-09-15"), isEOL: false },
      { version: "18.3.0", releaseDate: new Date("2024-01-10"), isEOL: false },
    ],
    remediations: [
      {
        id: "rem-4",
        title: "Minor dependency update",
        description: "Update some peer dependencies",
        priority: "low",
        estimatedTime: "1-2 hours",
      },
    ],
    reliabilityIndicators: {
      contributorReputation: { score: 10, riskLevel: "no risk" },
      packageReliability: { score: 10, riskLevel: "no risk" },
      behavioralIntegrity: { score: 10, riskLevel: "no risk" },
    },
  },
  {
    id: "ts-4",
    name: "Node.js",
    type: "language",
    version: "18.12.0",
    logo: "🟢",
    isEOL: false,
    isUpgradable: true,
    secureVersion: "20.10.0",
    cves: commonCVEs["Node.js"],
    unscannedThreatsCount: 4,
    riskLevel: "high",
    riskScore: 7.8,
    createdAt: new Date("2023-12-20"),
    lastUpdated: new Date("2024-02-12"),
    license: "MIT",
    effectiveLicense: "MIT",
    versionHistory: [
      { version: "18.12.0", releaseDate: new Date("2023-08-15"), isEOL: false },
      { version: "20.10.0", releaseDate: new Date("2024-01-20"), isEOL: false },
    ],
    remediations: [
      {
        id: "rem-5",
        title: "Upgrade to Node 20",
        description: "Update Node.js to latest LTS",
        priority: "high",
        estimatedTime: "4-6 hours",
      },
    ],
    reliabilityIndicators: {
      contributorReputation: { score: 10, riskLevel: "no risk" },
      packageReliability: { score: 8, riskLevel: "low" },
      behavioralIntegrity: { score: 9, riskLevel: "no risk" },
    },
  },
  {
    id: "ts-5",
    name: "PostgreSQL",
    type: "database",
    version: "13.10",
    logo: "🐘",
    isEOL: true,
    isUpgradable: true,
    secureVersion: "15.3",
    cves: commonCVEs["PostgreSQL"],
    unscannedThreatsCount: 2,
    riskLevel: "high",
    riskScore: 7.5,
    createdAt: new Date("2024-01-05"),
    lastUpdated: new Date("2024-02-11"),
    license: "PostgreSQL License",
    effectiveLicense: "PostgreSQL License",
    versionHistory: [
      { version: "13.10", releaseDate: new Date("2023-07-01"), isEOL: true },
      { version: "14.8", releaseDate: new Date("2023-11-15"), isEOL: false },
      { version: "15.3", releaseDate: new Date("2024-02-01"), isEOL: false },
    ],
    remediations: [
      {
        id: "rem-6",
        title: "Upgrade PostgreSQL to 15.3",
        description: "Migrate database from EOL 13.10 to 15.3",
        priority: "critical",
        estimatedTime: "12-20 hours",
      },
    ],
    reliabilityIndicators: {
      contributorReputation: { score: 10, riskLevel: "no risk" },
      packageReliability: { score: 9, riskLevel: "no risk" },
      behavioralIntegrity: { score: 9, riskLevel: "no risk" },
    },
  },
  {
    id: "ts-6",
    name: "Django",
    type: "framework",
    version: "3.2.18",
    logo: "🎯",
    isEOL: false,
    isUpgradable: true,
    secureVersion: "4.2.0",
    cves: commonCVEs["Django"],
    unscannedThreatsCount: 3,
    riskLevel: "medium",
    riskScore: 5.2,
    createdAt: new Date("2024-01-20"),
    lastUpdated: new Date("2024-02-13"),
    license: "BSD License",
    effectiveLicense: "BSD 3",
    versionHistory: [
      { version: "3.2.18", releaseDate: new Date("2023-12-01"), isEOL: false },
      { version: "4.2.0", releaseDate: new Date("2024-02-03"), isEOL: false },
    ],
    remediations: [
      {
        id: "rem-7",
        title: "Update Django to 4.2",
        description: "Upgrade to latest Django version",
        priority: "medium",
        estimatedTime: "6-10 hours",
      },
    ],
    reliabilityIndicators: {
      contributorReputation: { score: 10, riskLevel: "no risk" },
      packageReliability: { score: 10, riskLevel: "no risk" },
      behavioralIntegrity: { score: 9, riskLevel: "no risk" },
    },
  },
  {
    id: "ts-7",
    name: "Express.js",
    type: "framework",
    version: "4.17.1",
    logo: "🚂",
    isEOL: false,
    isUpgradable: true,
    secureVersion: "4.18.2",
    cves: commonCVEs["Express.js"],
    unscannedThreatsCount: 4,
    riskLevel: "high",
    riskScore: 7.5,
    createdAt: new Date("2024-01-25"),
    lastUpdated: new Date("2024-02-10"),
    license: "MIT",
    effectiveLicense: "MIT",
    versionHistory: [
      { version: "4.17.1", releaseDate: new Date("2023-09-01"), isEOL: false },
      { version: "4.18.2", releaseDate: new Date("2024-01-15"), isEOL: false },
    ],
    remediations: [
      {
        id: "rem-8",
        title: "Update Express.js",
        description: "Update to Express 4.18.2",
        priority: "high",
        estimatedTime: "2-3 hours",
      },
    ],
    reliabilityIndicators: {
      contributorReputation: { score: 10, riskLevel: "no risk" },
      packageReliability: { score: 8, riskLevel: "low" },
      behavioralIntegrity: { score: 8, riskLevel: "low" },
    },
  },
  {
    id: "ts-8",
    name: "Docker",
    type: "devops",
    version: "20.10.12",
    logo: "🐳",
    isEOL: false,
    isUpgradable: true,
    secureVersion: "25.0.0",
    cves: [],
    unscannedThreatsCount: 1,
    riskLevel: "low",
    riskScore: 2.1,
    createdAt: new Date("2024-02-05"),
    lastUpdated: new Date("2024-02-16"),
    license: "Apache License 2.0",
    effectiveLicense: "Apache",
    versionHistory: [
      {
        version: "20.10.12",
        releaseDate: new Date("2023-10-01"),
        isEOL: false,
      },
      { version: "25.0.0", releaseDate: new Date("2024-02-06"), isEOL: false },
    ],
    remediations: [
      {
        id: "rem-9",
        title: "Update Docker",
        description: "Update Docker daemon to 25.0",
        priority: "low",
        estimatedTime: "1-2 hours",
      },
    ],
    reliabilityIndicators: {
      contributorReputation: { score: 10, riskLevel: "no risk" },
      packageReliability: { score: 10, riskLevel: "no risk" },
      behavioralIntegrity: { score: 10, riskLevel: "no risk" },
    },
  },
  {
    id: "ts-9",
    name: "Kubernetes",
    type: "devops",
    version: "1.27.0",
    logo: "☸️",
    isEOL: false,
    isUpgradable: false,
    cves: [],
    unscannedThreatsCount: 0,
    riskLevel: "low",
    riskScore: 1.8,
    createdAt: new Date("2024-02-10"),
    lastUpdated: new Date("2024-02-15"),
    license: "Apache License 2.0",
    effectiveLicense: "Apache",
    versionHistory: [
      { version: "1.27.0", releaseDate: new Date("2023-08-23"), isEOL: false },
    ],
    remediations: [],
    reliabilityIndicators: {
      contributorReputation: { score: 10, riskLevel: "no risk" },
      packageReliability: { score: 10, riskLevel: "no risk" },
      behavioralIntegrity: { score: 10, riskLevel: "no risk" },
    },
  },
  {
    id: "ts-10",
    name: "MongoDB",
    type: "database",
    version: "5.0.10",
    logo: "🍃",
    isEOL: false,
    isUpgradable: true,
    secureVersion: "7.0.0",
    cves: [],
    unscannedThreatsCount: 2,
    riskLevel: "medium",
    riskScore: 4.2,
    createdAt: new Date("2024-01-30"),
    lastUpdated: new Date("2024-02-09"),
    license: "SSPL/Community",
    effectiveLicense: "Other",
    versionHistory: [
      { version: "5.0.10", releaseDate: new Date("2023-12-01"), isEOL: false },
      { version: "7.0.0", releaseDate: new Date("2024-02-01"), isEOL: false },
    ],
    remediations: [
      {
        id: "rem-10",
        title: "Upgrade MongoDB",
        description: "Update MongoDB to version 7.0",
        priority: "medium",
        estimatedTime: "4-8 hours",
      },
    ],
    reliabilityIndicators: {
      contributorReputation: { score: 9, riskLevel: "no risk" },
      packageReliability: { score: 8, riskLevel: "low" },
      behavioralIntegrity: { score: 8, riskLevel: "low" },
    },
  },
  {
    id: "ts-11",
    name: "Log4j",
    type: "library",
    version: "2.13.0",
    logo: "📋",
    isEOL: true,
    isUpgradable: true,
    secureVersion: "2.20.0",
    cves: [
      {
        id: "CVE-2021-44228",
        severity: "critical",
        title: "Log4j RCE",
        score: 10.0,
      },
      {
        id: "CVE-2021-45046",
        severity: "critical",
        title: "Log4j Bypass",
        score: 9.8,
      },
      {
        id: "CVE-2021-45105",
        severity: "high",
        title: "Log4j DoS",
        score: 7.5,
      },
    ],
    unscannedThreatsCount: 6,
    riskLevel: "critical",
    riskScore: 9.8,
    createdAt: new Date("2024-01-20"),
    lastUpdated: new Date("2024-02-08"),
    license: "Apache License 2.0",
    effectiveLicense: "Apache",
    versionHistory: [
      { version: "2.13.0", releaseDate: new Date("2020-11-15"), isEOL: true },
      { version: "2.20.0", releaseDate: new Date("2023-10-20"), isEOL: false },
    ],
    remediations: [
      {
        id: "rem-11",
        title: "Critical: Update to 2.20.0",
        description:
          "Immediate upgrade required due to critical RCE vulnerability",
        priority: "critical",
        estimatedTime: "1-2 hours",
      },
    ],
    reliabilityIndicators: {
      contributorReputation: { score: 10, riskLevel: "no risk" },
      packageReliability: { score: 6, riskLevel: "low" },
      behavioralIntegrity: { score: 7, riskLevel: "low" },
    },
  },
  {
    id: "ts-12",
    name: "Log4j",
    type: "library",
    version: "2.15.0",
    logo: "📋",
    isEOL: false,
    isUpgradable: true,
    secureVersion: "2.20.0",
    cves: [
      {
        id: "CVE-2021-45046",
        severity: "critical",
        title: "Log4j Bypass",
        score: 9.8,
      },
      {
        id: "CVE-2021-45105",
        severity: "high",
        title: "Log4j DoS",
        score: 7.5,
      },
    ],
    unscannedThreatsCount: 6,
    riskLevel: "critical",
    riskScore: 8.9,
    createdAt: new Date("2024-01-18"),
    lastUpdated: new Date("2024-02-07"),
    license: "Apache License 2.0",
    effectiveLicense: "Apache",
    versionHistory: [
      { version: "2.15.0", releaseDate: new Date("2021-12-10"), isEOL: false },
      { version: "2.20.0", releaseDate: new Date("2023-10-20"), isEOL: false },
    ],
    remediations: [
      {
        id: "rem-12",
        title: "Update to 2.20.0",
        description: "Upgrade to patch remaining vulnerabilities",
        priority: "critical",
        estimatedTime: "2-3 hours",
      },
    ],
    reliabilityIndicators: {
      contributorReputation: { score: 10, riskLevel: "no risk" },
      packageReliability: { score: 7, riskLevel: "low" },
      behavioralIntegrity: { score: 8, riskLevel: "low" },
    },
  },
  {
    id: "ts-13",
    name: "Spring Framework",
    type: "framework",
    version: "5.2.0",
    logo: "🍃",
    isEOL: true,
    isUpgradable: true,
    secureVersion: "6.1.0",
    cves: [
      {
        id: "CVE-2022-22965",
        severity: "critical",
        title: "Spring4Shell RCE",
        score: 9.8,
      },
      {
        id: "CVE-2022-22963",
        severity: "high",
        title: "Spring Cloud Function Expression Injection",
        score: 8.1,
      },
    ],
    unscannedThreatsCount: 5,
    riskLevel: "critical",
    riskScore: 9.2,
    createdAt: new Date("2024-01-12"),
    lastUpdated: new Date("2024-02-06"),
    license: "Apache License 2.0",
    effectiveLicense: "Apache",
    versionHistory: [
      { version: "5.2.0", releaseDate: new Date("2019-09-30"), isEOL: true },
      { version: "6.1.0", releaseDate: new Date("2024-01-01"), isEOL: false },
    ],
    remediations: [
      {
        id: "rem-13",
        title: "Upgrade to Spring 6.1",
        description: "Major version upgrade required to fix critical RCE",
        priority: "critical",
        estimatedTime: "16-24 hours",
      },
    ],
    reliabilityIndicators: {
      contributorReputation: { score: 10, riskLevel: "no risk" },
      packageReliability: { score: 9, riskLevel: "no risk" },
      behavioralIntegrity: { score: 9, riskLevel: "no risk" },
    },
  },
  {
    id: "ts-14",
    name: "Spring Framework",
    type: "framework",
    version: "6.0.0",
    logo: "🍃",
    isEOL: false,
    isUpgradable: true,
    secureVersion: "6.1.0",
    cves: [
      {
        id: "CVE-2023-34035",
        severity: "high",
        title: "Spring Security OAuth2 Token Validation",
        score: 7.5,
      },
    ],
    unscannedThreatsCount: 4,
    riskLevel: "high",
    riskScore: 7.5,
    createdAt: new Date("2024-01-08"),
    lastUpdated: new Date("2024-02-05"),
    license: "Apache License 2.0",
    effectiveLicense: "Apache",
    versionHistory: [
      { version: "6.0.0", releaseDate: new Date("2023-09-30"), isEOL: false },
      { version: "6.1.0", releaseDate: new Date("2024-01-01"), isEOL: false },
    ],
    remediations: [
      {
        id: "rem-14",
        title: "Update to Spring 6.1.0",
        description: "Update to fix OAuth2 token validation issue",
        priority: "high",
        estimatedTime: "4-6 hours",
      },
    ],
    reliabilityIndicators: {
      contributorReputation: { score: 10, riskLevel: "no risk" },
      packageReliability: { score: 9, riskLevel: "no risk" },
      behavioralIntegrity: { score: 9, riskLevel: "no risk" },
    },
  },
  {
    id: "ts-15",
    name: "Nginx",
    type: "framework",
    version: "1.24.0",
    logo: "⚙️",
    isEOL: false,
    isUpgradable: true,
    secureVersion: "1.26.0",
    cves: [
      {
        id: "CVE-2023-44487",
        severity: "high",
        title: "HTTP/2 Rapid Reset Attack",
        score: 7.5,
      },
      {
        id: "CVE-2023-27536",
        severity: "medium",
        title: "Socket Closure DoS",
        score: 5.8,
      },
    ],
    unscannedThreatsCount: 4,
    riskLevel: "high",
    riskScore: 6.8,
    createdAt: new Date("2024-01-10"),
    lastUpdated: new Date("2024-02-12"),
    license: "BSD License",
    effectiveLicense: "BSD 3",
    versionHistory: [
      { version: "1.24.0", releaseDate: new Date("2023-07-01"), isEOL: false },
      { version: "1.26.0", releaseDate: new Date("2024-02-01"), isEOL: false },
    ],
    remediations: [
      {
        id: "rem-15",
        title: "Upgrade to Nginx 1.26.0",
        description: "Fix HTTP/2 vulnerabilities",
        priority: "high",
        estimatedTime: "2-3 hours",
      },
    ],
    reliabilityIndicators: {
      contributorReputation: { score: 10, riskLevel: "no risk" },
      packageReliability: { score: 9, riskLevel: "no risk" },
      behavioralIntegrity: { score: 9, riskLevel: "no risk" },
    },
  },
  {
    id: "ts-16",
    name: "Apache HTTP Server",
    type: "framework",
    version: "2.4.52",
    logo: "🪶",
    isEOL: false,
    isUpgradable: true,
    secureVersion: "2.4.58",
    cves: [
      {
        id: "CVE-2023-38545",
        severity: "critical",
        title: "mod_proxy Overflow",
        score: 9.6,
      },
      {
        id: "CVE-2021-41773",
        severity: "critical",
        title: "Path Traversal RCE",
        score: 9.8,
      },
      {
        id: "CVE-2023-44487",
        severity: "high",
        title: "HTTP/2 Rapid Reset",
        score: 7.5,
      },
    ],
    unscannedThreatsCount: 5,
    riskLevel: "critical",
    riskScore: 8.9,
    createdAt: new Date("2023-12-15"),
    lastUpdated: new Date("2024-02-04"),
    license: "Apache License 2.0",
    effectiveLicense: "Apache",
    versionHistory: [
      { version: "2.4.52", releaseDate: new Date("2022-06-01"), isEOL: false },
      { version: "2.4.58", releaseDate: new Date("2024-01-15"), isEOL: false },
    ],
    remediations: [
      {
        id: "rem-16",
        title: "Critical: Update to 2.4.58",
        description: "Fix critical RCE vulnerabilities",
        priority: "critical",
        estimatedTime: "3-5 hours",
      },
    ],
    reliabilityIndicators: {
      contributorReputation: { score: 10, riskLevel: "no risk" },
      packageReliability: { score: 9, riskLevel: "no risk" },
      behavioralIntegrity: { score: 9, riskLevel: "no risk" },
    },
  },
  {
    id: "ts-17",
    name: "MySQL",
    type: "database",
    version: "5.7.44",
    logo: "🐬",
    isEOL: true,
    isUpgradable: true,
    secureVersion: "8.0.36",
    cves: [
      {
        id: "CVE-2023-21919",
        severity: "high",
        title: "Connectors Authentication Bypass",
        score: 8.1,
      },
      {
        id: "CVE-2023-21977",
        severity: "high",
        title: "Server Denial of Service",
        score: 7.5,
      },
    ],
    unscannedThreatsCount: 6,
    riskLevel: "high",
    riskScore: 7.8,
    createdAt: new Date("2023-11-20"),
    lastUpdated: new Date("2024-02-03"),
    license: "GPL",
    effectiveLicense: "Other",
    versionHistory: [
      { version: "5.7.44", releaseDate: new Date("2023-10-01"), isEOL: true },
      { version: "8.0.36", releaseDate: new Date("2024-01-20"), isEOL: false },
    ],
    remediations: [
      {
        id: "rem-17",
        title: "Migrate to MySQL 8.0",
        description: "EOL version needs immediate upgrade",
        priority: "critical",
        estimatedTime: "8-12 hours",
      },
    ],
    reliabilityIndicators: {
      contributorReputation: { score: 10, riskLevel: "no risk" },
      packageReliability: { score: 8, riskLevel: "low" },
      behavioralIntegrity: { score: 8, riskLevel: "low" },
    },
  },
  {
    id: "ts-18",
    name: "AWS SDK for Python (boto3)",
    type: "library",
    version: "1.26.0",
    logo: "☁️",
    isEOL: false,
    isUpgradable: true,
    secureVersion: "1.34.0",
    cves: [
      {
        id: "CVE-2023-49088",
        severity: "medium",
        title: "Credential Exposure in Logs",
        score: 6.2,
      },
    ],
    unscannedThreatsCount: 3,
    riskLevel: "medium",
    riskScore: 5.5,
    createdAt: new Date("2024-01-05"),
    lastUpdated: new Date("2024-02-14"),
    license: "Apache License 2.0",
    effectiveLicense: "Apache",
    versionHistory: [
      { version: "1.26.0", releaseDate: new Date("2023-09-01"), isEOL: false },
      { version: "1.34.0", releaseDate: new Date("2024-02-10"), isEOL: false },
    ],
    remediations: [
      {
        id: "rem-18",
        title: "Update boto3",
        description: "Address credential exposure issues",
        priority: "medium",
        estimatedTime: "2-3 hours",
      },
    ],
    reliabilityIndicators: {
      contributorReputation: { score: 10, riskLevel: "no risk" },
      packageReliability: { score: 9, riskLevel: "no risk" },
      behavioralIntegrity: { score: 9, riskLevel: "no risk" },
    },
  },
  {
    id: "ts-19",
    name: "OpenSSL",
    type: "library",
    version: "1.1.1k",
    logo: "🔒",
    isEOL: true,
    isUpgradable: true,
    secureVersion: "3.0.13",
    cves: [
      {
        id: "CVE-2023-5678",
        severity: "high",
        title: "Poly1305 MAC Timing Attack",
        score: 7.5,
      },
      {
        id: "CVE-2023-2975",
        severity: "medium",
        title: "Denial of Service",
        score: 5.3,
      },
    ],
    unscannedThreatsCount: 5,
    riskLevel: "high",
    riskScore: 7.2,
    createdAt: new Date("2023-10-01"),
    lastUpdated: new Date("2024-02-01"),
    license: "Apache License 2.0",
    effectiveLicense: "Apache",
    versionHistory: [
      { version: "1.1.1k", releaseDate: new Date("2021-05-01"), isEOL: true },
      { version: "3.0.13", releaseDate: new Date("2024-01-30"), isEOL: false },
    ],
    remediations: [
      {
        id: "rem-19",
        title: "Upgrade OpenSSL to 3.x",
        description: "EOL version with multiple vulnerabilities",
        priority: "critical",
        estimatedTime: "4-6 hours",
      },
    ],
    reliabilityIndicators: {
      contributorReputation: { score: 10, riskLevel: "no risk" },
      packageReliability: { score: 9, riskLevel: "no risk" },
      behavioralIntegrity: { score: 9, riskLevel: "no risk" },
    },
  },
  {
    id: "ts-20",
    name: "Redis",
    type: "database",
    version: "6.2.11",
    logo: "💾",
    isEOL: false,
    isUpgradable: true,
    secureVersion: "7.2.0",
    cves: [
      {
        id: "CVE-2023-41053",
        severity: "high",
        title: "Key Expiration Race Condition",
        score: 8.1,
      },
    ],
    unscannedThreatsCount: 2,
    riskLevel: "high",
    riskScore: 6.5,
    createdAt: new Date("2024-01-12"),
    lastUpdated: new Date("2024-02-13"),
    license: "BSD License",
    effectiveLicense: "BSD 3",
    versionHistory: [
      { version: "6.2.11", releaseDate: new Date("2023-08-01"), isEOL: false },
      { version: "7.2.0", releaseDate: new Date("2024-02-05"), isEOL: false },
    ],
    remediations: [
      {
        id: "rem-20",
        title: "Update to Redis 7.2",
        description: "Fix race condition vulnerability",
        priority: "high",
        estimatedTime: "2-4 hours",
      },
    ],
    reliabilityIndicators: {
      contributorReputation: { score: 10, riskLevel: "no risk" },
      packageReliability: { score: 9, riskLevel: "no risk" },
      behavioralIntegrity: { score: 9, riskLevel: "no risk" },
    },
  },
  {
    id: "ts-21",
    name: "containerd",
    type: "devops",
    version: "1.7.0",
    logo: "📦",
    isEOL: false,
    isUpgradable: true,
    secureVersion: "1.7.8",
    cves: [
      {
        id: "CVE-2023-47108",
        severity: "high",
        title: "Privileged Container Escape",
        score: 8.8,
      },
    ],
    unscannedThreatsCount: 3,
    riskLevel: "high",
    riskScore: 7.4,
    createdAt: new Date("2024-01-08"),
    lastUpdated: new Date("2024-02-11"),
    license: "Apache License 2.0",
    effectiveLicense: "Apache",
    versionHistory: [
      { version: "1.7.0", releaseDate: new Date("2023-09-15"), isEOL: false },
      { version: "1.7.8", releaseDate: new Date("2024-02-15"), isEOL: false },
    ],
    remediations: [
      {
        id: "rem-21",
        title: "Update containerd to 1.7.8",
        description: "Fix container escape vulnerability",
        priority: "critical",
        estimatedTime: "3-4 hours",
      },
    ],
    reliabilityIndicators: {
      contributorReputation: { score: 10, riskLevel: "no risk" },
      packageReliability: { score: 9, riskLevel: "no risk" },
      behavioralIntegrity: { score: 9, riskLevel: "no risk" },
    },
  },
  {
    id: "ts-22",
    name: "curl",
    type: "library",
    version: "7.88.1",
    logo: "📡",
    isEOL: false,
    isUpgradable: true,
    secureVersion: "8.5.0",
    cves: [
      {
        id: "CVE-2023-38546",
        severity: "critical",
        title: "Buffer Overflow in HTTPS Proxy",
        score: 9.8,
      },
      {
        id: "CVE-2023-38545",
        severity: "critical",
        title: "SOCKS5 Buffer Overflow",
        score: 9.6,
      },
    ],
    unscannedThreatsCount: 4,
    riskLevel: "critical",
    riskScore: 9.5,
    createdAt: new Date("2023-12-10"),
    lastUpdated: new Date("2024-02-10"),
    license: "MIT",
    effectiveLicense: "MIT",
    versionHistory: [
      { version: "7.88.1", releaseDate: new Date("2023-03-01"), isEOL: false },
      { version: "8.5.0", releaseDate: new Date("2024-01-25"), isEOL: false },
    ],
    remediations: [
      {
        id: "rem-22",
        title: "Critical: Update curl to 8.5.0",
        description: "Critical buffer overflow vulnerabilities",
        priority: "critical",
        estimatedTime: "1-2 hours",
      },
    ],
    reliabilityIndicators: {
      contributorReputation: { score: 10, riskLevel: "no risk" },
      packageReliability: { score: 9, riskLevel: "no risk" },
      behavioralIntegrity: { score: 9, riskLevel: "no risk" },
    },
  },
  {
    id: "ts-23",
    name: "Tomcat",
    type: "framework",
    version: "9.0.70",
    logo: "🍅",
    isEOL: false,
    isUpgradable: true,
    secureVersion: "10.1.19",
    cves: [
      {
        id: "CVE-2023-45648",
        severity: "high",
        title: "Open Redirect",
        score: 7.2,
      },
      {
        id: "CVE-2021-50129",
        severity: "high",
        title: "Partial Directory Disclosure",
        score: 7.5,
      },
    ],
    unscannedThreatsCount: 3,
    riskLevel: "high",
    riskScore: 6.8,
    createdAt: new Date("2024-01-15"),
    lastUpdated: new Date("2024-02-09"),
    license: "Apache License 2.0",
    effectiveLicense: "Apache",
    versionHistory: [
      { version: "9.0.70", releaseDate: new Date("2023-10-01"), isEOL: false },
      { version: "10.1.19", releaseDate: new Date("2024-02-01"), isEOL: false },
    ],
    remediations: [
      {
        id: "rem-23",
        title: "Update Tomcat to 10.1.19",
        description: "Fix open redirect and disclosure issues",
        priority: "high",
        estimatedTime: "3-4 hours",
      },
    ],
    reliabilityIndicators: {
      contributorReputation: { score: 9, riskLevel: "no risk" },
      packageReliability: { score: 8, riskLevel: "low" },
      behavioralIntegrity: { score: 8, riskLevel: "low" },
    },
  },
  {
    id: "ts-24",
    name: "Swagger Doc",
    type: "devops",
    version: "3.0.3",
    logo: "📄",
    isEOL: false,
    isUpgradable: true,
    secureVersion: "3.1.0",
    cves: [
      {
        id: "CVE-2023-41081",
        severity: "medium",
        title: "Swagger UI XSS Vulnerability",
        score: 6.1,
      },
      {
        id: "CVE-2022-21705",
        severity: "low",
        title: "Swagger Parser DoS",
        score: 4.3,
      },
    ],
    unscannedThreatsCount: 2,
    riskLevel: "medium",
    riskScore: 5.2,
    createdAt: new Date("2024-01-22"),
    lastUpdated: new Date("2024-02-12"),
    license: "Apache License 2.0",
    effectiveLicense: "Apache",
    versionHistory: [
      { version: "3.0.3", releaseDate: new Date("2023-11-01"), isEOL: false },
      { version: "3.1.0", releaseDate: new Date("2024-02-15"), isEOL: false },
    ],
    remediations: [
      {
        id: "rem-24",
        title: "Update Swagger to 3.1.0",
        description: "Fix XSS vulnerability in Swagger UI",
        priority: "medium",
        estimatedTime: "2-3 hours",
      },
      {
        id: "rem-25",
        title: "Upgrade OpenAPI specification",
        description: "Align with latest OpenAPI standards",
        priority: "medium",
        estimatedTime: "4-6 hours",
      },
    ],
    reliabilityIndicators: {
      contributorReputation: { score: 9, riskLevel: "no risk" },
      packageReliability: { score: 8, riskLevel: "low" },
      behavioralIntegrity: { score: 8, riskLevel: "low" },
    },
  },
  {
    id: "ts-25",
    name: "Amazon S3 Bucket",
    type: "devops",
    version: "N/A",
    logo: "🪣",
    isEOL: false,
    isUpgradable: false,
    cves: [],
    unscannedThreatsCount: 1,
    riskLevel: "high",
    riskScore: 7.0,
    createdAt: new Date("2023-08-10"),
    lastUpdated: new Date("2026-01-27"),
    license: "AWS Proprietary",
    effectiveLicense: "Other",
    versionHistory: [
      {
        version: "N/A",
        releaseDate: new Date("2006-03-14"),
        isEOL: false,
      },
    ],
    remediations: [
      {
        id: "rem-25-s3",
        title: "Restrict S3 Bucket Access",
        description:
          "Configure bucket policies and ACLs to restrict public read access. Enable Block Public Access settings.",
        priority: "critical",
        estimatedTime: "1-2 hours",
      },
      {
        id: "rem-26-s3",
        title: "Enable S3 Bucket Encryption",
        description:
          "Enable server-side encryption and configure encryption keys",
        priority: "high",
        estimatedTime: "2-3 hours",
      },
      {
        id: "rem-27-s3",
        title: "Enable S3 Bucket Versioning & MFA Delete",
        description: "Protect against accidental or malicious deletion",
        priority: "high",
        estimatedTime: "1 hour",
      },
    ],
    reliabilityIndicators: {
      contributorReputation: { score: 10, riskLevel: "no risk" },
      packageReliability: { score: 10, riskLevel: "no risk" },
      behavioralIntegrity: { score: 10, riskLevel: "no risk" },
    },
  },
  {
    id: "ts-26",
    name: "Apache Log4j",
    type: "library",
    version: "2.14.1",
    logo: "📋",
    isEOL: true,
    isUpgradable: true,
    secureVersion: "2.20.0",
    cves: [
      {
        id: "CVE-2021-44228",
        severity: "critical",
        title: "Log4j Remote Code Execution",
        score: 10.0,
      },
    ],
    unscannedThreatsCount: 0,
    riskLevel: "critical",
    riskScore: 10.0,
    createdAt: new Date("2024-01-20"),
    lastUpdated: new Date("2024-02-18"),
    license: "Apache License 2.0",
    effectiveLicense: "Apache",
    versionHistory: [
      { version: "2.14.1", releaseDate: new Date("2021-12-10"), isEOL: true },
      { version: "2.20.0", releaseDate: new Date("2023-10-20"), isEOL: false },
    ],
    remediations: [
      {
        id: "rem-26-log4j",
        title: "CRITICAL: Immediate Upgrade Required",
        description:
          "Upgrade Apache Log4j to version 2.20.0 or later immediately. CVE-2021-44228 is an actively exploited RCE vulnerability.",
        priority: "critical",
        estimatedTime: "1-2 hours",
      },
      {
        id: "rem-27-log4j",
        title: "Disable JNDI in Java Runtime",
        description:
          "As a temporary mitigation, disable JNDI lookups by setting com.sun.jndi.ldap.connect.pool=false",
        priority: "critical",
        estimatedTime: "15 minutes",
      },
    ],
    reliabilityIndicators: {
      contributorReputation: { score: 10, riskLevel: "no risk" },
      packageReliability: { score: 3, riskLevel: "critical" },
      behavioralIntegrity: { score: 2, riskLevel: "critical" },
    },
    associatedComponents: [
      {
        component_name: "Spring Boot",
        component_version: "2.5.4",
        component_type: "Framework",
        directly_vulnerable: false,
        inherited_risk: true,
        risk_reason: "Bundles vulnerable Log4j version internally",
        dependency_depth: 1,
      },
      {
        component_name: "Apache Tomcat",
        component_version: "9.0.52",
        component_type: "Runtime",
        directly_vulnerable: false,
        inherited_risk: true,
        risk_reason: "Executes applications using Log4j logging pipeline",
        dependency_depth: 2,
      },
      {
        component_name: "Java JDK",
        component_version: "11.0.12",
        component_type: "Runtime",
        directly_vulnerable: false,
        inherited_risk: true,
        risk_reason: "JNDI LDAP lookups enabled, enabling exploit chain",
        dependency_depth: 3,
      },
      {
        component_name: "AWS EC2",
        component_version: "Amazon Linux 2",
        component_type: "Infrastructure",
        directly_vulnerable: false,
        inherited_risk: true,
        risk_reason: "Hosts exploited Java service allowing attacker OS access",
        dependency_depth: 4,
      },
    ],
    impactContext: {
      execution_context: "Docker Container",
      privilege_level: "Root",
      exposure_surface: "Internet-facing",
      blast_radius: "Entire Cloud Account",
      lateral_movement_possible: true,
    },
  },
  // ===== AI TECH STACKS =====
  {
    id: "ts-27",
    name: "Python",
    type: "language",
    version: "3.8",
    logo: "🐍",
    isEOL: true,
    isUpgradable: true,
    secureVersion: "3.11",
    cves: [
      {
        id: "CVE-2023-24329",
        severity: "high",
        title: "Python Regex DoS",
        score: 7.5,
      },
    ],
    unscannedThreatsCount: 2,
    riskLevel: "high",
    riskScore: 7.2,
    createdAt: new Date("2024-02-01"),
    lastUpdated: new Date("2024-02-18"),
    license: "Python Software Foundation",
    effectiveLicense: "Other",
    versionHistory: [
      { version: "3.8", releaseDate: new Date("2019-10-14"), isEOL: true },
      { version: "3.11", releaseDate: new Date("2022-10-24"), isEOL: false },
    ],
    remediations: [
      {
        id: "rem-ai-python",
        title: "Upgrade to Python 3.11",
        description: "Python 3.8 has reached end-of-life. Upgrade to 3.11 for security patches.",
        priority: "high",
        estimatedTime: "6-12 hours",
      },
    ],
    reliabilityIndicators: {
      contributorReputation: { score: 10, riskLevel: "no risk" },
      packageReliability: { score: 9, riskLevel: "no risk" },
      behavioralIntegrity: { score: 10, riskLevel: "no risk" },
    },
  },
  {
    id: "ts-28",
    name: "PyTorch",
    type: "library",
    version: "1.13.0",
    logo: "🔥",
    isEOL: false,
    isUpgradable: true,
    secureVersion: "2.1.0",
    cves: [
      {
        id: "CVE-2023-43654",
        severity: "high",
        title: "PyTorch Arbitrary Code Execution",
        score: 8.6,
      },
    ],
    unscannedThreatsCount: 1,
    riskLevel: "high",
    riskScore: 7.8,
    createdAt: new Date("2023-12-15"),
    lastUpdated: new Date("2024-02-18"),
    license: "BSD",
    effectiveLicense: "BSD 3",
    versionHistory: [
      { version: "1.13.0", releaseDate: new Date("2023-01-10"), isEOL: false },
      { version: "2.0.0", releaseDate: new Date("2023-03-14"), isEOL: false },
      { version: "2.1.0", releaseDate: new Date("2023-09-20"), isEOL: false },
    ],
    remediations: [
      {
        id: "rem-ai-pytorch",
        title: "Update to PyTorch 2.1.0",
        description: "Address CVE-2023-43654 by upgrading to the latest stable version.",
        priority: "high",
        estimatedTime: "2-4 hours",
      },
    ],
    reliabilityIndicators: {
      contributorReputation: { score: 10, riskLevel: "no risk" },
      packageReliability: { score: 8, riskLevel: "low" },
      behavioralIntegrity: { score: 9, riskLevel: "no risk" },
    },
  },
  {
    id: "ts-29",
    name: "NVIDIA CUDA Toolkit",
    type: "devops",
    version: "11.0",
    logo: "⚡",
    isEOL: true,
    isUpgradable: true,
    secureVersion: "12.2",
    cves: [
      {
        id: "CVE-2024-0050",
        severity: "high",
        title: "CUDA Toolkit Privilege Escalation",
        score: 8.1,
      },
    ],
    unscannedThreatsCount: 3,
    riskLevel: "high",
    riskScore: 7.6,
    createdAt: new Date("2023-11-20"),
    lastUpdated: new Date("2024-02-18"),
    license: "NVIDIA Proprietary",
    effectiveLicense: "Other",
    versionHistory: [
      { version: "11.0", releaseDate: new Date("2021-06-28"), isEOL: true },
      { version: "12.0", releaseDate: new Date("2023-01-10"), isEOL: false },
      { version: "12.2", releaseDate: new Date("2023-10-31"), isEOL: false },
    ],
    remediations: [
      {
        id: "rem-ai-cuda",
        title: "Update CUDA Toolkit to 12.2",
        description: "Migrate from unsupported CUDA 11.0 to 12.2 for security and performance.",
        priority: "high",
        estimatedTime: "4-8 hours",
      },
    ],
    reliabilityIndicators: {
      contributorReputation: { score: 10, riskLevel: "no risk" },
      packageReliability: { score: 8, riskLevel: "low" },
      behavioralIntegrity: { score: 8, riskLevel: "low" },
    },
  },
  {
    id: "ts-30",
    name: "Kubernetes",
    type: "devops",
    version: "1.24.0",
    logo: "☸️",
    isEOL: false,
    isUpgradable: true,
    secureVersion: "1.29.0",
    cves: [
      {
        id: "CVE-2023-2728",
        severity: "high",
        title: "Kubernetes API Server Bypass",
        score: 8.8,
      },
    ],
    unscannedThreatsCount: 2,
    riskLevel: "high",
    riskScore: 7.5,
    createdAt: new Date("2024-01-10"),
    lastUpdated: new Date("2024-02-18"),
    license: "Apache License 2.0",
    effectiveLicense: "Apache",
    versionHistory: [
      { version: "1.24.0", releaseDate: new Date("2022-05-03"), isEOL: false },
      { version: "1.28.0", releaseDate: new Date("2023-08-30"), isEOL: false },
      { version: "1.29.0", releaseDate: new Date("2023-12-13"), isEOL: false },
    ],
    remediations: [
      {
        id: "rem-ai-k8s",
        title: "Update Kubernetes to 1.29.0",
        description: "Fix CVE-2023-2728 and improve cluster security posture.",
        priority: "high",
        estimatedTime: "8-16 hours",
      },
    ],
    reliabilityIndicators: {
      contributorReputation: { score: 10, riskLevel: "no risk" },
      packageReliability: { score: 9, riskLevel: "no risk" },
      behavioralIntegrity: { score: 9, riskLevel: "no risk" },
    },
  },
  {
    id: "ts-31",
    name: "Ubuntu OS",
    type: "devops",
    version: "20.04",
    logo: "🐧",
    isEOL: false,
    isUpgradable: true,
    secureVersion: "22.04",
    cves: [
      {
        id: "CVE-2023-38408",
        severity: "high",
        title: "SSH Agent RCE",
        score: 8.2,
      },
    ],
    unscannedThreatsCount: 4,
    riskLevel: "high",
    riskScore: 7.4,
    createdAt: new Date("2024-01-15"),
    lastUpdated: new Date("2024-02-18"),
    license: "LGPL/Ubuntu License",
    effectiveLicense: "LGPL",
    versionHistory: [
      { version: "20.04", releaseDate: new Date("2020-04-23"), isEOL: false },
      { version: "22.04", releaseDate: new Date("2022-04-21"), isEOL: false },
    ],
    remediations: [
      {
        id: "rem-ai-ubuntu",
        title: "Upgrade to Ubuntu 22.04 LTS",
        description: "Address SSH and system-level vulnerabilities.",
        priority: "high",
        estimatedTime: "2-4 hours",
      },
    ],
    reliabilityIndicators: {
      contributorReputation: { score: 10, riskLevel: "no risk" },
      packageReliability: { score: 9, riskLevel: "no risk" },
      behavioralIntegrity: { score: 9, riskLevel: "no risk" },
    },
  },
  {
    id: "ts-32",
    name: "Hugging Face Transformers",
    type: "framework",
    version: "4.36.0",
    logo: "🤗",
    isEOL: false,
    isUpgradable: false,
    cves: [],
    unscannedThreatsCount: 0,
    riskLevel: "low",
    riskScore: 2.1,
    createdAt: new Date("2024-02-01"),
    lastUpdated: new Date("2024-02-18"),
    license: "Apache License 2.0",
    effectiveLicense: "Apache",
    versionHistory: [
      { version: "4.30.0", releaseDate: new Date("2023-07-01"), isEOL: false },
      { version: "4.36.0", releaseDate: new Date("2024-01-20"), isEOL: false },
    ],
    remediations: [],
    reliabilityIndicators: {
      contributorReputation: { score: 10, riskLevel: "no risk" },
      packageReliability: { score: 9, riskLevel: "no risk" },
      behavioralIntegrity: { score: 9, riskLevel: "no risk" },
    },
  },
  {
    id: "ts-33",
    name: "LangChain",
    type: "framework",
    version: "0.1.0",
    logo: "⛓️",
    isEOL: false,
    isUpgradable: true,
    secureVersion: "0.1.5",
    cves: [],
    unscannedThreatsCount: 1,
    riskLevel: "medium",
    riskScore: 4.2,
    createdAt: new Date("2024-01-25"),
    lastUpdated: new Date("2024-02-18"),
    license: "MIT",
    effectiveLicense: "MIT",
    versionHistory: [
      { version: "0.0.200", releaseDate: new Date("2023-06-01"), isEOL: true },
      { version: "0.1.0", releaseDate: new Date("2024-01-10"), isEOL: false },
      { version: "0.1.5", releaseDate: new Date("2024-02-15"), isEOL: false },
    ],
    remediations: [
      {
        id: "rem-ai-langchain",
        title: "Update LangChain to latest",
        description: "Ensure compatibility with latest API changes and security improvements.",
        priority: "medium",
        estimatedTime: "1-2 hours",
      },
    ],
    reliabilityIndicators: {
      contributorReputation: { score: 10, riskLevel: "no risk" },
      packageReliability: { score: 7, riskLevel: "low" },
      behavioralIntegrity: { score: 8, riskLevel: "low" },
    },
  },
  {
    id: "ts-34",
    name: "vLLM",
    type: "framework",
    version: "0.2.0",
    logo: "⚙️",
    isEOL: false,
    isUpgradable: false,
    cves: [],
    unscannedThreatsCount: 0,
    riskLevel: "low",
    riskScore: 1.5,
    createdAt: new Date("2024-02-05"),
    lastUpdated: new Date("2024-02-18"),
    license: "Apache License 2.0",
    effectiveLicense: "Apache",
    versionHistory: [
      { version: "0.1.0", releaseDate: new Date("2023-08-01"), isEOL: false },
      { version: "0.2.0", releaseDate: new Date("2024-01-15"), isEOL: false },
    ],
    remediations: [],
    reliabilityIndicators: {
      contributorReputation: { score: 10, riskLevel: "no risk" },
      packageReliability: { score: 8, riskLevel: "low" },
      behavioralIntegrity: { score: 8, riskLevel: "low" },
    },
  },
  {
    id: "ts-35",
    name: "FAISS Vector DB",
    type: "database",
    version: "1.7.4",
    logo: "📊",
    isEOL: false,
    isUpgradable: true,
    secureVersion: "1.8.0",
    cves: [],
    unscannedThreatsCount: 1,
    riskLevel: "low",
    riskScore: 1.8,
    createdAt: new Date("2024-01-20"),
    lastUpdated: new Date("2024-02-18"),
    license: "MIT",
    effectiveLicense: "MIT",
    versionHistory: [
      { version: "1.7.0", releaseDate: new Date("2022-10-01"), isEOL: false },
      { version: "1.7.4", releaseDate: new Date("2023-06-15"), isEOL: false },
      { version: "1.8.0", releaseDate: new Date("2024-01-10"), isEOL: false },
    ],
    remediations: [
      {
        id: "rem-ai-faiss",
        title: "Update FAISS to 1.8.0",
        description: "Get latest performance improvements and bug fixes.",
        priority: "low",
        estimatedTime: "1-2 hours",
      },
    ],
    reliabilityIndicators: {
      contributorReputation: { score: 10, riskLevel: "no risk" },
      packageReliability: { score: 8, riskLevel: "low" },
      behavioralIntegrity: { score: 8, riskLevel: "low" },
    },
  },
];

// Common CVEs for reference
const commonCVEsExpanded: Record<string, CVE[]> = {
  Nginx: commonCVEs["Nginx"] || [],
  Apache: commonCVEs["Apache"] || [],
  MySQL: commonCVEs["MySQL"] || [],
};

const assetDatabase: Asset[] = [
  {
    id: "asset-ai-1",
    name: "AI Model Inference API",
    type: "app",
    riskLevel: "high",
    techStacks: [
      techStackDatabase[32], // Hugging Face Transformers
      techStackDatabase[28], // PyTorch
      techStackDatabase[27], // Python
      techStackDatabase[29], // CUDA
    ],
    cveCount: 3,
    topCriticalCVE: techStackDatabase[28].cves[0],
    lastUpdated: new Date("2024-02-18"),
    isScanned: true,
  },
  {
    id: "asset-ai-2",
    name: "AI-powered Chat Application",
    type: "app",
    riskLevel: "medium",
    techStacks: [
      techStackDatabase[33], // LangChain
      techStackDatabase[35], // FAISS
      techStackDatabase[27], // Python
      techStackDatabase[30], // Kubernetes
    ],
    cveCount: 3,
    topCriticalCVE: techStackDatabase[30].cves[0],
    lastUpdated: new Date("2024-02-18"),
    isScanned: true,
  },
  {
    id: "asset-ai-3",
    name: "Internal LLM Service",
    type: "app",
    riskLevel: "high",
    techStacks: [
      techStackDatabase[34], // vLLM
      techStackDatabase[28], // PyTorch
      techStackDatabase[27], // Python
      techStackDatabase[30], // Kubernetes
      techStackDatabase[31], // Ubuntu OS
    ],
    cveCount: 5,
    topCriticalCVE: techStackDatabase[30].cves[0],
    lastUpdated: new Date("2024-02-18"),
    isScanned: true,
  },
  {
    id: "asset-1",
    name: "prod-web-server-01",
    type: "ip",
    riskLevel: "critical",
    techStacks: [
      techStackDatabase[0],
      techStackDatabase[1],
      techStackDatabase[10],
      techStackDatabase[11],
      techStackDatabase[13],
      techStackDatabase[4],
      techStackDatabase[6],
    ],
    cveCount: 8,
    topCriticalCVE: techStackDatabase[0].cves[0],
    lastUpdated: new Date("2024-02-15"),
    isScanned: true,
  },
  {
    id: "asset-2",
    name: "api.example.com",
    type: "domain",
    riskLevel: "high",
    techStacks: [
      techStackDatabase[3],
      techStackDatabase[6],
      techStackDatabase[5],
      techStackDatabase[23], // Swagger Doc added
    ],
    cveCount: 5,
    topCriticalCVE: techStackDatabase[3].cves[0],
    lastUpdated: new Date("2024-02-14"),
    isScanned: true,
  },
  {
    id: "asset-3",
    name: "frontend-app",
    type: "app",
    riskLevel: "low",
    techStacks: [
      techStackDatabase[2],
      techStackDatabase[7],
      techStackDatabase[8],
    ],
    cveCount: 0,
    lastUpdated: new Date("2024-02-13"),
    isScanned: true,
  },
  {
    id: "asset-4",
    name: "database-cluster",
    type: "cloud-resource",
    riskLevel: "high",
    techStacks: [
      techStackDatabase[4],
      techStackDatabase[9],
      techStackDatabase[8],
    ],
    cveCount: 2,
    topCriticalCVE: techStackDatabase[4].cves[0],
    lastUpdated: new Date("2024-02-12"),
    isScanned: true,
  },
  {
    id: "asset-5",
    name: "legacy-backend",
    type: "app",
    riskLevel: "critical",
    techStacks: [
      techStackDatabase[1],
      techStackDatabase[4],
      techStackDatabase[5],
      techStackDatabase[11],
      techStackDatabase[12],
    ],
    cveCount: 4,
    topCriticalCVE: techStackDatabase[1].cves[0],
    lastUpdated: new Date("2024-02-11"),
    isScanned: true,
  },
  {
    id: "asset-6",
    name: "192.168.1.100",
    type: "ip",
    riskLevel: "medium",
    techStacks: [techStackDatabase[6], techStackDatabase[3]],
    cveCount: 2,
    topCriticalCVE: techStackDatabase[6].cves[0],
    lastUpdated: new Date("2024-02-10"),
    isScanned: false,
  },
  {
    id: "asset-7",
    name: "ec2-prod-web-01",
    type: "cloud-resource",
    riskLevel: "critical",
    techStacks: [
      techStackDatabase[14],
      techStackDatabase[3],
      techStackDatabase[17],
      techStackDatabase[18],
      techStackDatabase[25], // Apache Log4j with CVE-2021-44228
    ],
    cveCount: 6,
    topCriticalCVE: techStackDatabase[25].cves[0],
    lastUpdated: new Date("2024-02-18"),
    isScanned: true,
  },
  {
    id: "asset-8",
    name: "ec2-api-gateway",
    type: "cloud-resource",
    riskLevel: "critical",
    techStacks: [
      techStackDatabase[15],
      techStackDatabase[4],
      techStackDatabase[17],
    ],
    cveCount: 6,
    topCriticalCVE: techStackDatabase[15].cves[0],
    lastUpdated: new Date("2024-02-16"),
    isScanned: true,
  },
  {
    id: "asset-9",
    name: "s3-bucket-data-lake",
    type: "cloud-resource",
    riskLevel: "high",
    techStacks: [techStackDatabase[17], techStackDatabase[18]],
    cveCount: 3,
    lastUpdated: new Date("2024-02-15"),
    isScanned: true,
  },
  {
    id: "asset-10",
    name: "rds-mysql-prod",
    type: "cloud-resource",
    riskLevel: "high",
    techStacks: [techStackDatabase[16]],
    cveCount: 4,
    topCriticalCVE: techStackDatabase[16].cves[0],
    lastUpdated: new Date("2024-02-14"),
    isScanned: true,
  },
  {
    id: "asset-11",
    name: "elasticache-redis-01",
    type: "cloud-resource",
    riskLevel: "high",
    techStacks: [techStackDatabase[19]],
    cveCount: 2,
    topCriticalCVE: techStackDatabase[19].cves[0],
    lastUpdated: new Date("2024-02-13"),
    isScanned: true,
  },
  {
    id: "asset-12",
    name: "eks-cluster-prod",
    type: "cloud-resource",
    riskLevel: "critical",
    techStacks: [
      techStackDatabase[7],
      techStackDatabase[8],
      techStackDatabase[20],
      techStackDatabase[17],
    ],
    cveCount: 5,
    topCriticalCVE: techStackDatabase[20].cves[0],
    lastUpdated: new Date("2024-02-15"),
    isScanned: true,
  },
  {
    id: "asset-13",
    name: "lambda-payment-processor",
    type: "app",
    riskLevel: "medium",
    techStacks: [techStackDatabase[3], techStackDatabase[17]],
    cveCount: 1,
    lastUpdated: new Date("2024-02-14"),
    isScanned: true,
  },
  {
    id: "asset-14",
    name: "cloudfront-cdn",
    type: "cloud-resource",
    riskLevel: "low",
    techStacks: [techStackDatabase[17]],
    cveCount: 0,
    lastUpdated: new Date("2024-02-16"),
    isScanned: true,
  },
  {
    id: "asset-15",
    name: "web-app-ecommerce",
    type: "app",
    riskLevel: "critical",
    techStacks: [
      techStackDatabase[1],
      techStackDatabase[2],
      techStackDatabase[4],
      techStackDatabase[6],
      techStackDatabase[21],
      techStackDatabase[22],
      techStackDatabase[23], // Swagger Doc added
    ],
    cveCount: 10,
    topCriticalCVE: techStackDatabase[1].cves[0],
    lastUpdated: new Date("2024-02-16"),
    isScanned: true,
  },
  {
    id: "asset-16",
    name: "web-app-admin-panel",
    type: "app",
    riskLevel: "high",
    techStacks: [
      techStackDatabase[5],
      techStackDatabase[3],
      techStackDatabase[13],
      techStackDatabase[15],
      techStackDatabase[16],
    ],
    cveCount: 4,
    topCriticalCVE: techStackDatabase[15].cves[0],
    lastUpdated: new Date("2024-02-15"),
    isScanned: true,
  },
  {
    id: "asset-17",
    name: "mobile-app-ios",
    type: "app",
    riskLevel: "medium",
    techStacks: [
      techStackDatabase[3],
      techStackDatabase[17],
      techStackDatabase[18],
      techStackDatabase[21],
    ],
    cveCount: 2,
    lastUpdated: new Date("2024-02-14"),
    isScanned: false,
  },
  {
    id: "asset-18",
    name: "mobile-app-android",
    type: "app",
    riskLevel: "medium",
    techStacks: [
      techStackDatabase[3],
      techStackDatabase[17],
      techStackDatabase[18],
    ],
    cveCount: 2,
    lastUpdated: new Date("2024-02-14"),
    isScanned: false,
  },
  {
    id: "asset-19",
    name: "api-microservice-users",
    type: "app",
    riskLevel: "high",
    techStacks: [
      techStackDatabase[3],
      techStackDatabase[4],
      techStackDatabase[16],
      techStackDatabase[17],
      techStackDatabase[21],
      techStackDatabase[23], // Swagger Doc added
    ],
    cveCount: 6,
    topCriticalCVE: techStackDatabase[16].cves[0],
    lastUpdated: new Date("2024-02-15"),
    isScanned: true,
  },
  {
    id: "asset-20",
    name: "api-microservice-orders",
    type: "app",
    riskLevel: "high",
    techStacks: [
      techStackDatabase[3],
      techStackDatabase[5],
      techStackDatabase[9],
      techStackDatabase[19],
      techStackDatabase[17],
      techStackDatabase[23], // Swagger Doc added
    ],
    cveCount: 5,
    lastUpdated: new Date("2024-02-15"),
    isScanned: true,
  },
  {
    id: "asset-21",
    name: "web-app-crm-system",
    type: "app",
    riskLevel: "critical",
    techStacks: [
      techStackDatabase[1],
      techStackDatabase[2],
      techStackDatabase[4],
      techStackDatabase[5],
      techStackDatabase[12],
      techStackDatabase[16],
      techStackDatabase[18],
    ],
    cveCount: 7,
    topCriticalCVE: techStackDatabase[15].cves[0],
    lastUpdated: new Date("2024-02-14"),
    isScanned: true,
  },
  {
    id: "asset-22",
    name: "vpn-gateway",
    type: "cloud-resource",
    riskLevel: "high",
    techStacks: [
      techStackDatabase[18],
      techStackDatabase[20],
      techStackDatabase[21],
    ],
    cveCount: 3,
    lastUpdated: new Date("2024-02-13"),
    isScanned: true,
  },
];

export { techStackDatabase, assetDatabase };
