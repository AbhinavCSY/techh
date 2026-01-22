import { Asset } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { ThreatBar } from "@/components/ThreatBar";
import { cn } from "@/lib/utils";

interface AssetCardViewProps {
  assets: Asset[];
  onSelectCard?: (asset: Asset) => void;
}

export function AssetCardView({ assets, onSelectCard }: AssetCardViewProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-50 border-red-200";
      case "high":
        return "bg-orange-50 border-orange-200";
      case "medium":
        return "bg-yellow-50 border-yellow-200";
      case "low":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

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

  const getAssetTypeIcon = (type: string) => {
    switch (type) {
      case "ip":
        return "🖥️";
      case "domain":
        return "🌐";
      case "app":
        return "📦";
      case "cloud-resource":
        return "☁️";
      default:
        return "📋";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {assets.map((asset) => (
        <div
          key={asset.id}
          onClick={() => onSelectCard?.(asset)}
          className={cn(
            "border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg hover:border-opacity-100",
            getRiskColor(asset.riskLevel),
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getAssetTypeIcon(asset.type)}</span>
              <div>
                <h3 className="font-semibold text-gray-900 truncate">
                  {asset.name}
                </h3>
                <p className="text-xs text-gray-500 capitalize">
                  {asset.type.replace("-", " ")}
                </p>
              </div>
            </div>
            <Badge className={getRiskBadgeColor(asset.riskLevel)}>
              {asset.riskLevel}
            </Badge>
          </div>

          {/* Threat Summary */}
          <div className="mb-4 p-3 bg-white rounded border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Threat</p>
            <ThreatBar
              cves={
                asset.topCriticalCVE
                  ? [
                      asset.topCriticalCVE,
                      ...asset.techStacks.flatMap((ts) => ts.cves),
                    ]
                  : asset.techStacks.flatMap((ts) => ts.cves)
              }
              unscannedCount={asset.techStacks.reduce(
                (sum, ts) => sum + ts.unscannedThreatsCount,
                0,
              )}
            />
            <p className="text-xs text-gray-600 mt-2">
              {asset.cveCount} scanned,{" "}
              {asset.techStacks.reduce(
                (sum, ts) => sum + ts.unscannedThreatsCount,
                0,
              )}{" "}
              unscanned
            </p>
          </div>

          {/* Tech Stacks */}
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-700 mb-2">
              Tech Stacks ({asset.techStacks.length})
            </p>
            <div className="space-y-2">
              {asset.techStacks.map((techStack) => (
                <div
                  key={techStack.id}
                  className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200"
                >
                  <span className="text-lg">{techStack.logo}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {techStack.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      v{techStack.version}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {techStack.isEOL && (
                      <Badge className="bg-red-200 text-red-800 text-xs">
                        EOL
                      </Badge>
                    )}
                    {techStack.cves.length > 0 && (
                      <Badge className="bg-orange-200 text-orange-800 text-xs">
                        {techStack.cves.length}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Last Updated */}
          <div className="pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Updated {asset.lastUpdated.toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
