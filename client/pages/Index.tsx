import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFilters, filterTechStacks, filterAssets, sortTechStacks, sortAssets } from '@/hooks/useFilters';
import { techStackDatabase, assetDatabase } from '@/data/mockData';
import { FilterPanel } from '@/components/FilterPanel';
import { TechStackCardView } from '@/components/TechStackCardView';
import { AssetCardView } from '@/components/AssetCardView';
import { TechStackTableView } from '@/components/TechStackTableView';
import { AssetTableView } from '@/components/AssetTableView';
import { exportAsCSV, exportAsJSON, exportAsPDF } from '@/lib/exportUtils';
import { Button } from '@/components/ui/button';
import { ChevronDown, AlertTriangle, Badge as BadgeIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

  const handleExport = (format: 'csv' | 'json' | 'pdf') => {
    const dataToExport = grouping === 'tech-stack' ? filteredTechStacks : filteredAssets;
    const filename = `${grouping}-inventory-${new Date().toISOString().split('T')[0]}`;

    switch (format) {
      case 'csv':
        exportAsCSV(dataToExport, `${filename}.csv`, grouping === 'tech-stack');
        break;
      case 'json':
        exportAsJSON(dataToExport, `${filename}.json`);
        break;
      case 'pdf':
        exportAsPDF(dataToExport, `${filename}.pdf`, grouping === 'tech-stack');
        break;
    }
  };

  const getMetrics = () => {
    const criticalCount = (grouping === 'tech-stack' ? filteredTechStacks : filteredAssets).filter(
      (item: any) => item.riskLevel === 'critical'
    ).length;
    const highCount = (grouping === 'tech-stack' ? filteredTechStacks : filteredAssets).filter(
      (item: any) => item.riskLevel === 'high'
    ).length;
    const totalCVEs = filteredTechStacks.reduce((acc, ts) => acc + ts.cves.length, 0);
    const totalAssets = Math.max(...assetDatabase.map(a => a.techStacks.length));

    return { criticalCount, highCount, totalCVEs, totalAssets };
  };

  const metrics = getMetrics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="text-4xl">🔒</span>
                  Tech Stack Inventory
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage and monitor your technology dependencies and security risks
                </p>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              <MetricCard
                label="Critical Issues"
                value={metrics.criticalCount}
                color="red"
                icon="🔴"
              />
              <MetricCard
                label="High Risk"
                value={metrics.highCount}
                color="orange"
                icon="🟠"
              />
              <MetricCard
                label="Total CVEs"
                value={metrics.totalCVEs}
                color="yellow"
                icon="⚠️"
              />
              <MetricCard
                label={grouping === 'tech-stack' ? 'Tech Stacks' : 'Assets'}
                value={grouping === 'tech-stack' ? filteredTechStacks.length : filteredAssets.length}
                color="blue"
                icon="📦"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Filters */}
          <aside className="lg:col-span-1 order-2 lg:order-1">
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
          <div className="lg:col-span-3 order-1 lg:order-2">
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
                      {grouping === 'tech-stack' ? 'Tech Stack Inventory' : 'Asset Inventory'}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Showing {grouping === 'tech-stack' ? filteredTechStacks.length : filteredAssets.length}{' '}
                      {grouping === 'tech-stack' ? 'tech stacks' : 'assets'}
                      {hasActiveFilters && ' (filtered)'}
                    </p>
                  </div>
                </div>

                {/* Content - Card or Table View */}
                {viewType === 'card' ? (
                  <>
                    {grouping === 'tech-stack' ? (
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
                    {grouping === 'tech-stack' ? (
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
          isAsset={grouping === 'asset'}
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
    red: 'bg-red-50 border-red-200 text-red-900',
    orange: 'bg-orange-50 border-orange-200 text-orange-900',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
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
  const getAssociatedAssets = (techStackId: string) => {
    return allAssets.filter((asset) =>
      asset.techStacks.some((ts: any) => ts.id === techStackId)
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      onClick={onClose}
    >
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
                    {item.type.replace('-', ' ')}
                  </p>
                </div>

                <div className="space-y-3">
                  <DetailRow label="Risk Level" value={item.riskLevel} />
                  <DetailRow label="CVEs" value={item.cveCount} />
                  <DetailRow label="Tech Stacks" value={item.techStacks.length} />
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
                              <p className="text-xs text-gray-600">v{ts.version}</p>
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
                    value={item.isEOL ? '⚠️ End of Life' : '✓ Active'}
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
                          new Date(a.releaseDate).getTime()
                      )
                      .map((version: any, idx: number) => (
                        <div
                          key={idx}
                          className={cn(
                            'p-3 rounded-lg border text-xs',
                            version.isEOL
                              ? 'bg-red-50 border-red-200'
                              : idx === 0
                              ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200'
                              : 'bg-gray-50 border-gray-200'
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">v{version.version}</span>
                            <span className="text-gray-500">
                              {new Date(version.releaseDate).toLocaleDateString()}
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

                {/* Vulnerabilities/Incidents */}
                {item.cves.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Vulnerabilities/Incidents ({item.cves.length})
                    </h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {item.cves.map((cve: any) => (
                        <button
                          key={cve.id}
                          onClick={() =>
                            onNavigateToIncident(item.id, cve.id)
                          }
                          className="w-full text-left p-3 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-lg">🔴</span>
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-red-900">
                                {cve.title}
                              </p>
                              <p className="text-xs text-red-700 mt-1">
                                {cve.id} • {cve.severity.toUpperCase()}
                              </p>
                              <p className="text-xs text-red-600 mt-1">
                                CVSS: {cve.score.toFixed(1)} • Click for details →
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Associated Assets */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Used by {getAssociatedAssets(item.id).length} Asset
                    {getAssociatedAssets(item.id).length !== 1 ? 's' : ''}
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {getAssociatedAssets(item.id).map((asset) => (
                      <div
                        key={asset.id}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                      >
                        <p className="font-semibold text-sm">{asset.name}</p>
                        <p className="text-xs text-gray-600">
                          {asset.type.replace('-', ' ')} • Risk:{' '}
                          <span className="font-semibold">{asset.riskLevel}</span>
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
                            'p-3 rounded-lg border text-xs',
                            rem.priority === 'critical'
                              ? 'bg-red-50 border-red-200'
                              : rem.priority === 'high'
                              ? 'bg-orange-50 border-orange-200'
                              : 'bg-blue-50 border-blue-200'
                          )}
                        >
                          <p className="font-semibold">{rem.title}</p>
                          <p className="text-gray-600 mt-1">{rem.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <Badge
                              className={cn(
                                rem.priority === 'critical'
                                  ? 'bg-red-100 text-red-800'
                                  : rem.priority === 'high'
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-blue-100 text-blue-800'
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

function DetailRow({ label, value }: { label: string; value: string | number }) {
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
        'w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-colors',
        isClickable
          ? 'hover:bg-gray-100 cursor-pointer'
          : 'cursor-default'
      )}
    >
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </button>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
