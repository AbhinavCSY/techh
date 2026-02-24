import { Asset } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { ThreatBar } from "@/components/ThreatBar";
import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AssetTableViewProps {
  assets: Asset[];
  onSelectRow?: (asset: Asset) => void;
  scanningProject?: string | null;
  scannedAssets?: Set<string>;
}

export function AssetTableView({ assets, onSelectRow, scanningProject, scannedAssets = new Set() }: AssetTableViewProps) {
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set(["ip"])); // Default expand first type

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

  // Group assets by type
  const groupedAssets = useMemo(() => {
    const grouped: Record<string, Asset[]> = {};
    assets.forEach((asset) => {
      if (!grouped[asset.type]) {
        grouped[asset.type] = [];
      }
      grouped[asset.type].push(asset);
    });
    return grouped;
  }, [assets]);

  // Get all unique tech stacks for a category
  const getCategoryTechStacks = (assetList: Asset[]) => {
    const techStackMap = new Map<string, any>();
    assetList.forEach((asset) => {
      asset.techStacks.forEach((ts) => {
        if (!techStackMap.has(ts.id)) {
          techStackMap.set(ts.id, ts);
        }
      });
    });
    return Array.from(techStackMap.values());
  };

  // Get category threat info
  const getCategoryThreat = (assetList: Asset[]) => {
    return assetList.flatMap((asset) =>
      asset.techStacks.flatMap((ts) => ts.cves)
    );
  };

  const toggleTypeExpanded = (type: string) => {
    const newSet = new Set(expandedTypes);
    if (newSet.has(type)) {
      newSet.delete(type);
    } else {
      newSet.add(type);
    }
    setExpandedTypes(newSet);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-semibold">Asset Category</TableHead>
            <TableHead className="font-semibold">Count</TableHead>
            <TableHead className="font-semibold">Tech Stacks</TableHead>
            <TableHead className="font-semibold">Threat</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(groupedAssets).flatMap(([type, typeAssets]) => {
            const rows: React.ReactNode[] = [];

            // Category Header Row
            rows.push(
              <TableRow
                key={`category-${type}`}
                onClick={() => toggleTypeExpanded(type)}
                className="bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors border-b-2"
              >
                <TableCell className="font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {expandedTypes.has(type) ? "▼" : "▶"}
                    </span>
                    <span className="text-lg">
                      {getAssetTypeIcon(type)}
                    </span>
                    <span className="capitalize">
                      {type.replace("-", " ")}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-semibold">
                  <Badge variant="outline">{typeAssets.length}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {getCategoryTechStacks(typeAssets).slice(0, 2).map((ts) => (
                      <Badge
                        key={ts.id}
                        variant="outline"
                        className="text-xs"
                      >
                        {ts.logo} {ts.name}
                      </Badge>
                    ))}
                    {getCategoryTechStacks(typeAssets).length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{getCategoryTechStacks(typeAssets).length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <ThreatBar
                    cves={getCategoryThreat(typeAssets)}
                    unscannedCount={typeAssets.reduce(
                      (sum, asset) =>
                        sum +
                        asset.techStacks.reduce(
                          (ts, t) => ts + t.unscannedThreatsCount,
                          0,
                        ),
                      0,
                    )}
                    className="w-56"
                  />
                </TableCell>
              </TableRow>
            );

            // Expanded Assets Rows
            if (expandedTypes.has(type)) {
              typeAssets.forEach((asset) => {
                rows.push(
                  <TableRow
                    key={asset.id}
                    onClick={() => onSelectRow?.(asset)}
                    className="cursor-pointer hover:bg-blue-50 transition-colors"
                  >
                    <TableCell className="font-medium pl-12">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {getAssetTypeIcon(asset.type)}
                        </span>
                        <span
                          className="truncate"
                          title={asset.displayName || asset.name}
                        >
                          {asset.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {asset.techStacks.slice(0, 3).map((techStack) => (
                          <Badge
                            key={techStack.id}
                            variant="outline"
                            className="text-xs"
                          >
                            {techStack.logo} {techStack.name}
                          </Badge>
                        ))}
                        {asset.techStacks.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{asset.techStacks.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <ThreatBar
                        cves={asset.techStacks.flatMap((ts) => ts.cves)}
                        unscannedCount={asset.techStacks.reduce(
                          (sum, ts) => sum + ts.unscannedThreatsCount,
                          0,
                        )}
                        className="w-56"
                      />
                    </TableCell>
                    <TableCell>
                      {scanningProject && scannedAssets.has(asset.id) ? (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-green-700 font-medium">
                            Scanned
                          </span>
                        </div>
                      ) : scanningProject && !scannedAssets.has(asset.id) ? (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <span className="text-sm text-blue-700 font-medium">
                            Scanning
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-600">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {asset.firstSeen.toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {asset.lastSeen.toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                );
              });
            }

            return rows;
          })}
        </TableBody>
      </Table>
    </div>
  );
}
