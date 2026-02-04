import { Asset } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { ThreatBar } from "@/components/ThreatBar";
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
}

export function AssetTableView({ assets, onSelectRow }: AssetTableViewProps) {
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
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-semibold">Asset Name</TableHead>
            <TableHead className="font-semibold">Type</TableHead>
            <TableHead className="font-semibold">Tech Stacks</TableHead>
            <TableHead className="font-semibold">Threat</TableHead>
            <TableHead className="font-semibold">First Seen</TableHead>
            <TableHead className="font-semibold">Last Seen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => (
            <TableRow
              key={asset.id}
              onClick={() => onSelectRow?.(asset)}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <span className="text-xl">
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
                <span className="text-sm capitalize">
                  {asset.type.replace("-", " ")}
                </span>
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
              <TableCell className="text-sm text-gray-600">
                {asset.firstSeen.toLocaleDateString()}
              </TableCell>
              <TableCell className="text-sm text-gray-600">
                {asset.lastSeen.toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
