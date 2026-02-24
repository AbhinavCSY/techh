import { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useFilters,
  filterTechStacks,
  filterAssets,
  sortTechStacks,
  sortAssets,
} from "@/hooks/useFilters";
import { techStackDatabase, assetDatabase } from "@/data/mockData";
import { HorizontalFilterBar } from "@/components/HorizontalFilterBar";
import { TechStackCardView } from "@/components/TechStackCardView";
import { AssetCardView } from "@/components/AssetCardView";
import { TechStackTableView } from "@/components/TechStackTableView";
import { AssetTableView } from "@/components/AssetTableView";
import { PackageReliabilityCard } from "@/components/PackageReliabilityCard";
import { CVEsPieChart } from "@/components/CVEsPieChart";
import { EOLPieChart } from "@/components/EOLPieChart";
import { TechStacksAndAssetsChart } from "@/components/TechStacksAndAssetsChart";
import { VulnerableLibrariesWidget } from "@/components/VulnerableLibrariesWidget";
import { LicenseDistributionWidget } from "@/components/LicenseDistributionWidget";
import { RiskByTechnologiesChart } from "@/components/RiskByTechnologiesChart";
import { CloudSecurityGraph } from "@/components/CloudSecurityGraph";
import { VersionAndLicenseWidget } from "@/components/VersionAndLicenseWidget";
import { exportAsCSV, exportAsJSON, exportAsPDF } from "@/lib/exportUtils";
import { Button } from "@/components/ui/button";
import { ChevronDown, AlertTriangle, Badge as BadgeIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DependencyGraph } from "@/components/DependencyGraph";
import { CombinedDependencyGraph } from "@/components/CombinedDependencyGraph";
import { InteractiveDependencyGraph } from "@/components/InteractiveDependencyGraph";
import { cn } from "@/lib/utils";

export default function Index() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Call all hooks BEFORE any conditional logic
  const {
    viewType,
    setViewType,
    grouping,
    setGrouping,
    filters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
  } = useFilters();

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showWidgetPanel, setShowWidgetPanel] = useState(true);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAutomaticScanModal, setShowAutomaticScanModal] = useState(false);
  const [scanningProject, setScanningProject] = useState<string | null>(null);
  const [scannedAssets, setScannedAssets] = useState<Set<string>>(new Set());

  // Handle query parameter for security graph view
  useEffect(() => {
    const viewParam = searchParams.get("view");
    if (viewParam === "security-graph") {
      setViewType("graph");
      setGrouping("security-graph");
    }
  }, [searchParams, setViewType, setGrouping]);

  // Filter and sort data - must be called before any early returns
  const filteredTechStacks = useMemo(() => {
    const filtered = filterTechStacks(techStackDatabase, filters);
    return sortTechStacks(filtered, filters.sortBy, filters.sortOrder);
  }, [filters]);

  const filteredAssets = useMemo(() => {
    const filtered = filterAssets(assetDatabase, filters);
    return sortAssets(filtered, filters.sortBy, filters.sortOrder);
  }, [filters]);

  const handleExport = async (format: "csv" | "json" | "pdf") => {
    if (grouping === "security-graph") {
      // Security graph export not yet implemented
      alert("Export for Security Graph view coming soon");
      return;
    }

    const dataToExport =
      grouping === "tech-stack" ? filteredTechStacks : filteredAssets;
    const filename = `${grouping}-inventory-${new Date().toISOString().split("T")[0]}`;

    switch (format) {
      case "csv":
        exportAsCSV(dataToExport, `${filename}.csv`, grouping === "tech-stack");
        break;
      case "json":
        exportAsJSON(dataToExport, `${filename}.json`);
        break;
      case "pdf":
        await exportAsPDF(
          dataToExport,
          `${filename}.pdf`,
          grouping === "tech-stack",
        );
        break;
    }
  };

  const handleStartScan = (projectName: string) => {
    setScanningProject(projectName);
    setShowNewProjectModal(false);
    setGrouping("asset");

    // Simulate scanning - mark all assets as scanned after random intervals
    const assetIds = assetDatabase.map((a) => a.id);
    assetIds.forEach((assetId, index) => {
      setTimeout(
        () => {
          setScannedAssets((prev) => new Set([...prev, assetId]));
        },
        (index + 1) * 800,
      ); // Stagger the scanning
    });

    // Clear scanning state after all assets are scanned
    setTimeout(
      () => {
        setScanningProject(null);
      },
      assetIds.length * 800 + 2000,
    );
  };

  const getMetrics = () => {
    const totalTechStacks = techStackDatabase.length;
    const assetsScanned = assetDatabase.filter((a) => a.isScanned).length;

    return {
      totalTechStacks,
      assetsScanned,
    };
  };

  const metrics = getMetrics();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Scanning Banner */}
      {scanningProject && (
        <div className="bg-blue-50 border-b border-blue-200 py-3 px-6">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-900">
              🔍 Scanning <strong>{scanningProject}</strong> - Scanning assets (
              {scannedAssets.size}% complete)
            </span>
          </div>
        </div>
      )}

      {/* Header with improved visual hierarchy */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Primary Title Section */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {grouping === "tech-stack" ? "Tech Stack Inventory" : "Asset Inventory"}
              </h1>
              <p className="text-sm text-gray-600">
                Monitor vulnerabilities, risks, and compliance across your dependencies
              </p>
            </div>
            <Button
              onClick={() => setShowNewProjectModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 h-auto"
            >
              + New Project
            </Button>
          </div>

          {/* Overview Section - Clear Visual Separation */}
          <div className="space-y-3">
            {/* Section Header with Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Overview</h2>
                <p className="text-xs text-gray-500 mt-1">Key insights and risk metrics</p>
              </div>
              <button
                onClick={() => setShowWidgetPanel(!showWidgetPanel)}
                className={cn(
                  "px-3 py-1.5 rounded text-xs font-medium transition-colors",
                  showWidgetPanel
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                )}
              >
                {showWidgetPanel ? "▼ Hide Overview" : "▶ Show Overview"}
              </button>
            </div>

            {/* Overview Widgets */}
            {showWidgetPanel && (
              <div className="grid grid-cols-3 gap-3 pt-2">
                {/* Vulnerable Tech Stacks Widget */}
                <div className="bg-white rounded-lg border border-gray-200 p-3 max-h-56 overflow-y-auto hover:border-gray-300 transition-colors">
                  <VulnerableLibrariesWidget compact={true} />
                </div>

                {/* Risk by Tech Stacks Widget */}
                <div className="bg-white rounded-lg border border-gray-200 p-3 max-h-56 overflow-y-auto hover:border-gray-300 transition-colors">
                  <RiskByTechnologiesChart compact={true} />
                </div>

                {/* Version & License Widget */}
                <div className="bg-white rounded-lg border border-gray-200 p-3 max-h-56 overflow-y-auto hover:border-gray-300 transition-colors">
                  <VersionAndLicenseWidget compact={true} />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Controls Section - Sticky with better hierarchy */}
      <div className="sticky top-0 z-20 border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Primary Controls */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">View:</span>
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setGrouping("asset")}
                    className={cn(
                      "px-3 py-1.5 rounded font-medium text-sm transition-all whitespace-nowrap",
                      grouping === "asset"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900",
                    )}
                  >
                    🖥️ Assets
                  </button>
                  <button
                    onClick={() => setGrouping("tech-stack")}
                    className={cn(
                      "px-3 py-1.5 rounded font-medium text-sm transition-all whitespace-nowrap",
                      grouping === "tech-stack"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900",
                    )}
                  >
                    📦 Tech Stacks
                  </button>
                </div>
              </div>
            </div>

            {/* Metric Display */}
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <div>
                <span className="font-semibold text-gray-900">{metrics.totalTechStacks}</span>
                <span className="ml-1">Total Tech Stacks</span>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <div>
                <span className="font-semibold text-gray-900">{metrics.assetsScanned}</span>
                <span className="ml-1">Assets Scanned</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar - Secondary Controls */}
      <div className="border-b border-gray-200 bg-white/50 backdrop-blur-sm">
        <HorizontalFilterBar
          filters={filters}
          onFilterChange={updateFilter}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
          viewType={viewType}
          onViewTypeChange={setViewType}
          onExport={handleExport}
          grouping={grouping}
        />
      </div>

      {/* Main Content - Clear separation */}
      <main
        className={cn(
          viewType === "graph" ? "px-0 py-0" : "max-w-7xl mx-auto px-6 py-8",
        )}
      >
        {/* Graph View */}
        {viewType === "graph" ? (
          <div className="w-full" style={{ height: "calc(100vh - 200px)" }}>
            {grouping === "security-graph" ? (
              <CloudSecurityGraph />
            ) : grouping === "asset" ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center p-8 max-w-md">
                  <div className="text-4xl mb-4">🔗</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Asset Dependency Graph
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Visualize relationships and dependencies between your assets
                  </p>
                  <p className="text-xs text-gray-500">
                    Total Assets: {filteredAssets.length}
                  </p>
                  {filteredAssets.length > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs text-blue-900 font-medium">
                        Graph view shows dependencies and relationships between assets in your inventory
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <InteractiveDependencyGraph />
            )}
          </div>
        ) : (
          <>
            {/* Empty State - Enhanced Visual Hierarchy */}
            {filteredTechStacks.length === 0 && filteredAssets.length === 0 ? (
              <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-16 text-center">
                <div className="flex justify-center mb-6">
                  <div className="bg-gray-100 rounded-full p-4">
                    <AlertTriangle className="w-8 h-8 text-gray-500" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No {grouping === "tech-stack" ? "Tech Stacks" : "Assets"} Found
                </h3>
                <p className="text-gray-600 mb-6 text-sm">
                  {hasActiveFilters
                    ? "Try adjusting your filters to see results"
                    : "Start by adding a new project or scanning your dependencies"}
                </p>
                <div className="flex items-center justify-center gap-3">
                  {hasActiveFilters && (
                    <Button onClick={clearFilters} variant="outline" className="text-sm">
                      Clear All Filters
                    </Button>
                  )}
                  <Button
                    onClick={() => setShowNewProjectModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                  >
                    Create New Project
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Content Header with result count */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {grouping === "tech-stack"
                      ? `${filteredTechStacks.length} Tech Stack${filteredTechStacks.length !== 1 ? 's' : ''}`
                      : `${filteredAssets.length} Asset${filteredAssets.length !== 1 ? 's' : ''}`
                    }
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {viewType === "card" ? "Card view" : "Table view"}
                  </p>
                </div>

                {/* Content - Card or Table View */}
                {viewType === "card" ? (
                  <>
                    {grouping === "tech-stack" ? (
                      <TechStackCardView
                        techStacks={filteredTechStacks}
                        allAssets={assetDatabase}
                        onSelectCard={(ts) => {
                          setSelectedItem(ts);
                          setShowDetails(true);
                        }}
                        scanningProject={scanningProject}
                        scannedAssets={scannedAssets}
                      />
                    ) : (
                      <AssetCardView
                        assets={filteredAssets}
                        onSelectCard={(asset) => {
                          setSelectedItem(asset);
                          setShowDetails(true);
                        }}
                        scanningProject={scanningProject}
                        scannedAssets={scannedAssets}
                      />
                    )}
                  </>
                ) : (
                  <>
                    {grouping === "tech-stack" ? (
                      <TechStackTableView
                        techStacks={filteredTechStacks}
                        allAssets={assetDatabase}
                        onSelectRow={(ts) => {
                          setSelectedItem(ts);
                          setShowDetails(true);
                        }}
                        scanningProject={scanningProject}
                        scannedAssets={scannedAssets}
                      />
                    ) : (
                      <AssetTableView
                        assets={filteredAssets}
                        onSelectRow={(asset) => {
                          setSelectedItem(asset);
                          setShowDetails(true);
                        }}
                        scanningProject={scanningProject}
                        scannedAssets={scannedAssets}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* Detail Panel */}
      {showDetails && selectedItem && (
        <DetailsPanel
          item={selectedItem}
          isAsset={grouping === "asset"}
          allAssets={assetDatabase}
          onClose={() => setShowDetails(false)}
          onNavigateToIncident={(techStackId, cveId) =>
            navigate(`/cve-details/${cveId}`)
          }
          onSelectAsset={(asset) => {
            setSelectedItem(asset);
          }}
        />
      )}

      {/* New Project Modal */}
      {showNewProjectModal && (
        <NewProjectModal
          isOpen={showNewProjectModal}
          onClose={() => setShowNewProjectModal(false)}
          onStartScan={handleStartScan}
          onOpenImport={() => {
            setShowNewProjectModal(false);
            setShowImportModal(true);
          }}
          onOpenAutomaticScan={() => {
            setShowNewProjectModal(false);
            setShowAutomaticScanModal(true);
          }}
          setShowImportModal={setShowImportModal}
          setShowNewProjectModal={setShowNewProjectModal}
        />
      )}

      {/* Import From Modal */}
      {showImportModal && (
        <ImportFromModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onStartScan={handleStartScan}
        />
      )}

      {/* Automatic Scan Modal */}
      {showAutomaticScanModal && (
        <AutomaticScanModal
          isOpen={showAutomaticScanModal}
          onClose={() => setShowAutomaticScanModal(false)}
        />
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: number;
  color: string;
  icon: string;
}) {
  const colorMap: Record<string, string> = {
    red: "bg-red-50 border-red-200 text-red-900",
    orange: "bg-orange-50 border-orange-200 text-orange-900",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-900",
    blue: "bg-blue-50 border-blue-200 text-blue-900",
    purple: "bg-purple-50 border-purple-200 text-purple-900",
    green: "bg-green-50 border-green-200 text-green-900",
  };

  return (
    <div className={`border rounded p-1.5 ${colorMap[color]}`}>
      <p className="text-xs font-medium opacity-75 truncate leading-tight">
        {label}
      </p>
      <div className="flex items-center justify-between mt-0.5">
        <p className="text-base font-bold">{value}</p>
        <p className="text-sm">{icon}</p>
      </div>
    </div>
  );
}

interface DetailsPanelProps {
  item: any;
  isAsset: boolean;
  allAssets: any[];
  onClose: () => void;
  onNavigateToIncident: (techStackId: string, cveId: string) => void;
  onSelectAsset: (asset: any) => void;
}

function DetailsPanel({
  item,
  isAsset,
  allAssets,
  onClose,
  onNavigateToIncident,
  onSelectAsset,
}: DetailsPanelProps) {
  const navigate = useNavigate();
  // Dynamically determine if the current item is an asset or tech stack
  // Assets have 'techStacks' property, tech stacks have 'version' property
  const isAssetItem = item && Array.isArray(item.techStacks) && !item.version;

  const [activeTab, setActiveTab] = useState("overview");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any>(null);
  const [scannedCVEs, setScannedCVEs] = useState<Record<string, any>>({});
  const [newlyDiscoveredCVEs, setNewlyDiscoveredCVEs] = useState<any[]>([]);
  const [expandedCVE, setExpandedCVE] = useState<string | null>(null);
  const [selectedAssetsForScan, setSelectedAssetsForScan] = useState<
    Record<string, boolean>
  >({});
  const [selectedCVEForAssets, setSelectedCVEForAssets] = useState<
    string | null
  >(null);
  const [cveAssetSelections, setCVEAssetSelections] = useState<
    Record<string, Record<string, boolean>>
  >({});
  const [expandedRemediations, setExpandedRemediations] = useState<
    Record<string, boolean>
  >({});

  // Get the highest severity CVE for the panel header color
  const getHighestSeverityCVE = () => {
    if (isAssetItem) return null;
    const allCVEs = [...(item.cves || []), ...marketCVEs];
    if (allCVEs.length === 0) return null;
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return allCVEs.reduce((prev, current) => {
      const prevOrder = severityOrder[prev.severity as keyof typeof severityOrder] ?? 4;
      const currentOrder = severityOrder[current.severity as keyof typeof severityOrder] ?? 4;
      return currentOrder < prevOrder ? current : prev;
    });
  };

  const getHeaderLineColor = () => {
    const highestCVE = getHighestSeverityCVE();
    if (!highestCVE) return "bg-gray-300";
    const score = highestCVE.score || 0;
    if (score >= 9.0) return "bg-red-600";
    if (score >= 7.0) return "bg-orange-600";
    if (score >= 5.0) return "bg-yellow-500";
    return "bg-green-600";
  };

  // Initialize selected assets when item changes
  const initializeSelectedAssets = () => {
    if (!isAssetItem) {
      const assets = getAssociatedAssets(item.id);
      const selected: Record<string, boolean> = {};
      assets.forEach((asset) => {
        selected[asset.id] = true;
      });
      setSelectedAssetsForScan(selected);
    }
  };

  // Market CVEs available for scanning
  const marketCVEs = [
    {
      id: "CVE-2024-1086",
      severity: "critical",
      title: "Remote Code Execution in Core Module",
      score: 9.8,
      description:
        "A critical vulnerability allowing remote code execution through input validation bypass",
      published: "2024-01-15",
      affected: "v2.0.0 - v2.14.0",
      cwe: "CWE-94: Improper Control of Generation of Code",
      references: ["https://nvd.nist.gov/vuln/detail/CVE-2024-1086"],
      scanningSupported: true,
      scanCoverage: {
        totalAssets: 5,
        scannedAssets: 0,
        unscannedAssets: 5,
      },
    },
    {
      id: "CVE-2024-2156",
      severity: "high",
      title: "SQL Injection Vulnerability",
      score: 8.9,
      description:
        "Authentication bypass through SQL injection in user login module",
      published: "2024-01-10",
      affected: "v2.0.0 - v2.13.5",
      cwe: "CWE-89: SQL Injection",
      references: ["https://nvd.nist.gov/vuln/detail/CVE-2024-2156"],
      scanningSupported: false,
      scanCoverage: {
        totalAssets: 4,
        scannedAssets: 2,
        unscannedAssets: 2,
      },
      remediationSteps: [
        {
          step: 1,
          title: "Upgrade to version 2.14.0 or later",
          description:
            "Apply the latest security patch that addresses the SQL injection vulnerability",
        },
        {
          step: 2,
          title: "Use parameterized queries",
          description:
            "Replace all dynamic SQL queries with parameterized prepared statements",
        },
        {
          step: 3,
          title: "Input validation",
          description:
            "Implement strict input validation for all user-supplied data",
        },
        {
          step: 4,
          title: "Security testing",
          description: "Conduct thorough security testing after applying fixes",
        },
      ],
    },
    {
      id: "CVE-2024-3421",
      severity: "high",
      title: "Cross-Site Scripting (XSS) in API Response",
      score: 7.5,
      description:
        "Reflected XSS vulnerability in API response handling allowing session hijacking",
      published: "2024-01-20",
      affected: "v2.0.0 - v2.12.0",
      cwe: "CWE-79: Cross-site Scripting (XSS)",
      references: ["https://nvd.nist.gov/vuln/detail/CVE-2024-3421"],
      scanningSupported: true,
      scanCoverage: {
        totalAssets: 3,
        scannedAssets: 3,
        unscannedAssets: 0,
      },
    },
    {
      id: "CVE-2024-4567",
      severity: "high",
      title: "Directory Traversal in File Upload",
      score: 7.8,
      description:
        "Path traversal vulnerability in file upload functionality allowing arbitrary file write",
      published: "2024-01-25",
      affected: "v2.5.0 - v2.14.0",
      cwe: "CWE-22: Improper Limitation of a Pathname",
      references: ["https://nvd.nist.gov/vuln/detail/CVE-2024-4567"],
      scanningSupported: false,
      scanCoverage: {
        totalAssets: 6,
        scannedAssets: 1,
        unscannedAssets: 5,
      },
      remediationSteps: [
        {
          step: 1,
          title: "Update to version 2.15.0 or newer",
          description: "Contains fixes for directory traversal vulnerability",
        },
        {
          step: 2,
          title: "Implement path sanitization",
          description:
            "Sanitize and validate all file path inputs to prevent directory traversal",
        },
        {
          step: 3,
          title: "Use whitelisting",
          description:
            "Implement whitelist-based validation for allowed upload directories",
        },
      ],
    },
    {
      id: "CVE-2024-5678",
      severity: "medium",
      title: "Insecure Deserialization",
      score: 6.8,
      description:
        "Unsafe object deserialization leading to potential code execution",
      published: "2024-02-01",
      affected: "v2.3.0 - v2.14.0",
      cwe: "CWE-502: Deserialization of Untrusted Data",
      references: ["https://nvd.nist.gov/vuln/detail/CVE-2024-5678"],
      scanningSupported: true,
      scanCoverage: {
        totalAssets: 5,
        scannedAssets: 4,
        unscannedAssets: 1,
      },
    },
    {
      id: "CVE-2024-6789",
      severity: "medium",
      title: "Denial of Service via Resource Exhaustion",
      score: 6.5,
      description:
        "DoS vulnerability through uncontrolled resource consumption in request handling",
      published: "2024-02-05",
      affected: "v2.0.0 - v2.13.0",
      cwe: "CWE-400: Uncontrolled Resource Consumption",
      references: ["https://nvd.nist.gov/vuln/detail/CVE-2024-6789"],
      scanningSupported: false,
      scanCoverage: {
        totalAssets: 7,
        scannedAssets: 0,
        unscannedAssets: 7,
      },
      remediationSteps: [
        {
          step: 1,
          title: "Apply rate limiting",
          description:
            "Implement request rate limiting to prevent resource exhaustion attacks",
        },
        {
          step: 2,
          title: "Update to version 2.14.0",
          description: "Contains optimizations for resource handling",
        },
        {
          step: 3,
          title: "Monitor resource usage",
          description:
            "Set up monitoring and alerts for unusual resource consumption patterns",
        },
      ],
    },
  ];

  const getAssociatedAssets = (techStackId: string) => {
    return allAssets.filter((asset) =>
      asset.techStacks.some((ts: any) => ts.id === techStackId),
    );
  };

  useEffect(() => {
    initializeSelectedAssets();
  }, [item.id]);

  const handleScanAssets = async (techStackId: string) => {
    setIsScanning(true);
    // Simulate scanning delay
    setTimeout(() => {
      const associatedAssets = getAssociatedAssets(techStackId);

      // Newly published CVEs that appear in scan results but not in known vulnerabilities
      const newCVEs = [
        {
          id: "CVE-2024-0001",
          severity: "high",
          title: "New Vulnerability in Package",
          score: 8.5,
          discovered: true,
          discoveredDate: new Date(),
        },
        {
          id: "CVE-2024-0002",
          severity: "medium",
          title: "Potential Security Issue",
          score: 6.2,
          discovered: true,
          discoveredDate: new Date(),
        },
      ];

      setNewlyDiscoveredCVEs(newCVEs);
      setScanResults({
        techStackId,
        assetsScanned: associatedAssets.length,
        knownVulnerabilities: item.cves.length,
        newlyDiscovered: newCVEs.length,
        totalVulnerabilities: item.cves.length + newCVEs.length,
        timestamp: new Date(),
      });
      setIsScanning(false);
    }, 2500);
  };

  const handleScanCVE = async (cveId: string, techStackId: string) => {
    // Simulate scanning individual CVE
    setScannedCVEs((prev) => ({
      ...prev,
      [cveId]: { isScanning: true },
    }));

    setTimeout(() => {
      const associatedAssets = getAssociatedAssets(techStackId);
      const affectedAssets = associatedAssets.filter(
        (asset) => asset.cveCount > 0,
      );
      setScannedCVEs((prev) => ({
        ...prev,
        [cveId]: {
          isScanning: false,
          assetsScanned: associatedAssets.length,
          affectedAssets: affectedAssets.length,
          timestamp: new Date(),
        },
      }));
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" onClick={onClose}>
      <div className="absolute inset-0 overflow-hidden">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" />

        {/* Panel */}
        <div
          className="absolute right-0 top-0 bottom-0 w-full max-w-[912px] bg-white shadow-xl transform transition-transform overflow-y-auto flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Risk Level Color Bar */}
          <div className={`h-1 ${getHeaderLineColor()} flex-shrink-0`} />
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
            {isAssetItem ? (
              <h2 className="text-lg font-bold text-gray-900">{item.name}</h2>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-2xl">{item.logo}</span>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {item.name} v{item.version}
                  </h2>
                </div>
              </div>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {isAssetItem ? (
              <>
                {/* Asset Details */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.type.replace("-", " ")}
                  </p>
                </div>

                <div className="space-y-3">
                  <DetailRow label="Risk Level" value={item.riskLevel} />
                  <DetailRow label="CVEs" value={item.cveCount} />
                  <DetailRow
                    label="Tech Stacks"
                    value={item.techStacks.length}
                  />
                  <DetailRow
                    label="Last Seen"
                    value={item.lastSeen.toLocaleDateString()}
                  />
                  <DetailRow
                    label="First Seen"
                    value={item.firstSeen.toLocaleDateString()}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Detected Tech Stacks
                  </h4>
                  <div className="space-y-2">
                    {item.techStacks.map((ts: any) => (
                      <div
                        key={ts.id}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{ts.logo}</span>
                            <div>
                              <p className="font-semibold text-sm">{ts.name}</p>
                              <p className="text-xs text-gray-600">
                                v{ts.version}
                              </p>
                            </div>
                          </div>
                        </div>
                        {ts.cves.length > 0 && (
                          <p className="text-xs text-red-600 mt-2">
                            {ts.cves.length} vulnerabilities
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Tech Stack Tabs */}
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full h-full"
                >
                  <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto sticky top-16 z-40 bg-white">
                    <TabsTrigger
                      value="overview"
                      className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="dependency-graph"
                      className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
                    >
                      Dependency Graph
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="p-6">
                    {/* Two Column Layout - Metadata on Left, Package Reliability on Right */}
                    <div className="grid grid-cols-3 gap-8">
                      {/* Left Column - Name, Version, and Metadata */}
                      <div className="col-span-2 space-y-6">
                        {/* Name and Version Header */}
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-4xl">{item.logo}</span>
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900">
                                {item.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                v{item.version}
                                {item.secureVersion &&
                                  item.secureVersion !== item.version && (
                                    <span className="ml-3 text-green-600 font-medium">
                                      → v{item.secureVersion} available
                                    </span>
                                  )}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Metadata - All Info Inline - Type, Risk Score, License, Effective License, EOL Status, Secure Version */}
                        <div className="grid grid-cols-3 gap-6">
                          <div>
                            <p className="text-xs font-bold text-gray-900 mb-1">
                              Type
                            </p>
                            <p className="text-sm text-gray-700">{item.type}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900 mb-1">
                              Risk Score
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                              {item.riskScore}/10
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900 mb-1">
                              License
                            </p>
                            <p className="text-sm text-gray-700">
                              {item.license}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900 mb-1">
                              Effective
                            </p>
                            <p className="text-sm text-gray-700">
                              {item.effectiveLicense}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900 mb-1">
                              EOL Status
                            </p>
                            <p
                              className={
                                item.isEOL
                                  ? "text-sm text-red-600 font-semibold"
                                  : "text-sm text-green-600 font-semibold"
                              }
                            >
                              {item.isEOL ? "⚠️ End of Life" : "✓ Active"}
                            </p>
                          </div>
                          {item.secureVersion && (
                            <div>
                              <p className="text-xs font-bold text-gray-900 mb-1">
                                Secure Version
                              </p>
                              <p className="text-sm text-green-600 font-semibold">
                                v{item.secureVersion}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Column - Package Reliability Pie Charts */}
                      {item.reliabilityIndicators && (
                        <div className="col-span-1">
                          <PackageReliabilityCard
                            indicators={item.reliabilityIndicators}
                            compact={true}
                          />
                        </div>
                      )}
                    </div>

                    {/* Unified Threat Intel Section - Moved to Top */}
                    <div className="mt-8 space-y-6">
                      <h4 className="font-semibold text-gray-900">
                        🛡️ Threat Intel
                      </h4>

                      {/* Summary Stats - Updated for Scan Coverage */}
                      {(() => {
                        const allCVEs = [...(item.cves || []), ...marketCVEs];
                        const fullyScanned = allCVEs.filter((cve: any) =>
                          cve.scanCoverage ? cve.scanCoverage.scannedAssets === cve.scanCoverage.totalAssets : false
                        ).length;
                        const partiallyScanned = allCVEs.filter((cve: any) =>
                          cve.scanCoverage ? (cve.scanCoverage.scannedAssets > 0 && cve.scanCoverage.scannedAssets < cve.scanCoverage.totalAssets) : false
                        ).length;
                        const notScanned = allCVEs.filter((cve: any) =>
                          !cve.scanCoverage || cve.scanCoverage.scannedAssets === 0
                        ).length;

                        return (
                          <div className="grid grid-cols-2 gap-2 mb-4">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                              <p className="text-xs text-gray-600 font-medium">
                                Fully Scanned
                              </p>
                              <p className="text-lg font-bold text-green-900">
                                {fullyScanned}
                              </p>
                            </div>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-center">
                              <p className="text-xs text-gray-600 font-medium">
                                Partially Scanned
                              </p>
                              <p className="text-lg font-bold text-yellow-900">
                                {partiallyScanned}
                              </p>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
                              <p className="text-xs text-gray-600 font-medium">
                                Not Scanned
                              </p>
                              <p className="text-lg font-bold text-gray-900">
                                {notScanned}
                              </p>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center">
                              <p className="text-xs text-gray-600 font-medium">
                                Total CVEs
                              </p>
                              <p className="text-lg font-bold text-blue-900">
                                {allCVEs.length}
                              </p>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Threats List - Combined Scanned and Unscanned */}
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {/* Scanned Threats */}
                        {item.cves.map((cve: any) => {
                          const cveResults = scannedCVEs[cve.id];
                          const isScanning = cveResults?.isScanning;
                          const isExpanded =
                            expandedCVE === `scanned-${cve.id}`;

                          return (
                            <div
                              key={cve.id}
                              className="border border-red-200 rounded-lg bg-red-50 transition-all"
                            >
                              <button
                                onClick={() =>
                                  setExpandedCVE(
                                    isExpanded ? null : `scanned-${cve.id}`,
                                  )
                                }
                                className="w-full text-left p-3 flex items-start gap-2 hover:opacity-80 transition-opacity"
                              >
                                <span className="text-lg flex-shrink-0 mt-0.5">
                                  {cve.severity === "critical"
                                    ? "🔴"
                                    : cve.severity === "high"
                                      ? "🟠"
                                      : cve.severity === "medium"
                                        ? "🟡"
                                        : "🟢"}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-xs text-red-900">
                                    {cve.id}
                                  </p>
                                  <p className="text-xs text-red-700 mt-1">
                                    {cve.title}
                                  </p>
                                  <div className="flex gap-2 mt-1 flex-wrap">
                                    {(() => {
                                      const associatedAssets = getAssociatedAssets(item.id);

                                      // If not scannable (threat intelligence only), always show "Not Scanned"
                                      if (cve.scanningSupported === false) {
                                        return (
                                          <Badge className="bg-gray-200 text-gray-800 text-xs">
                                            ❌ Not Scanned
                                          </Badge>
                                        );
                                      }

                                      if (!cve.scanCoverage) {
                                        return (
                                          <Badge className="bg-gray-200 text-gray-800 text-xs">
                                            ❌ Not Scanned
                                          </Badge>
                                        );
                                      }

                                      // Calculate scanned assets for this specific tech stack
                                      const scannedInThisStack = Math.min(cve.scanCoverage.scannedAssets, associatedAssets.length);

                                      if (scannedInThisStack === 0) {
                                        return (
                                          <Badge className="bg-gray-200 text-gray-800 text-xs">
                                            ❌ Not Scanned
                                          </Badge>
                                        );
                                      } else if (scannedInThisStack === associatedAssets.length) {
                                        return (
                                          <Badge className="bg-green-200 text-green-800 text-xs">
                                            ✓ Fully Scanned
                                          </Badge>
                                        );
                                      } else {
                                        return (
                                          <Badge className="bg-yellow-200 text-yellow-800 text-xs">
                                            ⚠️ Partially Scanned ({scannedInThisStack}/{associatedAssets.length})
                                          </Badge>
                                        );
                                      }
                                    })()}
                                    <Badge className="bg-blue-200 text-blue-800 text-xs">
                                      🔍 Agent Scan
                                    </Badge>
                                    <span className="text-xs text-red-700">
                                      CVSS: {cve.score.toFixed(1)} •{" "}
                                      {cve.severity.toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                                <span className="text-gray-400 flex-shrink-0 text-lg">
                                  {isExpanded ? "▼" : "▶"}
                                </span>
                              </button>

                              {isExpanded && (
                                <div className="border-t border-red-300 border-opacity-50 p-3 space-y-3 bg-white bg-opacity-50">
                                  <div>
                                    <p className="text-xs font-semibold text-gray-700 mb-1">
                                      Description
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      This is a known vulnerability that has
                                      been scanned and identified in your
                                      environment.
                                    </p>
                                  </div>

                                  {/* Affected Versions */}
                                  <div>
                                    <p className="text-xs font-semibold text-gray-700 mb-1">
                                      Affected Versions
                                    </p>
                                    <p className="text-xs bg-white bg-opacity-70 rounded px-2 py-1 font-mono text-gray-700">
                                      {cve.affected || "N/A"}
                                    </p>
                                  </div>

                                  {/* CWE and Published Date */}
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <p className="text-xs font-semibold text-gray-700 mb-1">
                                        CWE
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        {cve.cwe || "N/A"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs font-semibold text-gray-700 mb-1">
                                        Published
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        {cve.published || "N/A"}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex gap-2 pt-2">
                                    <button
                                      onClick={() => {
                                        if (
                                          selectedCVEForAssets ===
                                          `scanned-${cve.id}`
                                        ) {
                                          setSelectedCVEForAssets(null);
                                        } else {
                                          setSelectedCVEForAssets(
                                            `scanned-${cve.id}`,
                                          );
                                          const assets = getAssociatedAssets(
                                            item.id,
                                          );
                                          const selections: Record<
                                            string,
                                            boolean
                                          > = {};
                                          assets.forEach((a) => {
                                            selections[a.id] = true;
                                          });
                                          setCVEAssetSelections((prev) => ({
                                            ...prev,
                                            [`scanned-${cve.id}`]: selections,
                                          }));
                                        }
                                      }}
                                      className="flex-1 py-2 px-2 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                      <span>↻</span>
                                      {selectedCVEForAssets ===
                                      `scanned-${cve.id}`
                                        ? "Hide Assets"
                                        : `Rescan ${getAssociatedAssets(item.id).length} Assets`}
                                    </button>
                                    <button
                                      onClick={() =>
                                        onNavigateToIncident(item.id, cve.id)
                                      }
                                      className="flex-1 py-2 px-2 rounded text-xs font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                      Full Details
                                    </button>
                                  </div>

                                  {/* Asset Selection for Scanned CVE */}
                                  {selectedCVEForAssets ===
                                    `scanned-${cve.id}` && (
                                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                                      <div className="flex items-center justify-between mb-2">
                                        <div>
                                          <label className="text-xs font-semibold text-gray-900">
                                            Assets Status
                                          </label>
                                          <p className="text-xs text-gray-600 mt-0.5">
                                            {(() => {
                                              const associatedAssets = getAssociatedAssets(item.id);
                                              const scannedCount = cve.scanCoverage
                                                ? Math.min(cve.scanCoverage.scannedAssets, associatedAssets.length)
                                                : 0;
                                              const notScannedCount = associatedAssets.length - scannedCount;
                                              return `${scannedCount} scanned • ${notScannedCount} not scanned`;
                                            })()}
                                          </p>
                                        </div>
                                        <button
                                          onClick={() => {
                                            const allAssets =
                                              getAssociatedAssets(item.id);
                                            const currentSelections =
                                              cveAssetSelections[
                                                `scanned-${cve.id}`
                                              ] || {};
                                            const allSelected = allAssets.every(
                                              (a) => currentSelections[a.id],
                                            );
                                            const newSelections: Record<
                                              string,
                                              boolean
                                            > = {};
                                            allAssets.forEach((a) => {
                                              newSelections[a.id] =
                                                !allSelected;
                                            });
                                            setCVEAssetSelections((prev) => ({
                                              ...prev,
                                              [`scanned-${cve.id}`]:
                                                newSelections,
                                            }));
                                          }}
                                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                          {Object.values(
                                            cveAssetSelections[
                                              `scanned-${cve.id}`
                                            ] || {},
                                          ).every((v) => v)
                                            ? "Deselect All"
                                            : "Select All"}
                                        </button>
                                      </div>
                                      <div className="space-y-1 max-h-40 overflow-y-auto">
                                        {getAssociatedAssets(item.id).map(
                                          (asset, assetIndex) => {
                                            // Determine scan status based on scanCoverage ratio
                                            // Mark first N assets as scanned where N = Math.min(scannedAssets, totalAssociatedAssets)
                                            const associatedAssets = getAssociatedAssets(item.id);
                                            const scannedCount = cve.scanCoverage
                                              ? Math.min(cve.scanCoverage.scannedAssets, associatedAssets.length)
                                              : 0;
                                            const isAssetScanned = assetIndex < scannedCount;
                                            return (
                                              <label
                                                key={asset.id}
                                                className="flex items-center gap-2 cursor-pointer text-xs p-1 hover:bg-gray-100 rounded"
                                              >
                                                <input
                                                  type="checkbox"
                                                  checked={
                                                    cveAssetSelections[
                                                      `scanned-${cve.id}`
                                                    ]?.[asset.id] || false
                                                  }
                                                  onChange={(e) => {
                                                    setCVEAssetSelections(
                                                      (prev) => ({
                                                        ...prev,
                                                        [`scanned-${cve.id}`]: {
                                                          ...prev[
                                                            `scanned-${cve.id}`
                                                          ],
                                                          [asset.id]:
                                                            e.target.checked,
                                                        },
                                                      }),
                                                    );
                                                  }}
                                                  className="w-4 h-4 rounded"
                                                />
                                                <span className="text-gray-700 flex-1">
                                                  {asset.name}
                                                </span>
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                                  isAssetScanned
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                  {isAssetScanned ? '✓ Scanned' : 'Not scanned'}
                                                </span>
                                              </label>
                                            );
                                          },
                                        )}
                                      </div>
                                      <button
                                        onClick={() => {
                                          const selectedAssetIds = Object.keys(
                                            cveAssetSelections[
                                              `scanned-${cve.id}`
                                            ] || {},
                                          ).filter(
                                            (id) =>
                                              cveAssetSelections[
                                                `scanned-${cve.id}`
                                              ][id],
                                          );
                                          if (selectedAssetIds.length > 0) {
                                            handleScanCVE(cve.id, item.id);
                                            setSelectedCVEForAssets(null);
                                            // Navigate to rescan history after scan completes
                                            setTimeout(() => {
                                              const cveData = {
                                                cveId: cve.id,
                                                cveName: cve.name,
                                                scanner: item.name,
                                                timestamp: new Date().getTime(),
                                              };
                                              localStorage.setItem("pendingCVEScan", JSON.stringify(cveData));
                                              navigate("/rescan-history", {
                                                state: cveData
                                              });
                                            }, 1500);
                                          }
                                        }}
                                        disabled={
                                          !Object.values(
                                            cveAssetSelections[
                                              `scanned-${cve.id}`
                                            ] || {},
                                          ).some((v) => v)
                                        }
                                        className={cn(
                                          "w-full py-1.5 px-2 rounded text-xs font-medium transition-colors flex items-center justify-center gap-2",
                                          Object.values(
                                            cveAssetSelections[
                                              `scanned-${cve.id}`
                                            ] || {},
                                          ).some((v) => v)
                                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                                            : "bg-gray-400 text-white cursor-not-allowed",
                                        )}
                                      >
                                        <span>↻</span>
                                        Rescan Selected Assets
                                      </button>
                                    </div>
                                  )}

                                  {cveResults && !isScanning && (
                                    <div className="p-2 bg-blue-100 border border-blue-300 rounded">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">✓</span>
                                        <p className="font-semibold text-blue-900 text-xs">
                                          Scan Complete
                                        </p>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="bg-blue-50 rounded p-1.5">
                                          <p className="text-gray-600 font-medium">
                                            Assets Scanned
                                          </p>
                                          <p className="text-blue-900 font-bold">
                                            {cveResults.assetsScanned}
                                          </p>
                                        </div>
                                        <div className="bg-red-50 rounded p-1.5">
                                          <p className="text-gray-600 font-medium">
                                            Affected
                                          </p>
                                          <p className="text-red-900 font-bold">
                                            {cveResults.affectedAssets}
                                          </p>
                                        </div>
                                      </div>
                                      {cveResults.affectedAssets > 0 && (
                                        <p className="text-xs text-red-700 mt-2 font-semibold">
                                          ⚠️ {cveResults.affectedAssets}{" "}
                                          asset(s) are vulnerable
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* Unscanned Threats from Market */}
                        {marketCVEs.map((cve: any) => {
                          const cveResults = scannedCVEs[cve.id];
                          const isScanning = cveResults?.isScanning;
                          const isExpanded = expandedCVE === `market-${cve.id}`;

                          return (
                            <div
                              key={cve.id}
                              className={cn(
                                "border rounded-lg transition-all",
                                cve.severity === "critical"
                                  ? "bg-red-50 border-red-200"
                                  : cve.severity === "high"
                                    ? "bg-orange-50 border-orange-200"
                                    : "bg-yellow-50 border-yellow-200",
                              )}
                            >
                              <button
                                onClick={() =>
                                  setExpandedCVE(
                                    isExpanded ? null : `market-${cve.id}`,
                                  )
                                }
                                className="w-full text-left p-3 flex items-start gap-2 hover:opacity-80 transition-opacity"
                              >
                                <span className="text-lg flex-shrink-0 mt-0.5">
                                  {cve.severity === "critical"
                                    ? "🔴"
                                    : cve.severity === "high"
                                      ? "🟠"
                                      : "🟡"}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-xs text-gray-900">
                                    {cve.id}
                                  </p>
                                  <p className="text-xs text-gray-700 mt-1">
                                    {cve.title}
                                  </p>
                                  <div className="flex gap-2 mt-1 flex-wrap">
                                    {(() => {
                                      const associatedAssets = getAssociatedAssets(item.id);

                                      // If not scannable (threat intelligence only), always show "Not Scanned"
                                      if (cve.scanningSupported === false) {
                                        return (
                                          <Badge className="bg-gray-200 text-gray-800 text-xs">
                                            ❌ Not Scanned
                                          </Badge>
                                        );
                                      }

                                      if (!cve.scanCoverage) {
                                        return (
                                          <Badge className="bg-gray-200 text-gray-800 text-xs">
                                            ❌ Not Scanned
                                          </Badge>
                                        );
                                      }

                                      // Calculate scanned assets for this specific tech stack
                                      const scannedInThisStack = Math.min(cve.scanCoverage.scannedAssets, associatedAssets.length);

                                      if (scannedInThisStack === 0) {
                                        return (
                                          <Badge className="bg-gray-200 text-gray-800 text-xs">
                                            ❌ Not Scanned
                                          </Badge>
                                        );
                                      } else if (scannedInThisStack === associatedAssets.length) {
                                        return (
                                          <Badge className="bg-green-200 text-green-800 text-xs">
                                            ✓ Fully Scanned
                                          </Badge>
                                        );
                                      } else {
                                        return (
                                          <Badge className="bg-yellow-200 text-yellow-800 text-xs">
                                            ⚠️ Partially Scanned ({scannedInThisStack}/{associatedAssets.length})
                                          </Badge>
                                        );
                                      }
                                    })()}
                                    <Badge className="bg-purple-200 text-purple-800 text-xs">
                                      📡 Threat Intelligence
                                    </Badge>
                                    <span className="text-xs text-gray-700">
                                      CVSS: {cve.score.toFixed(1)} •{" "}
                                      {cve.severity.toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                                <span className="text-gray-400 flex-shrink-0 text-lg">
                                  {isExpanded ? "▼" : "▶"}
                                </span>
                              </button>

                              {isExpanded && (
                                <div className="border-t border-gray-300 border-opacity-50 p-3 space-y-3 bg-white bg-opacity-50">
                                  {/* Description */}
                                  <div>
                                    <p className="text-xs font-semibold text-gray-700 mb-1">
                                      Description
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      {cve.description}
                                    </p>
                                  </div>

                                  {/* Affected Versions */}
                                  <div>
                                    <p className="text-xs font-semibold text-gray-700 mb-1">
                                      Affected Versions
                                    </p>
                                    <p className="text-xs bg-white bg-opacity-70 rounded px-2 py-1 font-mono text-gray-700">
                                      {cve.affected}
                                    </p>
                                  </div>

                                  {/* CWE and Published Date */}
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <p className="text-xs font-semibold text-gray-700 mb-1">
                                        CWE
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        {cve.cwe}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs font-semibold text-gray-700 mb-1">
                                        Published
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        {cve.published}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  {cve.scanningSupported ? (
                                    <div className="flex gap-2 pt-2">
                                      <button
                                        onClick={() => {
                                          if (
                                            selectedCVEForAssets ===
                                            `market-${cve.id}`
                                          ) {
                                            setSelectedCVEForAssets(null);
                                          } else {
                                            setSelectedCVEForAssets(
                                              `market-${cve.id}`,
                                            );
                                            const assets = getAssociatedAssets(
                                              item.id,
                                            );
                                            const selections: Record<
                                              string,
                                              boolean
                                            > = {};
                                            assets.forEach((a) => {
                                              selections[a.id] = true;
                                            });
                                            setCVEAssetSelections((prev) => ({
                                              ...prev,
                                              [`market-${cve.id}`]: selections,
                                            }));
                                          }
                                        }}
                                        className="flex-1 py-2 px-2 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white"
                                      >
                                        <span>🔍</span>
                                        {selectedCVEForAssets ===
                                        `market-${cve.id}`
                                          ? "Hide Assets"
                                          : `Scan ${getAssociatedAssets(item.id).length} Assets`}
                                      </button>
                                      <button
                                        onClick={() =>
                                          onNavigateToIncident(item.id, cve.id)
                                        }
                                        className="flex-1 py-2 px-2 rounded text-xs font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                                      >
                                        Full Details
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        onNavigateToIncident(item.id, cve.id)
                                      }
                                      className="w-full py-2 px-2 rounded text-xs font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                      Full Details
                                    </button>
                                  )}

                                  {/* Tech Intelligence Warning & Remediation Steps - Shown when scanning is not supported */}
                                  {!cve.scanningSupported &&
                                    cve.remediationSteps && (
                                      <div className="space-y-2">
                                        {/* Warning Banner for Unscannable CVE */}
                                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                          <div className="flex items-start gap-2">
                                            <span className="text-lg flex-shrink-0 mt-0.5">
                                              ℹ️
                                            </span>
                                            <div className="flex-1 min-w-0">
                                              <p className="text-xs font-semibold text-amber-900 mb-1">
                                                Technology Intelligence Identified
                                              </p>
                                              <p className="text-xs text-amber-800">
                                                This vulnerability is identified through technology intelligence based on detected software version and external vulnerability databases. Agent-based verification is not required or applicable for this finding.
                                              </p>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Expandable Remediation Steps */}
                                        <button
                                          onClick={() => {
                                            const remKey = `${cve.id}-remediation`;
                                            setExpandedRemediations((prev) => ({
                                              ...prev,
                                              [remKey]: !prev[remKey],
                                            }));
                                          }}
                                          className="w-full p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left flex items-center justify-between"
                                        >
                                          <div className="flex items-center gap-2 flex-1">
                                            <span className="text-lg flex-shrink-0">
                                              📋
                                            </span>
                                            <span className="text-xs font-semibold text-blue-900">
                                              Remediation Steps
                                            </span>
                                          </div>
                                          <span
                                            className="text-gray-400 flex-shrink-0 text-lg transition-transform"
                                            style={{
                                              transform: expandedRemediations[
                                                `${cve.id}-remediation`
                                              ]
                                                ? "rotate(180deg)"
                                                : "rotate(0deg)",
                                            }}
                                          >
                                            ▼
                                          </span>
                                        </button>

                                        {/* Remediation Steps Content */}
                                        {expandedRemediations[
                                          `${cve.id}-remediation`
                                        ] && (
                                          <div className="p-3 bg-white border border-blue-200 border-t-0 rounded-b-lg space-y-3">
                                            {cve.remediationSteps.map(
                                              (step: any, idx: number) => (
                                                <div
                                                  key={idx}
                                                  className="text-xs text-gray-700 pb-2 border-b border-gray-200 last:border-b-0 last:pb-0"
                                                >
                                                  <p className="font-semibold text-gray-900 flex items-start gap-2">
                                                    <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">
                                                      {step.step}
                                                    </span>
                                                    {step.title}
                                                  </p>
                                                  <p className="text-gray-600 mt-1 ml-7">
                                                    {step.description}
                                                  </p>
                                                </div>
                                              ),
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    )}

                                  {/* Asset Selection for Market CVE */}
                                  {cve.scanningSupported &&
                                    selectedCVEForAssets ===
                                      `market-${cve.id}` && (
                                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                                        <div className="flex items-center justify-between mb-2">
                                          <div>
                                            <label className="text-xs font-semibold text-gray-900">
                                              Assets Status
                                            </label>
                                            <p className="text-xs text-gray-600 mt-0.5">
                                              {(() => {
                                                const associatedAssets = getAssociatedAssets(item.id);
                                                const scannedCount = cve.scanCoverage
                                                  ? Math.min(cve.scanCoverage.scannedAssets, associatedAssets.length)
                                                  : 0;
                                                const notScannedCount = associatedAssets.length - scannedCount;
                                                return `${scannedCount} scanned • ${notScannedCount} not scanned`;
                                              })()}
                                            </p>
                                          </div>
                                          <button
                                            onClick={() => {
                                              const allAssets =
                                                getAssociatedAssets(item.id);
                                              const currentSelections =
                                                cveAssetSelections[
                                                  `market-${cve.id}`
                                                ] || {};
                                              const allSelected =
                                                allAssets.every(
                                                  (a) =>
                                                    currentSelections[a.id],
                                                );
                                              const newSelections: Record<
                                                string,
                                                boolean
                                              > = {};
                                              allAssets.forEach((a) => {
                                                newSelections[a.id] =
                                                  !allSelected;
                                              });
                                              setCVEAssetSelections((prev) => ({
                                                ...prev,
                                                [`market-${cve.id}`]:
                                                  newSelections,
                                              }));
                                            }}
                                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                          >
                                            {Object.values(
                                              cveAssetSelections[
                                                `market-${cve.id}`
                                              ] || {},
                                            ).every((v) => v)
                                              ? "Deselect All"
                                              : "Select All"}
                                          </button>
                                        </div>
                                        <div className="space-y-1 max-h-40 overflow-y-auto">
                                          {getAssociatedAssets(item.id).map(
                                            (asset, assetIndex) => {
                                              const associatedAssets = getAssociatedAssets(item.id);
                                              const scannedCount = cve.scanCoverage
                                                ? Math.min(cve.scanCoverage.scannedAssets, associatedAssets.length)
                                                : 0;
                                              const isAssetScanned = assetIndex < scannedCount;

                                              return (
                                                <label
                                                  key={asset.id}
                                                  className="flex items-center gap-2 cursor-pointer text-xs p-1 hover:bg-gray-100 rounded"
                                                >
                                                  <input
                                                    type="checkbox"
                                                    checked={
                                                      cveAssetSelections[
                                                        `market-${cve.id}`
                                                      ]?.[asset.id] || false
                                                    }
                                                    onChange={(e) => {
                                                      setCVEAssetSelections(
                                                        (prev) => ({
                                                          ...prev,
                                                          [`market-${cve.id}`]: {
                                                            ...prev[
                                                              `market-${cve.id}`
                                                            ],
                                                            [asset.id]:
                                                              e.target.checked,
                                                          },
                                                        }),
                                                      );
                                                    }}
                                                    className="w-4 h-4 rounded"
                                                  />
                                                  <span className="text-gray-700 flex-1">
                                                    {asset.name}
                                                  </span>
                                                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                                    isAssetScanned
                                                      ? 'bg-green-100 text-green-700'
                                                      : 'bg-gray-100 text-gray-600'
                                                  }`}>
                                                    {isAssetScanned ? '✓ Scanned' : 'Not scanned'}
                                                  </span>
                                                </label>
                                              );
                                            }
                                          )}
                                        </div>
                                        <button
                                          onClick={() => {
                                            const selectedAssetIds =
                                              Object.keys(
                                                cveAssetSelections[
                                                  `market-${cve.id}`
                                                ] || {},
                                              ).filter(
                                                (id) =>
                                                  cveAssetSelections[
                                                    `market-${cve.id}`
                                                  ][id],
                                              );
                                            if (selectedAssetIds.length > 0) {
                                              handleScanCVE(cve.id, item.id);
                                              setSelectedCVEForAssets(null);
                                              // Navigate to rescan history after scan completes
                                              setTimeout(() => {
                                                const cveData = {
                                                  cveId: cve.id,
                                                  cveName: cve.name,
                                                  scanner: item.name,
                                                  timestamp: new Date().getTime(),
                                                };
                                                localStorage.setItem("pendingCVEScan", JSON.stringify(cveData));
                                                navigate("/rescan-history", {
                                                  state: cveData
                                                });
                                              }, 1500);
                                            }
                                          }}
                                          disabled={
                                            !Object.values(
                                              cveAssetSelections[
                                                `market-${cve.id}`
                                              ] || {},
                                            ).some((v) => v)
                                          }
                                          className={cn(
                                            "w-full py-1.5 px-2 rounded text-xs font-medium transition-colors",
                                            Object.values(
                                              cveAssetSelections[
                                                `market-${cve.id}`
                                              ] || {},
                                            ).some((v) => v)
                                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                                              : "bg-gray-400 text-white cursor-not-allowed",
                                          )}
                                        >
                                          Scan Selected Assets
                                        </button>
                                      </div>
                                    )}

                                  {/* Scan Results for this CVE */}
                                  {cve.scanningSupported &&
                                    cveResults &&
                                    !isScanning && (
                                      <div className="p-2 bg-blue-100 border border-blue-300 rounded">
                                        <div className="flex items-center gap-2 mb-2">
                                          <span className="text-lg">✓</span>
                                          <p className="font-semibold text-blue-900 text-xs">
                                            Scan Complete
                                          </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                          <div className="bg-blue-50 rounded p-1.5">
                                            <p className="text-gray-600 font-medium">
                                              Assets Scanned
                                            </p>
                                            <p className="text-blue-900 font-bold">
                                              {cveResults.assetsScanned}
                                            </p>
                                          </div>
                                          <div className="bg-red-50 rounded p-1.5">
                                            <p className="text-gray-600 font-medium">
                                              Affected
                                            </p>
                                            <p className="text-red-900 font-bold">
                                              {cveResults.affectedAssets}
                                            </p>
                                          </div>
                                        </div>
                                        {cveResults.affectedAssets > 0 && (
                                          <p className="text-xs text-red-700 mt-2 font-semibold">
                                            ⚠️ {cveResults.affectedAssets}{" "}
                                            asset(s) are vulnerable
                                          </p>
                                        )}
                                      </div>
                                    )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Asset Selection and Scanning Controls - Moved after CVEs */}
                      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-semibold text-gray-700">
                            Select Assets to Scan
                          </label>
                          <button
                            onClick={() => {
                              const allAssets = getAssociatedAssets(item.id);
                              const currentSelected = Object.keys(
                                selectedAssetsForScan,
                              ).filter(
                                (key) => selectedAssetsForScan[key as any],
                              );
                              if (currentSelected.length === allAssets.length) {
                                const newSelection = {
                                  ...selectedAssetsForScan,
                                };
                                allAssets.forEach(
                                  (a) => (newSelection[a.id as any] = false),
                                );
                                setSelectedAssetsForScan(newSelection);
                              } else {
                                const newSelection = {
                                  ...selectedAssetsForScan,
                                };
                                allAssets.forEach(
                                  (a) => (newSelection[a.id as any] = true),
                                );
                                setSelectedAssetsForScan(newSelection);
                              }
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {Object.keys(selectedAssetsForScan).length ===
                              getAssociatedAssets(item.id).length &&
                            Object.keys(selectedAssetsForScan).length > 0
                              ? "Deselect All"
                              : "Select All"}
                          </button>
                        </div>
                        <div className="space-y-2 max-h-32 overflow-y-auto mb-3">
                          {getAssociatedAssets(item.id).map((asset) => (
                            <label
                              key={asset.id}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  selectedAssetsForScan[asset.id as any] ||
                                  false
                                }
                                onChange={(e) =>
                                  setSelectedAssetsForScan((prev) => ({
                                    ...prev,
                                    [asset.id]: e.target.checked,
                                  }))
                                }
                                className="w-4 h-4 rounded"
                              />
                              <span className="text-xs text-gray-700">
                                {asset.name}
                              </span>
                            </label>
                          ))}
                        </div>

                        <button
                          onClick={() => {
                            const selectedAssetIds = Object.keys(
                              selectedAssetsForScan,
                            ).filter((id) => selectedAssetsForScan[id as any]);
                            if (selectedAssetIds.length > 0) {
                              handleScanAssets(item.id);
                            }
                          }}
                          disabled={
                            isScanning ||
                            Object.values(selectedAssetsForScan).every(
                              (v) => !v,
                            )
                          }
                          className={cn(
                            "w-full font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2",
                            isScanning ||
                              Object.values(selectedAssetsForScan).every(
                                (v) => !v,
                              )
                              ? "bg-gray-400 text-white cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700 text-white",
                          )}
                        >
                          <span>{isScanning ? "⏳" : "🔍"}</span>
                          {isScanning
                            ? "Scanning Against Each Scannable CVEs..."
                            : `Scan Against Each Scannable CVEs`}
                        </button>
                      </div>
                    </div>

                    {/* Associated Assets */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Used by {getAssociatedAssets(item.id).length} Asset
                        {getAssociatedAssets(item.id).length !== 1 ? "s" : ""}
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {getAssociatedAssets(item.id).map((asset) => {
                          const getRiskBadgeColor = (level: string) => {
                            switch (level) {
                              case "critical":
                                return "bg-red-100 text-red-800";
                              case "high":
                                return "bg-orange-100 text-orange-800";
                              case "medium":
                                return "bg-yellow-100 text-yellow-800";
                              case "low":
                                return "bg-green-100 text-green-800";
                              default:
                                return "bg-gray-100 text-gray-800";
                            }
                          };

                          // Get logos from tech stacks
                          const techStackLogos = asset.techStacks
                            .slice(0, 2)
                            .map((ts) => ts.logo);

                          return (
                            <div
                              key={asset.id}
                              className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                              onClick={() => {
                                onSelectAsset(asset);
                              }}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2 flex-1">
                                  <div className="flex gap-1">
                                    {techStackLogos.map((logo, idx) => (
                                      <span
                                        key={idx}
                                        className="text-lg cursor-pointer hover:scale-110 transition-transform"
                                        title={
                                          asset.techStacks[idx]?.name ||
                                          "Tech Stack"
                                        }
                                      >
                                        {logo}
                                      </span>
                                    ))}
                                    {asset.techStacks.length > 2 && (
                                      <span
                                        className="text-sm font-semibold text-gray-600"
                                        title={asset.techStacks
                                          .slice(2)
                                          .map((ts) => ts.name)
                                          .join(", ")}
                                      >
                                        +{asset.techStacks.length - 2}
                                      </span>
                                    )}
                                  </div>
                                  <p className="font-semibold text-sm text-gray-900">
                                    {asset.name}
                                  </p>
                                </div>
                                <Badge
                                  className={`${getRiskBadgeColor(asset.riskLevel)} text-xs`}
                                >
                                  {asset.riskLevel}
                                </Badge>
                              </div>
                              <div className="space-y-1 text-xs text-gray-600">
                                <p>
                                  Type:{" "}
                                  <span className="font-medium text-gray-700">
                                    {asset.type.replace("-", " ")}
                                  </span>
                                </p>
                                <p>
                                  CVEs:{" "}
                                  <span className="font-medium text-gray-700">
                                    {asset.cveCount}
                                  </span>
                                </p>
                                <p>
                                  Last Seen:{" "}
                                  <span className="font-medium text-gray-700">
                                    {asset.lastSeen.toLocaleDateString()}
                                  </span>
                                </p>
                                <p>
                                  First Seen:{" "}
                                  <span className="font-medium text-gray-700">
                                    {asset.firstSeen.toLocaleDateString()}
                                  </span>
                                </p>
                                {asset.isScanned && (
                                  <p className="text-green-700">✓ Scanned</p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Remediations */}
                    {item.remediations && item.remediations.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Recommended Remediations
                        </h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {item.remediations.map((rem: any) => (
                            <div
                              key={rem.id}
                              className={cn(
                                "p-3 rounded-lg border text-xs",
                                rem.priority === "critical"
                                  ? "bg-red-50 border-red-200"
                                  : rem.priority === "high"
                                    ? "bg-orange-50 border-orange-200"
                                    : "bg-blue-50 border-blue-200",
                              )}
                            >
                              <p className="font-semibold">{rem.title}</p>
                              <p className="text-gray-600 mt-1">
                                {rem.description}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <Badge
                                  className={cn(
                                    rem.priority === "critical"
                                      ? "bg-red-100 text-red-800"
                                      : rem.priority === "high"
                                        ? "bg-orange-100 text-orange-800"
                                        : "bg-blue-100 text-blue-800",
                                  )}
                                >
                                  {rem.priority}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {rem.estimatedTime}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="dependency-graph" className="p-6">
                    <DependencyGraph techStack={item} />
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}

function DetailRowClickable({
  label,
  value,
  isClickable = false,
  onClick,
}: {
  label: string;
  value: string | number;
  isClickable?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={!isClickable}
      className={cn(
        "w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-colors",
        isClickable ? "hover:bg-gray-100 cursor-pointer" : "cursor-default",
      )}
    >
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </button>
  );
}

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartScan: (projectName: string) => void;
  onOpenImport?: () => void;
  onOpenAutomaticScan?: () => void;
  setShowImportModal?: (show: boolean) => void;
  setShowNewProjectModal?: (show: boolean) => void;
}

function NewProjectModal({
  isOpen,
  onClose,
  onStartScan,
  onOpenImport,
  onOpenAutomaticScan,
  setShowImportModal,
  setShowNewProjectModal,
}: NewProjectModalProps) {
  const [activeStep, setActiveStep] = useState<
    "options" | "sourceCode" | "selectScanners"
  >("options");
  const [formData, setFormData] = useState({
    projectName: "",
    tags: [] as string[],
    tagInput: "",
    sourceType: "file" as "file" | "repository" | "sbom",
    branch: "",
    incrementalScan: false,
    saveAsDefault: false,
    scanners: {
      sast: false,
      sca: true,
      containerSecurity: false,
      iacSecurity: false,
      apiSecurity: false,
      ossfScorecard: false,
      secretDetection: false,
    } as Record<string, boolean>,
  });

  if (!isOpen) return null;

  const options = [
    {
      id: "manual-scan",
      icon: "➕",
      title: "New Project - Manual Scan",
      description: "Scan from ZIP/TAR archive, SBOM file or repository URL",
      active: true,
    },
    {
      id: "code-repo",
      icon: "📤",
      title: "New Project - Code Repository Integration",
      description: "Import your code repositories from your SCM",
      active: true,
    },
    {
      id: "automatic-scan",
      icon: "⚙️",
      title: "New Scan - Automatic Scan",
      description: "Push the SBOM/CBOM on every gh action trigger",
      active: true,
    },
  ];

  const handleAddTag = () => {
    if (formData.tagInput.trim()) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.tagInput.trim()],
        tagInput: "",
      });
    }
  };

  const handleRemoveTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index),
    });
  };

  const handleNext = () => {
    if (activeStep === "sourceCode") {
      setActiveStep("selectScanners");
    }
  };

  const handleFinish = () => {
    console.log("Finishing scan setup:", formData);
    // Call onStartScan with the project name
    onStartScan(formData.projectName);
    setActiveStep("options");
    setFormData({
      projectName: "",
      tags: [],
      tagInput: "",
      sourceType: "file",
      branch: "",
      incrementalScan: false,
      saveAsDefault: false,
      scanners: {
        sast: false,
        sca: true,
        containerSecurity: false,
        iacSecurity: false,
        apiSecurity: false,
        ossfScorecard: false,
        secretDetection: false,
      },
    });
  };

  const handleBackToOptions = () => {
    setActiveStep("options");
    setFormData({
      projectName: "",
      tags: [],
      tagInput: "",
      sourceType: "file",
      branch: "",
      incrementalScan: false,
      saveAsDefault: false,
      scanners: {
        sast: false,
        sca: true,
        containerSecurity: false,
        iacSecurity: false,
        apiSecurity: false,
        ossfScorecard: false,
        secretDetection: false,
      },
    });
  };

  if (activeStep !== "options") {
    return (
      <div
        className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 flex max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left Sidebar */}
          <div className="bg-gray-50 w-56 p-6 flex flex-col border-r border-gray-200">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-2xl">📡</span>
              <h2 className="text-lg font-bold text-gray-900">New Scan</h2>
            </div>

            {/* Steps */}
            <div className="space-y-4 flex-1">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white",
                    activeStep === "sourceCode" ? "bg-blue-600" : "bg-gray-400",
                  )}
                >
                  1
                </div>
                <div>
                  <p
                    className={cn(
                      "font-semibold text-sm",
                      activeStep === "sourceCode"
                        ? "text-gray-900"
                        : "text-gray-600",
                    )}
                  >
                    Select Source
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white",
                    activeStep === "selectScanners"
                      ? "bg-blue-600"
                      : "bg-gray-400",
                  )}
                >
                  2
                </div>
                <div>
                  <p
                    className={cn(
                      "font-semibold text-sm",
                      activeStep === "selectScanners"
                        ? "text-gray-900"
                        : "text-gray-600",
                    )}
                  >
                    Select Scanners
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleBackToOptions}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back
            </button>
          </div>

          {/* Right Content */}
          <div className="flex-1 p-6 overflow-y-auto flex flex-col">
            <div className="space-y-4 flex-1">
              {activeStep === "sourceCode" && (
                <>
                  {/* Project Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Project Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.projectName}
                        onChange={(e) => {
                          if (e.target.value === "add-new") {
                            // Handle add new project - you can add logic here to open a new project creation form
                            console.log("Add new project clicked");
                            setFormData({ ...formData, projectName: "" });
                          } else {
                            setFormData({
                              ...formData,
                              projectName: e.target.value,
                            });
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none bg-white cursor-pointer"
                      >
                        <option value="">Select project</option>
                        <option value="as">as</option>
                        <option value="new-project">New Project</option>
                        <option value="" disabled>
                          ──────────────
                        </option>
                        <option value="add-new">+ Add New Project</option>
                      </select>
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                        ▼
                      </span>
                    </div>
                  </div>

                  {/* Source to Scan */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Source to Scan <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2 mb-4">
                      {["File", "SBOM", "Repository"].map((type) => {
                        const isDisabled = type === "Repository";
                        return (
                          <div key={type} className="relative group">
                            <button
                              onClick={() => {
                                if (!isDisabled) {
                                  setFormData({
                                    ...formData,
                                    sourceType: type.toLowerCase() as any,
                                  });
                                }
                              }}
                              disabled={isDisabled}
                              className={cn(
                                "px-4 py-2 rounded-lg font-medium text-sm transition-colors",
                                isDisabled
                                  ? "bg-gray-300 text-gray-500 opacity-70 cursor-not-allowed"
                                  : formData.sourceType === type.toLowerCase()
                                    ? "bg-gray-600 text-white"
                                    : "bg-gray-300 text-gray-700 hover:bg-gray-400",
                              )}
                            >
                              {type}
                            </button>
                            {isDisabled && (
                              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 flex items-center justify-center">
                                <span className="text-white text-xs font-semibold whitespace-nowrap">
                                  Coming Soon
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* File Type - File Upload */}
                    {formData.sourceType === "file" && (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 mb-4">
                        <div className="text-4xl mb-2">📱</div>
                        <p className="text-sm text-gray-600">
                          Drop ZIP/TAR file here or{" "}
                          <button className="text-blue-600 hover:text-blue-800 font-medium">
                            Select File
                          </button>
                        </p>
                      </div>
                    )}

                    {/* Repository Type - Repository URL */}
                    {formData.sourceType === "repository" && (
                      <>
                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Repository URL{" "}
                            <span className="text-gray-500 text-xs">
                              (i) Info
                            </span>
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder=""
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            <button className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg text-sm font-medium">
                              Fetch Branches
                            </button>
                          </div>
                        </div>
                      </>
                    )}

                    {/* SBOM Type - File Upload */}
                    {formData.sourceType === "sbom" && (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 mb-4">
                        <div className="text-4xl mb-2">📄</div>
                        <p className="text-sm text-gray-600">
                          Drop JSON/XML file here or{" "}
                          <button className="text-blue-600 hover:text-blue-800 font-medium">
                            Select File
                          </button>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Branch - Only for File and SBOM */}
                  {formData.sourceType !== "repository" && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Branch
                      </label>
                      <input
                        type="text"
                        placeholder="Enter branch"
                        value={formData.branch}
                        onChange={(e) =>
                          setFormData({ ...formData, branch: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      {formData.sourceType === "sbom" && (
                        <p className="text-xs text-gray-600 mt-2">
                          ℹ️ Branch information will be extracted from the SBOM file if available. Enter a default branch name if not found in the SBOM.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Scan Tags */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Scan Tags
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Add Tags (i.e. CodeVersion:Feature)"
                        value={formData.tagInput}
                        onChange={(e) =>
                          setFormData({ ...formData, tagInput: e.target.value })
                        }
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs"
                          >
                            {tag}
                            <button
                              onClick={() => handleRemoveTag(index)}
                              className="text-blue-600 hover:text-blue-900 font-bold"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </>
              )}

              {activeStep === "selectScanners" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Select Scanners
                    </h3>
                    <div className="flex gap-4">
                      <button
                        onClick={() => {
                          setFormData({
                            ...formData,
                            scanners: {
                              sast: true,
                              sca: true,
                              containerSecurity: false,
                              iacSecurity: false,
                              apiSecurity: false,
                              ossfScorecard: false,
                              secretDetection: false,
                            },
                          });
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Select all
                      </button>
                      <button
                        onClick={() => {
                          setFormData({
                            ...formData,
                            scanners: {
                              sast: false,
                              sca: false,
                              containerSecurity: false,
                              iacSecurity: false,
                              apiSecurity: false,
                              ossfScorecard: false,
                              secretDetection: false,
                            },
                          });
                        }}
                        className="text-sm text-gray-400 hover:text-gray-600 font-medium"
                      >
                        Deselect all
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* SAST */}
                    <div
                      onClick={() =>
                        setFormData({
                          ...formData,
                          scanners: {
                            ...formData.scanners,
                            sast: !formData.scanners.sast,
                          },
                        })
                      }
                      className={cn(
                        "p-5 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md",
                        formData.scanners.sast
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      )}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">SAST</p>
                          <p className="text-xs text-gray-600 mt-1">
                            CloudSek Static Application Security Testing
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.scanners.sast}
                          onChange={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                          className="w-5 h-5 ml-2 flex-shrink-0 cursor-pointer accent-blue-600"
                        />
                      </div>
                    </div>

                    {/* SCA */}
                    <div
                      onClick={() =>
                        setFormData({
                          ...formData,
                          scanners: {
                            ...formData.scanners,
                            sca: !formData.scanners.sca,
                          },
                        })
                      }
                      className={cn(
                        "p-5 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md",
                        formData.scanners.sca
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      )}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">SCA</p>
                          <p className="text-xs text-gray-600 mt-1">
                            CloudSek Software Composition Analysis
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.scanners.sca}
                          onChange={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                          className="w-5 h-5 ml-2 flex-shrink-0 cursor-pointer accent-blue-600"
                        />
                      </div>
                    </div>

                    {/* Container Security */}
                    <div className="relative group">
                      <div className="p-5 border-2 border-gray-200 bg-white rounded-lg opacity-60 cursor-not-allowed">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              Container Security
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              CloudSek Container Analysis
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            disabled
                            className="w-5 h-5 ml-2 flex-shrink-0 cursor-not-allowed opacity-40"
                          />
                        </div>
                      </div>
                      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold whitespace-nowrap">
                          Coming Soon
                        </span>
                      </div>
                    </div>

                    {/* IaC Security */}
                    <div className="relative group">
                      <div className="p-5 border-2 border-gray-200 bg-white rounded-lg opacity-60 cursor-not-allowed">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              IaC Security
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              CloudSek Static Code Analysis for Infrastructure as
                              Code
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            disabled
                            className="w-5 h-5 ml-2 flex-shrink-0 cursor-not-allowed opacity-40"
                          />
                        </div>
                      </div>
                      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold whitespace-nowrap">
                          Coming Soon
                        </span>
                      </div>
                    </div>

                    {/* API Security */}
                    <div className="relative group">
                      <div className="p-5 border-2 border-gray-200 bg-white rounded-lg opacity-60 cursor-not-allowed">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              API Security
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              CloudSek Static Analysis for API Security
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            disabled
                            className="w-5 h-5 ml-2 flex-shrink-0 cursor-not-allowed opacity-40"
                          />
                        </div>
                      </div>
                      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold whitespace-nowrap">
                          Coming Soon
                        </span>
                      </div>
                    </div>

                    {/* OSSF Scorecard */}
                    <div className="relative group">
                      <div className="p-5 border-2 border-gray-200 bg-white rounded-lg opacity-60 cursor-not-allowed">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-gray-900">
                                OSSF Scorecard
                              </p>
                              <span className="text-gray-400 cursor-help">
                                ℹ
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              Identify risk factors throughout your project's
                              supply chain
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            disabled
                            className="w-5 h-5 ml-2 flex-shrink-0 cursor-not-allowed opacity-40"
                          />
                        </div>
                      </div>
                      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold whitespace-nowrap">
                          Coming Soon
                        </span>
                      </div>
                    </div>

                    {/* Secret Detection */}
                    <div className="relative group">
                      <div className="p-5 border-2 border-gray-200 bg-white rounded-lg opacity-60 cursor-not-allowed">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-gray-900">
                                Secret Detection
                              </p>
                              <span className="text-gray-400 cursor-help">
                                ℹ
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              Detect unencrypted secrets in your project
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            disabled
                            className="w-5 h-5 ml-2 flex-shrink-0 cursor-not-allowed opacity-40"
                          />
                        </div>
                      </div>
                      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold whitespace-nowrap">
                          Coming Soon
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 border-t border-gray-200 pt-4 mt-6">
              {activeStep === "selectScanners" && (
                <button
                  onClick={() => setActiveStep("sourceCode")}
                  className="px-4 py-2 text-gray-700 font-medium text-sm"
                >
                  Back
                </button>
              )}
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm"
              >
                Cancel
              </button>
              {activeStep === "sourceCode" && (
                <button
                  onClick={handleNext}
                  disabled={!formData.projectName.trim()}
                  className={cn(
                    "flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors",
                    formData.projectName.trim()
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed",
                  )}
                >
                  Next
                </button>
              )}
              {activeStep === "selectScanners" && (
                <button
                  onClick={handleFinish}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm"
                >
                  Scan
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-3">
          {options.map((option) => (
            <div key={option.id} className="relative group">
              <button
                onClick={() => {
                  if (option.active) {
                    if (option.id === "code-repo") {
                      if (onOpenImport) {
                        onOpenImport();
                      } else if (setShowImportModal && setShowNewProjectModal) {
                        setShowNewProjectModal(false);
                        setShowImportModal(true);
                      }
                    } else if (option.id === "automatic-scan") {
                      onOpenAutomaticScan?.();
                    } else {
                      setActiveStep("sourceCode");
                    }
                  }
                }}
                disabled={!option.active}
                className={cn(
                  "w-full flex items-start gap-3 p-3 rounded-lg border transition-all text-left",
                  option.active
                    ? "border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer"
                    : "border-gray-200 opacity-70 cursor-not-allowed",
                )}
              >
                <span className="text-2xl flex-shrink-0">{option.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3
                    className={cn(
                      "font-semibold text-sm",
                      option.active
                        ? "text-gray-900 group-hover:text-blue-600"
                        : "text-gray-600",
                    )}
                  >
                    {option.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {option.description}
                  </p>
                </div>
              </button>

              {!option.active && (
                <div className="absolute inset-0 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 backdrop-blur-sm">
                  <span className="text-white text-xs font-semibold whitespace-nowrap">
                    Coming Soon
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface AutomaticScanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AutomaticScanModal({ isOpen, onClose }: AutomaticScanModalProps) {
  const [step, setStep] = useState<"config" | "tool" | "ghAction" | "script">("config");
  const [projectName, setProjectName] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [sbomTool, setSbomTool] = useState("syft");
  const [ghActionOption, setGhActionOption] = useState("new");
  const [copied, setCopied] = useState(false);
  const [showNewProjectInput, setShowNewProjectInput] = useState(false);
  const [newProjectInputValue, setNewProjectInputValue] = useState("");
  const [projectsList, setProjectsList] = useState<string[]>(["as", "new-project", "project-3", "project-4"]);

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleAddNewProject = () => {
    if (newProjectInputValue.trim()) {
      const projectId = newProjectInputValue.toLowerCase().replace(/\s+/g, "-");
      if (!projectsList.includes(projectId)) {
        setProjectsList([...projectsList, projectId]);
        setProjectName(projectId);
        setShowNewProjectInput(false);
        setNewProjectInputValue("");
      }
    }
  };

  const sbomTools = [
    { id: "syft", label: "Syft", description: "CLI tool that generates SBOMs from container images, filesystems, and directories (SPDX, CycloneDX supported)" },
    { id: "cdxgen", label: "cdxgen", description: "Multi-language CycloneDX SBOM generator for applications and containers" },
    { id: "ms-sbom-tool", label: "Microsoft sbom-tool", description: "Generates SPDX SBOMs for multiple ecosystems, often used in CI/CD pipelines" },
    { id: "cyclonedx-cli", label: "CycloneDX CLI", description: "Tool for generating, validating, and converting CycloneDX SBOMs" },
    { id: "spdx-tools", label: "SPDX Tools", description: "Utilities to create, validate, and manipulate SPDX SBOM documents" },
    { id: "tern", label: "Tern", description: "Generates SBOMs for container images and Dockerfiles" },
    { id: "trivy", label: "Trivy", description: "Security scanner that can also export SBOMs for containers and filesystems" },
    { id: "anchore", label: "Anchore (Syft/Grype)", description: "Enterprise container security platform with SBOM generation capabilities" },
    { id: "black-duck", label: "Black Duck (Synopsys)", description: "Enterprise SCA platform that produces detailed SBOMs" },
    { id: "snyk", label: "Snyk", description: "Developer-focused SCA tool that exports SBOM data" },
    { id: "mend", label: "Mend (WhiteSource)", description: "Enterprise SCA tool with automated SBOM generation" },
    { id: "jfrog-xray", label: "JFrog Xray", description: "Artifact security scanner that can generate SBOMs" },
    { id: "veracode-sca", label: "Veracode SCA", description: "Generates SBOMs during dependency analysis" },
    { id: "dependency-track", label: "OWASP Dependency-Track", description: "Consumes and manages SBOMs; can integrate with generators" },
    { id: "dependency-check", label: "OWASP Dependency-Check", description: "Scans dependencies and can produce SBOM-style outputs" },
    { id: "cyclonedx-maven", label: "CycloneDX Maven Plugin", description: "Generates SBOMs for Maven-based Java projects" },
    { id: "cyclonedx-gradle", label: "CycloneDX Gradle Plugin", description: "SBOM generation for Gradle builds" },
    { id: "cyclonedx-npm", label: "CycloneDX Node Module", description: "Generates SBOMs for Node.js projects" },
    { id: "cyclonedx-python", label: "CycloneDX Python Tool", description: "SBOM generation for Python environments" },
    { id: "cargo-sbom", label: "Cargo SBOM", description: "Generates SBOMs for Rust projects" },
    { id: "go-sbom", label: "Go version / Go SBOM tools", description: "Extracts dependency metadata from Go modules" },
    { id: "distro2sbom", label: "Distro2SBOM", description: "Generates SBOMs for Linux distributions and packages" },
    { id: "github-sbom", label: "GitHub Dependency Graph / SBOM export", description: "Generates SBOMs directly from GitHub repositories" },
    { id: "gitlab-sbom", label: "GitLab SBOM generator", description: "Built-in SBOM generation within GitLab CI pipelines" },
  ];

  const ghActionOptions = [
    { id: "new", icon: "📄", label: "New GitHub Action", description: "Create a new workflow file" },
    { id: "manual", icon: "✏️", label: "Manual GH Action", description: "Copy and paste the configuration manually" },
    { id: "existing", icon: "🔗", label: "Add to Existing GH Action", description: "Add this snippet to your existing workflow" },
  ];

  const generateScript = () => {
    const sbomGenCommand = {
      syft: `curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sh
          syft dir:. -o cyclonedx-json > sbom.json`,
      cdxgen: `npm install -g @cyclonedx/cdxgen
          cdxgen -r -o sbom.json`,
      "ms-sbom-tool": `curl -LO https://github.com/microsoft/sbom-tool/releases/latest/download/sbom-tool-linux
          chmod +x sbom-tool-linux
          ./sbom-tool-linux generate -b . -bc . -pn MyProject -pv 1.0 -ps Microsoft`,
      "cyclonedx-cli": `npm install -g @cyclonedx/cli
          cyclonedx-cli validate -i sbom.json`,
      "spdx-tools": `wget https://repo1.maven.org/maven2/org/spdx/tools/spdx-tools-0.8/spdx-tools-0.8-jar-with-dependencies.jar
          java -jar spdx-tools.jar convert --input sbom.json --output sbom.spdx`,
      tern: `pip install tern
          tern report -i myimage:tag -f json > sbom.json`,
      trivy: `trivy image --format cyclonedx --output sbom.json myimage:tag`,
      anchore: `curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sh
          syft dir:. -o cyclonedx-json > sbom.json`,
      "black-duck": `# Use Black Duck (Synopsys) UI or API for SBOM generation
          # Configure Black Duck integration with your project`,
      snyk: `snyk sbom --format cyclonedx > sbom.json`,
      mend: `# Mend provides automated SBOM generation through their platform
          # Configure via Mend UI or CLI integration`,
      "jfrog-xray": `# JFrog Xray generates SBOMs through Artifactory integration
          # Configure artifact scanning policies in Xray`,
      "veracode-sca": `# Veracode SCA generates SBOMs during dependency analysis
          # Configure via Veracode platform`,
      "dependency-track": `# OWASP Dependency-Track consumes SBOMs from other generators
          # Upload SBOM files to Dependency-Track for management`,
      "dependency-check": `dependency-check.sh --scan . --format json --project MyProject > sbom-report.json`,
      "cyclonedx-maven": `mvn org.cyclonedx:cyclonedx-maven-plugin:makeAggregateBom -DoutputFile=sbom.xml`,
      "cyclonedx-gradle": `gradle org.cyclonedx.cyclonedxCreateBom -DoutputFile=sbom.json`,
      "cyclonedx-npm": `npm install -g @cyclonedx/npm
          cyclonedx-npm --output-file sbom.json`,
      "cyclonedx-python": `pip install cyclonedx-bom
          cyclonedx-bom -o sbom.json -of json`,
      "cargo-sbom": `cargo sbom --output sbom.json`,
      "go-sbom": `go list -json ./... > go-deps.json`,
      distro2sbom: `distro2sbom generate-distro-spdx rpm > sbom.spdx`,
      "github-sbom": `# GitHub Dependency Graph exports SBOMs automatically
          # Access via GitHub API or download from repository insights`,
      "gitlab-sbom": `# GitLab generates SBOMs in CI/CD pipelines
          # Configure in .gitlab-ci.yml with appropriate stages`,
    };

    if (ghActionOption === "new") {
      return `name: SonarQube Scan + SBOM Upload

on:
  push:
    branches:
      - main
  pull_request:

jobs:
  scan-and-upload:
    runs-on: ubuntu-latest

    env:
      SONAR_HOST_URL: \${{ secrets.SONAR_HOST_URL }}
      SONAR_TOKEN: \${{ secrets.SONAR_TOKEN }}
      API_TOKEN: \${{ secrets.API_TOKEN }}
      TENANT_ID: \${{ secrets.TENANT_ID }}

    steps:
      # ✅ Checkout repo
      - name: Checkout Code
        uses: actions/checkout@v4

      # ✅ Setup Java (required for SonarQube scanner)
      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 17

      # ✅ SonarQube Scan
      - name: Run SonarQube Scan
        run: |
          sonar-scanner \\
            -Dsonar.projectKey=my-project \\
            -Dsonar.sources=. \\
            -Dsonar.host.url=\$SONAR_HOST_URL \\
            -Dsonar.login=\$SONAR_TOKEN

      # ✅ Generate SBOM
      - name: Generate SBOM
        run: |
          ${sbomGenCommand[sbomTool as keyof typeof sbomGenCommand]}

      # ✅ Upload SBOM via API
      - name: Upload SBOM Artifact
        run: |
          curl -X POST "https://api.example.com/artifact/upload" \\
            -H "Authorization: Bearer \$API_TOKEN" \\
            -H "X-Tenant-Id: \$TENANT_ID" \\
            -F "data-type=sbom" \\
            -F "file=@sbom.json"`;
    } else if (ghActionOption === "existing") {
      return `# Add this step to your existing GitHub Actions workflow

      # ✅ Generate SBOM using ${sbomTools.find(t => t.id === sbomTool)?.label}
      - name: Generate SBOM
        run: |
          ${sbomGenCommand[sbomTool as keyof typeof sbomGenCommand]}

      # ✅ Upload SBOM via API
      - name: Upload SBOM Artifact
        run: |
          curl -X POST "https://api.example.com/artifact/upload" \\
            -H "Authorization: Bearer \${{ secrets.API_TOKEN }}" \\
            -H "X-Tenant-Id: \${{ secrets.TENANT_ID }}" \\
            -F "data-type=sbom" \\
            -F "file=@sbom.json"`;
    } else {
      return `# SonarQube Scan + SBOM Generation (Manual Configuration)

## 1. Install sonar-scanner
curl https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-5.0.1.3006-linux.zip -o sonar-scanner.zip
unzip sonar-scanner.zip

## 2. Run SonarQube Scan
./sonar-scanner/bin/sonar-scanner \\
  -Dsonar.projectKey=my-project \\
  -Dsonar.sources=. \\
  -Dsonar.host.url=\${SONAR_HOST_URL} \\
  -Dsonar.login=\${SONAR_TOKEN}

## 3. Generate SBOM
${sbomGenCommand[sbomTool as keyof typeof sbomGenCommand]}

## 4. Upload SBOM
curl -X POST "https://api.example.com/artifact/upload" \\
  -H "Authorization: Bearer \${API_TOKEN}" \\
  -H "X-Tenant-Id: \${TENANT_ID}" \\
  -F "data-type=sbom" \\
  -F "file=@sbom.json"`;
    }
  };

  const script = generateScript();

  const handleCopyScript = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNext = () => {
    if (step === "config" && projectName) setStep("tool");
    else if (step === "tool") setStep("ghAction");
    else if (step === "ghAction") setStep("script");
  };

  const handleBack = () => {
    if (step === "script") setStep("ghAction");
    else if (step === "ghAction") setStep("tool");
    else if (step === "tool") setStep("config");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">⚙️</span>
          <h2 className="text-lg font-bold text-gray-900">Automatic Scan Setup</h2>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-6">
          {["config", "tool", "ghAction", "script"].map((s, idx) => (
            <div key={s} className="flex items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                  step === s
                    ? "bg-blue-600 text-white"
                    : ["config", "tool", "ghAction", "script"].indexOf(step) > idx
                    ? "bg-green-600 text-white"
                    : "bg-gray-300 text-gray-600"
                )}
              >
                {["config", "tool", "ghAction", "script"].indexOf(step) > idx ? "✓" : idx + 1}
              </div>
              {idx < 3 && (
                <div
                  className={cn(
                    "h-1 w-12 mx-2",
                    ["config", "tool", "ghAction", "script"].indexOf(step) > idx
                      ? "bg-green-600"
                      : "bg-gray-300"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {/* Step 1: Project Name and Tags */}
          {step === "config" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Select Project Name <span className="text-red-500">*</span>
                </label>
                <div className="relative mb-3">
                  <select
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none bg-white cursor-pointer"
                  >
                    <option value="">Select project</option>
                    {projectsList.map((project) => (
                      <option key={project} value={project}>
                        {project}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                    ▼
                  </span>
                </div>

                {/* New Project Button */}
                {!showNewProjectInput && (
                  <button
                    onClick={() => setShowNewProjectInput(true)}
                    className="w-full px-4 py-2 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="text-lg">+</span>
                    New Project
                  </button>
                )}

                {/* New Project Input */}
                {showNewProjectInput && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter project name"
                      value={newProjectInputValue}
                      onChange={(e) => setNewProjectInputValue(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleAddNewProject();
                        }
                      }}
                      autoFocus
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <button
                      onClick={handleAddNewProject}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowNewProjectInput(false);
                        setNewProjectInputValue("");
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Tags Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tags <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add tags (e.g. Environment:Prod)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Add
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(index)}
                          className="text-blue-600 hover:text-blue-900 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: SBOM Tool Selection */}
          {step === "tool" && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Select SBOM Generator Tool <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {sbomTools.map((tool) => (
                  <label
                    key={tool.id}
                    className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="sbom-tool"
                      value={tool.id}
                      checked={sbomTool === tool.id}
                      onChange={(e) => setSbomTool(e.target.value)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{tool.label}</p>
                      <p className="text-xs text-gray-600">{tool.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: GitHub Action Option */}
          {step === "ghAction" && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                GitHub Action Configuration <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {ghActionOptions.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="gh-action"
                      value={option.id}
                      checked={ghActionOption === option.id}
                      onChange={(e) => setGhActionOption(e.target.value)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">
                        <span className="mr-2">{option.icon}</span>
                        {option.label}
                      </p>
                      <p className="text-xs text-gray-600">{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Script Display */}
          {step === "script" && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-900">
                  {ghActionOption === "new" ? "GitHub Actions Script" : "Code Snippet"}
                </label>
                <button
                  onClick={handleCopyScript}
                  className={cn(
                    "px-3 py-1 rounded text-xs font-medium transition-all",
                    copied
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  )}
                >
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto max-h-96 overflow-y-auto border border-gray-700">
                <pre className="text-gray-100 font-mono text-xs whitespace-pre-wrap break-words">
                  {script}
                </pre>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-900 mb-2 font-semibold">📌 Instructions:</p>
                {ghActionOption === "new" && (
                  <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Copy the script above</li>
                    <li>Create a new workflow file: `.github/workflows/sbom-scan.yml`</li>
                    <li>Paste the script into that file</li>
                    <li>Configure required secrets in GitHub: SONAR_HOST_URL, SONAR_TOKEN, API_TOKEN, TENANT_ID</li>
                    <li>Push the changes to trigger the workflow</li>
                  </ol>
                )}
                {ghActionOption === "existing" && (
                  <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Copy the snippet above</li>
                    <li>Open your existing GitHub Actions workflow file</li>
                    <li>Add the steps to your job after other build steps</li>
                    <li>Ensure the required secrets are configured</li>
                    <li>Push the changes</li>
                  </ol>
                )}
                {ghActionOption === "manual" && (
                  <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Follow the manual steps provided in the code snippet</li>
                    <li>Replace placeholders with your actual values</li>
                    <li>Ensure all required tools are installed in your environment</li>
                    <li>Configure environment variables or GitHub secrets as needed</li>
                    <li>Run the commands in your CI/CD pipeline</li>
                  </ol>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg font-medium text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          {step !== "config" && (
            <button
              onClick={handleBack}
              className="flex-1 px-4 py-2 rounded-lg font-medium text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          )}
          {step !== "script" && (
            <button
              onClick={handleNext}
              disabled={step === "config" ? !projectName : false}
              className={cn(
                "flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors",
                step === "config" && !projectName
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              )}
            >
              Next
            </button>
          )}
          {step === "script" && (
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg font-medium text-sm bg-green-600 hover:bg-green-700 text-white transition-colors"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface ImportFromModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartScan?: (projectName: string) => void;
}

function ImportFromModal({ isOpen, onClose, onStartScan }: ImportFromModalProps) {
  const [activeStep, setActiveStep] = useState<
    "selectService" | "selectOrganization" | "selectRepositories" | "repositoriesSettings" | "selectBranches" | "scanUponCreation"
  >("selectService");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [orgType, setOrgType] = useState<"user" | "organization">("user");
  const [orgSearchInput, setOrgSearchInput] = useState("");
  const [selectedOrg, setSelectedOrg] = useState("");
  const [repoSearchInput, setRepoSearchInput] = useState("");
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);

  // Mock repositories data
  const mockRepositories = [
    { id: "tech", name: "tech", icon: "📁" },
    { id: "cft", name: "cft", icon: "📁" },
    { id: "project-alpha", name: "project-alpha", icon: "📁" },
    { id: "project-beta", name: "project-beta", icon: "📁" },
    { id: "utils", name: "utils", icon: "📁" },
  ];

  const filteredRepos = mockRepositories.filter((repo) =>
    repo.name.toLowerCase().includes(repoSearchInput.toLowerCase())
  );

  const handleRepoToggle = (repoId: string) => {
    setSelectedRepos((prev) =>
      prev.includes(repoId)
        ? prev.filter((id) => id !== repoId)
        : [...prev, repoId]
    );
  };

  const handleSelectAllRepos = () => {
    if (selectedRepos.length === filteredRepos.length) {
      setSelectedRepos([]);
    } else {
      setSelectedRepos(filteredRepos.map((repo) => repo.id));
    }
  };

  // Repositories Settings state
  const [selectedRepo, setSelectedRepo] = useState<string>(
    selectedRepos[0] || "abhinavCSYSCS/techh"
  );
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "permission",
  ]);
  const [repoSettings, setRepoSettings] = useState({
    scanTrigger: { push: true, pullRequest: true },
    pullRequestDecoration: true,
    scaAutoPullRequest: false,
    protectedBranches: ["main"],
    protectedBranchInput: "",
    sshKey: "",
    assignGroups: [] as string[],
    assignGroupsInput: "",
    assignTags: [] as string[],
    assignTagsInput: "",
    criticalityLevel: 2,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const addProtectedBranch = () => {
    if (repoSettings.protectedBranchInput.trim()) {
      setRepoSettings({
        ...repoSettings,
        protectedBranches: [
          ...repoSettings.protectedBranches,
          repoSettings.protectedBranchInput.trim(),
        ],
        protectedBranchInput: "",
      });
    }
  };

  const removeProtectedBranch = (index: number) => {
    setRepoSettings({
      ...repoSettings,
      protectedBranches: repoSettings.protectedBranches.filter(
        (_, i) => i !== index
      ),
    });
  };

  const addGroup = () => {
    if (repoSettings.assignGroupsInput.trim()) {
      setRepoSettings({
        ...repoSettings,
        assignGroups: [
          ...repoSettings.assignGroups,
          repoSettings.assignGroupsInput.trim(),
        ],
        assignGroupsInput: "",
      });
    }
  };

  const removeGroup = (index: number) => {
    setRepoSettings({
      ...repoSettings,
      assignGroups: repoSettings.assignGroups.filter((_, i) => i !== index),
    });
  };

  const addTag = () => {
    if (repoSettings.assignTagsInput.trim()) {
      setRepoSettings({
        ...repoSettings,
        assignTags: [
          ...repoSettings.assignTags,
          repoSettings.assignTagsInput.trim(),
        ],
        assignTagsInput: "",
      });
    }
  };

  const removeTag = (index: number) => {
    setRepoSettings({
      ...repoSettings,
      assignTags: repoSettings.assignTags.filter((_, i) => i !== index),
    });
  };

  // Branches Selection state
  const [selectedBranches, setSelectedBranches] = useState<
    Record<string, string[]>
  >({});
  const [branchInputs, setBranchInputs] = useState<Record<string, string>>({});
  const [suggestedBranches] = useState<string[]>(["main", "develop", "master", "staging", "production"]);

  // Initialize selected branches and branch inputs for all repositories
  useEffect(() => {
    const initialBranches: Record<string, string[]> = {};
    const initialInputs: Record<string, string> = {};
    selectedRepos.forEach((repo) => {
      if (!selectedBranches[repo]) {
        initialBranches[repo] = ["main"];
      }
      if (!branchInputs[repo]) {
        initialInputs[repo] = "";
      }
    });
    if (Object.keys(initialBranches).length > 0) {
      setSelectedBranches((prev) => ({ ...prev, ...initialBranches }));
    }
    if (Object.keys(initialInputs).length > 0) {
      setBranchInputs((prev) => ({ ...prev, ...initialInputs }));
    }
  }, [selectedRepos]);

  // Reset modal state when it opens
  useEffect(() => {
    if (isOpen) {
      setActiveStep("selectService");
      setSelectedService(null);
      setOrgType("user");
      setOrgSearchInput("");
      setSelectedOrg("");
      setRepoSearchInput("");
      setSelectedRepos([]);
    }
  }, [isOpen]);

  const addBranch = (repo: string) => {
    const input = branchInputs[repo]?.trim();
    if (input && !selectedBranches[repo]?.includes(input)) {
      setSelectedBranches((prev) => ({
        ...prev,
        [repo]: [...(prev[repo] || []), input],
      }));
      setBranchInputs((prev) => ({ ...prev, [repo]: "" }));
    }
  };

  const removeBranch = (repo: string, branch: string) => {
    setSelectedBranches((prev) => ({
      ...prev,
      [repo]: prev[repo].filter((b) => b !== branch),
    }));
  };

  if (!isOpen) return null;

  const services = [
    { id: "github", label: "GitHub", icon: "🐙" },
    { id: "github-app", label: "GitHub App", icon: "🐙" },
    { id: "gitlab", label: "GitLab", icon: "🦊" },
    { id: "azure", label: "Azure", icon: "☁️" },
    { id: "bitbucket", label: "Bitbucket", icon: "🪣" },
  ];

  const steps = [
    { id: 1, label: "Select Service" },
    { id: 2, label: "Select Organization" },
    { id: 3, label: "Select Repositories" },
    { id: 4, label: "Repositories Settings" },
    { id: 5, label: "Select Branches" },
    { id: 6, label: "Scan Upon Creation" },
  ];

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setActiveStep("selectOrganization");
  };

  const handleBack = () => {
    if (activeStep === "selectService") {
      onClose();
    } else if (activeStep === "selectOrganization") {
      setActiveStep("selectService");
      setSelectedService(null);
    } else {
      const stepOrder: typeof activeStep[] = [
        "selectService",
        "selectOrganization",
        "selectRepositories",
        "repositoriesSettings",
        "selectBranches",
        "scanUponCreation",
      ];
      const currentIndex = stepOrder.indexOf(activeStep);
      if (currentIndex > 0) {
        setActiveStep(stepOrder[currentIndex - 1]);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-5xl h-[90vh] mx-4 flex overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Sidebar */}
        <div className="bg-gray-50 w-56 p-6 flex flex-col border-r border-gray-200 overflow-y-auto">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-2xl">⚙️</span>
            <h2 className="text-lg font-bold text-gray-900">Import From</h2>
          </div>

          {/* Steps */}
          <div className="space-y-4 flex-1">
            {steps.map((step, index) => {
              const stepNames: typeof activeStep[] = [
                "selectService",
                "selectOrganization",
                "selectRepositories",
                "repositoriesSettings",
                "selectBranches",
                "scanUponCreation",
              ];
              const currentStepIndex = stepNames.indexOf(activeStep);
              const isCompleted = currentStepIndex > index;
              const isCurrent = currentStepIndex === index;

              return (
                <div key={step.id} className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white",
                      isCurrent
                        ? "bg-blue-600"
                        : isCompleted
                          ? "bg-green-600"
                          : "bg-gray-400",
                    )}
                  >
                    {isCompleted ? "✓" : step.id}
                  </div>
                  <div>
                    <p
                      className={cn(
                        "font-semibold text-sm",
                        isCurrent ? "text-gray-900" : "text-gray-600",
                      )}
                    >
                      {step.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleBack}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back
          </button>
        </div>

        {/* Right Content */}
        <div className="flex-1 p-8 overflow-y-auto flex flex-col min-h-0 bg-white">
          {activeStep === "selectService" && (
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Select service
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-4 mb-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="hosting"
                        value="cloud"
                        defaultChecked
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium">Cloud-Hosted</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="hosting"
                        value="self"
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium">Self-Hosted</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => handleServiceSelect(service.id)}
                        className="flex items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                      >
                        <span className="text-2xl">{service.icon}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {service.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {activeStep === "selectOrganization" && (
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Select Organization
                </h3>

                {/* Organization Type Selection */}
                <div className="space-y-4 mb-6">
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="org-type"
                      value="user"
                      checked={orgType === "user"}
                      onChange={(e) => {
                        setOrgType(e.target.value as "user" | "organization");
                        setSelectedOrg("");
                      }}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        User: abhinavCSYSCS
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="org-type"
                      value="organization"
                      checked={orgType === "organization"}
                      onChange={(e) => {
                        setOrgType(e.target.value as "user" | "organization");
                        setSelectedOrg("");
                      }}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        Organization
                      </p>
                    </div>
                  </label>
                </div>

                {/* Search Input */}
                {orgType === "organization" && (
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Type the full Org name"
                        value={orgSearchInput}
                        onChange={(e) => setOrgSearchInput(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div className="flex justify-end">
                      <a
                        href="#"
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Grant additional organizations →
                      </a>
                    </div>
                  </div>
                )}

                {/* Info Message */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600">
                    {orgType === "user"
                      ? "Automatically sync with new or transferred projects in your user account."
                      : "Automatically sync with new or transferred projects in the organization."}
                  </p>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={handleBack}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    const stepOrder: typeof activeStep[] = [
                      "selectService",
                      "selectOrganization",
                      "selectRepositories",
                      "repositoriesSettings",
                      "selectBranches",
                      "scanUponCreation",
                    ];
                    const currentIndex = stepOrder.indexOf(activeStep);
                    if (currentIndex < stepOrder.length - 1) {
                      setActiveStep(stepOrder[currentIndex + 1]);
                    }
                  }}
                  disabled={orgType === "organization" && !orgSearchInput.trim()}
                  className={cn(
                    "ml-auto px-6 py-2 rounded-lg font-medium transition-colors",
                    orgType === "organization" && !orgSearchInput.trim()
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  )}
                >
                  Select Organization
                </button>
              </div>
            </div>
          )}

          {activeStep === "selectRepositories" && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Select Repositories
                </h3>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                  <span className="text-blue-600 text-lg mt-0.5">ℹ️</span>
                  <div className="flex-1">
                    <p className="text-sm text-blue-900">
                      If you are unable to see your Repositories/Projects, check your privilege definitions
                    </p>
                  </div>
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap ml-4"
                  >
                    More details
                  </a>
                </div>

                {/* Search Input */}
                <div className="mb-4 relative">
                  <input
                    type="text"
                    placeholder="Find a Repository"
                    value={repoSearchInput}
                    onChange={(e) => setRepoSearchInput(e.target.value)}
                    className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔍
                  </span>
                </div>

                {/* Select All Checkbox */}
                <div className="mb-4 flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                  <input
                    type="checkbox"
                    id="select-all"
                    checked={
                      filteredRepos.length > 0 &&
                      selectedRepos.length === filteredRepos.length
                    }
                    onChange={handleSelectAllRepos}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                  />
                  <label
                    htmlFor="select-all"
                    className="flex-1 text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    Select all
                  </label>
                </div>

                {/* Repositories List */}
                <div className="space-y-2">
                  {filteredRepos.map((repo) => (
                    <div
                      key={repo.id}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        id={`repo-${repo.id}`}
                        checked={selectedRepos.includes(repo.id)}
                        onChange={() => handleRepoToggle(repo.id)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                      />
                      <label
                        htmlFor={`repo-${repo.id}`}
                        className="flex-1 flex items-center gap-2 cursor-pointer"
                      >
                        <span className="text-lg">{repo.icon}</span>
                        <span className="text-sm text-gray-900 font-medium">
                          {repo.name}
                        </span>
                      </label>
                    </div>
                  ))}

                  {filteredRepos.length === 0 && repoSearchInput && (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-600">
                        No repositories found matching "{repoSearchInput}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={handleBack}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    const stepOrder: typeof activeStep[] = [
                      "selectService",
                      "selectOrganization",
                      "selectRepositories",
                      "repositoriesSettings",
                      "selectBranches",
                      "scanUponCreation",
                    ];
                    const currentIndex = stepOrder.indexOf(activeStep);
                    if (currentIndex < stepOrder.length - 1) {
                      setActiveStep(stepOrder[currentIndex + 1]);
                    }
                  }}
                  disabled={selectedRepos.length === 0}
                  className={cn(
                    "ml-auto px-6 py-2 rounded-lg font-medium transition-colors",
                    selectedRepos.length === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  )}
                >
                  Select Repositories
                </button>
              </div>
            </div>
          )}

          {activeStep === "repositoriesSettings" && (
            <div className="flex h-full gap-4">
              {/* Left Sidebar - Repositories List */}
              <div className="w-64 border-r border-gray-200 overflow-y-auto">
                <h4 className="text-sm font-semibold text-gray-900 p-4 sticky top-0 bg-white">
                  Selected Repositories
                </h4>
                <div className="space-y-2 p-4">
                  {selectedRepos.map((repo) => (
                    <button
                      key={repo}
                      onClick={() => setSelectedRepo(repo)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2",
                        selectedRepo === repo
                          ? "bg-blue-100 text-blue-900 border border-blue-300"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <span>📁</span>
                      {repo}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Panel - Settings */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Repositories Settings
                    </h3>
                    <p className="text-sm text-gray-600">
                      Configure setting for each repository
                    </p>
                  </div>

                  {/* Selected Repository Display */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
                    <span className="text-lg">📁</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {selectedRepo}
                    </span>
                    <button className="ml-auto text-gray-400 hover:text-gray-600">
                      ›
                    </button>
                  </div>

                  {/* Permission Settings */}
                  <div className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleSection("permission")}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "transition-transform",
                            expandedSections.includes("permission")
                              ? "rotate-90"
                              : ""
                          )}
                        >
                          ›
                        </span>
                        <span className="font-semibold text-gray-900">
                          Permission Settings
                        </span>
                      </div>
                    </button>

                    {expandedSections.includes("permission") && (
                      <div className="p-4 border-t border-gray-200 space-y-4">
                        {/* Scan Trigger */}
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-900">
                            Scan Trigger: Push, Pull request
                          </label>
                          <button
                            onClick={() =>
                              setRepoSettings({
                                ...repoSettings,
                                scanTrigger: {
                                  ...repoSettings.scanTrigger,
                                  push: !repoSettings.scanTrigger.push,
                                },
                              })
                            }
                            className={cn(
                              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                              repoSettings.scanTrigger.push
                                ? "bg-blue-600"
                                : "bg-gray-300"
                            )}
                          >
                            <span
                              className={cn(
                                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                repoSettings.scanTrigger.push
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              )}
                            />
                          </button>
                        </div>

                        {/* Pull Request Decoration */}
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-900">
                            Pull Request Decoration
                          </label>
                          <button
                            onClick={() =>
                              setRepoSettings({
                                ...repoSettings,
                                pullRequestDecoration:
                                  !repoSettings.pullRequestDecoration,
                              })
                            }
                            className={cn(
                              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                              repoSettings.pullRequestDecoration
                                ? "bg-blue-600"
                                : "bg-gray-300"
                            )}
                          >
                            <span
                              className={cn(
                                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                repoSettings.pullRequestDecoration
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              )}
                            />
                          </button>
                        </div>

                        {/* SCA Auto Pull Request */}
                        <div className="flex items-center justify-between group relative">
                          <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-900">
                              SCA Auto Pull Request
                            </label>
                            <div className="relative inline-block">
                              <span
                                className="text-gray-400 cursor-help hover:text-gray-600"
                              >
                                ℹ️
                              </span>
                              {/* Tooltip */}
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 pointer-events-none">
                                <p>
                                  By activating this feature, you are allowing CloudSEK to send PRs with remediated manifest files to your repository and close/remove those PR branches as needed.
                                </p>
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45 -mt-1"></div>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              setRepoSettings({
                                ...repoSettings,
                                scaAutoPullRequest:
                                  !repoSettings.scaAutoPullRequest,
                              })
                            }
                            className={cn(
                              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                              repoSettings.scaAutoPullRequest
                                ? "bg-blue-600"
                                : "bg-gray-300"
                            )}
                          >
                            <span
                              className={cn(
                                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                repoSettings.scaAutoPullRequest
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              )}
                            />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Scanner Settings */}
                  <div className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleSection("scanner")}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "transition-transform",
                            expandedSections.includes("scanner")
                              ? "rotate-90"
                              : ""
                          )}
                        >
                          ›
                        </span>
                        <span className="font-semibold text-gray-900">
                          Scanner Settings
                        </span>
                      </div>
                    </button>

                    {expandedSections.includes("scanner") && (
                      <div className="p-4 border-t border-gray-200 space-y-4">
                        {/* Protected Branches */}
                        <div>
                          <h5 className="font-semibold text-gray-900 text-sm mb-2">
                            Protected Branches
                          </h5>
                          <p className="text-xs text-gray-600 mb-3">
                            Protected branches (e.g., main or release) are
                            critical branches with enforced rules to keep
                            production code stable.
                          </p>

                          <div className="mb-3">
                            <label className="block text-xs font-medium text-gray-900 mb-2">
                              Choose Branches:
                            </label>
                            {repoSettings.protectedBranches.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-2">
                                {repoSettings.protectedBranches.map(
                                  (branch, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full"
                                    >
                                      <span className="text-xs font-medium text-gray-900">
                                        {branch}
                                      </span>
                                      <button
                                        onClick={() =>
                                          removeProtectedBranch(idx)
                                        }
                                        className="text-gray-400 hover:text-gray-600 ml-1"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>

                          {/* SSH Key Input */}
                          <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                              Add SSH Key
                            </label>
                            <textarea
                              placeholder="Paste your SSH key here..."
                              value={repoSettings.sshKey}
                              onChange={(e) =>
                                setRepoSettings({
                                  ...repoSettings,
                                  sshKey: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm h-24"
                            />
                          </div>

                          {/* Assign Groups */}
                          <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                              Assign Groups
                            </label>
                            {repoSettings.assignGroups.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-2">
                                {repoSettings.assignGroups.map((group, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-full"
                                  >
                                    <span className="text-xs font-medium text-blue-900">
                                      {group}
                                    </span>
                                    <button
                                      onClick={() => removeGroup(idx)}
                                      className="text-blue-600 hover:text-blue-800 ml-1"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                            <input
                              type="text"
                              placeholder="Add Groups"
                              value={repoSettings.assignGroupsInput}
                              onChange={(e) =>
                                setRepoSettings({
                                  ...repoSettings,
                                  assignGroupsInput: e.target.value,
                                })
                              }
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  addGroup();
                                }
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>

                          {/* Assign Tags */}
                          <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                              Assign Tags
                            </label>
                            {repoSettings.assignTags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-2">
                                {repoSettings.assignTags.map((tag, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-full"
                                  >
                                    <span className="text-xs font-medium text-blue-900">
                                      {tag}
                                    </span>
                                    <button
                                      onClick={() => removeTag(idx)}
                                      className="text-blue-600 hover:text-blue-800 ml-1"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                            <input
                              type="text"
                              placeholder="Add Tags"
                              value={repoSettings.assignTagsInput}
                              onChange={(e) =>
                                setRepoSettings({
                                  ...repoSettings,
                                  assignTagsInput: e.target.value,
                                })
                              }
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  addTag();
                                }
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>

                          {/* Criticality Level */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-sm font-semibold text-gray-900">
                                Set Criticality Level
                              </label>
                              <span
                                className="text-gray-400 cursor-help"
                                title="Info about Criticality Level"
                              >
                                ℹ️
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              <input
                                type="range"
                                min="1"
                                max="5"
                                value={repoSettings.criticalityLevel}
                                onChange={(e) =>
                                  setRepoSettings({
                                    ...repoSettings,
                                    criticalityLevel: parseInt(e.target.value),
                                  })
                                }
                                className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                              />
                              <span className="text-sm font-medium text-gray-900 min-w-12">
                                {repoSettings.criticalityLevel}
                              </span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-600 mt-2">
                              <span>1</span>
                              <span>
                                {[
                                  "",
                                  "Low",
                                  "Medium",
                                  "High",
                                  "Critical",
                                  "Severe",
                                ][repoSettings.criticalityLevel]}
                              </span>
                              <span>5</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeStep === "selectBranches" && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select Branches
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Select protected Branches (each repository must have at least
                  one branch selected)
                </p>

                {/* Repositories and Branches */}
                <div className="space-y-6">
                  {selectedRepos.map((repo) => (
                    <div key={repo} className="border border-gray-200 rounded-lg p-4">
                      {/* Repository Name */}
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <span>📁</span>
                          {repo}
                        </h4>
                      </div>

                      {/* Selected Branches Tags */}
                      {selectedBranches[repo]?.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-2">
                          {selectedBranches[repo].map((branch) => (
                            <div
                              key={branch}
                              className="flex items-center gap-1 bg-blue-50 border border-blue-300 px-3 py-1 rounded-lg"
                            >
                              <span className="text-xs font-medium text-gray-900">
                                {branch}
                              </span>
                              <button
                                onClick={() => removeBranch(repo, branch)}
                                className="ml-1 text-gray-400 hover:text-gray-600"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Branch Input */}
                      <div className="relative">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="main"
                            value={branchInputs[repo] || ""}
                            onChange={(e) =>
                              setBranchInputs((prev) => ({
                                ...prev,
                                [repo]: e.target.value,
                              }))
                            }
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                addBranch(repo);
                              }
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                          <button
                            onClick={() => addBranch(repo)}
                            disabled={
                              !branchInputs[repo]?.trim() ||
                              selectedBranches[repo]?.includes(
                                branchInputs[repo].trim()
                              )
                            }
                            className={cn(
                              "px-3 py-2 rounded-lg font-medium text-sm transition-colors",
                              !branchInputs[repo]?.trim() ||
                                selectedBranches[repo]?.includes(
                                  branchInputs[repo].trim()
                                )
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-gray-300 hover:bg-gray-400 text-gray-700"
                            )}
                          >
                            Add
                          </button>
                        </div>

                        {/* Autocomplete Suggestions */}
                        {branchInputs[repo] &&
                          !selectedBranches[repo]?.includes(
                            branchInputs[repo].trim()
                          ) && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                              {suggestedBranches
                                .filter((b) =>
                                  b
                                    .toLowerCase()
                                    .includes(
                                      branchInputs[repo].toLowerCase()
                                    ) &&
                                  !selectedBranches[repo]?.includes(b)
                                )
                                .map((branch) => (
                                  <button
                                    key={branch}
                                    onClick={() => {
                                      setBranchInputs((prev) => ({
                                        ...prev,
                                        [repo]: branch,
                                      }));
                                      // Auto-add the branch
                                      setTimeout(() => {
                                        setSelectedBranches((prev) => ({
                                          ...prev,
                                          [repo]: [
                                            ...(prev[repo] || []),
                                            branch,
                                          ],
                                        }));
                                        setBranchInputs((prev) => ({
                                          ...prev,
                                          [repo]: "",
                                        }));
                                      }, 0);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm text-gray-900 border-b border-gray-200 last:border-b-0"
                                  >
                                    {branch}
                                  </button>
                                ))}
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={handleBack}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    const stepOrder: typeof activeStep[] = [
                      "selectService",
                      "selectOrganization",
                      "selectRepositories",
                      "repositoriesSettings",
                      "selectBranches",
                      "scanUponCreation",
                    ];
                    const currentIndex = stepOrder.indexOf(activeStep);
                    if (currentIndex < stepOrder.length - 1) {
                      setActiveStep(stepOrder[currentIndex + 1]);
                    }
                  }}
                  disabled={
                    selectedRepos.some((repo) => !selectedBranches[repo]?.length)
                  }
                  className={cn(
                    "ml-auto px-6 py-2 rounded-lg font-medium transition-colors",
                    selectedRepos.some(
                      (repo) => !selectedBranches[repo]?.length
                    )
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  )}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {activeStep === "scanUponCreation" && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select Branches To Scan:
                </h3>

                {/* Toggle for Scan Upon Creation */}
                <div className="mb-6 flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="text-sm font-medium text-gray-900">
                    Scan a branch upon creation of the project
                  </label>
                  <button
                    onClick={() => {
                      setRepoSettings({
                        ...repoSettings,
                        scaAutoPullRequest: !repoSettings.scaAutoPullRequest,
                      });
                    }}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      repoSettings.scaAutoPullRequest
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        repoSettings.scaAutoPullRequest
                          ? "translate-x-6"
                          : "translate-x-1"
                      )}
                    />
                  </button>
                </div>

                {/* Repositories with Branch Selection */}
                <div className="space-y-4">
                  {selectedRepos.map((repo) => (
                    <div key={repo} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">📁</span>
                        <span className="font-semibold text-gray-900">{repo}</span>
                      </div>

                      {/* Branch Dropdown */}
                      <div className="relative">
                        <select
                          value={selectedBranches[repo]?.[0] || "main"}
                          onChange={(e) => {
                            setSelectedBranches((prev) => ({
                              ...prev,
                              [repo]: [e.target.value],
                            }));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none bg-white cursor-pointer"
                        >
                          {suggestedBranches.map((branch) => (
                            <option key={branch} value={branch}>
                              {branch}
                            </option>
                          ))}
                        </select>
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                          ▼
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={handleBack}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    // Create projects and navigate to asset page
                    const projectNames = selectedRepos.map((repo) => repo.split("/")[1] || repo);
                    projectNames.forEach((projectName) => {
                      onStartScan?.(projectName);
                    });
                    // Close the modal
                    onClose();
                  }}
                  className="ml-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Create Projects ({selectedRepos.length})
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons - Only for selectRepositories step */}
          {activeStep === "selectRepositories" && (
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const stepOrder: typeof activeStep[] = [
                    "selectService",
                    "selectOrganization",
                    "selectRepositories",
                    "repositoriesSettings",
                    "selectBranches",
                    "scanUponCreation",
                  ];
                  const currentIndex = stepOrder.indexOf(activeStep);
                  if (currentIndex < stepOrder.length - 1) {
                    setActiveStep(stepOrder[currentIndex + 1]);
                  }
                }}
                className="ml-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                Next
              </button>
            </div>
          )}

          {/* Navigation Buttons - For repositoriesSettings */}
          {activeStep === "repositoriesSettings" && (
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleBack}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => {
                  const stepOrder: typeof activeStep[] = [
                    "selectService",
                    "selectOrganization",
                    "selectRepositories",
                    "repositoriesSettings",
                    "selectBranches",
                    "scanUponCreation",
                  ];
                  const currentIndex = stepOrder.indexOf(activeStep);
                  if (currentIndex < stepOrder.length - 1) {
                    setActiveStep(stepOrder[currentIndex + 1]);
                  }
                }}
                className="ml-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                Next
              </button>
            </div>
          )}

          {/* Navigation Buttons - For selectBranches - Already included in the component above */}

          {/* Fallback for unhandled activeStep - should never show */}
        </div>
      </div>
    </div>
  );
}
