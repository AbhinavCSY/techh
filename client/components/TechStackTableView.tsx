import { TechStack, Asset } from "@/data/mockData";
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

interface TechStackTableViewProps {
  techStacks: TechStack[];
  allAssets: Asset[];
  onSelectRow?: (techStack: TechStack) => void;
}

export function TechStackTableView({
  techStacks,
  allAssets,
  onSelectRow,
}: TechStackTableViewProps) {
  const isNewTechStack = (createdAt: Date) => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return new Date(createdAt) > oneDayAgo;
  };

  const getRiskColor = (level: string) => {
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

  const getCVEColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-700";
      case "high":
        return "text-orange-700";
      case "medium":
        return "text-yellow-700";
      case "low":
        return "text-green-700";
      default:
        return "text-gray-700";
    }
  };

  const getAssociatedAssets = (techStackId: string) => {
    return allAssets.filter((asset) =>
      asset.techStacks.some((ts) => ts.id === techStackId),
    );
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-semibold">Tech Stack</TableHead>
            <TableHead className="font-semibold">Version</TableHead>
            <TableHead className="font-semibold">License</TableHead>
            <TableHead className="font-semibold">Associated Assets</TableHead>
            <TableHead className="font-semibold">Last Updated</TableHead>
            <TableHead className="font-semibold">Risk</TableHead>
            <TableHead className="font-semibold">Threat</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {techStacks.map((techStack) => {
            const associatedAssets = getAssociatedAssets(techStack.id);
            const criticalCVE = techStack.cves.find(
              (cve) => cve.severity === "critical",
            );
            const highCVE = techStack.cves.find(
              (cve) => cve.severity === "high",
            );

            return (
              <TableRow
                key={techStack.id}
                onClick={() => onSelectRow?.(techStack)}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{techStack.logo}</span>
                    <div>
                      <p className="font-semibold">{techStack.name}</p>
                      <p className="text-xs text-gray-500">{techStack.type}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">v{techStack.version}</p>
                    {techStack.secureVersion && (
                      <p className="text-xs text-green-600">
                        → v{techStack.secureVersion}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                    {techStack.effectiveLicense}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 items-center">
                    {associatedAssets.slice(0, 2).map((asset) => (
                      <Badge
                        key={asset.id}
                        className="bg-purple-100 text-purple-800 text-xs py-0.5 px-1.5"
                        title={asset.name}
                      >
                        {asset.name.length > 12
                          ? `${asset.name.substring(0, 12)}...`
                          : asset.name}
                      </Badge>
                    ))}
                    {associatedAssets.length > 2 && (
                      <Badge className="bg-gray-200 text-gray-800 text-xs py-0.5 px-1.5 font-semibold">
                        +{associatedAssets.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-gray-600">
                    {techStack.lastUpdated
                      ? techStack.lastUpdated.toLocaleDateString()
                      : "N/A"}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge className={getRiskColor(techStack.riskLevel)}>
                    {techStack.riskLevel}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ThreatBar
                    cves={techStack.cves}
                    unscannedCount={techStack.unscannedThreatsCount}
                    className="w-48"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {techStack.isEOL && (
                      <Badge className="bg-red-200 text-red-800 text-xs">
                        EOL
                      </Badge>
                    )}
                    {techStack.isUpgradable && (
                      <Badge className="bg-blue-200 text-blue-800 text-xs">
                        Upgradable
                      </Badge>
                    )}
                    {!techStack.isEOL && !techStack.isUpgradable && (
                      <Badge className="bg-green-200 text-green-800 text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
