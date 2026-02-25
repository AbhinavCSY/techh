import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";

interface FlowNode {
  id: string;
  label: string;
  type: "section" | "page" | "component" | "modal" | "action" | "feature" | "data";
  color: string;
  description: string;
  details: string;
  triggers?: string[];
  children?: string[];
}

interface DetailModal {
  nodeId: string;
  label: string;
  description: string;
  details: string;
  triggers?: string[];
}

const APPLICATION_FLOW: Record<string, FlowNode> = {
  // ============ MAIN APPLICATION ============
  "root": {
    id: "root",
    label: "Tech Stack Inventory",
    type: "section",
    color: "#7f1d1d",
    description: "Main application root",
    details: "Dashboard showing all tech stacks and assets with filtering, grouping, and visualization options",
    children: ["header", "main-content", "right-panel", "modals"]
  },

  // ============ HEADER SECTION ============
  "header": {
    id: "header",
    label: "Header / Top Navigation",
    type: "section",
    color: "#1e40af",
    description: "Navigation bar and quick actions",
    details: "Contains logo, products, menu items, search, documentation, security graph, notifications, profile",
    triggers: ["Navigate to different products", "Show notifications", "Access documentation"],
    children: ["header-products", "header-menu", "header-tools"]
  },
  "header-products": {
    id: "header-products",
    label: "Products Dropdown",
    type: "component",
    color: "#1e40af",
    description: "Switch between products",
    details: "Xvigil, BeVigil, SVigil, Asset Inventory, Threat Intel",
    triggers: ["Navigate to threat-intel", "Switch product context"]
  },
  "header-menu": {
    id: "header-menu",
    label: "Menu Items",
    type: "component",
    color: "#1e40af",
    description: "Navigation menu",
    details: "Dashboards, Events (badge: 15), Incidents, All Capabilities",
    triggers: ["Open Dashboards", "View Events", "View Incidents"]
  },
  "header-tools": {
    id: "header-tools",
    label: "Tools & Icons",
    type: "component",
    color: "#1e40af",
    description: "Quick action buttons",
    details: "Search, Security Graph, Documentation, Tech Stack Flow, Support, Notifications, Profile, Logout",
    triggers: ["Open Security Graph", "Show Info Architecture", "Show Tech Stack Flow", "View Notifications", "Logout"],
    children: ["security-graph-page", "info-arch-page", "tech-flow-page"]
  },

  // ============ MAIN CONTENT SECTION ============
  "main-content": {
    id: "main-content",
    label: "Main Content Area",
    type: "section",
    color: "#059669",
    description: "Central dashboard with filters and data views",
    details: "Shows the primary inventory view with all interactive elements",
    children: ["overview-section", "controls-section", "data-view"]
  },

  // OVERVIEW SECTION
  "overview-section": {
    id: "overview-section",
    label: "Overview Section",
    type: "component",
    color: "#059669",
    description: "Top summary area",
    details: "Company name, status metrics, widget panel toggle, new project button",
    triggers: ["Create New Project", "Toggle Widget Panel"],
    children: ["company-info", "status-indicators", "widget-panel"]
  },
  "company-info": {
    id: "company-info",
    label: "Company Info",
    type: "feature",
    color: "#059669",
    description: "Company name and logo",
    details: "Displays company name with refresh capabilities"
  },
  "status-indicators": {
    id: "status-indicators",
    label: "Status Indicators",
    type: "feature",
    color: "#059669",
    description: "Key metrics display",
    details: "Total Tech Stacks, Assets Scanned, Last Scan Date"
  },
  "widget-panel": {
    id: "widget-panel",
    label: "Collapsible Widget Panel",
    type: "feature",
    color: "#059669",
    description: "Toggle widget visibility",
    details: "Shows/hides 3 key widgets: Vulnerable Tech Stacks, Risk by Tech Stacks, Version & License",
    triggers: ["Show/Hide Widgets"]
  },

  // CONTROLS SECTION
  "controls-section": {
    id: "controls-section",
    label: "Controls Section",
    type: "component",
    color: "#059669",
    description: "Filter and view controls",
    details: "Grouping toggle, view options, export, sort, filter",
    triggers: ["Change View Type", "Change Grouping", "Apply Filters", "Sort Data", "Export Data"],
    children: ["view-toggle", "grouping-toggle", "horizontal-filter-bar"]
  },
  "view-toggle": {
    id: "view-toggle",
    label: "View Type Toggle",
    type: "feature",
    color: "#059669",
    description: "Switch between views",
    details: "Table View, Card View, Graph View",
    triggers: ["Switch to Table", "Switch to Cards", "Switch to Graph"]
  },
  "grouping-toggle": {
    id: "grouping-toggle",
    label: "Grouping Toggle",
    type: "feature",
    color: "#059669",
    description: "Group data by",
    details: "Assets or Tech Stacks grouping",
    triggers: ["Group by Assets", "Group by Tech Stacks"]
  },
  "horizontal-filter-bar": {
    id: "horizontal-filter-bar",
    label: "Horizontal Filter Bar",
    type: "feature",
    color: "#059669",
    description: "Filtering and sorting",
    details: "View type selector, sort controls, filter panel, clear filters, export options",
    triggers: ["Open Filter Panel", "Apply Filters", "Clear All Filters", "Export CSV/JSON/PDF"],
    children: ["filter-panel", "sort-controls", "export-menu"]
  },
  "filter-panel": {
    id: "filter-panel",
    label: "Filter Panel (Expandable)",
    type: "component",
    color: "#059669",
    description: "Detailed filtering options",
    details: "Filter by severity, CVE count, vulnerabilities, license type, EOL status, risk level",
    triggers: ["Apply Individual Filters", "Combine Filters", "See Filtered Results"]
  },
  "sort-controls": {
    id: "sort-controls",
    label: "Sort Controls",
    type: "feature",
    color: "#059669",
    description: "Sorting options",
    details: "Sort by name, risk score, CVE count, EOL status, license type"
  },
  "export-menu": {
    id: "export-menu",
    label: "Export Options",
    type: "component",
    color: "#059669",
    description: "Export data",
    details: "Export as CSV, JSON, or PDF with current filters applied"
  },

  // DATA VIEW SECTION
  "data-view": {
    id: "data-view",
    label: "Data View",
    type: "section",
    color: "#059669",
    description: "Primary data display",
    details: "Shows data in selected format (Table, Card, or Graph)",
    children: ["table-view", "card-view", "graph-view"]
  },
  "table-view": {
    id: "table-view",
    label: "Table View",
    type: "component",
    color: "#059669",
    description: "Tabular data display",
    details: "Rows with columns: Name, CVEs, Risk, License, EOL, Last Updated. Click row for details",
    triggers: ["Click row", "Sort by column", "Select multiple"]
  },
  "card-view": {
    id: "card-view",
    label: "Card View",
    type: "component",
    color: "#059669",
    description: "Card-based display",
    details: "Grid of cards showing tech stack summary with risk score, CVE count, vulnerability bars",
    triggers: ["Click card", "Hover for details", "Right-click for actions"]
  },
  "graph-view": {
    id: "graph-view",
    label: "Graph View",
    type: "component",
    color: "#059669",
    description: "Network visualization",
    details: "Force-directed graph showing relationships between assets and tech stacks",
    triggers: ["Click node", "Drag to pan", "Scroll to zoom"],
    children: ["hierarchical-security-graph"]
  },
  "hierarchical-security-graph": {
    id: "hierarchical-security-graph",
    label: "Hierarchical Security Graph",
    type: "feature",
    color: "#059669",
    description: "Advanced graph visualization",
    details: "Org → Cloud → Asset → Tech Stack → Dependency → CVE with dynamic expansion",
    triggers: ["Expand node", "View node details", "Highlight attack path"]
  },

  // ============ RIGHT PANEL ============
  "right-panel": {
    id: "right-panel",
    label: "Right Details Panel",
    type: "section",
    color: "#7c3aed",
    description: "Context-sensitive details",
    details: "Shows details of selected item (tech stack or asset)",
    children: ["item-header", "risk-metrics", "cve-list", "dependencies-list", "actions-panel"]
  },
  "item-header": {
    id: "item-header",
    label: "Item Header",
    type: "component",
    color: "#7c3aed",
    description: "Item identification",
    details: "Icon, name, type, tags, favorite toggle"
  },
  "risk-metrics": {
    id: "risk-metrics",
    label: "Risk Metrics",
    type: "component",
    color: "#7c3aed",
    description: "Risk assessment",
    details: "Risk score (0-100), severity badge (Critical/High/Medium/Low), trend indicator",
    triggers: ["View risk details"]
  },
  "cve-list": {
    id: "cve-list",
    label: "CVE List",
    type: "component",
    color: "#7c3aed",
    description: "Vulnerability list",
    details: "All CVEs affecting this item with severity, CVSS score, fix status",
    triggers: ["Click CVE", "See full details", "View remediation"]
  },
  "dependencies-list": {
    id: "dependencies-list",
    label: "Dependencies List",
    type: "component",
    color: "#7c3aed",
    description: "Dependency tree",
    details: "All dependencies with version, CVE count, update available status"
  },
  "actions-panel": {
    id: "actions-panel",
    label: "Actions Panel",
    type: "component",
    color: "#7c3aed",
    description: "Quick actions",
    details: "Buttons: Create Ticket, View Full Details, Add to Watchlist, Rescan",
    triggers: ["Create Ticket", "View Full Details", "Add Watchlist", "Rescan"]
  },

  // ============ MODALS & DIALOGS ============
  "modals": {
    id: "modals",
    label: "Modals & Dialogs",
    type: "section",
    color: "#dc2626",
    description: "Popup windows and forms",
    details: "All modal dialogs and popups in the application",
    children: ["new-project-modal", "import-modal", "automatic-scan-modal", "cve-details-modal"]
  },

  // NEW PROJECT MODAL
  "new-project-modal": {
    id: "new-project-modal",
    label: "New Project Modal",
    type: "modal",
    color: "#dc2626",
    description: "Create new project workflow",
    details: "Multi-step form for creating a new project with repository selection",
    triggers: ["Click New Project Button"],
    children: ["step-1-project-config", "step-2-repo-selection", "step-3-confirmation"]
  },
  "step-1-project-config": {
    id: "step-1-project-config",
    label: "Step 1: Project Config",
    type: "component",
    color: "#dc2626",
    description: "Basic project setup",
    details: "Input project name, description, select repo type (GitHub, GitLab, Gitea), enter repo URL"
  },
  "step-2-repo-selection": {
    id: "step-2-repo-selection",
    label: "Step 2: Repository Selection",
    type: "component",
    color: "#dc2626",
    description: "Choose repository",
    details: "List/search all available repos from selected provider, show last updated, select checkbox"
  },
  "step-3-confirmation": {
    id: "step-3-confirmation",
    label: "Step 3: Confirmation & Scan",
    type: "component",
    color: "#dc2626",
    description: "Verify and start scan",
    details: "Summary of selected repos, scan type selection, start scan button",
    triggers: ["Start Scan", "Trigger Automatic Scan Modal"]
  },

  // IMPORT MODAL
  "import-modal": {
    id: "import-modal",
    label: "Import Modal",
    type: "modal",
    color: "#dc2626",
    description: "Import from external source",
    details: "Upload SBOM, dependency list, or scan results",
    triggers: ["Click Import Button"],
    children: ["import-file-upload", "import-preview", "import-confirm"]
  },
  "import-file-upload": {
    id: "import-file-upload",
    label: "File Upload",
    type: "component",
    color: "#dc2626",
    description: "Upload files",
    details: "Drag-drop or select files (JSON, XML, CSV formats)"
  },
  "import-preview": {
    id: "import-preview",
    label: "Preview Data",
    type: "component",
    color: "#dc2626",
    description: "Preview imported data",
    details: "Show parsed items, count, validation status"
  },
  "import-confirm": {
    id: "import-confirm",
    label: "Confirm Import",
    type: "component",
    color: "#dc2626",
    description: "Complete import",
    details: "Confirm and import button, see results after import"
  },

  // AUTOMATIC SCAN MODAL
  "automatic-scan-modal": {
    id: "automatic-scan-modal",
    label: "Automatic Scan Setup Modal",
    type: "modal",
    color: "#dc2626",
    description: "Configure automated scanning",
    details: "4-step workflow for GitHub Actions setup",
    triggers: ["Click New Scan Button", "From New Project Step 3"],
    children: ["scan-step-1-config", "scan-step-2-sbom-tool", "scan-step-3-gh-action", "scan-step-4-script"]
  },
  "scan-step-1-config": {
    id: "scan-step-1-config",
    label: "Step 1: Project Config",
    type: "component",
    color: "#dc2626",
    description: "Setup project",
    details: "Enter project name, select environment (Prod/Staging/Dev)"
  },
  "scan-step-2-sbom-tool": {
    id: "scan-step-2-sbom-tool",
    label: "Step 2: Select SBOM Tool",
    type: "component",
    color: "#dc2626",
    description: "Choose SBOM generator",
    details: "24 tool options: Syft, cdxgen, Microsoft sbom-tool, CycloneDX CLI, SPDX, Tern, Trivy, Anchore, Black Duck, Snyk, Mend, JFrog Xray, Veracode, Dependency-Track/Check, Maven Plugin, Gradle Plugin, NPM Module, Python Tool, Cargo, Go Tools, Distro2SBOM, GitHub/GitLab generators",
    triggers: ["Select SBOM Tool", "Generate script preview"]
  },
  "scan-step-3-gh-action": {
    id: "scan-step-3-gh-action",
    label: "Step 3: GitHub Action Setup",
    type: "component",
    color: "#dc2626",
    description: "Configure GitHub Actions",
    details: "2 options: New GitHub Action (create workflow file) or Add to Existing GH Action (snippet)",
    triggers: ["Select action type"]
  },
  "scan-step-4-script": {
    id: "scan-step-4-script",
    label: "Step 4: View Script",
    type: "component",
    color: "#dc2626",
    description: "Display generated script",
    details: "Show generated YAML or bash script based on selections, copy button, instructions panel",
    triggers: ["Copy Script", "Close Modal"]
  },

  // CVE DETAILS MODAL
  "cve-details-modal": {
    id: "cve-details-modal",
    label: "CVE Details Modal",
    type: "modal",
    color: "#dc2626",
    description: "Full CVE information",
    details: "Comprehensive CVE data with remediation steps",
    triggers: ["Click CVE Link", "View CVE Details"],
    children: ["cve-header", "cve-metrics", "cve-description", "cve-remediation", "cve-references"]
  },
  "cve-header": {
    id: "cve-header",
    label: "CVE Header",
    type: "component",
    color: "#dc2626",
    description: "CVE identification",
    details: "CVE ID, severity badge, CVSS score, published date"
  },
  "cve-metrics": {
    id: "cve-metrics",
    label: "CVE Metrics",
    type: "component",
    color: "#dc2626",
    description: "Risk metrics",
    details: "CVSS v3.1, EPSS score, attack complexity, privileges required, user interaction"
  },
  "cve-description": {
    id: "cve-description",
    label: "Description & Impact",
    type: "component",
    color: "#dc2626",
    description: "Vulnerability details",
    details: "Full description, affected versions, impact assessment"
  },
  "cve-remediation": {
    id: "cve-remediation",
    label: "Remediation Steps",
    type: "component",
    color: "#dc2626",
    description: "Fix guidance",
    details: "Update version, patch instructions, workarounds, configuration changes"
  },
  "cve-references": {
    id: "cve-references",
    label: "References & Links",
    type: "component",
    color: "#dc2626",
    description: "External resources",
    details: "Links to NVD, vendor advisories, security blogs, exploits"
  },

  // ============ DETAILED PAGES ============
  "detailed-pages": {
    id: "detailed-pages",
    label: "Detailed View Pages",
    type: "section",
    color: "#ea580c",
    description: "Full-page detailed views",
    details: "Navigate from dashboard to see full details",
    children: ["incident-details-page", "cve-full-details-page", "rescan-history-page"]
  },
  "incident-details-page": {
    id: "incident-details-page",
    label: "Incident Details Page",
    type: "page",
    color: "#ea580c",
    description: "Security incident details",
    details: "Full information about a CVE incident including tech stack, affected assets, remediation progress",
    triggers: ["Navigate from Row Click"]
  },
  "cve-full-details-page": {
    id: "cve-full-details-page",
    label: "CVE Full Details Page",
    type: "page",
    color: "#ea580c",
    description: "Complete CVE analysis",
    details: "Comprehensive CVE data, affected software, exploits, remediation, threat intelligence",
    triggers: ["Navigate from CVE Link"]
  },
  "rescan-history-page": {
    id: "rescan-history-page",
    label: "Rescan History Page",
    type: "page",
    color: "#ea580c",
    description: "Scan history and logs",
    details: "Timeline of all scans, results, changes detected, remediation status",
    triggers: ["Navigate from History Button"]
  },

  // ============ SPECIAL PAGES ============
  "special-pages": {
    id: "special-pages",
    label: "Special Pages",
    type: "section",
    color: "#0891b2",
    description: "Specialized visualization and documentation pages",
    details: "Additional pages for graphs, documentation, and flow diagrams",
    children: ["security-graph-page", "info-arch-page", "tech-flow-page"]
  },
  "security-graph-page": {
    id: "security-graph-page",
    label: "Security Graph Page",
    type: "page",
    color: "#0891b2",
    description: "Hierarchical security visualization",
    details: "Full-screen graph showing Org → Cloud → Asset → Tech → Dependency → CVE hierarchy with attack path highlighting",
    triggers: ["Click Security Graph Icon", "URL: /?view=security-graph"]
  },
  "info-arch-page": {
    id: "info-arch-page",
    label: "Information Architecture",
    type: "page",
    color: "#0891b2",
    description: "Application map",
    details: "Visual sitemap showing all routes, pages, and user flows in the application",
    triggers: ["Click Documentation Icon", "URL: /information-architecture"]
  },
  "tech-flow-page": {
    id: "tech-flow-page",
    label: "Tech Stack Flow",
    type: "page",
    color: "#0891b2",
    description: "Tech stack hierarchy",
    details: "Hierarchical tree of all tech stacks, frameworks, databases, and libraries with click interactions",
    triggers: ["Click Tech Flow Icon", "URL: /tech-stack-flow"]
  },

  // ============ KEY FEATURES ============
  "features": {
    id: "features",
    label: "Key Features & Workflows",
    type: "section",
    color: "#6366f1",
    description: "Cross-cutting features and workflows",
    details: "Features that span multiple parts of the application",
    children: ["search-feature", "filter-workflow", "rescan-workflow", "export-workflow"]
  },
  "search-feature": {
    id: "search-feature",
    label: "Search & Find",
    type: "feature",
    color: "#6366f1",
    description: "Global search functionality",
    details: "Search tech stacks, CVEs, assets by name, filter results in real-time",
    triggers: ["Type in search", "See filtered results", "Click result to select"]
  },
  "filter-workflow": {
    id: "filter-workflow",
    label: "Filter Workflow",
    type: "feature",
    color: "#6366f1",
    description: "Apply complex filters",
    details: "Combine multiple filters (severity, CVE count, licenses, EOL status), see live results, clear filters",
    triggers: ["Open Filter Panel", "Select Filter Options", "Apply", "Clear All"]
  },
  "rescan-workflow": {
    id: "rescan-workflow",
    label: "Rescan Workflow",
    type: "feature",
    color: "#6366f1",
    description: "Re-run vulnerability scans",
    details: "Select items to rescan, trigger scan, monitor progress, see results",
    triggers: ["Click Rescan Button", "Select Items", "Start Scan"]
  },
  "export-workflow": {
    id: "export-workflow",
    label: "Export Workflow",
    type: "feature",
    color: "#6366f1",
    description: "Export data in multiple formats",
    details: "Export current view/filtered data as CSV, JSON, or PDF",
    triggers: ["Click Export Button", "Select Format", "Download"]
  }
};

export default function ApplicationFlow() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set([
      "root", "header", "main-content", "right-panel", "modals", "detailed-pages", "special-pages", "features",
      "overview-section", "controls-section", "data-view", "new-project-modal", "automatic-scan-modal"
    ])
  );
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
    const node = APPLICATION_FLOW[nodeId];
    if (!node) return null;

    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(nodeId);

    const typeColors: Record<string, string> = {
      section: "#1e40af",
      page: "#ea580c",
      component: "#0891b2",
      modal: "#dc2626",
      action: "#7c3aed",
      feature: "#6366f1",
      data: "#059669"
    };

    return (
      <div key={nodeId} className="flex flex-col">
        <div className="flex items-center gap-2 mb-2" style={{ marginLeft: `${level * 20}px` }}>
          {hasChildren && (
            <button
              onClick={() => toggleExpand(nodeId)}
              className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          )}
          {!hasChildren && <div className="w-4 flex-shrink-0" />}

          <button
            onClick={() =>
              setSelectedDetail({
                nodeId,
                label: node.label,
                description: node.description,
                details: node.details,
                triggers: node.triggers,
              })
            }
            className="flex-1 px-3 py-2 rounded font-medium text-sm transition-all hover:opacity-90 active:scale-95 text-white border border-opacity-30 border-white"
            style={{
              backgroundColor: node.color,
              minWidth: level === 0 ? "300px" : level === 1 ? "250px" : "200px",
            }}
          >
            {node.label}
            {node.type === "modal" && " 📋"}
            {node.type === "page" && " 📄"}
            {node.type === "feature" && " ✨"}
          </button>
        </div>

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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Application Flow Architecture</h1>
          <p className="text-gray-400">Complete map of all features, modals, pages, and workflows</p>
        </div>

        {/* Flow Chart */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 overflow-auto max-h-[calc(100vh-200px)]">
          {renderNode("root")}
        </div>

        {/* Legend */}
        <div className="mt-8 grid grid-cols-7 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: "#1e40af" }} />
            <span className="text-xs text-gray-300">Section</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: "#ea580c" }} />
            <span className="text-xs text-gray-300">Page</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: "#0891b2" }} />
            <span className="text-xs text-gray-300">Component</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: "#dc2626" }} />
            <span className="text-xs text-gray-300">Modal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: "#6366f1" }} />
            <span className="text-xs text-gray-300">Feature</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: "#059669" }} />
            <span className="text-xs text-gray-300">Data View</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Click any item for details</span>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg max-w-2xl w-full p-6 border border-slate-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedDetail.label}</h2>
                <p className="text-sm text-gray-400 mt-1">{selectedDetail.description}</p>
              </div>
              <button
                onClick={() => setSelectedDetail(null)}
                className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-300 uppercase mb-2">Details</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{selectedDetail.details}</p>
              </div>

              {selectedDetail.triggers && selectedDetail.triggers.length > 0 && (
                <div className="border-t border-slate-700 pt-4">
                  <h3 className="text-sm font-semibold text-gray-300 uppercase mb-2">Triggers / Actions</h3>
                  <ul className="space-y-1">
                    {selectedDetail.triggers.map((trigger, idx) => (
                      <li key={idx} className="text-sm text-blue-300 flex items-start gap-2">
                        <span className="text-blue-500 flex-shrink-0 mt-0.5">→</span>
                        <span>{trigger}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

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
