import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useFilters,
  filterTechStacks,
  filterAssets,
  sortTechStacks,
  sortAssets,
} from "@/hooks/useFilters";
import { techStackDatabase, assetDatabase } from "@/data/mockData";
import { FilterPanel } from "@/components/FilterPanel";
import { TechStackCardView } from "@/components/TechStackCardView";
import { AssetCardView } from "@/components/AssetCardView";
import { TechStackTableView } from "@/components/TechStackTableView";
import { AssetTableView } from "@/components/AssetTableView";
import { PackageReliabilityCard } from "@/components/PackageReliabilityCard";
import { exportAsCSV, exportAsJSON, exportAsPDF } from "@/lib/exportUtils";
import { Button } from "@/components/ui/button";
import { ChevronDown, AlertTriangle, Badge as BadgeIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Index() {
  const navigate = useNavigate();
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

  // Filter and sort data
  const filteredTechStacks = useMemo(() => {
    const filtered = filterTechStacks(techStackDatabase, filters);
    return sortTechStacks(filtered, filters.sortBy, filters.sortOrder);
  }, [filters]);

  const filteredAssets = useMemo(() => {
    const filtered = filterAssets(assetDatabase, filters);
    return sortAssets(filtered, filters.sortBy, filters.sortOrder);
  }, [filters]);

  const handleExport = (format: "csv" | "json" | "pdf") => {
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
        exportAsPDF(dataToExport, `${filename}.pdf`, grouping === "tech-stack");
        break;
    }
  };

  const getMetrics = () => {
    const totalTechStacks = techStackDatabase.length;
    const assetsMonitored = assetDatabase.length;
    const criticalCVEs = techStackDatabase.reduce(
      (acc, ts) =>
        acc + ts.cves.filter((cve) => cve.severity === "critical").length,
      0,
    );
    const totalEOL = techStackDatabase.filter((ts) => ts.isEOL).length;
    const assetScanned = assetDatabase.filter((a) => a.isScanned).length;

    return {
      totalTechStacks,
      assetsMonitored,
      criticalCVEs,
      totalEOL,
      assetScanned,
    };
  };

  const metrics = getMetrics();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="text-4xl">🔒</span>
                  Tech Stack Inventory
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage and monitor your technology dependencies and security
                  risks
                </p>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-4">
              <MetricCard
                label="Total Tech Stacks"
                value={metrics.totalTechStacks}
                color="blue"
                icon="📦"
              />
              <MetricCard
                label="Assets Monitored"
                value={metrics.assetsMonitored}
                color="purple"
                icon="🎯"
              />
              <MetricCard
                label="Critical CVEs"
                value={metrics.criticalCVEs}
                color="red"
                icon="🔴"
              />
              <MetricCard
                label="EOL Technologies"
                value={metrics.totalEOL}
                color="orange"
                icon="⚠️"
              />
              <MetricCard
                label="Assets Scanned"
                value={metrics.assetScanned}
                color="green"
                icon="✓"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* Sidebar - Filters */}
          <aside className="hidden lg:block w-56">
            <div className="sticky top-24">
              <FilterPanel
                filters={filters}
                onFilterChange={updateFilter}
                onClearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
                viewType={viewType}
                onViewTypeChange={setViewType}
                grouping={grouping}
                onGroupingChange={setGrouping}
                onExport={handleExport}
              />
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
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
                {/* Results Info */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {grouping === "tech-stack"
                        ? "Tech Stack Inventory"
                        : "Asset Inventory"}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Showing{" "}
                      {grouping === "tech-stack"
                        ? filteredTechStacks.length
                        : filteredAssets.length}{" "}
                      {grouping === "tech-stack" ? "tech stacks" : "assets"}
                      {hasActiveFilters && " (filtered)"}
                    </p>
                  </div>
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
                      />
                    ) : (
                      <AssetCardView
                        assets={filteredAssets}
                        onSelectCard={(asset) => {
                          setSelectedItem(asset);
                          setShowDetails(true);
                        }}
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
                      />
                    ) : (
                      <AssetTableView
                        assets={filteredAssets}
                        onSelectRow={(asset) => {
                          setSelectedItem(asset);
                          setShowDetails(true);
                        }}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
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
    <div className={`border rounded-lg p-4 ${colorMap[color]}`}>
      <p className="text-xs font-medium opacity-75">{label}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <p className="text-2xl mt-1">{icon}</p>
    </div>
  );
}

interface DetailsPanelProps {
  item: any;
  isAsset: boolean;
  allAssets: any[];
  onClose: () => void;
  onNavigateToIncident: (techStackId: string, cveId: string) => void;
}

function DetailsPanel({
  item,
  isAsset,
  allAssets,
  onClose,
  onNavigateToIncident,
}: DetailsPanelProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any>(null);
  const [scannedCVEs, setScannedCVEs] = useState<Record<string, any>>({});
  const [newlyDiscoveredCVEs, setNewlyDiscoveredCVEs] = useState<any[]>([]);
  const [expandedCVE, setExpandedCVE] = useState<string | null>(null);

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
    },
  ];

  const getAssociatedAssets = (techStackId: string) => {
    return allAssets.filter((asset) =>
      asset.techStacks.some((ts: any) => ts.id === techStackId),
    );
  };

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
          className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl transform transition-transform overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
            <h2 className="text-lg font-bold text-gray-900">Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {isAsset ? (
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
                    label="Last Updated"
                    value={item.lastUpdated.toLocaleDateString()}
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
                {/* Tech Stack Details */}
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{item.logo}</span>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600">v{item.version}</p>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="space-y-3">
                  <DetailRowClickable
                    label="Type"
                    value={item.type}
                    isClickable={false}
                  />
                  <DetailRowClickable
                    label="Risk Score"
                    value={`${item.riskScore}/10 (${item.riskLevel.toUpperCase()})`}
                    isClickable={false}
                  />
                  <DetailRowClickable
                    label="License"
                    value={item.license}
                    isClickable={false}
                  />
                  <DetailRowClickable
                    label="EOL Status"
                    value={item.isEOL ? "⚠️ End of Life" : "✓ Active"}
                    isClickable={false}
                  />
                  {item.secureVersion && (
                    <DetailRowClickable
                      label="Secure Version"
                      value={`v${item.secureVersion}`}
                      isClickable={false}
                    />
                  )}
                </div>

                {/* Package Reliability Indicators */}
                {item.reliabilityIndicators && (
                  <PackageReliabilityCard
                    indicators={item.reliabilityIndicators}
                    compact={true}
                  />
                )}

                {/* Version History */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Version History
                  </h4>
                  <div className="space-y-2">
                    {item.versionHistory
                      .sort(
                        (a: any, b: any) =>
                          new Date(b.releaseDate).getTime() -
                          new Date(a.releaseDate).getTime(),
                      )
                      .map((version: any, idx: number) => (
                        <div
                          key={idx}
                          className={cn(
                            "p-3 rounded-lg border text-xs",
                            version.isEOL
                              ? "bg-red-50 border-red-200"
                              : idx === 0
                                ? "bg-blue-50 border-blue-200 ring-1 ring-blue-200"
                                : "bg-gray-50 border-gray-200",
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">
                              v{version.version}
                            </span>
                            <span className="text-gray-500">
                              {new Date(
                                version.releaseDate,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          {idx === 0 && (
                            <Badge className="mt-2 bg-blue-100 text-blue-800 text-xs">
                              Current
                            </Badge>
                          )}
                          {version.isEOL && (
                            <Badge className="mt-2 bg-red-100 text-red-800 text-xs">
                              EOL
                            </Badge>
                          )}
                        </div>
                      ))}
                  </div>
                </div>

                {/* CVE Vulnerability Scan Section */}
                <div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">🔍</span>
                      <h4 className="font-semibold text-blue-900">
                        CVE Vulnerability Scan
                      </h4>
                    </div>
                    <p className="text-sm text-blue-800 mb-4">
                      Scan associated assets for all known and newly published
                      vulnerabilities
                    </p>
                    <button
                      onClick={() => handleScanAssets(item.id)}
                      disabled={isScanning}
                      className={cn(
                        "w-full font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2",
                        isScanning
                          ? "bg-blue-400 text-white cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 text-white",
                      )}
                    >
                      <span>{isScanning ? "⏳" : "⚡"}</span>
                      {isScanning
                        ? "Scanning for Vulnerabilities..."
                        : `Scan ${getAssociatedAssets(item.id).length} Associated Assets`}
                    </button>

                    {/* Scan Summary */}
                    {scanResults && scanResults.techStackId === item.id && (
                      <div className="mt-4 p-3 bg-white border border-blue-300 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg">✓</span>
                          <p className="font-semibold text-blue-900 text-sm">
                            Scan Complete
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                          <div className="bg-blue-100 rounded p-2">
                            <p className="text-gray-600 font-medium">
                              Assets Scanned
                            </p>
                            <p className="text-blue-900 font-bold text-lg">
                              {scanResults.assetsScanned}
                            </p>
                          </div>
                          <div className="bg-red-100 rounded p-2">
                            <p className="text-gray-600 font-medium">
                              Total Vulnerabilities
                            </p>
                            <p className="text-red-900 font-bold text-lg">
                              {scanResults.totalVulnerabilities}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 text-xs bg-blue-50 p-2 rounded border border-blue-200">
                          <span className="text-blue-700">
                            <span className="font-semibold">
                              {scanResults.knownVulnerabilities}
                            </span>{" "}
                            Known
                          </span>
                          <span className="text-blue-700">•</span>
                          <span className="text-green-700">
                            <span className="font-semibold text-green-600">
                              +{scanResults.newlyDiscovered}
                            </span>{" "}
                            Newly Discovered
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Market CVEs Available for Scanning */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">
                      CVEs Found in Market ({marketCVEs.length})
                    </h4>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {marketCVEs.map((cve) => {
                        const cveResults = scannedCVEs[cve.id];
                        const isScanning = cveResults?.isScanning;
                        const isExpanded = expandedCVE === cve.id;

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
                            {/* CVE Header - Clickable to expand */}
                            <button
                              onClick={() =>
                                setExpandedCVE(isExpanded ? null : cve.id)
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
                                <p className="text-xs text-gray-600 mt-1">
                                  CVSS: {cve.score.toFixed(1)} •{" "}
                                  {cve.severity.toUpperCase()}
                                </p>
                              </div>
                              <span className="text-gray-400 flex-shrink-0 text-lg">
                                {isExpanded ? "▼" : "▶"}
                              </span>
                            </button>

                            {/* Expanded Details */}
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
                                <div className="flex gap-2 pt-2">
                                  <button
                                    onClick={() =>
                                      handleScanCVE(cve.id, item.id)
                                    }
                                    disabled={isScanning}
                                    className={cn(
                                      "flex-1 py-2 px-2 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1",
                                      isScanning
                                        ? "bg-blue-400 text-white cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700 text-white",
                                    )}
                                  >
                                    <span>{isScanning ? "⏳" : "🔍"}</span>
                                    {isScanning
                                      ? "Scanning Assets"
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

                                {/* Scan Results for this CVE */}
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
                                        ⚠️ {cveResults.affectedAssets} asset(s)
                                        are vulnerable to this CVE
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
                  </div>

                  {/* Scan Results - Individual CVEs */}
                  {scanResults && scanResults.techStackId === item.id && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Scan Results ({scanResults.totalVulnerabilities})
                      </h4>

                      {/* Known Vulnerabilities in Scan Results */}
                      {item.cves.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                            ✓ Known Vulnerabilities ({item.cves.length})
                          </p>
                          <div className="space-y-3">
                            {item.cves.map((cve: any) => {
                              const cveResults = scannedCVEs[cve.id];
                              const isScanning = cveResults?.isScanning;
                              return (
                                <div
                                  key={cve.id}
                                  className="border border-red-200 rounded-lg p-3 bg-red-50"
                                >
                                  <div className="flex items-start gap-2 mb-2">
                                    <span className="text-lg flex-shrink-0">
                                      {cve.severity === "critical"
                                        ? "🔴"
                                        : cve.severity === "high"
                                          ? "🟠"
                                          : "🟡"}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-semibold text-xs text-red-900">
                                        {cve.title}
                                      </p>
                                      <p className="text-xs text-red-700 mt-1">
                                        <span className="font-mono">
                                          {cve.id}
                                        </span>{" "}
                                        • {cve.severity.toUpperCase()} • CVSS:{" "}
                                        {cve.score.toFixed(1)}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() =>
                                        handleScanCVE(cve.id, item.id)
                                      }
                                      disabled={isScanning}
                                      className={cn(
                                        "flex-1 py-1.5 px-2 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1",
                                        isScanning
                                          ? "bg-blue-400 text-white cursor-not-allowed"
                                          : "bg-blue-600 hover:bg-blue-700 text-white",
                                      )}
                                    >
                                      <span>{isScanning ? "⏳" : "🔍"}</span>
                                      {isScanning ? "Scanning" : "Scan"}
                                    </button>
                                    <button
                                      onClick={() =>
                                        onNavigateToIncident(item.id, cve.id)
                                      }
                                      className="flex-1 py-1.5 px-2 rounded text-xs font-medium bg-white text-red-700 border border-red-200 hover:bg-red-50 transition-colors"
                                    >
                                      Details
                                    </button>
                                  </div>
                                  {cveResults && !isScanning && (
                                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                                      <p className="text-blue-900">
                                        <span className="font-semibold">
                                          Affected Assets:
                                        </span>{" "}
                                        {cveResults.affectedAssets}/
                                        {cveResults.assetsScanned}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Newly Discovered CVEs */}
                      {newlyDiscoveredCVEs.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-green-700 mb-2 uppercase tracking-wide">
                            🆕 Newly Discovered CVEs (
                            {newlyDiscoveredCVEs.length})
                          </p>
                          <div className="space-y-3">
                            {newlyDiscoveredCVEs.map((cve: any) => {
                              const cveResults = scannedCVEs[cve.id];
                              const isScanning = cveResults?.isScanning;
                              return (
                                <div
                                  key={cve.id}
                                  className="border border-green-200 rounded-lg p-3 bg-green-50"
                                >
                                  <div className="flex items-start gap-2 mb-2">
                                    <span className="text-lg flex-shrink-0">
                                      {cve.severity === "critical"
                                        ? "🔴"
                                        : cve.severity === "high"
                                          ? "🟠"
                                          : "🟡"}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <p className="font-semibold text-xs text-green-900">
                                          {cve.title}
                                        </p>
                                        <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                                          NEW
                                        </span>
                                      </div>
                                      <p className="text-xs text-green-700 mt-1">
                                        <span className="font-mono">
                                          {cve.id}
                                        </span>{" "}
                                        • {cve.severity.toUpperCase()} • CVSS:{" "}
                                        {cve.score.toFixed(1)}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() =>
                                        handleScanCVE(cve.id, item.id)
                                      }
                                      disabled={isScanning}
                                      className={cn(
                                        "flex-1 py-1.5 px-2 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1",
                                        isScanning
                                          ? "bg-green-400 text-white cursor-not-allowed"
                                          : "bg-green-600 hover:bg-green-700 text-white",
                                      )}
                                    >
                                      <span>{isScanning ? "⏳" : "🔍"}</span>
                                      {isScanning ? "Scanning" : "Scan"}
                                    </button>
                                    <button
                                      onClick={() =>
                                        onNavigateToIncident(item.id, cve.id)
                                      }
                                      className="flex-1 py-1.5 px-2 rounded text-xs font-medium bg-white text-green-700 border border-green-200 hover:bg-green-50 transition-colors"
                                    >
                                      Details
                                    </button>
                                  </div>
                                  {cveResults && !isScanning && (
                                    <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded text-xs">
                                      <p className="text-green-900">
                                        <span className="font-semibold">
                                          Affected Assets:
                                        </span>{" "}
                                        {cveResults.affectedAssets}/
                                        {cveResults.assetsScanned}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Known Vulnerabilities */}
                {item.cves.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Known Vulnerabilities ({item.cves.length})
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {item.cves.map((cve: any) => (
                        <div
                          key={cve.id}
                          className="p-3 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-lg">
                              {cve.severity === "critical"
                                ? "🔴"
                                : cve.severity === "high"
                                  ? "🟠"
                                  : cve.severity === "medium"
                                    ? "🟡"
                                    : "🟢"}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-red-900">
                                {cve.title}
                              </p>
                              <p className="text-xs text-red-700 mt-1">
                                {cve.id} • {cve.severity.toUpperCase()} • CVSS:{" "}
                                {cve.score.toFixed(1)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Associated Assets */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Used by {getAssociatedAssets(item.id).length} Asset
                    {getAssociatedAssets(item.id).length !== 1 ? "s" : ""}
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {getAssociatedAssets(item.id).map((asset) => (
                      <div
                        key={asset.id}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                      >
                        <p className="font-semibold text-sm">{asset.name}</p>
                        <p className="text-xs text-gray-600">
                          {asset.type.replace("-", " ")} • Risk:{" "}
                          <span className="font-semibold">
                            {asset.riskLevel}
                          </span>
                        </p>
                      </div>
                    ))}
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

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
