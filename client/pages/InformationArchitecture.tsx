export default function InformationArchitecture() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Application Sitemap
          </h1>
          <p className="text-lg text-gray-600">
            Navigation structure and page relationships
          </p>
        </div>

        {/* Main Sitemap */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-12 mb-8">
          <svg
            viewBox="0 0 1200 800"
            className="w-full h-auto"
            style={{ maxHeight: "800px" }}
          >
            {/* Define styles */}
            <defs>
              <style>{`
                .node-box { fill: white; stroke: #3b82f6; stroke-width: 2; rx: 8; }
                .node-protected { fill: white; stroke: #10b981; stroke-width: 2; rx: 8; }
                .node-public { fill: white; stroke: #f59e0b; stroke-width: 2; rx: 8; }
                .node-error { fill: white; stroke: #ef4444; stroke-width: 2; rx: 8; }
                .node-text { font-size: 14px; font-weight: 600; text-anchor: middle; fill: #111827; }
                .node-subtext { font-size: 11px; text-anchor: middle; fill: #6b7280; }
                .connector { stroke: #d1d5db; stroke-width: 2; fill: none; marker-end: url(#arrowhead); }
                .connector-protected { stroke: #10b981; stroke-width: 2; fill: none; marker-end: url(#arrowhead-green); }
                .connector-public { stroke: #f59e0b; stroke-width: 2; fill: none; marker-end: url(#arrowhead-amber); }
                .label-text { font-size: 12px; fill: #6b7280; font-weight: 500; }
              `}</style>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#d1d5db" />
              </marker>
              <marker
                id="arrowhead-green"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#10b981" />
              </marker>
              <marker
                id="arrowhead-amber"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#f59e0b" />
              </marker>
            </defs>

            {/* Layer 1: Root Entry Points */}
            {/* Public Route */}
            <rect x="480" y="20" width="240" height="60" className="node-public" />
            <text x="600" y="48" className="node-text">
              /tech-stack-slideshow
            </text>
            <text x="600" y="68" className="node-subtext">Fullscreen Presentation</text>

            {/* Protected Routes */}
            <rect x="50" y="120" width="200" height="60" className="node-protected" />
            <text x="150" y="148" className="node-text">
              Password Protected
            </text>
            <text x="150" y="168" className="node-subtext">Authentication Gate</text>

            {/* Connectors from entry to protected */}
            <line
              x1="600"
              y1="80"
              x2="600"
              y2="100"
              className="connector"
              strokeDasharray="5,5"
            />
            <text x="620" y="95" className="label-text">no auth required</text>

            {/* Layer 2: Protected Routes Container */}
            <rect
              x="280"
              y="110"
              width="870"
              height="450"
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="5,5"
              rx="8"
            />
            <text x="300" y="130" className="label-text">
              Protected Routes (require password)
            </text>

            {/* Main Dashboard */}
            <rect x="320" y="160" width="160" height="60" className="node-box" />
            <text x="400" y="188" className="node-text">
              Dashboard
            </text>
            <text x="400" y="208" className="node-subtext">/ (Home)</text>

            {/* Secondary Pages Row 1 */}
            <rect x="520" y="160" width="160" height="60" className="node-box" />
            <text x="600" y="188" className="node-text">
              Web Apps
            </text>
            <text x="600" y="208" className="node-subtext">/web-apps</text>

            <rect x="720" y="160" width="160" height="60" className="node-box" />
            <text x="800" y="188" className="node-text">
              Threat Intel
            </text>
            <text x="800" y="208" className="node-subtext">/threat-intel</text>

            <rect x="920" y="160" width="160" height="60" className="node-box" />
            <text x="1000" y="188" className="node-text">
              Rescan History
            </text>
            <text x="1000" y="208" className="node-subtext">/rescan-history</text>

            {/* Detail Pages Row 2 */}
            <rect x="420" y="280" width="170" height="70" className="node-box" />
            <text x="505" y="312" className="node-text">
              Incident Details
            </text>
            <text x="505" y="333" className="node-subtext">
              /incident/:techStackId/:cveId
            </text>

            <rect x="630" y="280" width="170" height="70" className="node-box" />
            <text x="715" y="312" className="node-text">
              CVE Details
            </text>
            <text x="715" y="333" className="node-subtext">
              /cve-details/:cveId
            </text>

            {/* Error Page */}
            <rect x="840" y="280" width="140" height="70" className="node-error" />
            <text x="910" y="312" className="node-text">
              Not Found
            </text>
            <text x="910" y="333" className="node-subtext">/* (404)</text>

            {/* Navigation Connectors */}
            {/* Dashboard to Incident Details */}
            <path
              d="M 400 220 Q 450 250 505 280"
              className="connector"
            />
            <text x="420" y="265" className="label-text">select incident</text>

            {/* Threat Intel to CVE Details */}
            <path
              d="M 800 220 Q 760 250 715 280"
              className="connector"
            />
            <text x="760" y="265" className="label-text">view details</text>

            {/* Web Apps to Incident */}
            <path
              d="M 600 220 L 520 280"
              className="connector"
            />

            {/* Sidebar Navigation */}
            <rect x="50" y="160" width="160" height="280" className="node-box" />
            <text x="130" y="185" className="node-text">Main Navigation</text>
            <line x1="50" y1="200" x2="210" y2="200" stroke="#d1d5db" strokeWidth="1" />
            <text x="60" y="230" className="label-text">• Dashboard</text>
            <text x="60" y="255" className="label-text">• Web Apps</text>
            <text x="60" y="280" className="label-text">• Threat Intel</text>
            <text x="60" y="305" className="label-text">• Rescan History</text>
            <text x="60" y="330" className="label-text">• Settings</text>

            {/* Connectors from nav to pages */}
            <line
              x1="210"
              y1="230"
              x2="320"
              y2="190"
              className="connector-protected"
            />
            <line
              x1="210"
              y1="255"
              x2="520"
              y2="190"
              className="connector-protected"
            />
            <line
              x1="210"
              y1="280"
              x2="720"
              y2="190"
              className="connector-protected"
            />
            <line
              x1="210"
              y1="305"
              x2="920"
              y2="190"
              className="connector-protected"
            />

            {/* Breadcrumb flow indicator */}
            <text x="50" y="500" className="label-text" style={{ fontSize: "13px" }}>
              <tspan x="50" dy="0">Key Navigation Flows:</tspan>
              <tspan x="50" dy="20">
                • Users authenticate → Dashboard (main hub)
              </tspan>
              <tspan x="50" dy="20">
                • From any page → access sidebar navigation
              </tspan>
              <tspan x="50" dy="20">
                • Dashboard cards → drill down to incident/CVE details
              </tspan>
              <tspan x="50" dy="20">
                • Invalid routes → 404 Not Found page
              </tspan>
            </text>
          </svg>
        </div>

        {/* Detailed Route Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Protected Routes */}
          <div className="bg-white rounded-lg border border-green-200 p-6 shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              Protected Routes
            </h3>
            <div className="space-y-3">
              <div>
                <div className="font-mono text-sm text-blue-600">GET /</div>
                <p className="text-sm text-gray-600 mt-1">
                  Asset Inventory Dashboard - main hub for viewing tech stacks and
                  assets
                </p>
              </div>
              <div>
                <div className="font-mono text-sm text-blue-600">GET /web-apps</div>
                <p className="text-sm text-gray-600 mt-1">
                  Web Applications listing and management
                </p>
              </div>
              <div>
                <div className="font-mono text-sm text-blue-600">GET /threat-intel</div>
                <p className="text-sm text-gray-600 mt-1">
                  Threat Intelligence dashboard with CVE analysis
                </p>
              </div>
              <div>
                <div className="font-mono text-sm text-blue-600">
                  GET /incident/:techStackId/:cveId
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Detailed incident information for specific tech stack CVE
                </p>
              </div>
              <div>
                <div className="font-mono text-sm text-blue-600">GET /cve-details/:cveId</div>
                <p className="text-sm text-gray-600 mt-1">
                  Comprehensive CVE details across all affected tech stacks
                </p>
              </div>
              <div>
                <div className="font-mono text-sm text-blue-600">GET /rescan-history</div>
                <p className="text-sm text-gray-600 mt-1">
                  View security scan history and timeline
                </p>
              </div>
            </div>
          </div>

          {/* Public Routes & Special Cases */}
          <div className="bg-white rounded-lg border border-amber-200 p-6 shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-500 rounded"></div>
              Public & Special Routes
            </h3>
            <div className="space-y-3">
              <div>
                <div className="font-mono text-sm text-blue-600">/tech-stack-slideshow</div>
                <p className="text-sm text-gray-600 mt-1">
                  Fullscreen presentation mode (no authentication required, no header
                  nav)
                </p>
              </div>
              <div>
                <div className="font-mono text-sm text-red-600">GET /*</div>
                <p className="text-sm text-gray-600 mt-1">
                  404 Not Found - catch-all for invalid routes
                </p>
              </div>

              <div className="border-t border-gray-200 pt-3 mt-4">
                <h4 className="font-semibold text-gray-900 text-sm mb-2">
                  Authentication Flow
                </h4>
                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Visit any protected route</li>
                  <li>
                    PasswordProtection checks localStorage for auth token
                  </li>
                  <li>If missing/expired → show login prompt</li>
                  <li>Enter password → POST /api/verify-password</li>
                  <li>Token stored (24h expiry) → proceed to page</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* User Journey Flows */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">User Journey Flows</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Journey 1 */}
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="font-bold text-gray-900 mb-4">🔍 Vulnerability Discovery</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0">1.</span>
                  <span>User logs in with password</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0">2.</span>
                  <span>Lands on Dashboard (/)</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0">3.</span>
                  <span>Views "Risk by Tech Stacks" widget</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0">4.</span>
                  <span>Clicks on tech stack to see details</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0">5.</span>
                  <span>Navigates to Incident Details page</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0">6.</span>
                  <span>Reviews remediation steps</span>
                </div>
              </div>
            </div>

            {/* Journey 2 */}
            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="font-bold text-gray-900 mb-4">📊 Threat Intelligence Analysis</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <span className="font-bold text-green-600 flex-shrink-0">1.</span>
                  <span>User clicks "Threat Intel" in sidebar</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-green-600 flex-shrink-0">2.</span>
                  <span>Views threat intelligence dashboard</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-green-600 flex-shrink-0">3.</span>
                  <span>Finds high-risk CVEs in list</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-green-600 flex-shrink-0">4.</span>
                  <span>Clicks CVE to view full details</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-green-600 flex-shrink-0">5.</span>
                  <span>Sees which tech stacks are affected</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-green-600 flex-shrink-0">6.</span>
                  <span>Links back to incident details for each</span>
                </div>
              </div>
            </div>

            {/* Journey 3 */}
            <div className="border-l-4 border-amber-500 pl-6">
              <h3 className="font-bold text-gray-900 mb-4">🔄 Scan Management</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <span className="font-bold text-amber-600 flex-shrink-0">1.</span>
                  <span>User clicks "Rescan History" in sidebar</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-amber-600 flex-shrink-0">2.</span>
                  <span>Views timeline of security scans</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-amber-600 flex-shrink-0">3.</span>
                  <span>Sees scan results and improvements</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-amber-600 flex-shrink-0">4.</span>
                  <span>Initiates new security scan</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-amber-600 flex-shrink-0">5.</span>
                  <span>Monitors scan progress</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-amber-600 flex-shrink-0">6.</span>
                  <span>Views new vulnerabilities discovered</span>
                </div>
              </div>
            </div>

            {/* Journey 4 */}
            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="font-bold text-gray-900 mb-4">📱 Asset Management</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <span className="font-bold text-purple-600 flex-shrink-0">1.</span>
                  <span>User clicks "Web Apps" in sidebar</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-purple-600 flex-shrink-0">2.</span>
                  <span>Views list of web applications</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-purple-600 flex-shrink-0">3.</span>
                  <span>Filters by tech stack or status</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-purple-600 flex-shrink-0">4.</span>
                  <span>Selects an application</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-purple-600 flex-shrink-0">5.</span>
                  <span>Views associated tech stacks</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-purple-600 flex-shrink-0">6.</span>
                  <span>Sees vulnerabilities for each stack</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-lg border border-gray-200 shadow p-6">
          <h3 className="font-bold text-gray-900 mb-4">Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-green-500 rounded border-2 border-green-600"></div>
              <span className="text-sm text-gray-700">Protected Routes (password required)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-amber-500 rounded border-2 border-amber-600"></div>
              <span className="text-sm text-gray-700">Public Routes (no authentication)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-red-500 rounded border-2 border-red-600"></div>
              <span className="text-sm text-gray-700">Error Pages (404, etc.)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
