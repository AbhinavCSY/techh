import { useState } from "react";
import { ChevronLeft, ChevronRight, Home, X, Expand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Slide {
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  notes?: string;
}

// Complete Flow Diagram Component
function CompleteFlowDiagram() {
  return (
    <svg viewBox="0 0 1000 500" className="w-full h-96">
      {/* Background */}
      <rect width="1000" height="500" fill="#f8f9fa" />

      {/* Title */}
      <text x="500" y="30" fontSize="24" fontWeight="bold" fill="#1a202c" textAnchor="middle">
        Complete Tech Stack Management Workflow
      </text>

      {/* Stage 1: Discovery */}
      <g>
        <rect x="30" y="80" width="140" height="140" rx="10" fill="#e3f2fd" stroke="#1976d2" strokeWidth="2" />
        <circle cx="100" cy="120" r="25" fill="#1976d2" />
        <text x="100" y="128" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle">🔍</text>
        <text x="100" y="155" fontSize="13" fontWeight="bold" fill="#1976d2" textAnchor="middle">Discovery</text>
        <text x="100" y="170" fontSize="10" fill="#0d47a1" textAnchor="middle">Scan Assets</text>
        <text x="100" y="182" fontSize="10" fill="#0d47a1" textAnchor="middle">&amp; Dependencies</text>
        <text x="100" y="200" fontSize="9" fill="#1976d2" textAnchor="middle" fontStyle="italic">All Tech Stacks</text>
      </g>

      {/* Arrow 1 */}
      <path d="M 170 150 L 210 150" stroke="#333" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />

      {/* Stage 2: Analysis */}
      <g>
        <rect x="210" y="80" width="140" height="140" rx="10" fill="#fff3e0" stroke="#e65100" strokeWidth="2" />
        <circle cx="280" cy="120" r="25" fill="#e65100" />
        <text x="280" y="128" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle">📊</text>
        <text x="280" y="155" fontSize="13" fontWeight="bold" fill="#e65100" textAnchor="middle">Analysis</text>
        <text x="280" y="170" fontSize="10" fill="#bf360c" textAnchor="middle">Check CVEs,</text>
        <text x="280" y="182" fontSize="10" fill="#bf360c" textAnchor="middle">Map Dependencies</text>
        <text x="280" y="200" fontSize="9" fill="#e65100" textAnchor="middle" fontStyle="italic">Correlate Issues</text>
      </g>

      {/* Arrow 2 */}
      <path d="M 350 150 L 390 150" stroke="#333" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />

      {/* Stage 3: Scoring */}
      <g>
        <rect x="390" y="80" width="140" height="140" rx="10" fill="#f3e5f5" stroke="#6a1b9a" strokeWidth="2" />
        <circle cx="460" cy="120" r="25" fill="#6a1b9a" />
        <text x="460" y="128" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle">⚡</text>
        <text x="460" y="155" fontSize="13" fontWeight="bold" fill="#6a1b9a" textAnchor="middle">Risk Scoring</text>
        <text x="460" y="170" fontSize="10" fill="#4a148c" textAnchor="middle">Enterprise &amp;</text>
        <text x="460" y="182" fontSize="10" fill="#4a148c" textAnchor="middle">Domain Level</text>
        <text x="460" y="200" fontSize="9" fill="#6a1b9a" textAnchor="middle" fontStyle="italic">Prioritization</text>
      </g>

      {/* Arrow 3 */}
      <path d="M 530 150 L 570 150" stroke="#333" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />

      {/* Stage 4: Monitoring */}
      <g>
        <rect x="570" y="80" width="140" height="140" rx="10" fill="#e0f2f1" stroke="#00695c" strokeWidth="2" />
        <circle cx="640" cy="120" r="25" fill="#00695c" />
        <text x="640" y="128" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle">🔄</text>
        <text x="640" y="155" fontSize="13" fontWeight="bold" fill="#00695c" textAnchor="middle">Monitoring</text>
        <text x="640" y="170" fontSize="10" fill="#004d40" textAnchor="middle">Continuous</text>
        <text x="640" y="182" fontSize="10" fill="#004d40" textAnchor="middle">Scanning &amp; Alerts</text>
        <text x="640" y="200" fontSize="9" fill="#00695c" textAnchor="middle" fontStyle="italic">Track Changes</text>
      </g>

      {/* Arrow 4 */}
      <path d="M 710 150 L 750 150" stroke="#333" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />

      {/* Stage 5: Compliance */}
      <g>
        <rect x="750" y="80" width="140" height="140" rx="10" fill="#f3e5f5" stroke="#7b1fa2" strokeWidth="2" />
        <circle cx="820" cy="120" r="25" fill="#7b1fa2" />
        <text x="820" y="128" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle">📋</text>
        <text x="820" y="155" fontSize="13" fontWeight="bold" fill="#7b1fa2" textAnchor="middle">Compliance</text>
        <text x="820" y="170" fontSize="10" fill="#4a148c" textAnchor="middle">Reports &amp;</text>
        <text x="820" y="182" fontSize="10" fill="#4a148c" textAnchor="middle">Dashboards</text>
        <text x="820" y="200" fontSize="9" fill="#7b1fa2" textAnchor="middle" fontStyle="italic">SOC 2, ISO, etc.</text>
      </g>

      {/* Feedback loop arrow */}
      <path d="M 820 240 Q 820 320 100 320 Q 100 260 100 220" stroke="#d32f2f" strokeWidth="2" fill="none" strokeDasharray="5,5" markerEnd="url(#arrowhead-red)" />
      <text x="450" y="340" fontSize="11" fill="#d32f2f" fontWeight="bold" textAnchor="middle">Continuous Feedback Loop - Rescan after Updates</text>

      {/* Output layers */}
      <g>
        {/* CISO View */}
        <rect x="30" y="380" width="180" height="80" rx="8" fill="#fce4ec" stroke="#c2185b" strokeWidth="2" />
        <text x="120" y="405" fontSize="12" fontWeight="bold" fill="#c2185b" textAnchor="middle">CISO Dashboard</text>
        <text x="120" y="423" fontSize="10" fill="#880e4f" textAnchor="middle">• Executive Summary</text>
        <text x="120" y="438" fontSize="10" fill="#880e4f" textAnchor="middle">• Risk Metrics</text>
        <text x="120" y="453" fontSize="10" fill="#880e4f" textAnchor="middle">• Compliance Status</text>
      </g>

      {/* DevSecOps View */}
      <g>
        <rect x="230" y="380" width="180" height="80" rx="8" fill="#e8f5e9" stroke="#388e3c" strokeWidth="2" />
        <text x="320" y="405" fontSize="12" fontWeight="bold" fill="#388e3c" textAnchor="middle">DevSecOps Tools</text>
        <text x="320" y="423" fontSize="10" fill="#1b5e20" textAnchor="middle">• Prioritized Tasks</text>
        <text x="320" y="438" fontSize="10" fill="#1b5e20" textAnchor="middle">• API Integration</text>
        <text x="320" y="453" fontSize="10" fill="#1b5e20" textAnchor="middle">• Alerts &amp; Automations</text>
      </g>

      {/* Enterprise View */}
      <g>
        <rect x="430" y="380" width="180" height="80" rx="8" fill="#ede7f6" stroke="#512da8" strokeWidth="2" />
        <text x="520" y="405" fontSize="12" fontWeight="bold" fill="#512da8" textAnchor="middle">Enterprise View</text>
        <text x="520" y="423" fontSize="10" fill="#311b92" textAnchor="middle">• Multi-Domain</text>
        <text x="520" y="438" fontSize="10" fill="#311b92" textAnchor="middle">• Asset Inventory</text>
        <text x="520" y="453" fontSize="10" fill="#311b92" textAnchor="middle">• Correlation Analytics</text>
      </g>

      {/* Compliance Reports */}
      <g>
        <rect x="630" y="380" width="180" height="80" rx="8" fill="#fff3e0" stroke="#e65100" strokeWidth="2" />
        <text x="720" y="405" fontSize="12" fontWeight="bold" fill="#e65100" textAnchor="middle">Compliance Docs</text>
        <text x="720" y="423" fontSize="10" fill="#bf360c" textAnchor="middle">• PDF Reports</text>
        <text x="720" y="438" fontSize="10" fill="#bf360c" textAnchor="middle">• Audit Ready</text>
        <text x="720" y="453" fontSize="10" fill="#bf360c" textAnchor="middle">• Board Presentations</text>
      </g>

      {/* Arrow markers */}
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#333" />
        </marker>
        <marker id="arrowhead-red" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#d32f2f" />
        </marker>
      </defs>
    </svg>
  );
}

// SVG Illustration Component
function FeatureIllustration({ type }: { type: string }) {
  switch (type) {
    case "inventory":
      return (
        <svg viewBox="0 0 400 300" className="w-full h-64">
          <rect width="400" height="300" fill="#e3f2fd" />
          <text x="20" y="40" fontSize="20" fontWeight="bold" fill="#1976d2">
            Complete Inventory
          </text>
          <rect
            x="20"
            y="60"
            width="360"
            height="40"
            rx="5"
            fill="#bbdefb"
            stroke="#1976d2"
            strokeWidth="2"
          />
          <text x="30" y="90" fontSize="12" fill="#1976d2">
            React 18.2.0
          </text>
          <rect
            x="20"
            y="110"
            width="360"
            height="40"
            rx="5"
            fill="#bbdefb"
            stroke="#1976d2"
            strokeWidth="2"
          />
          <text x="30" y="140" fontSize="12" fill="#1976d2">
            Node.js 18.14.0
          </text>
          <rect
            x="20"
            y="160"
            width="360"
            height="40"
            rx="5"
            fill="#bbdefb"
            stroke="#1976d2"
            strokeWidth="2"
          />
          <text x="30" y="190" fontSize="12" fill="#1976d2">
            TypeScript 5.0.0
          </text>
          <rect
            x="20"
            y="210"
            width="360"
            height="40"
            rx="5"
            fill="#bbdefb"
            stroke="#1976d2"
            strokeWidth="2"
          />
          <text x="30" y="240" fontSize="12" fill="#1976d2">
            PostgreSQL 14.0 + 45 more...
          </text>
        </svg>
      );
    case "vulnerability":
      return (
        <svg viewBox="0 0 400 300" className="w-full h-64">
          <rect width="400" height="300" fill="#ffebee" />
          <text x="20" y="40" fontSize="20" fontWeight="bold" fill="#d32f2f">
            Vulnerability Detection
          </text>
          <circle cx="100" cy="130" r="40" fill="#ef5350" />
          <text x="85" y="140" fontSize="16" fontWeight="bold" fill="white">
            CVE
          </text>
          <text x="30" y="190" fontSize="12" fill="#d32f2f">
            Critical: 3
          </text>
          <text x="30" y="210" fontSize="12" fill="#d32f2f">
            High: 12
          </text>
          <text x="30" y="230" fontSize="12" fill="#d32f2f">
            Medium: 28
          </text>
          <circle cx="300" cy="130" r="40" fill="#ffeb3b" />
          <text x="280" y="145" fontSize="14" fontWeight="bold" fill="#000">
            EOL
          </text>
          <text x="250" y="190" fontSize="12" fill="#d32f2f">
            ⚠️ Found 8 EOL components
          </text>
        </svg>
      );
    case "riskScoring":
      return (
        <svg viewBox="0 0 400 300" className="w-full h-64">
          <rect width="400" height="300" fill="#f3e5f5" />
          <text x="20" y="40" fontSize="20" fontWeight="bold" fill="#7b1fa2">
            Risk Scoring
          </text>
          <rect
            x="30"
            y="70"
            width="80"
            height="180"
            fill="#81c784"
            stroke="#388e3c"
            strokeWidth="2"
          />
          <text x="45" y="160" fontSize="12" fontWeight="bold" fill="white">
            Low
          </text>
          <rect
            x="130"
            y="100"
            width="80"
            height="150"
            fill="#fbc02d"
            stroke="#f57f17"
            strokeWidth="2"
          />
          <text x="145" y="160" fontSize="12" fontWeight="bold" fill="white">
            Med
          </text>
          <rect
            x="230"
            y="80"
            width="80"
            height="170"
            fill="#ff9800"
            stroke="#e65100"
            strokeWidth="2"
          />
          <text x="245" y="160" fontSize="12" fontWeight="bold" fill="white">
            High
          </text>
          <rect
            x="330"
            y="60"
            width="40"
            height="190"
            fill="#d32f2f"
            stroke="#b71c1c"
            strokeWidth="2"
          />
          <text x="335" y="160" fontSize="10" fontWeight="bold" fill="white">
            Crit
          </text>
          <text x="20" y="280" fontSize="11" fill="#7b1fa2">
            Enterprise & Domain-Level Scoring
          </text>
        </svg>
      );
    case "dependency":
      return (
        <svg viewBox="0 0 400 300" className="w-full h-64">
          <rect width="400" height="300" fill="#f3e5f5" />
          <text x="20" y="40" fontSize="20" fontWeight="bold" fill="#6a1b9a">
            Dependency Mapping
          </text>
          <circle cx="200" cy="100" r="25" fill="#9c27b0" />
          <text x="185" y="110" fontSize="12" fill="white">
            Core
          </text>
          <circle cx="100" cy="180" r="20" fill="#ba68c8" />
          <text x="85" y="185" fontSize="10" fill="white">
            Lib A
          </text>
          <circle cx="300" cy="180" r="20" fill="#ba68c8" />
          <text x="285" y="185" fontSize="10" fill="white">
            Lib B
          </text>
          <circle cx="80" cy="260" r="15" fill="#ce93d8" />
          <text x="70" y="265" fontSize="9" fill="white">
            Sub 1
          </text>
          <circle cx="320" cy="260" r="15" fill="#ce93d8" />
          <text x="310" y="265" fontSize="9" fill="white">
            Sub 2
          </text>
          <line
            x1="200"
            y1="125"
            x2="100"
            y2="160"
            stroke="#6a1b9a"
            strokeWidth="2"
          />
          <line
            x1="200"
            y1="125"
            x2="300"
            y2="160"
            stroke="#6a1b9a"
            strokeWidth="2"
          />
          <line
            x1="100"
            y1="200"
            x2="80"
            y2="245"
            stroke="#9c27b0"
            strokeWidth="1.5"
          />
          <line
            x1="300"
            y1="200"
            x2="320"
            y2="245"
            stroke="#9c27b0"
            strokeWidth="1.5"
          />
        </svg>
      );
    case "compliance":
      return (
        <svg viewBox="0 0 400 300" className="w-full h-64">
          <rect width="400" height="300" fill="#fff3e0" />
          <text x="20" y="40" fontSize="20" fontWeight="bold" fill="#e65100">
            Compliance Tracking
          </text>
          <rect
            x="20"
            y="60"
            width="340"
            height="50"
            rx="5"
            fill="#ffe0b2"
            stroke="#ff6f00"
            strokeWidth="2"
          />
          <text x="30" y="85" fontSize="12" fontWeight="bold" fill="#e65100">
            📋 SOC 2 Type II
          </text>
          <text x="30" y="100" fontSize="10" fill="#e65100">
            Status: Ready for Audit ✓
          </text>
          <rect
            x="20"
            y="120"
            width="340"
            height="50"
            rx="5"
            fill="#ffe0b2"
            stroke="#ff6f00"
            strokeWidth="2"
          />
          <text x="30" y="145" fontSize="12" fontWeight="bold" fill="#e65100">
            🔒 ISO 27001
          </text>
          <text x="30" y="160" fontSize="10" fill="#e65100">
            Status: In Progress
          </text>
          <rect
            x="20"
            y="180"
            width="340"
            height="50"
            rx="5"
            fill="#ffe0b2"
            stroke="#ff6f00"
            strokeWidth="2"
          />
          <text x="30" y="205" fontSize="12" fontWeight="bold" fill="#e65100">
            📊 HIPAA & PCI-DSS
          </text>
          <text x="30" y="220" fontSize="10" fill="#e65100">
            Status: Compliant ✓
          </text>
        </svg>
      );
    case "monitoring":
      return (
        <svg viewBox="0 0 400 300" className="w-full h-64">
          <rect width="400" height="300" fill="#e0f2f1" />
          <text x="20" y="40" fontSize="20" fontWeight="bold" fill="#00695c">
            Continuous Monitoring
          </text>
          <polyline
            points="30,220 80,180 130,200 180,140 230,160 280,100 330,120"
            fill="none"
            stroke="#00897b"
            strokeWidth="3"
          />
          <circle cx="30" cy="220" r="4" fill="#00897b" />
          <circle cx="80" cy="180" r="4" fill="#00897b" />
          <circle cx="130" cy="200" r="4" fill="#00897b" />
          <circle cx="180" cy="140" r="4" fill="#00897b" />
          <circle cx="230" cy="160" r="4" fill="#00897b" />
          <circle cx="280" cy="100" r="4" fill="#00897b" />
          <circle cx="330" cy="120" r="4" fill="#00897b" />
          <rect
            x="20"
            y="250"
            width="360"
            height="35"
            rx="5"
            fill="#b2dfdb"
            stroke="#00695c"
            strokeWidth="2"
          />
          <text x="30" y="272" fontSize="11" fill="#00695c">
            🔄 Scanning every 7 days | Last scan: 2 hours ago
          </text>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 400 300" className="w-full h-64">
          <rect width="400" height="300" fill="#f5f5f5" />
          <text x="100" y="150" fontSize="16" fill="#666">
            Feature Illustration
          </text>
        </svg>
      );
  }
}

// Feature details
const featureDetails = {
  inventory: {
    title: "Tech Stack Per Asset",
    description:
      "Complete visibility of all frameworks, libraries, and services running on each IP, subdomain, and web application",
    details:
      "Get a unified view of every technology running on a specific asset. See the complete software stack including frameworks (React, Django, Spring), servers (Apache, Nginx), databases, and third-party services with version information.",
    type: "inventory",
  },
  vulnerability: {
    title: "EOL & CVE Correlation",
    description:
      "Automatically identify outdated technologies and correlate them with known vulnerabilities",
    details:
      "Instantly flag end-of-life (EOL) versions and out-of-date technologies. Correlate detected tech stacks with CVE databases to see which vulnerabilities directly impact your assets. Get severity ratings and affected versions.",
    type: "vulnerability",
  },
  riskScoring: {
    title: "Risk Prioritization",
    description:
      "Understand which tech stack issues to address first based on impact and criticality",
    details:
      "Get actionable risk scores that help you prioritize remediation. Know which EOL versions, vulnerable frameworks, and outdated libraries pose the highest risk to your specific assets so you can focus resources effectively.",
    type: "riskScoring",
  },
  dependency: {
    title: "Technology Relationships",
    description:
      "Visualize how technologies on an asset are interconnected and understand dependencies",
    details:
      "See how frameworks, libraries, and services are related on each asset. Understand cascading impacts when you update or remove a component. Get context on which technologies depend on others.",
    type: "dependency",
  },
  compliance: {
    title: "Audit & Compliance Ready",
    description:
      "Export tech stack findings for compliance audits and security certifications",
    details:
      "Generate detailed compliance reports showing the complete tech stack, identified risks, and remediation status. Export findings for SOC 2, ISO 27001, and other audit requirements with executive summaries.",
    type: "compliance",
  },
  monitoring: {
    title: "Change Tracking",
    description:
      "Track what's changed in your tech stack over time and get alerted to new findings",
    details:
      "Monitor tech stack changes across assets over time. Get alerted when new technologies are detected, versions are upgraded, or components are removed. See the evolution of your infrastructure with historical data.",
    type: "monitoring",
  },
};

const slides: Slide[] = [
  {
    title: "Tech Stack Discovery Workflow",
    subtitle: "Per-Asset: From Detection to Remediation Action",
    content: (
      <div className="space-y-6">
        {/* Flow Diagram */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <CompleteFlowDiagram />
        </div>

        {/* Explanation */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 border-2 border-blue-300 p-4 rounded-lg">
            <h5 className="font-bold text-blue-900 mb-2">🔄 What Happens</h5>
            <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
              <li><span className="font-semibold">Discovery:</span> Scan each asset for all tech</li>
              <li><span className="font-semibold">Analysis:</span> Find CVEs &amp; EOL versions</li>
              <li><span className="font-semibold">Scoring:</span> Prioritize by risk level</li>
              <li><span className="font-semibold">Monitoring:</span> Track stack changes</li>
              <li><span className="font-semibold">Compliance:</span> Audit-ready findings</li>
            </ol>
          </div>

          <div className="bg-green-50 border-2 border-green-300 p-4 rounded-lg">
            <h5 className="font-bold text-green-900 mb-2">🎯 Actionable Output</h5>
            <ul className="text-sm text-gray-700 space-y-2">
              <li><span className="font-semibold">📋 Tech Inventory:</span> Full stack view per asset</li>
              <li><span className="font-semibold">⚠️ Risk Alerts:</span> EOL &amp; vulnerable tech flagged</li>
              <li><span className="font-semibold">🔗 Dependencies:</span> See what's connected</li>
              <li><span className="font-semibold">✅ Remediation:</span> Know what to fix first</li>
            </ul>
          </div>
        </div>

        {/* Key Insight */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 p-4 rounded-lg">
          <h5 className="font-bold text-indigo-900 mb-2">💡 Inside BeVigil</h5>
          <p className="text-sm text-gray-700">
            Tech Stack answers the core EASM question for every asset you discover: <span className="font-semibold">"What's running here, is it safe, and what do I do?"</span> All inside your BeVigil dashboard with one click per asset.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "BeVigil Tech Stack Discovery",
    subtitle: "Unified View of Technologies, Frameworks & Services Per Asset",
    content: (
      <div className="space-y-4">
        {/* Core Question */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg border-2 border-blue-800">
          <h4 className="text-lg font-bold mb-3">👉 The Key Question</h4>
          <p className="text-center text-lg font-semibold italic mb-2">
            "What exactly is running here, is it safe, and what should I do about it?"
          </p>
          <p className="text-sm">
            BeVigil's Tech Stack page answers this by providing a unified, enriched view of all technologies, frameworks, and services running on each asset—giving you complete visibility into your attack surface.
          </p>
        </div>

        {/* The Problem */}
        <div className="bg-red-50 border-2 border-red-300 p-4 rounded-lg">
          <h5 className="font-bold text-red-900 mb-3">⚠️ The Problem</h5>
          <p className="text-sm text-gray-700 mb-3">
            Traditional EASM solutions show you assets, but lack a dedicated, unified view of the complete tech stack running on each one. Without this, customers struggle to:
          </p>
          <ul className="text-sm text-gray-700 space-y-1 ml-4">
            <li>🔸 Understand what software, frameworks, and libraries are running</li>
            <li>🔸 Identify outdated or end-of-life (EOL) technologies that pose risk</li>
            <li>🔸 Correlate detected technologies with CVEs and misconfigurations</li>
            <li>🔸 Track changes in the stack over time (upgrades, removals, new components)</li>
            <li>🔸 Prioritize and act on risks with remediation context</li>
          </ul>
        </div>

        {/* The Solution */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 border-2 border-green-300 p-4 rounded-lg">
            <h5 className="font-bold text-green-900 mb-2">✅ What You Get</h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✓ Complete tech stack per asset (IP, subdomain, webapp)</li>
              <li>✓ Automated detection of all frameworks & libraries</li>
              <li>✓ EOL & vulnerable technology identification</li>
              <li>✓ CVE correlation with detected tech</li>
              <li>✓ Historical tracking & change detection</li>
              <li>✓ Risk-prioritized remediation actions</li>
            </ul>
          </div>

          <div className="bg-purple-50 border-2 border-purple-300 p-4 rounded-lg">
            <h5 className="font-bold text-purple-900 mb-2">🎯 Key Insights</h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>📊 See exactly what's running on each asset</li>
              <li>⚡ Know the risk level instantly</li>
              <li>🔗 Understand tech dependencies</li>
              <li>📈 Track improvements over time</li>
              <li>🛡️ Reduce breach risk by understanding your stack</li>
              <li>✔️ Meet compliance & audit requirements</li>
            </ul>
          </div>
        </div>

        {/* Core Value */}
        <div className="bg-indigo-50 border-2 border-indigo-400 p-4 rounded-lg">
          <h5 className="font-bold text-indigo-900 mb-2">💎 The Value</h5>
          <p className="text-sm text-gray-700">
            Move beyond asset discovery. Get complete visibility into every technology running on each asset, automatically correlate with threats, and take action with confidence. Inside BeVigil's EASM platform, Tech Stack becomes your most powerful tool for understanding and securing your attack surface.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "Tech Stack Features in BeVigil",
    subtitle: "Answer Every Question About Your Assets - Click to Expand",
    content: <FeatureCardsSlide />,
  },
];

// Feature Modal Component
function FeatureModal({
  feature,
  onClose,
}: {
  feature: (typeof featureDetails)[keyof typeof featureDetails] | null;
  onClose: () => void;
}) {
  if (!feature) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-90vh overflow-y-auto">
        {/* Close Button */}
        <div className="sticky top-0 flex justify-between items-center p-6 border-b bg-white">
          <h2 className="text-2xl font-bold text-gray-900">{feature.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Illustration */}
          <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
            <FeatureIllustration type={feature.type} />
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Overview</h3>
            <p className="text-gray-700">{feature.description}</p>
          </div>

          {/* Detailed Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">How It Works</h3>
            <p className="text-gray-700">{feature.details}</p>
          </div>

          {/* Key Benefits */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Key Benefits</h3>
            <ul className="text-sm text-gray-700 space-y-1 ml-4">
              <li>✓ Automated detection and discovery</li>
              <li>✓ Real-time alerts and notifications</li>
              <li>✓ Actionable insights and recommendations</li>
              <li>✓ Integration with existing workflows</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Feature Cards Slide Component
function FeatureCardsSlide() {
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  const features = [
    { id: "inventory", emoji: "📚", key: "inventory" as const },
    { id: "vulnerability", emoji: "🔍", key: "vulnerability" as const },
    { id: "riskScoring", emoji: "📊", key: "riskScoring" as const },
    { id: "dependency", emoji: "🔗", key: "dependency" as const },
    { id: "compliance", emoji: "📈", key: "compliance" as const },
    { id: "monitoring", emoji: "⚡", key: "monitoring" as const },
  ];

  const cardColors = {
    inventory: {
      bg: "from-blue-50 to-blue-100",
      border: "border-blue-300",
      title: "text-blue-900",
    },
    vulnerability: {
      bg: "from-red-50 to-red-100",
      border: "border-red-300",
      title: "text-red-900",
    },
    riskScoring: {
      bg: "from-green-50 to-green-100",
      border: "border-green-300",
      title: "text-green-900",
    },
    dependency: {
      bg: "from-purple-50 to-purple-100",
      border: "border-purple-300",
      title: "text-purple-900",
    },
    compliance: {
      bg: "from-yellow-50 to-yellow-100",
      border: "border-yellow-300",
      title: "text-yellow-900",
    },
    monitoring: {
      bg: "from-cyan-50 to-cyan-100",
      border: "border-cyan-300",
      title: "text-cyan-900",
    },
  };

  const selectedFeature = expandedFeature
    ? featureDetails[expandedFeature as keyof typeof featureDetails]
    : null;

  return (
    <div className="space-y-4">
      {/* Core Features */}
      <div className="grid grid-cols-2 gap-4">
        {features.map((feature) => {
          const colors = cardColors[feature.key];
          const featureData = featureDetails[feature.key];
          return (
            <div
              key={feature.id}
              className={`bg-gradient-to-br ${colors.bg} p-5 rounded-lg border-2 ${colors.border} relative group hover:shadow-lg transition`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className={`font-bold ${colors.title} mb-2`}>
                    {feature.emoji} {featureData.title}
                  </h4>
                  <p className="text-sm text-gray-700">
                    {featureData.description}
                  </p>
                </div>
                <button
                  onClick={() => setExpandedFeature(feature.key)}
                  className="ml-3 p-2 rounded-lg bg-white/50 group-hover:bg-white shadow-sm hover:shadow-md transition flex-shrink-0"
                  title="Click to expand"
                >
                  <Expand className="w-4 h-4 text-gray-700 hover:text-blue-600" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Why It Matters */}
      <div className="bg-gradient-to-r from-orange-50 to-rose-50 p-5 rounded-lg border-2 border-orange-300">
        <h5 className="font-bold text-orange-900 mb-2">💡 Why This Matters for EASM</h5>
        <p className="text-sm text-gray-700 mb-2">
          <span className="font-semibold">Tech Stack ≠ Just Another Asset List:</span> It transforms asset discovery into actionable intelligence by showing exactly what's running, what's vulnerable, and what to do about it.
        </p>
        <p className="text-sm text-gray-700 mb-2">
          <span className="font-semibold">For Security Teams:</span> Move beyond "we found an asset" to "here's every tech on it, here's the risk, here's what to fix."
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-semibold">For Customers:</span> Answer the #1 question teams ask: "What exactly is running on this asset and is it safe?"
        </p>
      </div>

      {/* Feature Modal */}
      <FeatureModal
        feature={selectedFeature}
        onClose={() => setExpandedFeature(null)}
      />
    </div>
  );
}

export default function TechStackSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const slide = slides[currentSlide];
  const progress = ((currentSlide + 1) / slides.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Tech Stack Management Overview
          </h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Slide Container */}
          <div className="min-h-96 p-12 bg-gradient-to-br from-slate-50 to-white">
            {/* Slide Title */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="text-xl text-gray-600">{slide.subtitle}</p>
              )}
            </div>

            {/* Slide Content */}
            <div className="mb-8">{slide.content}</div>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-gray-200">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Navigation */}
          <div className="bg-gray-50 px-12 py-6 flex items-center justify-between">
            <Button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">
                Slide {currentSlide + 1} of {slides.length}
              </span>
            </div>

            <Button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Slide Thumbnails */}
          <div className="bg-white border-t border-gray-200 px-12 py-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Navigate to Slide
            </p>
            <div className="flex gap-2 flex-wrap">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-12 h-12 rounded-lg font-semibold text-sm transition-all ${
                    currentSlide === index
                      ? "bg-blue-600 text-white shadow-lg scale-110"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Slide 1:</span> Understand what
              the solution does and its business impact
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Slide 2:</span> See all the key
              features and capabilities
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">💡 Tip:</span> Use navigation
              buttons or click slide numbers
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
