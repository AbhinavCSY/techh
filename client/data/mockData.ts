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
  license: string;
  versionHistory: VersionHistory[];
  remediations: Remediation[];
  reliabilityIndicators: PackageReliabilityIndicators;
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
    license: "Apache License 2.0",
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
    license: "Apache License 2.0",
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
    license: "MIT",
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
    license: "MIT",
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
    license: "PostgreSQL License",
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
    license: "BSD License",
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
    license: "MIT",
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
    license: "Apache License 2.0",
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
    license: "Apache License 2.0",
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
    license: "SSPL/Community",
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
    license: "Apache License 2.0",
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
    license: "Apache License 2.0",
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
    license: "Apache License 2.0",
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
    license: "Apache License 2.0",
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
    license: "BSD License",
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
    license: "Apache License 2.0",
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
    license: "GPL",
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
    license: "Apache License 2.0",
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
    license: "Apache License 2.0",
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
    license: "BSD License",
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
    license: "Apache License 2.0",
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
    license: "MIT",
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
    license: "Apache License 2.0",
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
];

// Common CVEs for reference
const commonCVEsExpanded: Record<string, CVE[]> = {
  Nginx: commonCVEs["Nginx"] || [],
  Apache: commonCVEs["Apache"] || [],
  MySQL: commonCVEs["MySQL"] || [],
};

const assetDatabase: Asset[] = [
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
    ],
    cveCount: 3,
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
    riskLevel: "high",
    techStacks: [
      techStackDatabase[14],
      techStackDatabase[3],
      techStackDatabase[17],
      techStackDatabase[18],
    ],
    cveCount: 5,
    topCriticalCVE: techStackDatabase[14].cves[0],
    lastUpdated: new Date("2024-02-16"),
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
      techStackDatabase[22],
      techStackDatabase[21],
    ],
    cveCount: 8,
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
    ],
    cveCount: 4,
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
      techStackDatabase[19],
      techStackDatabase[17],
    ],
    cveCount: 3,
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
