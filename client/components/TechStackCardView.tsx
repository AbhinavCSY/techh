import { TechStack, Asset } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { ThreatBar } from '@/components/ThreatBar';
import { cn } from '@/lib/utils';

interface TechStackCardViewProps {
  techStacks: TechStack[];
  allAssets: Asset[];
  onSelectCard?: (techStack: TechStack) => void;
}

export function TechStackCardView({
  techStacks,
  allAssets,
  onSelectCard,
}: TechStackCardViewProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-50 border-red-200';
      case 'high':
        return 'bg-orange-50 border-orange-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      case 'low':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getRiskBadgeColor = (level: string) => {
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

  const getCVEColor = (severity: string) => {
    switch (severity) {
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

  const getAssociatedAssets = (techStackId: string) => {
    return allAssets.filter((asset) =>
      asset.techStacks.some((ts) => ts.id === techStackId)
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {techStacks.map((techStack) => {
        const associatedAssets = getAssociatedAssets(techStack.id);
        const criticalAsset = associatedAssets.sort(
          (a, b) => {
            const riskOrder = { critical: 4, high: 3, medium: 2, low: 1 };
            return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
          }
        )[0];
        const otherCount = Math.max(0, associatedAssets.length - 2);

        return (
          <div
            key={techStack.id}
            onClick={() => onSelectCard?.(techStack)}
            className={cn(
              'border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg hover:border-opacity-100',
              getRiskColor(techStack.riskLevel)
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{techStack.logo}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {techStack.name}
                  </h3>
                  <p className="text-xs text-gray-500">v{techStack.version}</p>
                </div>
              </div>
              <Badge className={getRiskBadgeColor(techStack.riskLevel)}>
                {techStack.riskLevel}
              </Badge>
            </div>

            {/* Type Badge */}
            <div className="mb-3">
              <Badge variant="outline" className="text-xs">
                {techStack.type}
              </Badge>
            </div>

            {/* Status Indicators */}
            <div className="flex flex-wrap gap-2 mb-4">
              {techStack.isEOL && (
                <Badge className="bg-red-200 text-red-800 text-xs">
                  ⚠️ EOL
                </Badge>
              )}
              {techStack.isUpgradable && (
                <Badge className="bg-blue-200 text-blue-800 text-xs">
                  🔄 Upgradable
                </Badge>
              )}
              {techStack.secureVersion && (
                <Badge className="bg-green-200 text-green-800 text-xs">
                  → v{techStack.secureVersion}
                </Badge>
              )}
            </div>

            {/* Threat Summary */}
            <div className="mb-4 p-3 bg-white rounded border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Threat
              </p>
              <ThreatBar
                cves={techStack.cves}
                unscannedCount={techStack.unscannedThreatsCount}
              />
              <p className="text-xs text-gray-600 mt-2">
                {techStack.cves.length} scanned, {techStack.unscannedThreatsCount} unscanned
              </p>
            </div>

            {/* Associated Assets */}
            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs font-medium text-gray-700 mb-2">
                Used by {associatedAssets.length} asset{associatedAssets.length !== 1 ? 's' : ''}
              </p>
              {associatedAssets.length > 0 && (
                <div className="space-y-1">
                  {associatedAssets.slice(0, 2).map((asset) => (
                    <div
                      key={asset.id}
                      className="text-xs text-gray-600 flex items-center gap-2"
                    >
                      <span className="text-gray-400">•</span>
                      <span className="truncate">{asset.name}</span>
                    </div>
                  ))}
                  {otherCount > 0 && (
                    <p className="text-xs text-gray-500">+{otherCount} more</p>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
