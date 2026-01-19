import { PackageReliabilityIndicators } from '@/data/mockData';

interface PackageReliabilityCardProps {
  indicators: PackageReliabilityIndicators;
  compact?: boolean;
}

export function PackageReliabilityCard({ indicators, compact = false }: PackageReliabilityCardProps) {
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-blue-600';
      case 'no risk':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getRiskBgColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical':
        return 'bg-red-50 border-red-200';
      case 'high':
        return 'bg-orange-50 border-orange-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      case 'low':
        return 'bg-blue-50 border-blue-200';
      case 'no risk':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (compact) {
    return (
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900 text-sm">Package Reliability</h4>
        <div className="grid grid-cols-3 gap-3">
          <ReliabilityIndicatorCompact
            label="Contributor Rep"
            score={indicators.contributorReputation.score}
            riskLevel={indicators.contributorReputation.riskLevel}
            getRiskColor={getRiskColor}
          />
          <ReliabilityIndicatorCompact
            label="Package Rel"
            score={indicators.packageReliability.score}
            riskLevel={indicators.packageReliability.riskLevel}
            getRiskColor={getRiskColor}
          />
          <ReliabilityIndicatorCompact
            label="Behavioral"
            score={indicators.behavioralIntegrity.score}
            riskLevel={indicators.behavioralIntegrity.riskLevel}
            getRiskColor={getRiskColor}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-6">Package Reliability Indicators</h3>
      
      <div className="grid grid-cols-3 gap-6">
        <ReliabilityIndicator
          label="Contributor Reputation"
          score={indicators.contributorReputation.score}
          riskLevel={indicators.contributorReputation.riskLevel}
          getRiskColor={getRiskColor}
          getRiskBgColor={getRiskBgColor}
        />
        <ReliabilityIndicator
          label="Package Reliability"
          score={indicators.packageReliability.score}
          riskLevel={indicators.packageReliability.riskLevel}
          getRiskColor={getRiskColor}
          getRiskBgColor={getRiskBgColor}
        />
        <ReliabilityIndicator
          label="Behavioral Integrity"
          score={indicators.behavioralIntegrity.score}
          riskLevel={indicators.behavioralIntegrity.riskLevel}
          getRiskColor={getRiskColor}
          getRiskBgColor={getRiskBgColor}
        />
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <a
          href="#"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          <span>📚</span>
          Learn more about this package
        </a>
      </div>
    </div>
  );
}

interface ReliabilityIndicatorProps {
  label: string;
  score: number;
  riskLevel: string;
  getRiskColor: (level: string) => string;
  getRiskBgColor: (level: string) => string;
}

function ReliabilityIndicator({
  label,
  score,
  riskLevel,
  getRiskColor,
  getRiskBgColor,
}: ReliabilityIndicatorProps) {
  const percentage = (score / 10) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 mb-4">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`transition-all duration-300 ${getRiskColor(riskLevel)}`}
            strokeLinecap="round"
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-gray-900">{score}</span>
        </div>
      </div>
      <p className="text-sm font-medium text-gray-900 text-center mb-2">{label}</p>
      <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getRiskBgColor(
          riskLevel
        )} ${getRiskColor(riskLevel)}`}
      >
        {riskLevel}
      </span>
    </div>
  );
}

interface ReliabilityIndicatorCompactProps {
  label: string;
  score: number;
  riskLevel: string;
  getRiskColor: (level: string) => string;
}

function ReliabilityIndicatorCompact({
  label,
  score,
  riskLevel,
  getRiskColor,
}: ReliabilityIndicatorCompactProps) {
  const percentage = (score / 10) * 100;
  const circumference = 2 * Math.PI * 30;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24 mb-2">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="30" fill="none" stroke="#e5e7eb" strokeWidth="6" />
          <circle
            cx="40"
            cy="40"
            r="30"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`transition-all duration-300 ${getRiskColor(riskLevel)}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-gray-900">{score}</span>
        </div>
      </div>
      <p className="text-xs font-medium text-gray-900 text-center">{label}</p>
      <p className="text-xs text-gray-600">{riskLevel}</p>
    </div>
  );
}
