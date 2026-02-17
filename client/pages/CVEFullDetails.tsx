import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download } from 'lucide-react';
import { techStackDatabase } from '@/data/mockData';

export default function CVEFullDetails() {
  const { cveId } = useParams();
  const navigate = useNavigate();

  // Find the CVE across all tech stacks
  let cve = null;
  let techStack = null;
  
  for (const ts of techStackDatabase) {
    const foundCVE = ts.cves.find(c => c.id === cveId);
    if (foundCVE) {
      cve = foundCVE;
      techStack = ts;
      break;
    }
  }

  if (!cve || !techStack) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">CVE not found</h1>
            <p className="text-gray-600">The CVE you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const threatIntel = cve.threatIntelligence;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Download className="w-4 h-4" />
              Download Report
            </Button>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{cve.id}</h1>
                <Badge className="bg-blue-100 text-blue-800">CVE</Badge>
              </div>
              <h2 className="text-lg text-gray-700 mb-2">{cve.title}</h2>
              <p className="text-sm text-gray-600">Affects: <span className="font-semibold">{techStack.name}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Key Metrics */}
          <div className="space-y-4">
            {/* CVE ID Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-xs text-gray-600 font-medium mb-1">CVE ID</div>
              <div className="text-lg font-mono font-bold text-gray-900">{cve.id}</div>
            </div>

            {/* CVSS Score */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-xs text-gray-600 font-medium mb-2">CVSS</div>
              <div className="text-3xl font-bold text-red-600">{cve.score}</div>
              <div className="text-xs text-gray-600 mt-1">{cve.severity.toUpperCase()}</div>
            </div>

            {/* EPSS Score */}
            {threatIntel && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="text-xs text-gray-600 font-medium mb-2">EPSS</div>
                <div className="text-3xl font-bold text-orange-600">{threatIntel.epssScore}%</div>
                <div className="text-xs text-gray-600 mt-1">Exploitation Probability</div>
              </div>
            )}

            {/* Posted Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
              <div>
                <div className="text-xs text-gray-600 font-medium">Posted On Source</div>
                <div className="text-sm font-semibold text-gray-900">{cve.published}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 font-medium">Posted On CloudSEK</div>
                <div className="text-sm font-semibold text-gray-900">{cve.published}</div>
              </div>
            </div>

            {/* Source URL */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-xs text-gray-600 font-medium mb-2">Source URL</div>
              <a href="#" className="text-xs text-blue-600 hover:underline break-all">
                app.cloudsek.com
              </a>
            </div>
          </div>

          {/* Middle Column - Exploitation & Indicators */}
          <div className="space-y-4">
            {threatIntel && (
              <>
                {/* Exploitation Status */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-gray-700 mb-1">Exploitation Status</div>
                      <Badge className={`${
                        threatIntel.exploitationStatus === 'In the Wild' 
                          ? 'bg-red-100 text-red-800' 
                          : threatIntel.exploitationStatus === 'Yes' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {threatIntel.exploitationStatus}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-700 mb-1">Public Exploit</div>
                      <Badge className="bg-green-100 text-green-800">Yes</Badge>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-700 mb-1">First Exploited</div>
                      <div className="text-sm text-gray-900 font-semibold">January 15, 2026</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-700 mb-1">EPSS Score</div>
                      <div className="text-sm text-gray-900 font-semibold">{threatIntel.epssScore}%</div>
                    </div>
                  </div>
                </div>

                {/* Indicators of Compromise */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-semibold text-gray-900">Indicators Of Compromise</div>
                    <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">View all</button>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{threatIntel.indicatorsOfCompromise}</div>
                  
                  <div className="mt-4 space-y-2">
                    {threatIntel.iocs.slice(0, 3).map((ioc, idx) => (
                      <div key={idx} className="bg-gray-50 p-2 rounded text-xs">
                        <div className="font-semibold text-gray-700">{ioc.type}</div>
                        <div className="text-gray-600 break-all">{ioc.value}</div>
                        <div className="text-gray-500">{ioc.source}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Source Mentions */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="text-xs font-semibold text-gray-700 mb-2">Source Mentions</div>
                  <div className="text-lg font-bold text-gray-900">{threatIntel.sourcesMentioned}</div>
                </div>
              </>
            )}
          </div>

          {/* Right Columns - Charts */}
          <div className="lg:col-span-2 space-y-4">
            {threatIntel && (
              <>
                {/* CVE Tracking Sources */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">CVE Tracking Across Sources</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {threatIntel.trackingSources.map((source) => (
                      <div key={source.platform} className="text-center p-2 bg-gray-50 rounded">
                        <div className="text-lg font-bold text-gray-900">{source.count}</div>
                        <div className="text-xs text-gray-600 capitalize">{source.platform}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-gray-600">
                    Total mentions across all platforms tracked
                  </div>
                </div>

                {/* Geographic Impact */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Geographic Impact</h3>
                  <div className="flex items-center gap-4">
                    {/* Donut Chart */}
                    <svg width="120" height="120" viewBox="0 0 120 120" className="flex-shrink-0">
                      {threatIntel.geographicImpact.map((item, idx) => {
                        const total = threatIntel.geographicImpact.reduce((sum, i) => sum + i.count, 0);
                        const percentage = (item.count / total) * 100;
                        const startAngle = threatIntel.geographicImpact.slice(0, idx).reduce((sum, i) => sum + (i.count / total) * 360, 0);
                        const endAngle = startAngle + (percentage * 3.6);
                        
                        const startRad = (startAngle - 90) * (Math.PI / 180);
                        const endRad = (endAngle - 90) * (Math.PI / 180);
                        const x1 = 60 + 40 * Math.cos(startRad);
                        const y1 = 60 + 40 * Math.sin(startRad);
                        const x2 = 60 + 40 * Math.cos(endRad);
                        const y2 = 60 + 40 * Math.sin(endRad);
                        const largeArc = percentage > 50 ? 1 : 0;

                        return (
                          <path
                            key={`path-${idx}`}
                            d={`M 60 60 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                            fill={item.color}
                          />
                        );
                      })}
                    </svg>
                    {/* Legend */}
                    <div className="space-y-1">
                      {threatIntel.geographicImpact.map((item) => (
                        <div key={item.region} className="flex items-center gap-2 text-xs">
                          <div 
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-gray-700">{item.region}</span>
                          <span className="text-gray-600 ml-auto">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Vulnerability Timeline */}
        {threatIntel && threatIntel.timelineEvents.length > 0 && (
          <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Vulnerability Timeline ({threatIntel.timelineEvents.length})</h3>
            <div className="space-y-4">
              {threatIntel.timelineEvents.map((event, idx) => (
                <div key={idx} className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-600 mt-2" />
                    {idx < threatIntel.timelineEvents.length - 1 && (
                      <div className="w-0.5 h-12 bg-gray-200 mt-2" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">{event.date}</div>
                    <div className="font-medium text-gray-900">{event.title}</div>
                    <div className="text-sm text-gray-600 mt-1">{event.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
