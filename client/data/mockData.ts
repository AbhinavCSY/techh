export interface CVE {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  score: number;
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
  createdAt: Date;
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
    createdAt: new Date('2024-01-15'),
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
    createdAt: new Date('2024-01-10'),
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
    createdAt: new Date('2024-02-01'),
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
    createdAt: new Date('2023-12-20'),
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
    createdAt: new Date('2024-01-05'),
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
    createdAt: new Date('2024-01-20'),
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
    createdAt: new Date('2024-01-25'),
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
    createdAt: new Date('2024-02-05'),
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
    createdAt: new Date('2024-02-10'),
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
    createdAt: new Date('2024-01-30'),
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
