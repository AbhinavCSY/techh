import { Asset } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface AssetTableViewProps {
  assets: Asset[];
  onSelectRow?: (asset: Asset) => void;
}

export function AssetTableView({ assets, onSelectRow }: AssetTableViewProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAssetTypeIcon = (type: string) => {
    switch (type) {
      case 'ip':
        return '🖥️';
      case 'domain':
        return '🌐';
      case 'app':
        return '📦';
      case 'cloud-resource':
        return '☁️';
      default:
        return '📋';
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
            <TableHead className="font-semibold">Risk Level</TableHead>
            <TableHead className="font-semibold">CVEs</TableHead>
            <TableHead className="font-semibold">Last Updated</TableHead>
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
                  <span className="text-xl">{getAssetTypeIcon(asset.type)}</span>
                  <span className="truncate">{asset.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm capitalize">
                  {asset.type.replace('-', ' ')}
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
                <Badge className={getRiskColor(asset.riskLevel)}>
                  {asset.riskLevel}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg text-gray-900">
                    {asset.cveCount}
                  </span>
                  {asset.topCriticalCVE && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                      🔴 Critical
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-sm text-gray-600">
                {asset.lastUpdated.toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
