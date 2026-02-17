import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, AlertTriangle, Calendar, Link as LinkIcon } from 'lucide-react';
import { techStackDatabase } from '@/data/mockData';

export default function IncidentDetails() {
  const { techStackId, cveId } = useParams();
  const navigate = useNavigate();

  const techStack = techStackDatabase.find((ts) => ts.id === techStackId);
  const cve = techStack?.cves.find((c) => c.id === cveId);

  if (!techStack || !cve) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Incident not found
            </h1>
            <p className="text-gray-600">
              The incident you're looking for doesn't exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '🔴';
      case 'high':
        return '🟠';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '⚪';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Branding Bar */}
          <div className="mb-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-blue-600">BeVigil</span>
              <span className="text-gray-400">×</span>
              <span className="text-lg font-bold text-purple-600">CloudSEK</span>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <p className="text-xs text-gray-600 font-medium">CVE Details</p>
          </div>

          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Inventory
          </Button>

          <div className="flex items-start gap-4">
            <div className="text-5xl">
              {getSeverityIcon(cve.severity)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {cve.title}
                </h1>
                <Badge className={`${getSeverityColor(cve.severity)} border`}>
                  {cve.severity.toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Affects: <span className="font-semibold">{techStack.name} v{techStack.version}</span>
              </p>
              <p className="text-sm text-gray-600">
                CVE ID: <span className="font-monospace font-semibold">{cve.id}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Overview</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Severity Score (CVSS)
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className={cn(
                          'h-2 rounded-full transition-all',
                          cve.score >= 9
                            ? 'bg-red-500 w-full'
                            : cve.score >= 7
                            ? 'bg-orange-500'
                            : cve.score >= 5
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        )}
                        style={{ width: `${(cve.score / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {cve.score.toFixed(1)}/10
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Description
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    This vulnerability allows attackers to execute arbitrary code
                    through specially crafted input. The vulnerability exists in
                    the message lookup functionality which fails to properly validate
                    user-supplied data.
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Attack Vector
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <DetailItem label="Vector Type" value="Network" />
                    <DetailItem label="Complexity" value="Low" />
                    <DetailItem label="Privileges" value="None" />
                    <DetailItem label="User Interaction" value="None" />
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Analysis */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Impact Analysis
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Confidentiality Impact
                  </p>
                  <Badge className="bg-red-100 text-red-800">HIGH</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Integrity Impact
                  </p>
                  <Badge className="bg-red-100 text-red-800">HIGH</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Availability Impact
                  </p>
                  <Badge className="bg-red-100 text-red-800">HIGH</Badge>
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Technical Details
              </h2>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg font-monospace text-sm">
                <p className="text-gray-600">
                  <span className="text-gray-700 font-semibold">CVE Published:</span> 2021-12-10
                </p>
                <p className="text-gray-600">
                  <span className="text-gray-700 font-semibold">Last Modified:</span> 2024-02-10
                </p>
                <p className="text-gray-600">
                  <span className="text-gray-700 font-semibold">NVD Link:</span>{' '}
                  <a
                    href={`https://nvd.nist.gov/vuln/detail/${cve.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View on NVD
                  </a>
                </p>
              </div>
            </div>

            {/* Workarounds */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Temporary Workarounds
              </h2>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-lg">•</span>
                  <span className="text-gray-700">
                    Disable the affected message lookup feature if not in use
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-lg">•</span>
                  <span className="text-gray-700">
                    Implement input validation and sanitization
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-lg">•</span>
                  <span className="text-gray-700">
                    Use Web Application Firewall (WAF) rules
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 mb-3">Actions</h3>
              <div className="space-y-2">
                <Button
                  onClick={() => navigate(`/cve-details/${cve.id}`)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Full Details
                </Button>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Create Incident
                </Button>
                <Button variant="outline" className="w-full">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Remediation Info */}
            <div className="bg-white rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h3 className="font-bold text-blue-900 mb-3">🔧 Remediation</h3>
              <div className="space-y-2">
                <p className="text-sm text-blue-800">
                  Upgrade to version <span className="font-semibold">{techStack.secureVersion}</span> or later
                </p>
                <Button
                  size="sm"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  View Upgrade Guide
                </Button>
              </div>
            </div>

            {/* Related Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 mb-3">Related</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  <span className="font-medium">Affected Package:</span>
                </p>
                <p className="text-gray-900 font-semibold">{techStack.name}</p>
                <p className="text-gray-600 mt-2">
                  <span className="font-medium">Current Version:</span>
                </p>
                <p className="text-gray-900 font-semibold">v{techStack.version}</p>
                <p className="text-gray-600 mt-2">
                  <span className="font-medium">License:</span>
                </p>
                <p className="text-gray-900 font-semibold text-xs">
                  {techStack.license}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
      <p className="text-xs text-gray-600 font-medium">{label}</p>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
