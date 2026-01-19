export interface CVE {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
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
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedTime: string;
}

export interface PackageReliabilityIndicator {
  score: number;
  riskLevel: 'no risk' | 'low' | 'medium' | 'high' | 'critical';
}

export interface PackageReliabilityIndicators {
  contributorReputation: PackageReliabilityIndicator;
  packageReliability: PackageReliabilityIndicator;
  behavioralIntegrity: PackageReliabilityIndicator;
}

export interface TechStack {
  id: string;
  name: string;
  type: 'framework' | 'language' | 'database' | 'devops' | 'library';
  version: string;
  logo: string;
  isEOL: boolean;
  isUpgradable: boolean;
  secureVersion?: string;
  cves: CVE[];
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
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
  type: 'ip' | 'domain' | 'app' | 'cloud-resource';
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  techStacks: TechStack[];
  cveCount: number;
  topCriticalCVE?: CVE;
  lastUpdated: Date;
  isScanned: boolean;
}

const commonCVEs: Record<string, CVE[]> = {
  'Log4j': [
    { id: 'CVE-2021-44228', severity: 'critical', title: 'Log4j RCE', score: 10.0 },
    { id: 'CVE-2021-45046', severity: 'critical', title: 'Log4j Bypass', score: 9.8 },
  ],
  'Spring Framework': [
    { id: 'CVE-2022-22965', severity: 'critical', title: 'Spring4Shell RCE', score: 9.8 },
  ],
  'React': [
    { id: 'CVE-2020-5902', severity: 'high', title: 'DOM XSS', score: 8.2 },
  ],
  'Node.js': [
    { id: 'CVE-2023-23936', severity: 'high', title: 'HTTP Request Smuggling', score: 8.1 },
  ],
  'PostgreSQL': [
    { id: 'CVE-2022-41862', severity: 'high', title: 'Logical Replication XSS', score: 7.5 },
  ],
  'Django': [
    { id: 'CVE-2023-23969', severity: 'medium', title: 'Regex DoS', score: 5.3 },
  ],
  'Express.js': [
    { id: 'CVE-2022-24999', severity: 'high', title: 'Query Parser DoS', score: 7.5 },
  ],
};

const techStackDatabase: TechStack[] = [
  {
    id: 'ts-1',
    name: 'Log4j',
    type: 'library',
    version: '2.14.1',
    logo: '📋',
    isEOL: false,
    isUpgradable: true,
    secureVersion: '2.20.0',
    cves: commonCVEs['Log4j'],
    riskLevel: 'critical',
    riskScore: 9.2,
    createdAt: new Date('2024-01-15'),
    license: 'Apache License 2.0',
    versionHistory: [
      { version: '2.14.1', releaseDate: new Date('2022-01-15'), isEOL: false },
      { version: '2.17.0', releaseDate: new Date('2021-12-28'), isEOL: false },
      { version: '2.20.0', releaseDate: new Date('2023-10-20'), isEOL: false },
    ],
    remediations: [
      { id: 'rem-1', title: 'Update to 2.20.0', description: 'Upgrade Log4j to the latest stable version', priority: 'critical', estimatedTime: '2-4 hours' },
      { id: 'rem-2', title: 'Implement input validation', description: 'Add strict input validation for all user inputs', priority: 'high', estimatedTime: '4-8 hours' },
    ],
    reliabilityIndicators: {
      contributorReputation: { score: 10, riskLevel: 'no risk' },
      packageReliability: { score: 7, riskLevel: 'low' },
      behavioralIntegrity: { score: 8, riskLevel: 'low' },
    },
  },
  {
    id: 'ts-2',
    name: 'Spring Framework',
    type: 'framework',
    version: '5.3.15',
    logo: '🍃',
    isEOL: true,
    isUpgradable: true,
    secureVersion: '6.1.0',
    cves: commonCVEs['Spring Framework'],
    riskLevel: 'critical',
    riskScore: 9.0,
    createdAt: new Date('2024-01-10'),
    license: 'Apache License 2.0',
    versionHistory: [
      { version: '5.3.15', releaseDate: new Date('2022-12-01'), isEOL: true },
      { version: '6.0.0', releaseDate: new Date('2023-09-30'), isEOL: false },
      { version: '6.1.0', releaseDate: new Date('2024-01-01'), isEOL: false },
    ],
    remediations: [
      { id: 'rem-3', title: 'Upgrade to Spring 6.1', description: 'Migrate from EOL version 5.3 to current 6.1', priority: 'critical', estimatedTime: '8-16 hours' },
    ],
  },
  {
    id: 'ts-3',
    name: 'React',
    type: 'framework',
    version: '18.2.0',
    logo: '⚛️',
    isEOL: false,
    isUpgradable: false,
    cves: commonCVEs['React'],
    riskLevel: 'low',
    riskScore: 3.5,
    createdAt: new Date('2024-02-01'),
    license: 'MIT',
    versionHistory: [
      { version: '18.2.0', releaseDate: new Date('2023-09-15'), isEOL: false },
      { version: '18.3.0', releaseDate: new Date('2024-01-10'), isEOL: false },
    ],
    remediations: [
      { id: 'rem-4', title: 'Minor dependency update', description: 'Update some peer dependencies', priority: 'low', estimatedTime: '1-2 hours' },
    ],
  },
  {
    id: 'ts-4',
    name: 'Node.js',
    type: 'language',
    version: '18.12.0',
    logo: '🟢',
    isEOL: false,
    isUpgradable: true,
    secureVersion: '20.10.0',
    cves: commonCVEs['Node.js'],
    riskLevel: 'high',
    riskScore: 7.8,
    createdAt: new Date('2023-12-20'),
    license: 'MIT',
    versionHistory: [
      { version: '18.12.0', releaseDate: new Date('2023-08-15'), isEOL: false },
      { version: '20.10.0', releaseDate: new Date('2024-01-20'), isEOL: false },
    ],
    remediations: [
      { id: 'rem-5', title: 'Upgrade to Node 20', description: 'Update Node.js to latest LTS', priority: 'high', estimatedTime: '4-6 hours' },
    ],
  },
  {
    id: 'ts-5',
    name: 'PostgreSQL',
    type: 'database',
    version: '13.10',
    logo: '🐘',
    isEOL: true,
    isUpgradable: true,
    secureVersion: '15.3',
    cves: commonCVEs['PostgreSQL'],
    riskLevel: 'high',
    riskScore: 7.5,
    createdAt: new Date('2024-01-05'),
    license: 'PostgreSQL License',
    versionHistory: [
      { version: '13.10', releaseDate: new Date('2023-07-01'), isEOL: true },
      { version: '14.8', releaseDate: new Date('2023-11-15'), isEOL: false },
      { version: '15.3', releaseDate: new Date('2024-02-01'), isEOL: false },
    ],
    remediations: [
      { id: 'rem-6', title: 'Upgrade PostgreSQL to 15.3', description: 'Migrate database from EOL 13.10 to 15.3', priority: 'critical', estimatedTime: '12-20 hours' },
    ],
  },
  {
    id: 'ts-6',
    name: 'Django',
    type: 'framework',
    version: '3.2.18',
    logo: '🎯',
    isEOL: false,
    isUpgradable: true,
    secureVersion: '4.2.0',
    cves: commonCVEs['Django'],
    riskLevel: 'medium',
    riskScore: 5.2,
    createdAt: new Date('2024-01-20'),
    license: 'BSD License',
    versionHistory: [
      { version: '3.2.18', releaseDate: new Date('2023-12-01'), isEOL: false },
      { version: '4.2.0', releaseDate: new Date('2024-02-03'), isEOL: false },
    ],
    remediations: [
      { id: 'rem-7', title: 'Update Django to 4.2', description: 'Upgrade to latest Django version', priority: 'medium', estimatedTime: '6-10 hours' },
    ],
  },
  {
    id: 'ts-7',
    name: 'Express.js',
    type: 'framework',
    version: '4.17.1',
    logo: '🚂',
    isEOL: false,
    isUpgradable: true,
    secureVersion: '4.18.2',
    cves: commonCVEs['Express.js'],
    riskLevel: 'high',
    riskScore: 7.5,
    createdAt: new Date('2024-01-25'),
    license: 'MIT',
    versionHistory: [
      { version: '4.17.1', releaseDate: new Date('2023-09-01'), isEOL: false },
      { version: '4.18.2', releaseDate: new Date('2024-01-15'), isEOL: false },
    ],
    remediations: [
      { id: 'rem-8', title: 'Update Express.js', description: 'Update to Express 4.18.2', priority: 'high', estimatedTime: '2-3 hours' },
    ],
  },
  {
    id: 'ts-8',
    name: 'Docker',
    type: 'devops',
    version: '20.10.12',
    logo: '🐳',
    isEOL: false,
    isUpgradable: true,
    secureVersion: '25.0.0',
    cves: [],
    riskLevel: 'low',
    riskScore: 2.1,
    createdAt: new Date('2024-02-05'),
    license: 'Apache License 2.0',
    versionHistory: [
      { version: '20.10.12', releaseDate: new Date('2023-10-01'), isEOL: false },
      { version: '25.0.0', releaseDate: new Date('2024-02-06'), isEOL: false },
    ],
    remediations: [
      { id: 'rem-9', title: 'Update Docker', description: 'Update Docker daemon to 25.0', priority: 'low', estimatedTime: '1-2 hours' },
    ],
  },
  {
    id: 'ts-9',
    name: 'Kubernetes',
    type: 'devops',
    version: '1.27.0',
    logo: '☸️',
    isEOL: false,
    isUpgradable: false,
    cves: [],
    riskLevel: 'low',
    riskScore: 1.8,
    createdAt: new Date('2024-02-10'),
    license: 'Apache License 2.0',
    versionHistory: [
      { version: '1.27.0', releaseDate: new Date('2023-08-23'), isEOL: false },
    ],
    remediations: [],
  },
  {
    id: 'ts-10',
    name: 'MongoDB',
    type: 'database',
    version: '5.0.10',
    logo: '🍃',
    isEOL: false,
    isUpgradable: true,
    secureVersion: '7.0.0',
    cves: [],
    riskLevel: 'medium',
    riskScore: 4.2,
    createdAt: new Date('2024-01-30'),
    license: 'SSPL/Community',
    versionHistory: [
      { version: '5.0.10', releaseDate: new Date('2023-12-01'), isEOL: false },
      { version: '7.0.0', releaseDate: new Date('2024-02-01'), isEOL: false },
    ],
    remediations: [
      { id: 'rem-10', title: 'Upgrade MongoDB', description: 'Update MongoDB to version 7.0', priority: 'medium', estimatedTime: '4-8 hours' },
    ],
  },
];

const assetDatabase: Asset[] = [
  {
    id: 'asset-1',
    name: 'prod-web-server-01',
    type: 'ip',
    riskLevel: 'critical',
    techStacks: [
      techStackDatabase[0],
      techStackDatabase[1],
      techStackDatabase[4],
      techStackDatabase[6],
    ],
    cveCount: 5,
    topCriticalCVE: techStackDatabase[0].cves[0],
    lastUpdated: new Date('2024-02-15'),
  },
  {
    id: 'asset-2',
    name: 'api.example.com',
    type: 'domain',
    riskLevel: 'high',
    techStacks: [
      techStackDatabase[3],
      techStackDatabase[6],
      techStackDatabase[5],
    ],
    cveCount: 3,
    topCriticalCVE: techStackDatabase[3].cves[0],
    lastUpdated: new Date('2024-02-14'),
  },
  {
    id: 'asset-3',
    name: 'frontend-app',
    type: 'app',
    riskLevel: 'low',
    techStacks: [techStackDatabase[2], techStackDatabase[7], techStackDatabase[8]],
    cveCount: 0,
    lastUpdated: new Date('2024-02-13'),
  },
  {
    id: 'asset-4',
    name: 'database-cluster',
    type: 'cloud-resource',
    riskLevel: 'high',
    techStacks: [
      techStackDatabase[4],
      techStackDatabase[9],
      techStackDatabase[8],
    ],
    cveCount: 2,
    topCriticalCVE: techStackDatabase[4].cves[0],
    lastUpdated: new Date('2024-02-12'),
  },
  {
    id: 'asset-5',
    name: 'legacy-backend',
    type: 'app',
    riskLevel: 'critical',
    techStacks: [
      techStackDatabase[1],
      techStackDatabase[4],
      techStackDatabase[5],
    ],
    cveCount: 4,
    topCriticalCVE: techStackDatabase[1].cves[0],
    lastUpdated: new Date('2024-02-11'),
  },
  {
    id: 'asset-6',
    name: '192.168.1.100',
    type: 'ip',
    riskLevel: 'medium',
    techStacks: [techStackDatabase[6], techStackDatabase[3]],
    cveCount: 2,
    topCriticalCVE: techStackDatabase[6].cves[0],
    lastUpdated: new Date('2024-02-10'),
  },
];

export { techStackDatabase, assetDatabase };
