import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Home, X, Expand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Slide {
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  notes?: string;
}

// Complete Flow Diagram Component with Inputs/Outputs
function CompleteFlowDiagram() {
  return (
    <svg viewBox="0 0 1200 700" className="w-full h-auto max-w-5xl mx-auto">
      {/* Background */}
      <rect width="1200" height="650" fill="#f8f9fa" />

      {/* Title */}
      <text x="600" y="30" fontSize="24" fontWeight="bold" fill="#1a202c" textAnchor="middle">
        Tech Stack Discovery: Per-Asset Workflow with Inputs &amp; Outputs
      </text>

      {/* Stage 1: Discovery */}
      <g>
        {/* Input */}
        <g>
          <rect x="10" y="60" width="110" height="60" rx="5" fill="#e1f5fe" stroke="#01579b" strokeWidth="1.5" />
          <text x="65" y="78" fontSize="9" fontWeight="bold" fill="#01579b" textAnchor="middle">INPUT:</text>
          <text x="65" y="91" fontSize="8" fill="#01579b" textAnchor="middle">IPs, Domains,</text>
          <text x="65" y="103" fontSize="8" fill="#01579b" textAnchor="middle">Web Apps</text>
        </g>
        {/* Main Stage */}
        <rect x="50" y="140" width="140" height="140" rx="10" fill="#e3f2fd" stroke="#1976d2" strokeWidth="2" />
        <circle cx="120" cy="180" r="25" fill="#1976d2" />
        <text x="120" y="188" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle">🔍</text>
        <text x="120" y="215" fontSize="13" fontWeight="bold" fill="#1976d2" textAnchor="middle">Discovery</text>
        <text x="120" y="230" fontSize="9" fill="#0d47a1" textAnchor="middle">Scan Assets</text>
        <text x="120" y="242" fontSize="9" fill="#0d47a1" textAnchor="middle">&amp; Libraries</text>
        {/* Output */}
        <g>
          <rect x="10" y="300" width="110" height="60" rx="5" fill="#c8e6c9" stroke="#1b5e20" strokeWidth="1.5" />
          <text x="65" y="318" fontSize="9" fontWeight="bold" fill="#1b5e20" textAnchor="middle">OUTPUT:</text>
          <text x="65" y="331" fontSize="8" fill="#1b5e20" textAnchor="middle">Detected Tech</text>
          <text x="65" y="343" fontSize="8" fill="#1b5e20" textAnchor="middle">Components</text>
        </g>
      </g>

      {/* Arrow 1 */}
      <path d="M 190 210 L 240 210" stroke="#333" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />

      {/* Stage 2: Analysis */}
      <g>
        {/* Input */}
        <g>
          <rect x="240" y="60" width="110" height="60" rx="5" fill="#ffe0b2" stroke="#e65100" strokeWidth="1.5" />
          <text x="295" y="78" fontSize="9" fontWeight="bold" fill="#e65100" textAnchor="middle">INPUT:</text>
          <text x="295" y="91" fontSize="8" fill="#e65100" textAnchor="middle">Tech List,</text>
          <text x="295" y="103" fontSize="8" fill="#e65100" textAnchor="middle">Versions</text>
        </g>
        {/* Main Stage */}
        <rect x="240" y="140" width="140" height="140" rx="10" fill="#fff3e0" stroke="#e65100" strokeWidth="2" />
        <circle cx="310" cy="180" r="25" fill="#e65100" />
        <text x="310" y="188" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle">📊</text>
        <text x="310" y="215" fontSize="13" fontWeight="bold" fill="#e65100" textAnchor="middle">Analysis</text>
        <text x="310" y="230" fontSize="9" fill="#bf360c" textAnchor="middle">CVEs, EOL,</text>
        <text x="310" y="242" fontSize="9" fill="#bf360c" textAnchor="middle">Dependencies</text>
        {/* Output */}
        <g>
          <rect x="240" y="300" width="110" height="60" rx="5" fill="#f8bbd0" stroke="#880e4f" strokeWidth="1.5" />
          <text x="295" y="318" fontSize="9" fontWeight="bold" fill="#880e4f" textAnchor="middle">OUTPUT:</text>
          <text x="295" y="331" fontSize="8" fill="#880e4f" textAnchor="middle">CVEs, Risk</text>
          <text x="295" y="343" fontSize="8" fill="#880e4f" textAnchor="middle">Flags, Links</text>
        </g>
      </g>

      {/* Arrow 2 */}
      <path d="M 380 210 L 430 210" stroke="#333" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />

      {/* Stage 3: Scoring */}
      <g>
        {/* Input */}
        <g>
          <rect x="430" y="60" width="110" height="60" rx="5" fill="#e1bee7" stroke="#4a148c" strokeWidth="1.5" />
          <text x="485" y="78" fontSize="9" fontWeight="bold" fill="#4a148c" textAnchor="middle">INPUT:</text>
          <text x="485" y="91" fontSize="8" fill="#4a148c" textAnchor="middle">Findings,</text>
          <text x="485" y="103" fontSize="8" fill="#4a148c" textAnchor="middle">Severity</text>
        </g>
        {/* Main Stage */}
        <rect x="430" y="140" width="140" height="140" rx="10" fill="#f3e5f5" stroke="#6a1b9a" strokeWidth="2" />
        <circle cx="500" cy="180" r="25" fill="#6a1b9a" />
        <text x="500" y="188" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle">⚡</text>
        <text x="500" y="215" fontSize="13" fontWeight="bold" fill="#6a1b9a" textAnchor="middle">Scoring</text>
        <text x="500" y="230" fontSize="9" fill="#4a148c" textAnchor="middle">Enterprise &amp;</text>
        <text x="500" y="242" fontSize="9" fill="#4a148c" textAnchor="middle">Asset-Level</text>
        {/* Output */}
        <g>
          <rect x="430" y="300" width="110" height="60" rx="5" fill="#b2dfdb" stroke="#00695c" strokeWidth="1.5" />
          <text x="485" y="318" fontSize="9" fontWeight="bold" fill="#00695c" textAnchor="middle">OUTPUT:</text>
          <text x="485" y="331" fontSize="8" fill="#00695c" textAnchor="middle">Risk Scores,</text>
          <text x="485" y="343" fontSize="8" fill="#00695c" textAnchor="middle">Prioritization</text>
        </g>
      </g>

      {/* Arrow 3 */}
      <path d="M 570 210 L 620 210" stroke="#333" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />

      {/* Stage 4: Monitoring */}
      <g>
        {/* Input */}
        <g>
          <rect x="620" y="60" width="110" height="60" rx="5" fill="#c8e6c9" stroke="#1b5e20" strokeWidth="1.5" />
          <text x="675" y="78" fontSize="9" fontWeight="bold" fill="#1b5e20" textAnchor="middle">INPUT:</text>
          <text x="675" y="91" fontSize="8" fill="#1b5e20" textAnchor="middle">Baseline</text>
          <text x="675" y="103" fontSize="8" fill="#1b5e20" textAnchor="middle">Tech Stack</text>
        </g>
        {/* Main Stage */}
        <rect x="620" y="140" width="140" height="140" rx="10" fill="#e0f2f1" stroke="#00695c" strokeWidth="2" />
        <circle cx="690" cy="180" r="25" fill="#00695c" />
        <text x="690" y="188" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle">🔄</text>
        <text x="690" y="215" fontSize="13" fontWeight="bold" fill="#00695c" textAnchor="middle">Monitoring</text>
        <text x="690" y="230" fontSize="9" fill="#004d40" textAnchor="middle">Track Changes,</text>
        <text x="690" y="242" fontSize="9" fill="#004d40" textAnchor="middle">New Versions</text>
        {/* Output */}
        <g>
          <rect x="620" y="300" width="110" height="60" rx="5" fill="#ffe0b2" stroke="#e65100" strokeWidth="1.5" />
          <text x="675" y="318" fontSize="9" fontWeight="bold" fill="#e65100" textAnchor="middle">OUTPUT:</text>
          <text x="675" y="331" fontSize="8" fill="#e65100" textAnchor="middle">Alerts on</text>
          <text x="675" y="343" fontSize="8" fill="#e65100" textAnchor="middle">Changes</text>
        </g>
      </g>

      {/* Arrow 4 */}
      <path d="M 760 210 L 810 210" stroke="#333" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />

      {/* Stage 5: Compliance */}
      <g>
        {/* Input */}
        <g>
          <rect x="810" y="60" width="110" height="60" rx="5" fill="#f8bbd0" stroke="#880e4f" strokeWidth="1.5" />
          <text x="865" y="78" fontSize="9" fontWeight="bold" fill="#880e4f" textAnchor="middle">INPUT:</text>
          <text x="865" y="91" fontSize="8" fill="#880e4f" textAnchor="middle">Complete</text>
          <text x="865" y="103" fontSize="8" fill="#880e4f" textAnchor="middle">Risk Data</text>
        </g>
        {/* Main Stage */}
        <rect x="810" y="140" width="140" height="140" rx="10" fill="#f3e5f5" stroke="#7b1fa2" strokeWidth="2" />
        <circle cx="880" cy="180" r="25" fill="#7b1fa2" />
        <text x="880" y="188" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle">📋</text>
        <text x="880" y="215" fontSize="13" fontWeight="bold" fill="#7b1fa2" textAnchor="middle">Compliance</text>
        <text x="880" y="230" fontSize="9" fill="#4a148c" textAnchor="middle">Reports &amp;</text>
        <text x="880" y="242" fontSize="9" fill="#4a148c" textAnchor="middle">Dashboards</text>
        {/* Output */}
        <g>
          <rect x="810" y="300" width="110" height="60" rx="5" fill="#e1bee7" stroke="#4a148c" strokeWidth="1.5" />
          <text x="865" y="318" fontSize="9" fontWeight="bold" fill="#4a148c" textAnchor="middle">OUTPUT:</text>
          <text x="865" y="331" fontSize="8" fill="#4a148c" textAnchor="middle">Audit-Ready</text>
          <text x="865" y="343" fontSize="8" fill="#4a148c" textAnchor="middle">Reports</text>
        </g>
      </g>

      {/* Feedback loop arrow */}
      <path d="M 880 290 Q 880 380 120 380 Q 120 290 120 280" stroke="#d32f2f" strokeWidth="2" fill="none" strokeDasharray="5,5" markerEnd="url(#arrowhead-red)" />
      <text x="500" y="420" fontSize="11" fill="#d32f2f" fontWeight="bold" textAnchor="middle">🔁 Continuous Loop: Rescan after updates to detect new tech, CVEs, and changes</text>

      {/* Key insight boxes */}
      <g>
        <rect x="30" y="460" width="320" height="170" rx="8" fill="#bbdefb" stroke="#1976d2" strokeWidth="2" />
        <text x="190" y="490" fontSize="14" fontWeight="bold" fill="#1976d2" textAnchor="middle">Per-Asset Visibility</text>
        <text x="190" y="510" fontSize="10" fill="#0d47a1" textAnchor="middle">Each asset gets its own</text>
        <text x="190" y="524" fontSize="10" fill="#0d47a1" textAnchor="middle">complete tech stack</text>
        <text x="190" y="538" fontSize="10" fill="#0d47a1" textAnchor="middle">showing:</text>
        <text x="50" y="560" fontSize="9" fill="#0d47a1">✓ All frameworks &amp; libs</text>
        <text x="50" y="575" fontSize="9" fill="#0d47a1">✓ Versions &amp; EOL</text>
        <text x="50" y="590" fontSize="9" fill="#0d47a1">✓ Known CVEs</text>
        <text x="50" y="605" fontSize="9" fill="#0d47a1">✓ Change history</text>
      </g>

      <g>
        <rect x="370" y="460" width="320" height="170" rx="8" fill="#fff9c4" stroke="#f57f17" strokeWidth="2" />
        <text x="530" y="490" fontSize="14" fontWeight="bold" fill="#f57f17" textAnchor="middle">Risk Context</text>
        <text x="530" y="510" fontSize="10" fill="#827717" textAnchor="middle">For each finding,</text>
        <text x="530" y="524" fontSize="10" fill="#827717" textAnchor="middle">understand:</text>
        <text x="390" y="560" fontSize="9" fill="#827717">✓ Why it matters</text>
        <text x="390" y="575" fontSize="9" fill="#827717">✓ Impact on asset</text>
        <text x="390" y="590" fontSize="9" fill="#827717">✓ Dependency chains</text>
        <text x="390" y="605" fontSize="9" fill="#827717">✓ What to do about it</text>
      </g>

      <g>
        <rect x="710" y="460" width="320" height="170" rx="8" fill="#c8e6c9" stroke="#1b5e20" strokeWidth="2" />
        <text x="870" y="490" fontSize="14" fontWeight="bold" fill="#1b5e20" textAnchor="middle">Actionable Output</text>
        <text x="870" y="510" fontSize="10" fill="#1b5e20" textAnchor="middle">Everything is</text>
        <text x="870" y="524" fontSize="10" fill="#1b5e20" textAnchor="middle">ready to act on:</text>
        <text x="730" y="560" fontSize="9" fill="#1b5e20">✓ Prioritized by risk</text>
        <text x="730" y="575" fontSize="9" fill="#1b5e20">✓ Remediation paths</text>
        <text x="730" y="590" fontSize="9" fill="#1b5e20">✓ Track progress</text>
        <text x="730" y="605" fontSize="9" fill="#1b5e20">✓ Audit trail included</text>
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
      <div className="space-y-6 flex flex-col items-center">
        {/* Flow Diagram */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden w-full">
          <div className="flex justify-center">
            <CompleteFlowDiagram />
          </div>
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
  onNext,
  onPrev,
  canGoNext,
  canGoPrev,
}: {
  feature: (typeof featureDetails)[keyof typeof featureDetails] | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  canGoNext?: boolean;
  canGoPrev?: boolean;
}) {
  if (!feature) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-90vh overflow-y-auto relative">
        {/* Left Arrow Button */}
        {canGoPrev && onPrev && (
          <button
            onClick={onPrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
            title="Previous feature"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Right Arrow Button */}
        {canGoNext && onNext && (
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
            title="Next feature"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

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

  // Handle arrow navigation when card is expanded
  useEffect(() => {
    if (!expandedFeature) return;

    const currentIndex = features.findIndex((f) => f.key === expandedFeature);

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && currentIndex < features.length - 1) {
        e.preventDefault();
        setExpandedFeature(features[currentIndex + 1].key);
      } else if (e.key === "ArrowLeft" && currentIndex > 0) {
        e.preventDefault();
        setExpandedFeature(features[currentIndex - 1].key);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [expandedFeature]);

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
      {expandedFeature && (
        <FeatureModal
          feature={selectedFeature}
          onClose={() => setExpandedFeature(null)}
          onNext={() => {
            const currentIndex = features.findIndex((f) => f.key === expandedFeature);
            if (currentIndex < features.length - 1) {
              setExpandedFeature(features[currentIndex + 1].key);
            }
          }}
          onPrev={() => {
            const currentIndex = features.findIndex((f) => f.key === expandedFeature);
            if (currentIndex > 0) {
              setExpandedFeature(features[currentIndex - 1].key);
            }
          }}
          canGoNext={
            expandedFeature
              ? features.findIndex((f) => f.key === expandedFeature) < features.length - 1
              : false
          }
          canGoPrev={
            expandedFeature
              ? features.findIndex((f) => f.key === expandedFeature) > 0
              : false
          }
        />
      )}
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentSlide]);

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
          {/* Slide Container with Arrow Navigation */}
          <div className="relative flex items-center">
            {/* Left Arrow */}
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
              title="Previous slide"
            >
              <ChevronLeft className="w-8 h-8 text-blue-600" />
            </button>

            {/* Slide Content */}
            <div className="min-h-96 p-12 bg-gradient-to-br from-slate-50 to-white w-full flex flex-col items-center">
              {/* Slide Title */}
              <div className="mb-8 w-full text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {slide.title}
                </h1>
                {slide.subtitle && (
                  <p className="text-xl text-gray-600">{slide.subtitle}</p>
                )}
              </div>

              {/* Slide Content */}
              <div className="mb-8 w-full">{slide.content}</div>
            </div>

            {/* Right Arrow */}
            <button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
              title="Next slide"
            >
              <ChevronRight className="w-8 h-8 text-blue-600" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-gray-200">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Progress Indicator */}
          <div className="bg-gray-50 px-12 py-4 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              Slide {currentSlide + 1} of {slides.length} — Use arrow buttons or keyboard arrows to navigate
            </span>
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

      </main>
    </div>
  );
}
