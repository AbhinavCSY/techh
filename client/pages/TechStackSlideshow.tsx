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

// SVG Illustration Component
function FeatureIllustration({ type }: { type: string }) {
  switch (type) {
    case "inventory":
      return (
        <svg viewBox="0 0 400 300" className="w-full h-64">
          <rect width="400" height="300" fill="#e3f2fd" />
          <text x="20" y="40" fontSize="20" fontWeight="bold" fill="#1976d2">Complete Inventory</text>
          <rect x="20" y="60" width="360" height="40" rx="5" fill="#bbdefb" stroke="#1976d2" strokeWidth="2" />
          <text x="30" y="90" fontSize="12" fill="#1976d2">React 18.2.0</text>
          <rect x="20" y="110" width="360" height="40" rx="5" fill="#bbdefb" stroke="#1976d2" strokeWidth="2" />
          <text x="30" y="140" fontSize="12" fill="#1976d2">Node.js 18.14.0</text>
          <rect x="20" y="160" width="360" height="40" rx="5" fill="#bbdefb" stroke="#1976d2" strokeWidth="2" />
          <text x="30" y="190" fontSize="12" fill="#1976d2">TypeScript 5.0.0</text>
          <rect x="20" y="210" width="360" height="40" rx="5" fill="#bbdefb" stroke="#1976d2" strokeWidth="2" />
          <text x="30" y="240" fontSize="12" fill="#1976d2">PostgreSQL 14.0 + 45 more...</text>
        </svg>
      );
    case "vulnerability":
      return (
        <svg viewBox="0 0 400 300" className="w-full h-64">
          <rect width="400" height="300" fill="#ffebee" />
          <text x="20" y="40" fontSize="20" fontWeight="bold" fill="#d32f2f">Vulnerability Detection</text>
          <circle cx="100" cy="130" r="40" fill="#ef5350" />
          <text x="85" y="140" fontSize="16" fontWeight="bold" fill="white">CVE</text>
          <text x="30" y="190" fontSize="12" fill="#d32f2f">Critical: 3</text>
          <text x="30" y="210" fontSize="12" fill="#d32f2f">High: 12</text>
          <text x="30" y="230" fontSize="12" fill="#d32f2f">Medium: 28</text>
          <circle cx="300" cy="130" r="40" fill="#ffeb3b" />
          <text x="280" y="145" fontSize="14" fontWeight="bold" fill="#000">EOL</text>
          <text x="250" y="190" fontSize="12" fill="#d32f2f">⚠️ Found 8 EOL components</text>
        </svg>
      );
    case "riskScoring":
      return (
        <svg viewBox="0 0 400 300" className="w-full h-64">
          <rect width="400" height="300" fill="#f3e5f5" />
          <text x="20" y="40" fontSize="20" fontWeight="bold" fill="#7b1fa2">Risk Scoring</text>
          <rect x="30" y="70" width="80" height="180" fill="#81c784" stroke="#388e3c" strokeWidth="2" />
          <text x="45" y="160" fontSize="12" fontWeight="bold" fill="white">Low</text>
          <rect x="130" y="100" width="80" height="150" fill="#fbc02d" stroke="#f57f17" strokeWidth="2" />
          <text x="145" y="160" fontSize="12" fontWeight="bold" fill="white">Med</text>
          <rect x="230" y="80" width="80" height="170" fill="#ff9800" stroke="#e65100" strokeWidth="2" />
          <text x="245" y="160" fontSize="12" fontWeight="bold" fill="white">High</text>
          <rect x="330" y="60" width="40" height="190" fill="#d32f2f" stroke="#b71c1c" strokeWidth="2" />
          <text x="335" y="160" fontSize="10" fontWeight="bold" fill="white">Crit</text>
          <text x="20" y="280" fontSize="11" fill="#7b1fa2">Enterprise & Domain-Level Scoring</text>
        </svg>
      );
    case "dependency":
      return (
        <svg viewBox="0 0 400 300" className="w-full h-64">
          <rect width="400" height="300" fill="#f3e5f5" />
          <text x="20" y="40" fontSize="20" fontWeight="bold" fill="#6a1b9a">Dependency Mapping</text>
          <circle cx="200" cy="100" r="25" fill="#9c27b0" />
          <text x="185" y="110" fontSize="12" fill="white">Core</text>
          <circle cx="100" cy="180" r="20" fill="#ba68c8" />
          <text x="85" y="185" fontSize="10" fill="white">Lib A</text>
          <circle cx="300" cy="180" r="20" fill="#ba68c8" />
          <text x="285" y="185" fontSize="10" fill="white">Lib B</text>
          <circle cx="80" cy="260" r="15" fill="#ce93d8" />
          <text x="70" y="265" fontSize="9" fill="white">Sub 1</text>
          <circle cx="320" cy="260" r="15" fill="#ce93d8" />
          <text x="310" y="265" fontSize="9" fill="white">Sub 2</text>
          <line x1="200" y1="125" x2="100" y2="160" stroke="#6a1b9a" strokeWidth="2" />
          <line x1="200" y1="125" x2="300" y2="160" stroke="#6a1b9a" strokeWidth="2" />
          <line x1="100" y1="200" x2="80" y2="245" stroke="#9c27b0" strokeWidth="1.5" />
          <line x1="300" y1="200" x2="320" y2="245" stroke="#9c27b0" strokeWidth="1.5" />
        </svg>
      );
    case "compliance":
      return (
        <svg viewBox="0 0 400 300" className="w-full h-64">
          <rect width="400" height="300" fill="#fff3e0" />
          <text x="20" y="40" fontSize="20" fontWeight="bold" fill="#e65100">Compliance Tracking</text>
          <rect x="20" y="60" width="340" height="50" rx="5" fill="#ffe0b2" stroke="#ff6f00" strokeWidth="2" />
          <text x="30" y="85" fontSize="12" fontWeight="bold" fill="#e65100">📋 SOC 2 Type II</text>
          <text x="30" y="100" fontSize="10" fill="#e65100">Status: Ready for Audit ✓</text>
          <rect x="20" y="120" width="340" height="50" rx="5" fill="#ffe0b2" stroke="#ff6f00" strokeWidth="2" />
          <text x="30" y="145" fontSize="12" fontWeight="bold" fill="#e65100">🔒 ISO 27001</text>
          <text x="30" y="160" fontSize="10" fill="#e65100">Status: In Progress</text>
          <rect x="20" y="180" width="340" height="50" rx="5" fill="#ffe0b2" stroke="#ff6f00" strokeWidth="2" />
          <text x="30" y="205" fontSize="12" fontWeight="bold" fill="#e65100">📊 HIPAA & PCI-DSS</text>
          <text x="30" y="220" fontSize="10" fill="#e65100">Status: Compliant ✓</text>
        </svg>
      );
    case "monitoring":
      return (
        <svg viewBox="0 0 400 300" className="w-full h-64">
          <rect width="400" height="300" fill="#e0f2f1" />
          <text x="20" y="40" fontSize="20" fontWeight="bold" fill="#00695c">Continuous Monitoring</text>
          <polyline points="30,220 80,180 130,200 180,140 230,160 280,100 330,120" fill="none" stroke="#00897b" strokeWidth="3" />
          <circle cx="30" cy="220" r="4" fill="#00897b" />
          <circle cx="80" cy="180" r="4" fill="#00897b" />
          <circle cx="130" cy="200" r="4" fill="#00897b" />
          <circle cx="180" cy="140" r="4" fill="#00897b" />
          <circle cx="230" cy="160" r="4" fill="#00897b" />
          <circle cx="280" cy="100" r="4" fill="#00897b" />
          <circle cx="330" cy="120" r="4" fill="#00897b" />
          <rect x="20" y="250" width="360" height="35" rx="5" fill="#b2dfdb" stroke="#00695c" strokeWidth="2" />
          <text x="30" y="272" fontSize="11" fill="#00695c">🔄 Scanning every 7 days | Last scan: 2 hours ago</text>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 400 300" className="w-full h-64">
          <rect width="400" height="300" fill="#f5f5f5" />
          <text x="100" y="150" fontSize="16" fill="#666">Feature Illustration</text>
        </svg>
      );
  }
}

// Feature details
const featureDetails = {
  inventory: {
    title: "Complete Inventory",
    description: "Unified view of all technologies, frameworks, and services running on every asset",
    details: "Automatically discover and catalog every technology component across your entire infrastructure. Get a complete picture of software versions, frameworks, libraries, and services in one centralized dashboard.",
    type: "inventory"
  },
  vulnerability: {
    title: "Vulnerability Detection",
    description: "Identify CVEs, EOL versions, and security misconfigurations automatically",
    details: "Scan your tech stack against known vulnerability databases. Automatically identify outdated components, end-of-life versions, and security misconfigurations with real-time alerts and severity ratings.",
    type: "vulnerability"
  },
  riskScoring: {
    title: "Risk Scoring",
    description: "Enterprise and domain-level scoring with actionable prioritization",
    details: "Get actionable risk scores at the enterprise level and per domain/team. Automatically prioritize which vulnerabilities and components to address first based on impact and criticality.",
    type: "riskScoring"
  },
  dependency: {
    title: "Dependency Mapping",
    description: "Visualize technology relationships and blast radius impact analysis",
    details: "See how technologies are interconnected and understand the cascading impact when removing or updating components. Interactive graphs show dependency chains and affected services.",
    type: "dependency"
  },
  compliance: {
    title: "Compliance Tracking",
    description: "Export dashboards and PDF reports for SOC 2, ISO, HIPAA, and PCI-DSS compliance",
    details: "Generate compliance-ready reports with executive summaries, risk metrics, and remediation status. Export to PDF or dashboard format for board presentations and audit requirements.",
    type: "compliance"
  },
  monitoring: {
    title: "Continuous Monitoring",
    description: "Track technology changes, scan regularly, and rescan after updates",
    details: "Set up automated, continuous scanning of your infrastructure. Schedule regular scans and automatic rescans after updates to stay ahead of newly discovered vulnerabilities.",
    type: "monitoring"
  }
};

const slides: Slide[] = [
  {
    title: "Tech Stack Management",
    subtitle: "What It Does & Why It Matters",
    content: (
      <div className="space-y-4">
        {/* Problem & Solution */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg border-2 border-blue-800">
          <h4 className="text-lg font-bold mb-3">🎯 The Challenge</h4>
          <p className="mb-3">
            Organizations struggle to answer: <span className="italic font-semibold">"What's running on our assets, is it safe, and what should we do about it?"</span>
          </p>
          <p className="text-sm">
            Without unified visibility into tech stacks, you can't identify outdated technologies, correlate CVEs with components, or prioritize remediation effectively.
          </p>
        </div>

        {/* Business Value */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 border-2 border-green-300 p-4 rounded-lg">
            <h5 className="font-bold text-green-900 mb-2">📊 Business Value</h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✓ Reduce breach risk by 90%+</li>
              <li>✓ Meet compliance (SOC 2, ISO, HIPAA, PCI-DSS)</li>
              <li>✓ Quantifiable security ROI</li>
              <li>✓ Executive dashboards & PDF reports</li>
            </ul>
          </div>

          <div className="bg-purple-50 border-2 border-purple-300 p-4 rounded-lg">
            <h5 className="font-bold text-purple-900 mb-2">👨‍💻 DevSecOps Benefits</h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✓ See complete tech stack per asset</li>
              <li>✓ Identify EOL & vulnerable tech</li>
              <li>✓ Correlate tech with CVEs</li>
              <li>✓ Track changes over time</li>
            </ul>
          </div>
        </div>

        {/* CISO & Enterprise Features */}
        <div className="bg-slate-900 text-white p-4 rounded-lg border-2 border-slate-700">
          <h5 className="font-bold mb-2">🏢 Enterprise Capabilities</h5>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-800 p-2 rounded text-center">
              <p className="text-xs font-semibold">Overall Risk Scoring</p>
              <p className="text-xs mt-1">Enterprise-wide assessment</p>
            </div>
            <div className="bg-slate-800 p-2 rounded text-center">
              <p className="text-xs font-semibold">Domain-Level Scoring</p>
              <p className="text-xs mt-1">Granular by team/dept</p>
            </div>
            <div className="bg-slate-800 p-2 rounded text-center">
              <p className="text-xs font-semibold">Highest Accuracy</p>
              <p className="text-xs mt-1">Zero false positives</p>
            </div>
          </div>
        </div>

        {/* Key Outcome */}
        <div className="bg-indigo-50 border-2 border-indigo-400 p-4 rounded-lg">
          <h5 className="font-bold text-indigo-900 mb-2">🚀 The Outcome</h5>
          <p className="text-sm text-gray-700">
            A unified view of all technologies running on your assets with automated risk scoring, compliance readiness, and actionable remediation guidance.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "Key Features & Capabilities",
    subtitle: "What You Get - Click to Expand",
    content: (
      <FeatureCardsSlide />
    ),
  },
];

// Feature Modal Component
function FeatureModal({ feature, onClose }: { feature: (typeof featureDetails)[keyof typeof featureDetails] | null; onClose: () => void }) {
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
            <p className="text-gray-700">
              {feature.description}
            </p>
          </div>

          {/* Detailed Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">How It Works</h3>
            <p className="text-gray-700">
              {feature.details}
            </p>
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
    { id: "monitoring", emoji: "⚡", key: "monitoring" as const }
  ];

  const cardColors = {
    inventory: { bg: "from-blue-50 to-blue-100", border: "border-blue-300", title: "text-blue-900" },
    vulnerability: { bg: "from-red-50 to-red-100", border: "border-red-300", title: "text-red-900" },
    riskScoring: { bg: "from-green-50 to-green-100", border: "border-green-300", title: "text-green-900" },
    dependency: { bg: "from-purple-50 to-purple-100", border: "border-purple-300", title: "text-purple-900" },
    compliance: { bg: "from-yellow-50 to-yellow-100", border: "border-yellow-300", title: "text-yellow-900" },
    monitoring: { bg: "from-cyan-50 to-cyan-100", border: "border-cyan-300", title: "text-cyan-900" }
  };

  const selectedFeature = expandedFeature ? featureDetails[expandedFeature as keyof typeof featureDetails] : null;

  return (
    <div className="space-y-4">
      {/* Core Features */}
      <div className="grid grid-cols-2 gap-4">
        {features.map(feature => {
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
        <h5 className="font-bold text-orange-900 mb-2">💡 Why This Matters</h5>
        <p className="text-sm text-gray-700 mb-2">
          <span className="font-semibold">For CISOs:</span> Complete visibility to reduce breach risk, meet compliance, and demonstrate security ROI to the board.
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-semibold">For DevSecOps:</span> Automated scanning, smart prioritization, and context-aware remediation guidance to secure your stack efficiently.
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
              <span className="font-semibold">Slide 1:</span> Understand what the solution does and its business impact
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Slide 2:</span> See all the key features and capabilities
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">💡 Tip:</span> Use navigation buttons or click slide numbers
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
