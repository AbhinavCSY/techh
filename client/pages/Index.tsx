import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const [scanningProject, setScanningProject] = useState<string | null>(null);
  const [scannedAssets, setScannedAssets] = useState<Set<string>>(new Set());

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

      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold text-gray-900">
                Asset Inventory
              </h1>
              <Button
                onClick={() => setShowNewProjectModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-3 h-auto"
              >
                + New
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Manage and monitor your technology dependencies
            </p>
          </div>

          {/* Widget Panel Header with Toggle */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Overview Metrics
            </h2>
            <button
              onClick={() => setShowWidgetPanel(!showWidgetPanel)}
              className={cn(
                "px-2 py-0.5 rounded text-xs font-medium transition-colors",
                showWidgetPanel
                  ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              )}
            >
              {showWidgetPanel ? "▼ Hide" : "▶ Show"}
            </button>
          </div>

          {/* Key Metrics Panel - Collapsible & Compact */}
          {showWidgetPanel && (
            <div className="space-y-2">
              {/* First Row - Vulnerable Libraries and License Distribution */}
              <div className="grid grid-cols-2 gap-2">
                {/* Vulnerable Libraries Widget */}
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <VulnerableLibrariesWidget compact={true} />
                </div>

                {/* License Distribution Widget */}
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <LicenseDistributionWidget compact={true} />
                </div>
              </div>

              {/* Second Row - Risk by Technologies (Full Width) */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <RiskByTechnologiesChart compact={true} />
              </div>

              {/* Third Row - EOL and Tech Stacks & Assets */}
              <div className="grid grid-cols-2 gap-2">
                {/* EOL Pie Chart */}
                <div className="bg-white rounded-lg border border-gray-200 p-1.5">
                  <EOLPieChart compact={true} />
                </div>

                {/* Tech Stacks & Assets Chart */}
                <div className="bg-white rounded-lg border border-gray-200 p-1.5">
                  <TechStacksAndAssetsChart compact={true} />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Group By Switch */}
      <div className="sticky top-16 z-20 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">
          <label className="font-medium text-sm text-gray-700">Group By:</label>
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setGrouping("asset")}
              className={cn(
                "px-4 py-2 rounded font-medium text-sm transition-all whitespace-nowrap",
                grouping === "asset"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900",
              )}
            >
              🖥️ Asset
            </button>
            <button
              onClick={() => setGrouping("tech-stack")}
              className={cn(
                "px-4 py-2 rounded font-medium text-sm transition-all whitespace-nowrap",
                grouping === "tech-stack"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900",
              )}
            >
              📦 Tech Stack
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
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

      {/* Main Content */}
      <main
        className={cn(
          viewType === "graph" ? "px-0 py-0" : "max-w-7xl mx-auto px-6 py-8",
        )}
      >
        {/* Graph View */}
        {viewType === "graph" ? (
          <div className="w-full" style={{ height: "calc(100vh - 200px)" }}>
            <InteractiveDependencyGraph />
          </div>
        ) : (
          <>
            {/* Empty State */}
            {filteredTechStacks.length === 0 && filteredAssets.length === 0 ? (
              <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No items found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search criteria
                </p>
                {hasActiveFilters && (
                  <Button onClick={clearFilters} variant="outline">
                    Clear All Filters
                  </Button>
                )}
              </div>
            ) : (
              <>
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
            navigate(`/incident/${techStackId}/${cveId}`)
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
          className="absolute right-0 top-0 bottom-0 w-full max-w-[912px] bg-white shadow-xl transform transition-transform overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
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

                      {/* Summary Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-center">
                          <p className="text-xs text-gray-600 font-medium">
                            Scanned
                          </p>
                          <p className="text-lg font-bold text-red-900">
                            {item.cves.length}
                          </p>
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-center">
                          <p className="text-xs text-gray-600 font-medium">
                            Unscanned
                          </p>
                          <p className="text-lg font-bold text-amber-900">
                            {marketCVEs.length}
                          </p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center">
                          <p className="text-xs text-gray-600 font-medium">
                            Total
                          </p>
                          <p className="text-lg font-bold text-blue-900">
                            {item.cves.length + marketCVEs.length}
                          </p>
                        </div>
                      </div>

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
                                  <div className="flex gap-2 mt-1">
                                    <Badge className="bg-red-200 text-red-800 text-xs">
                                      ✓ SCANNED
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
                                    <div className="mt-3 p-3 bg-gray-100 border border-gray-300 rounded-lg space-y-2">
                                      <div className="flex items-center justify-between mb-2">
                                        <label className="text-xs font-semibold text-gray-700">
                                          Select Assets to Scan
                                        </label>
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
                                      <div className="space-y-1 max-h-32 overflow-y-auto">
                                        {getAssociatedAssets(item.id).map(
                                          (asset) => (
                                            <label
                                              key={asset.id}
                                              className="flex items-center gap-2 cursor-pointer text-xs"
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
                                              <span className="text-gray-700">
                                                {asset.name}
                                              </span>
                                            </label>
                                          ),
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
                                    <Badge className="bg-amber-200 text-amber-800 text-xs">
                                      ⚠️ UNSCANNED
                                    </Badge>
                                    {!cve.scanningSupported && (
                                      <Badge className="bg-gray-400 text-white text-xs">
                                        🔒 Scanning Not Supported
                                      </Badge>
                                    )}
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

                                  {/* Remediation Steps - Shown when scanning is not supported */}
                                  {!cve.scanningSupported &&
                                    cve.remediationSteps && (
                                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                                        <h5 className="text-xs font-semibold text-blue-900">
                                          📋 Remediation Steps
                                        </h5>
                                        <div className="space-y-2">
                                          {cve.remediationSteps.map(
                                            (step: any, idx: number) => (
                                              <div
                                                key={idx}
                                                className="text-xs text-gray-700"
                                              >
                                                <p className="font-semibold text-gray-900">
                                                  Step {step.step}: {step.title}
                                                </p>
                                                <p className="text-gray-600 mt-1">
                                                  {step.description}
                                                </p>
                                              </div>
                                            ),
                                          )}
                                        </div>
                                      </div>
                                    )}

                                  {/* Asset Selection for Market CVE */}
                                  {cve.scanningSupported &&
                                    selectedCVEForAssets ===
                                      `market-${cve.id}` && (
                                      <div className="mt-3 p-3 bg-gray-100 border border-gray-300 rounded-lg space-y-2">
                                        <div className="flex items-center justify-between mb-2">
                                          <label className="text-xs font-semibold text-gray-700">
                                            Select Assets to Scan
                                          </label>
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
                                        <div className="space-y-1 max-h-32 overflow-y-auto">
                                          {getAssociatedAssets(item.id).map(
                                            (asset) => (
                                              <label
                                                key={asset.id}
                                                className="flex items-center gap-2 cursor-pointer text-xs"
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
                                                <span className="text-gray-700">
                                                  {asset.name}
                                                </span>
                                              </label>
                                            ),
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
                            ? "Scanning Against Each CVEs..."
                            : `Scan Against Each CVEs for Threat Intel`}
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
}

function NewProjectModal({
  isOpen,
  onClose,
  onStartScan,
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
      active: false,
    },
    {
      id: "new-app",
      icon: "📊",
      title: "New Application",
      description: "Create an application to organize your projects",
      active: false,
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
                    Source Code
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

                  {/* Checkboxes */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.incrementalScan}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            incrementalScan: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700 font-medium">
                        Incremental Scan
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.saveAsDefault}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            saveAsDefault: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700 font-medium">
                        Save as default repository for the project
                      </span>
                    </label>
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

                  <div className="space-y-3">
                    {/* SAST */}
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div>
                        <p className="font-semibold text-gray-900">SAST</p>
                        <p className="text-xs text-gray-600">
                          CloudSek Static Application Security Testing
                        </p>
                      </div>
                      <label className="relative inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.scanners.sast}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              scanners: {
                                ...formData.scanners,
                                sast: e.target.checked,
                              },
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {/* SCA */}
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 bg-blue-50">
                      <div>
                        <p className="font-semibold text-gray-900">SCA</p>
                        <p className="text-xs text-gray-600">
                          CloudSek Software Composition Analysis
                        </p>
                      </div>
                      <label className="relative inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.scanners.sca}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              scanners: {
                                ...formData.scanners,
                                sca: e.target.checked,
                              },
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-blue-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {/* Container Security */}
                    <div className="relative group">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg opacity-70 cursor-not-allowed">
                        <div>
                          <p className="font-semibold text-gray-900">
                            Container Security
                          </p>
                          <p className="text-xs text-gray-600">
                            CloudSek Container Analysis
                          </p>
                        </div>
                        <label className="relative inline-flex items-center opacity-50">
                          <input
                            type="checkbox"
                            disabled
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold whitespace-nowrap">
                          Coming Soon
                        </span>
                      </div>
                    </div>

                    {/* IaC Security */}
                    <div className="relative group">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg opacity-70 cursor-not-allowed">
                        <div>
                          <p className="font-semibold text-gray-900">
                            IaC Security
                          </p>
                          <p className="text-xs text-gray-600">
                            CloudSek Static Code Analysis for Infrastructure as
                            Code
                          </p>
                        </div>
                        <label className="relative inline-flex items-center opacity-50">
                          <input
                            type="checkbox"
                            disabled
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold whitespace-nowrap">
                          Coming Soon
                        </span>
                      </div>
                    </div>

                    {/* API Security */}
                    <div className="relative group">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg opacity-70 cursor-not-allowed">
                        <div>
                          <p className="font-semibold text-gray-900">
                            API Security
                          </p>
                          <p className="text-xs text-gray-600">
                            CloudSek Static Analysis for API Security
                          </p>
                        </div>
                        <label className="relative inline-flex items-center opacity-50">
                          <input
                            type="checkbox"
                            disabled
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold whitespace-nowrap">
                          Coming Soon
                        </span>
                      </div>
                    </div>

                    {/* OSSF Scorecard */}
                    <div className="relative group">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg opacity-70 cursor-not-allowed">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">
                              OSSF Scorecard
                            </p>
                            <span className="text-gray-400 cursor-help">
                              ℹ
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">
                            Identify risk factors throughout your project's
                            supply chain
                          </p>
                        </div>
                        <label className="relative inline-flex items-center opacity-50">
                          <input
                            type="checkbox"
                            disabled
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold whitespace-nowrap">
                          Coming Soon
                        </span>
                      </div>
                    </div>

                    {/* Secret Detection */}
                    <div className="relative group">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg opacity-70 cursor-not-allowed">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">
                              Secret Detection
                            </p>
                            <span className="text-gray-400 cursor-help">
                              ℹ
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">
                            Detect unencrypted secrets in your project
                          </p>
                        </div>
                        <label className="relative inline-flex items-center opacity-50">
                          <input
                            type="checkbox"
                            disabled
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
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
                    setActiveStep("sourceCode");
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
