import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";

interface FlowNode {
  id: string;
  label: string;
  type: "org" | "category" | "tech" | "action" | "detail";
  color: string;
  description: string;
  onClick: string;
  children?: string[];
}

interface DetailModal {
  nodeId: string;
  label: string;
  description: string;
  onClick: string;
}

const TECH_STACK_FLOW: Record<string, FlowNode> = {
  "root": {
    id: "root",
    label: "Tech Stack Inventory",
    type: "org",
    color: "#7f1d1d",
    description: "Main dashboard showing all technology stacks",
    onClick: "Load inventory view with all stacks",
    children: ["category-1", "category-2", "category-3", "category-4", "category-5", "category-6", "category-7", "category-8", "category-9"]
  },

  // Top level categories
  "category-1": {
    id: "category-1",
    label: "Languages",
    type: "category",
    color: "#15803d",
    description: "Programming languages used in infrastructure",
    onClick: "Filter and show all language tech stacks",
    children: ["tech-1", "tech-2", "tech-3"]
  },
  "category-2": {
    id: "category-2",
    label: "Frameworks",
    type: "category",
    color: "#b45309",
    description: "Web and application frameworks",
    onClick: "Filter and show all framework tech stacks",
    children: ["tech-4", "tech-5", "tech-6"]
  },
  "category-3": {
    id: "category-3",
    label: "Databases",
    type: "category",
    color: "#b45309",
    description: "Database technologies",
    onClick: "Filter and show all database tech stacks",
    children: ["tech-7", "tech-8"]
  },
  "category-4": {
    id: "category-4",
    label: "Operating Systems",
    type: "category",
    color: "#9333ea",
    description: "OS and platforms",
    onClick: "Filter and show all OS tech stacks",
    children: ["tech-9", "tech-10"]
  },
  "category-5": {
    id: "category-5",
    label: "Cloud Platforms",
    type: "category",
    color: "#9333ea",
    description: "Cloud infrastructure providers",
    onClick: "Filter and show all cloud tech stacks",
    children: ["tech-11", "tech-12"]
  },
  "category-6": {
    id: "category-6",
    label: "Container Tech",
    type: "category",
    color: "#dc2626",
    description: "Containerization and orchestration",
    onClick: "Filter and show all container tech stacks",
    children: ["tech-13", "tech-14"]
  },
  "category-7": {
    id: "category-7",
    label: "DevOps Tools",
    type: "category",
    color: "#0891b2",
    description: "CI/CD and deployment tools",
    onClick: "Filter and show all DevOps tech stacks",
    children: ["tech-15", "tech-16", "tech-17"]
  },
  "category-8": {
    id: "category-8",
    label: "Monitoring",
    type: "category",
    color: "#92400e",
    description: "Monitoring and logging solutions",
    onClick: "Filter and show all monitoring tech stacks",
    children: ["tech-18", "tech-19"]
  },
  "category-9": {
    id: "category-9",
    label: "Libraries",
    type: "category",
    color: "#1e1b4b",
    description: "Third-party libraries and packages",
    onClick: "Filter and show all library tech stacks",
    children: ["tech-20", "tech-21", "tech-22"]
  },

  // Tech stacks - Languages
  "tech-1": {
    id: "tech-1",
    label: "Java",
    type: "tech",
    color: "#166534",
    description: "Java runtime and JVM",
    onClick: "Show Java version details, vulnerabilities, dependencies",
    children: ["detail-1", "detail-2", "detail-3"]
  },
  "tech-2": {
    id: "tech-2",
    label: "Python",
    type: "tech",
    color: "#166534",
    description: "Python runtime",
    onClick: "Show Python version details, libraries, vulnerabilities",
    children: ["detail-4", "detail-5"]
  },
  "tech-3": {
    id: "tech-3",
    label: "Node.js",
    type: "tech",
    color: "#166534",
    description: "JavaScript runtime",
    onClick: "Show Node.js version, npm packages, vulnerabilities",
    children: ["detail-6", "detail-7", "detail-8"]
  },

  // Tech stacks - Frameworks
  "tech-4": {
    id: "tech-4",
    label: "Spring Boot",
    type: "tech",
    color: "#b45309",
    description: "Java web framework",
    onClick: "Show Spring Boot version, dependencies, security advisories",
    children: ["detail-9"]
  },
  "tech-5": {
    id: "tech-5",
    label: "Express.js",
    type: "tech",
    color: "#b45309",
    description: "Node.js web framework",
    onClick: "Show Express.js version, npm dependencies, CVEs",
    children: ["detail-10"]
  },
  "tech-6": {
    id: "tech-6",
    label: "Django",
    type: "tech",
    color: "#b45309",
    description: "Python web framework",
    onClick: "Show Django version, Python packages, vulnerabilities",
    children: ["detail-11"]
  },

  // Tech stacks - Databases
  "tech-7": {
    id: "tech-7",
    label: "PostgreSQL",
    type: "tech",
    color: "#b45309",
    description: "SQL database",
    onClick: "Show PostgreSQL version, extensions, security settings",
    children: ["detail-12"]
  },
  "tech-8": {
    id: "tech-8",
    label: "MongoDB",
    type: "tech",
    color: "#b45309",
    description: "NoSQL database",
    onClick: "Show MongoDB version, replication config, CVEs",
    children: ["detail-13"]
  },

  // Tech stacks - OS
  "tech-9": {
    id: "tech-9",
    label: "Ubuntu",
    type: "tech",
    color: "#7c2d12",
    description: "Linux distribution",
    onClick: "Show Ubuntu version, patches, installed packages",
    children: ["detail-14"]
  },
  "tech-10": {
    id: "tech-10",
    label: "CentOS",
    type: "tech",
    color: "#7c2d12",
    description: "Enterprise Linux",
    onClick: "Show CentOS version, kernel, security updates",
    children: ["detail-15"]
  },

  // Tech stacks - Cloud
  "tech-11": {
    id: "tech-11",
    label: "AWS",
    type: "tech",
    color: "#6b21a8",
    description: "Amazon Web Services",
    onClick: "Show AWS services, regions, configurations",
    children: ["detail-16"]
  },
  "tech-12": {
    id: "tech-12",
    label: "Azure",
    type: "tech",
    color: "#6b21a8",
    description: "Microsoft Azure",
    onClick: "Show Azure subscriptions, resources, compliance",
    children: ["detail-17"]
  },

  // Tech stacks - Container
  "tech-13": {
    id: "tech-13",
    label: "Docker",
    type: "tech",
    color: "#b91c1c",
    description: "Container platform",
    onClick: "Show Docker version, image vulnerabilities, registry",
    children: ["detail-18"]
  },
  "tech-14": {
    id: "tech-14",
    label: "Kubernetes",
    type: "tech",
    color: "#b91c1c",
    description: "Orchestration platform",
    onClick: "Show K8s version, cluster config, RBAC policies",
    children: ["detail-19"]
  },

  // Tech stacks - DevOps
  "tech-15": {
    id: "tech-15",
    label: "Jenkins",
    type: "tech",
    color: "#0369a1",
    description: "CI/CD automation",
    onClick: "Show Jenkins version, plugins, build pipelines",
    children: ["detail-20"]
  },
  "tech-16": {
    id: "tech-16",
    label: "GitLab CI",
    type: "tech",
    color: "#0369a1",
    description: "GitLab pipelines",
    onClick: "Show GitLab version, CI runners, pipeline config",
    children: ["detail-21"]
  },
  "tech-17": {
    id: "tech-17",
    label: "Terraform",
    type: "tech",
    color: "#0369a1",
    description: "Infrastructure as code",
    onClick: "Show Terraform version, modules, resource count",
    children: ["detail-22"]
  },

  // Tech stacks - Monitoring
  "tech-18": {
    id: "tech-18",
    label: "Prometheus",
    type: "tech",
    color: "#92400e",
    description: "Metrics monitoring",
    onClick: "Show Prometheus version, exporters, retention",
    children: ["detail-23"]
  },
  "tech-19": {
    id: "tech-19",
    label: "ELK Stack",
    type: "tech",
    color: "#92400e",
    description: "Logging and analytics",
    onClick: "Show ELK versions, log sources, indices",
    children: ["detail-24"]
  },

  // Tech stacks - Libraries
  "tech-20": {
    id: "tech-20",
    label: "Log4j",
    type: "tech",
    color: "#1e293b",
    description: "Logging library",
    onClick: "Show Log4j version, CVE status, usage locations",
    children: ["detail-25", "detail-26"]
  },
  "tech-21": {
    id: "tech-21",
    label: "Jackson",
    type: "tech",
    color: "#1e293b",
    description: "JSON processing",
    onClick: "Show Jackson version, dependencies, vulnerabilities",
    children: ["detail-27"]
  },
  "tech-22": {
    id: "tech-22",
    label: "Lodash",
    type: "tech",
    color: "#1e293b",
    description: "Utility library",
    onClick: "Show Lodash version, security patches, usage",
    children: ["detail-28"]
  },

  // Details
  "detail-1": { id: "detail-1", label: "JDK 11.0.15", type: "detail", color: "#166534", description: "Java Development Kit", onClick: "View specific version details and patch status" },
  "detail-2": { id: "detail-2", label: "Security Config", type: "detail", color: "#166534", description: "Security manager settings", onClick: "Review Java security policies" },
  "detail-3": { id: "detail-3", label: "Dependencies", type: "detail", color: "#166534", description: "Dependent libraries", onClick: "Show all Java library dependencies" },
  "detail-4": { id: "detail-4", label: "Python 3.9", type: "detail", color: "#166534", description: "Python runtime", onClick: "View Python version details" },
  "detail-5": { id: "detail-5", label: "Packages", type: "detail", color: "#166534", description: "pip packages", onClick: "Show installed Python packages" },
  "detail-6": { id: "detail-6", label: "Node 16.x", type: "detail", color: "#166534", description: "Node.js version", onClick: "View Node.js runtime details" },
  "detail-7": { id: "detail-7", label: "npm Packages", type: "detail", color: "#166534", description: "npm dependencies", onClick: "Show package.json analysis" },
  "detail-8": { id: "detail-8", label: "Vulns", type: "detail", color: "#166534", description: "Known vulnerabilities", onClick: "Show npm audit vulnerabilities" },
  "detail-9": { id: "detail-9", label: "Dependencies", type: "detail", color: "#b45309", description: "Maven dependencies", onClick: "Show Spring Boot dependency tree" },
  "detail-10": { id: "detail-10", label: "Middleware", type: "detail", color: "#b45309", description: "Express middleware", onClick: "Show middleware security config" },
  "detail-11": { id: "detail-11", label: "Installed Apps", type: "detail", color: "#b45309", description: "Django apps", onClick: "Show Django installed apps" },
  "detail-12": { id: "detail-12", label: "Extensions", type: "detail", color: "#b45309", description: "DB extensions", onClick: "Show PostgreSQL extensions" },
  "detail-13": { id: "detail-13", label: "Sharding", type: "detail", color: "#b45309", description: "Sharding config", onClick: "View MongoDB sharding setup" },
  "detail-14": { id: "detail-14", label: "Kernel Ver", type: "detail", color: "#7c2d12", description: "Kernel version", onClick: "Show kernel security updates" },
  "detail-15": { id: "detail-15", label: "Repos", type: "detail", color: "#7c2d12", description: "Package repositories", onClick: "Show enabled repos and updates" },
  "detail-16": { id: "detail-16", label: "Services", type: "detail", color: "#6b21a8", description: "AWS services", onClick: "List all AWS services in use" },
  "detail-17": { id: "detail-17", label: "Subscriptions", type: "detail", color: "#6b21a8", description: "Azure subs", onClick: "Show Azure subscriptions" },
  "detail-18": { id: "detail-18", label: "Images", type: "detail", color: "#b91c1c", description: "Docker images", onClick: "Scan Docker images for CVEs" },
  "detail-19": { id: "detail-19", label: "Nodes", type: "detail", color: "#b91c1c", description: "K8s nodes", onClick: "Show Kubernetes cluster nodes" },
  "detail-20": { id: "detail-20", label: "Jobs", type: "detail", color: "#0369a1", description: "Jenkins jobs", onClick: "List all Jenkins jobs" },
  "detail-21": { id: "detail-21", label: "Runners", type: "detail", color: "#0369a1", description: "CI runners", onClick: "Show GitLab runner status" },
  "detail-22": { id: "detail-22", label: "State", type: "detail", color: "#0369a1", description: "Terraform state", onClick: "View Terraform managed resources" },
  "detail-23": { id: "detail-23", label: "Targets", type: "detail", color: "#92400e", description: "Scrape targets", onClick: "Show Prometheus targets" },
  "detail-24": { id: "detail-24", label: "Indices", type: "detail", color: "#92400e", description: "ES indices", onClick: "Show Elasticsearch indices" },
  "detail-25": { id: "detail-25", label: "CVE-2021-44228", type: "detail", color: "#1e293b", description: "Critical CVE", onClick: "View CVE details and remediation" },
  "detail-26": { id: "detail-26", label: "Fix Available", type: "detail", color: "#1e293b", description: "Upgrade path", onClick: "Show upgrade recommendations" },
  "detail-27": { id: "detail-27", label: "Jackson Deps", type: "detail", color: "#1e293b", description: "Dependencies", onClick: "Show Jackson dependency chain" },
  "detail-28": { id: "detail-28", label: "Usage", type: "detail", color: "#1e293b", description: "Usage locations", onClick: "Show where Lodash is used" },
};

export default function TechStackFlow() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["root", "category-1", "category-2", "category-3", "category-4", "category-5", "category-6", "category-7", "category-8", "category-9"]));
  const [selectedDetail, setSelectedDetail] = useState<DetailModal | null>(null);

  const toggleExpand = (nodeId: string) => {
    const newSet = new Set(expandedNodes);
    if (newSet.has(nodeId)) {
      newSet.delete(nodeId);
    } else {
      newSet.add(nodeId);
    }
    setExpandedNodes(newSet);
  };

  const renderNode = (nodeId: string, level: number = 0) => {
    const node = TECH_STACK_FLOW[nodeId];
    if (!node) return null;

    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(nodeId);

    return (
      <div key={nodeId} className="flex flex-col">
        {/* Node Box */}
        <div
          className="flex items-center gap-2 mb-2"
          style={{ marginLeft: `${level * 20}px` }}
        >
          {hasChildren && (
            <button
              onClick={() => toggleExpand(nodeId)}
              className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
            >
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronUp size={16} />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-4 flex-shrink-0" />}

          <button
            onClick={() =>
              setSelectedDetail({
                nodeId,
                label: node.label,
                description: node.description,
                onClick: node.onClick,
              })
            }
            className="flex-1 px-3 py-2 rounded font-medium text-sm transition-all hover:opacity-90 active:scale-95 text-white border border-opacity-30 border-white"
            style={{
              backgroundColor: node.color,
              minWidth: node.type === "org" ? "200px" : node.type === "category" ? "140px" : node.type === "tech" ? "120px" : "100px",
            }}
          >
            {node.label}
          </button>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="border-l-2 border-gray-700 ml-2 pl-2">
            {node.children.map(childId => renderNode(childId, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Tech Stack Flow</h1>
          <p className="text-gray-400">Click any node to see what happens on interaction</p>
        </div>

        {/* Flow Chart */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 overflow-auto max-h-[calc(100vh-200px)]">
          {renderNode("root")}
        </div>

        {/* Legend */}
        <div className="mt-8 grid grid-cols-5 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: "#7f1d1d" }} />
            <span className="text-sm text-gray-300">Organization</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: "#b45309" }} />
            <span className="text-sm text-gray-300">Category</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: "#059669" }} />
            <span className="text-sm text-gray-300">Tech Stack</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: "#1e293b" }} />
            <span className="text-sm text-gray-300">Detail</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Click any node to see interactions</span>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg max-w-md w-full p-6 border border-slate-700">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold text-white">{selectedDetail.label}</h2>
              <button
                onClick={() => setSelectedDetail(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase mb-1">Description</h3>
                <p className="text-sm text-gray-300">{selectedDetail.description}</p>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">On Click Action</h3>
                <div className="bg-slate-900 p-3 rounded text-sm text-blue-300 border border-blue-500/30">
                  → {selectedDetail.onClick}
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <p className="text-xs text-gray-500">Node ID: {selectedDetail.nodeId}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedDetail(null)}
              className="w-full mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
