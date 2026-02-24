import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
}

const CollapsibleSection = ({
  section,
  isOpen,
  onToggle,
}: {
  section: Section;
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <div className="border border-gray-200 rounded-lg mb-4">
    <button
      onClick={onToggle}
      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
    >
      <div className="text-left flex-1">
        <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
        <p className="text-sm text-gray-600 mt-1">{section.description}</p>
      </div>
      {isOpen ? (
        <ChevronDown className="w-5 h-5 text-blue-600 flex-shrink-0 ml-4" />
      ) : (
        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
      )}
    </button>
    {isOpen && <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">{section.content}</div>}
  </div>
);

export default function InformationArchitecture() {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["system-overview"])
  );

  const toggleSection = (sectionId: string) => {
    const newOpen = new Set(openSections);
    if (newOpen.has(sectionId)) {
      newOpen.delete(sectionId);
    } else {
      newOpen.add(sectionId);
    }
    setOpenSections(newOpen);
  };

  const sections: Section[] = [
    {
      id: "system-overview",
      title: "System Overview",
      description: "High-level architecture and technology stack",
      content: (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Architecture</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <span className="font-medium">Frontend:</span> React 18 SPA with
                TypeScript
              </li>
              <li>
                <span className="font-medium">Backend:</span> Express.js server
                (Node.js)
              </li>
              <li>
                <span className="font-medium">Build Tool:</span> Vite (dev
                server + SSR bundling)
              </li>
              <li>
                <span className="font-medium">Testing:</span> Vitest
              </li>
              <li>
                <span className="font-medium">UI Framework:</span> React Router
                v6 + Tailwind CSS
              </li>
              <li>
                <span className="font-medium">State Management:</span> React
                Query (TanStack), localStorage
              </li>
              <li>
                <span className="font-medium">Authentication:</span> Simple
                password-based (no OAuth/JWT)
              </li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Key Libraries</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-semibold text-gray-500">
                  UI &amp; Visualization
                </span>
                <ul className="text-sm text-gray-700 mt-2 space-y-1">
                  <li>Radix UI (components)</li>
                  <li>Recharts (charts)</li>
                  <li>Three.js &amp; R3F (3D)</li>
                </ul>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500">
                  Utilities
                </span>
                <ul className="text-sm text-gray-700 mt-2 space-y-1">
                  <li>html2canvas (exports)</li>
                  <li>jsPDF (PDF generation)</li>
                  <li>Sonner (toasts)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Deployment:</span> Supports Node.js
              server deployment, Netlify, or Vercel (via MCP integrations)
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "routing-structure",
      title: "Routing & Page Structure",
      description: "URL routes, page components, and navigation flow",
      content: (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">
              Route Hierarchy
            </h4>
            <div className="font-mono text-sm space-y-2">
              <div>
                <div className="text-blue-600 font-semibold">/tech-stack-slideshow</div>
                <div className="text-gray-600 ml-4">
                  → NoNavLayout → TechStackSlideshow (fullscreen, no password)
                </div>
              </div>
              <div className="text-gray-400 my-2">|</div>
              <div>
                <div className="text-blue-600 font-semibold">
                  /* (all protected routes)
                </div>
                <div className="text-gray-600 ml-4">
                  → PasswordProtection → AppLayout → nested Routes
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Protected Routes</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <span className="text-blue-600 font-mono mr-3 w-24">GET /</span>
                <span className="text-gray-700">Index (Asset Inventory Dashboard)</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-600 font-mono mr-3 w-24">
                  GET /web-apps
                </span>
                <span className="text-gray-700">Web Applications</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-600 font-mono mr-3 w-24">
                  GET /threat-intel
                </span>
                <span className="text-gray-700">Threat Intelligence</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-600 font-mono mr-3 w-24">
                  GET /incident/:techStackId/:cveId
                </span>
                <span className="text-gray-700">Incident Details</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-600 font-mono mr-3 w-24">
                  GET /cve-details/:cveId
                </span>
                <span className="text-gray-700">CVE Full Details</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-600 font-mono mr-3 w-24">
                  GET /rescan-history
                </span>
                <span className="text-gray-700">Rescan History</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-600 font-mono mr-3 w-24">GET *</span>
                <span className="text-gray-700">NotFound (404)</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded">
            <p className="text-sm text-amber-900">
              <span className="font-semibold">Architecture:</span> All routes
              except /tech-stack-slideshow are protected by PasswordProtection
              and wrapped in AppLayout (includes header navigation).
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "component-hierarchy",
      title: "Component Hierarchy & Layout",
      description: "Component tree, layouts, and reusable UI primitives",
      content: (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">
              Application Component Tree
            </h4>
            <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto font-mono text-gray-700">
{`App (root)
├─ QueryClientProvider (React Query)
├─ TooltipProvider (Radix UI)
├─ Toaster (UI notifications)
├─ Sonner (toast notifications)
└─ BrowserRouter
   └─ Routes
      ├─ /tech-stack-slideshow
      │  └─ NoNavLayout
      │     └─ TechStackSlideshow
      └─ /*
         └─ PasswordProtection
            └─ AppLayout
               ├─ MainNav (header)
               └─ Routes
                  ├─ Index (/)
                  ├─ WebApplications (/web-apps)
                  ├─ ThreatIntel (/threat-intel)
                  ├─ IncidentDetails (/incident/:id)
                  ├─ CVEFullDetails (/cve/:id)
                  ├─ RescanHistory (/rescan-history)
                  └─ NotFound (*)`}
            </pre>
          </div>

          <div className="bg-white p-4 rounded border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">
              UI Component Primitives
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              {[
                "button",
                "input",
                "label",
                "badge",
                "card",
                "sheet",
                "dialog",
                "select",
                "toggle",
                "sidebar",
                "navigation-menu",
                "toast",
              ].map((component) => (
                <div
                  key={component}
                  className="bg-gray-50 px-3 py-2 rounded border border-gray-200 text-gray-700"
                >
                  {component}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-3">
              All primitives built with Radix UI + Tailwind CSS
            </p>
          </div>

          <div className="bg-white p-4 rounded border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">
              Major Page Components
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <span className="font-mono text-blue-600">Index.tsx</span> -
                Asset Inventory dashboard with modals, asset table view, and
                visualizations
              </li>
              <li>
                <span className="font-mono text-blue-600">WebApplications.tsx</span> -
                Web applications listing and management
              </li>
              <li>
                <span className="font-mono text-blue-600">ThreatIntel.tsx</span> -
                Threat intelligence dashboard
              </li>
              <li>
                <span className="font-mono text-blue-600">IncidentDetails.tsx</span> -
                Detailed view of a security incident
              </li>
              <li>
                <span className="font-mono text-blue-600">CVEFullDetails.tsx</span> -
                Comprehensive CVE information and remediation
              </li>
              <li>
                <span className="font-mono text-blue-600">RescanHistory.tsx</span> -
                Security scan history and timeline
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "data-models",
      title: "Data Models & Domain Entities",
      description: "Core data structures and their relationships",
      content: (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">
              Primary Entities
            </h4>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  Asset
                </span>
                <div className="mt-1 ml-4 text-gray-700">
                  id, name, type (ip | domain | app | cloud-resource), techStacks[], cveCount,
                  riskLevel, lastSeen, firstSeen, isScanned
                </div>
              </div>
              <div>
                <span className="font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  TechStack
                </span>
                <div className="mt-1 ml-4 text-gray-700">
                  id, name, type (framework | language | database | devops | library), version,
                  secureVersion, cves[], versionHistory[], remediations[], riskLevel, license,
                  reliabilityIndicators[]
                </div>
              </div>
              <div>
                <span className="font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  CVE
                </span>
                <div className="mt-1 ml-4 text-gray-700">
                  id, severity, title, score, affectedRange, published, threatIntelligence,
                  scanCoverage, remediation
                </div>
              </div>
              <div>
                <span className="font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  ThreatIntelligence
                </span>
                <div className="mt-1 ml-4 text-gray-700">
                  epssScore, exploitationStatus, indicators[], iocs[], geographicImpact,
                  timelineEvents[]
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">
              Supporting Models
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { name: "Remediation", fields: "id, title, description, steps[]" },
                { name: "VersionHistory", fields: "version, releaseDate, changelog" },
                { name: "IOC", fields: "id, type, value, source" },
                { name: "GeographicImpact", fields: "region, count, severity" },
                { name: "TimelineEvent", fields: "date, title, description" },
                { name: "Vendor", fields: "id, name, products[]" },
              ].map((model) => (
                <div key={model.name} className="bg-gray-50 p-3 rounded border border-gray-200">
                  <div className="font-mono text-blue-600">{model.name}</div>
                  <div className="text-xs text-gray-600 mt-1">{model.fields}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">
              Data Flow & Relationships
            </h4>
            <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto font-mono text-gray-700">
{`Asset 1:N TechStack
   ↓
   1:N CVE
        ↓
        1:1 ThreatIntelligence
        1:N Remediation

TechStack 1:N VersionHistory
         1:1 Vendor
         1:N License`}
            </pre>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 p-4 rounded">
            <p className="text-sm text-indigo-900">
              <span className="font-semibold">Mock Data Source:</span> All data
              currently comes from client/data/mockData.ts and
              client/data/dependencyGraphData.ts. No persistent backend database
              is implemented in the template.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "state-management",
      title: "State Management & Data Flow",
      description: "How application state is managed and updated",
      content: (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">
              State Management Approach
            </h4>
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <span className="font-semibold text-gray-900">
                  Local UI State
                </span>
                <p className="mt-1 ml-4">
                  React useState/useEffect hooks used per-component for UI-specific
                  state (modals, form inputs, expanded sections, etc.)
                </p>
              </div>
              <div>
                <span className="font-semibold text-gray-900">
                  Server/Async Data
                </span>
                <p className="mt-1 ml-4">
                  @tanstack/react-query (TanStack Query) for fetching, caching, and
                  synchronizing server data. QueryClient provided at App root.
                </p>
              </div>
              <div>
                <span className="font-semibold text-gray-900">
                  Authentication State
                </span>
                <p className="mt-1 ml-4">
                  localStorage used to persist AUTH_TOKEN and AUTH_EXPIRY (24h).
                  Checked by PasswordProtection component on route load.
                </p>
              </div>
              <div>
                <span className="font-semibold text-gray-900">
                  No Global State Manager
                </span>
                <p className="mt-1 ml-4">
                  No Redux, Zustand, or Jotai. State is either local to components or
                  managed by React Query caches.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">
              React Query Integration
            </h4>
            <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto font-mono text-gray-700">
{`QueryClient configured at App root level.
Available to all pages & components via hooks:
- useQuery() - fetch and cache data
- useMutation() - mutations, create/update/delete
- useInfiniteQuery() - pagination support

Server endpoints can be added to:
  server/routes/* and consumed via react-query`}
            </pre>
          </div>

          <div className="bg-white p-4 rounded border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">
              Current Data Flow
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center">
                <span className="w-32">Pages render</span>
                <span className="text-gray-400">→</span>
                <span className="ml-2">Import mock data from client/data</span>
              </div>
              <div className="flex items-center">
                <span className="w-32">useState</span>
                <span className="text-gray-400">→</span>
                <span className="ml-2">Local component state</span>
              </div>
              <div className="flex items-center">
                <span className="w-32">useMemo</span>
                <span className="text-gray-400">→</span>
                <span className="ml-2">Memoized data transformations</span>
              </div>
              <div className="flex items-center">
                <span className="w-32">Render</span>
                <span className="text-gray-400">→</span>
                <span className="ml-2">Display in components</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <p className="text-sm text-green-900">
              <span className="font-semibold">Future Enhancement:</span> To add
              a database backend, create API endpoints in server/routes, configure
              a database connection, and replace mock data imports with useQuery
              calls pointing to those endpoints.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "authentication",
      title: "Authentication & Authorization",
      description: "How user access is controlled and secured",
      content: (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">
              Authentication Flow
            </h4>
            <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto font-mono text-gray-700">
{`1. User visits app
   ↓
2. PasswordProtection checks localStorage for AUTH_TOKEN
   ├─ If valid token exists (not expired)
   │  └─ → Proceed to AppLayout + Routes
   └─ If no token or expired
      └─ → Show LoginPage / password form
   ↓
3. User submits password
   ↓
4. POST /api/verify-password (to server)
   ├─ Server verifies password (APP_PASSWORD or dev password)
   ├─ If valid → return success
   └─ If invalid → return error
   ↓
5. Client stores AUTH_TOKEN + AUTH_EXPIRY in localStorage (24h)
   ↓
6. Reload page or trigger re-render → PasswordProtection checks passes`}
            </pre>
          </div>

          <div className="bg-white p-4 rounded border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">
              Password Management
            </h4>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold text-gray-900">Development Mode</span>
                <div className="mt-1 ml-4 text-gray-700">
                  Server generates random password on startup. Stored encrypted in
                  .data/password.json. Plaintext hint available at /api/dev-password.
                </div>
              </div>
              <div>
                <span className="font-semibold text-gray-900">Production Mode</span>
                <div className="mt-1 ml-4 text-gray-700">
                  APP_PASSWORD environment variable must be set. Server refuses to
                  start without it. /api/dev-password endpoint disabled.
                </div>
              </div>
              <div>
                <span className="font-semibold text-gray-900">Encryption</span>
                <div className="mt-1 ml-4 text-gray-700">
                  APP_SECRET env variable used to derive encryption key for storing
                  dev password securely in .data.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">
              Authorization Model
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <strong>No role-based access control (RBAC)</strong> - single
                global password for all users
              </li>
              <li>
                <strong>No JWT or OAuth</strong> - simple token-based auth via
                localStorage
              </li>
              <li>
                <strong>No user accounts</strong> - shared application password
              </li>
              <li>
                <strong>All routes protected equally</strong> - except
                /tech-stack-slideshow (can be accessed directly)
              </li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">
              Server Endpoints
            </h4>
            <div className="space-y-2 text-sm font-mono">
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-green-600 font-semibold">POST</span> /api/verify-password
                <div className="text-gray-700 text-xs mt-1">
                  Verify user password, return auth token on success
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-blue-600 font-semibold">GET</span> /api/dev-password
                <div className="text-gray-700 text-xs mt-1">
                  Return plaintext hint for dev password (dev only)
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-blue-600 font-semibold">GET</span> /api/ping
                <div className="text-gray-700 text-xs mt-1">
                  Health check endpoint (returns PING_MESSAGE env var)
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 p-4 rounded">
            <p className="text-sm text-red-900">
              <span className="font-semibold">Security Note:</span> This
              authentication system is suitable for demo/staging environments. For
              production with multiple users, implement proper OAuth/SSO, multi-factor
              authentication, and role-based access control.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "file-structure",
      title: "Directory & File Structure",
      description: "Project layout and important file locations",
      content: (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded border border-gray-200">
            <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto font-mono text-gray-700">
{`project-root/
├── client/                      # React SPA frontend
│   ├── App.tsx                 # Root component, providers, routing
│   ├── global.css              # Tailwind directives & theme
│   ├── pages/                  # Route components
│   │   ├── Index.tsx           # Asset Inventory (main dashboard)
│   │   ├── WebApplications.tsx
│   │   ├── ThreatIntel.tsx
│   │   ├── IncidentDetails.tsx
│   │   ├── CVEFullDetails.tsx
│   │   ├── RescanHistory.tsx
│   │   ├── TechStackSlideshow.tsx
│   │   └── NotFound.tsx        # 404 page
│   ├── components/             # Reusable UI components
│   │   ├── AppLayout.tsx       # Site wrapper layout
│   │   ├── MainNav.tsx         # Header navigation
│   │   ├── PasswordProtection.tsx  # Auth gating
│   │   ├── NoNavLayout.tsx     # Fullscreen layout
│   │   └── ui/                 # Radix + Tailwind primitives
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── badge.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── sheet.tsx
│   │       ├── toast.tsx
│   │       ├── sonner.tsx
│   │       └── ...
│   ├── data/                   # Mock data & models
│   │   ├── mockData.ts         # Asset, TechStack, CVE, etc.
│   │   └── dependencyGraphData.ts
│   ├── lib/                    # Utilities
│   │   └── utils.ts            # cn() function, etc.
│   └── index.html              # HTML entry point
├── server/                     # Express backend
│   ├── index.ts               # Express app, route mounting
│   ├── routes/                # API handlers
│   │   ├── auth.ts            # /api/verify-password, /api/dev-password
│   │   └── demo.ts            # /api/demo
│   ├── utils/                 # Server utilities
│   │   └── password.ts        # Password generation, encryption, verify
│   └── node-build.ts          # Server bundle entry
├── shared/                    # Shared types
│   └── api.ts                 # Shared TypeScript interfaces
├── .data/                     # Runtime-generated (dev only)
│   ├── password.json          # Encrypted dev password
│   └── SETUP_PASSWORD.txt     # Plaintext hint
├── vite.config.ts             # Vite dev config
├── vite.config.server.ts      # Server bundle config
├── package.json               # Dependencies & scripts
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.js         # Tailwind CSS theme
├── AGENTS.md                  # Deployment & structure docs
└── README.md                  # Project overview`}
            </pre>
          </div>

          <div className="bg-white p-4 rounded border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">
              Key Configuration Files
            </h4>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  vite.config.ts
                </span>
                <p className="mt-1 text-gray-700">
                  Vite dev server config, Express middleware integration, path aliases
                </p>
              </div>
              <div>
                <span className="font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  vite.config.server.ts
                </span>
                <p className="mt-1 text-gray-700">
                  Server bundle build config, Node.js output target
                </p>
              </div>
              <div>
                <span className="font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  package.json
                </span>
                <p className="mt-1 text-gray-700">
                  Dependencies, dev scripts (dev, build, start, test)
                </p>
              </div>
              <div>
                <span className="font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  tsconfig.json
                </span>
                <p className="mt-1 text-gray-700">
                  TypeScript compiler options and path aliases
                </p>
              </div>
              <div>
                <span className="font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  tailwind.config.js
                </span>
                <p className="mt-1 text-gray-700">
                  Tailwind CSS customization and theme settings
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "api-integration",
      title: "API & External Integrations",
      description: "Backend endpoints and external service connections",
      content: (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">
              Available API Endpoints
            </h4>
            <div className="space-y-3 text-sm">
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <div className="font-mono text-green-600 font-semibold">
                  POST /api/verify-password
                </div>
                <div className="mt-2 text-gray-700">
                  <p>
                    <strong>Purpose:</strong> Authenticate user with password
                  </p>
                  <p className="mt-1">
                    <strong>Request:</strong> {"{"}password: string{"}"}
                  </p>
                  <p className="mt-1">
                    <strong>Response:</strong> {"{"}token: string, expiry: number{"}"}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <div className="font-mono text-blue-600 font-semibold">
                  GET /api/dev-password
                </div>
                <div className="mt-2 text-gray-700">
                  <p>
                    <strong>Purpose:</strong> Retrieve dev password hint (dev only)
                  </p>
                  <p className="mt-1">
                    <strong>Response:</strong> {"{"}hint: string{"}"}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <div className="font-mono text-blue-600 font-semibold">
                  GET /api/ping
                </div>
                <div className="mt-2 text-gray-700">
                  <p>
                    <strong>Purpose:</strong> Health check endpoint
                  </p>
                  <p className="mt-1">
                    <strong>Response:</strong> Message from PING_MESSAGE env var
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">
              Environment Variables
            </h4>
            <div className="space-y-2 text-sm font-mono">
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-orange-600 font-semibold">APP_PASSWORD</span>
                <div className="text-gray-700 text-xs mt-1">
                  Required in production. Must be set before server starts.
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-orange-600 font-semibold">APP_SECRET</span>
                <div className="text-gray-700 text-xs mt-1">
                  Encryption key for dev password storage. Derived from env if not set.
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-orange-600 font-semibold">NODE_ENV</span>
                <div className="text-gray-700 text-xs mt-1">
                  Controls password behavior: 'production' vs 'development'
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-orange-600 font-semibold">PING_MESSAGE</span>
                <div className="text-gray-700 text-xs mt-1">
                  Message returned by /api/ping endpoint (optional)
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">
              External Integrations
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <strong>Netlify:</strong> Supported via MCP (Model Context Protocol) -
                auto-deploy on git push
              </li>
              <li>
                <strong>Vercel:</strong> Supported via MCP - auto-deploy on git push
              </li>
              <li>
                <strong>GitHub:</strong> Code import integration available in UI
                (multi-step modal workflow)
              </li>
              <li>
                <strong>SBOM Tools:</strong> Integration paths available for Syft,
                CycloneDX, SPDX, Grype, Poetry
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Extending APIs:</span> To add new
              endpoints, create files in server/routes/, import them in server/index.ts,
              and consume via react-query hooks in components.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "development-workflow",
      title: "Development Workflow & Tools",
      description: "How to work with this project during development",
      content: (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">
              Development Scripts
            </h4>
            <div className="space-y-2 text-sm font-mono">
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-blue-600 font-semibold">npm run dev</span>
                <div className="text-gray-700 text-xs mt-1">
                  Start Vite dev server with Express middleware. Hot module replacement
                  enabled for client changes.
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-blue-600 font-semibold">npm run build</span>
                <div className="text-gray-700 text-xs mt-1">
                  Build client (dist/client) and server (dist/server) bundles for
                  production.
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-blue-600 font-semibold">npm run start</span>
                <div className="text-gray-700 text-xs mt-1">
                  Run production server from dist/server/node-build.mjs bundle.
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-blue-600 font-semibold">npm test</span>
                <div className="text-gray-700 text-xs mt-1">
                  Run Vitest unit tests.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">
              Adding a New Page
            </h4>
            <ol className="space-y-2 text-sm text-gray-700">
              <li>
                <span className="font-semibold">1.</span> Create component in
                client/pages/YourPage.tsx
              </li>
              <li>
                <span className="font-semibold">2.</span> Export default component
              </li>
              <li>
                <span className="font-semibold">3.</span> Add Route in client/App.tsx
                Routes block
              </li>
              <li>
                <span className="font-semibold">4.</span> (Optional) Add nav link in
                MainNav.tsx
              </li>
              <li>
                <span className="font-semibold">5.</span> Auto-protected by
                PasswordProtection wrapper
              </li>
            </ol>
          </div>

          <div className="bg-white p-4 rounded border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">
              Adding a New API Endpoint
            </h4>
            <ol className="space-y-2 text-sm text-gray-700">
              <li>
                <span className="font-semibold">1.</span> Create file in
                server/routes/yourEndpoint.ts
              </li>
              <li>
                <span className="font-semibold">2.</span> Define Express router and
                handlers
              </li>
              <li>
                <span className="font-semibold">3.</span> Export router
              </li>
              <li>
                <span className="font-semibold">4.</span> Import in server/index.ts and
                call app.use('/api/path', router)
              </li>
              <li>
                <span className="font-semibold">5.</span> Consume in React via
                useQuery/useMutation
              </li>
            </ol>
          </div>

          <div className="bg-white p-4 rounded border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">
              Code Organization Best Practices
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                ✓ Keep page components focused; break large pages into smaller
                components
              </li>
              <li>
                ✓ Place reusable UI primitives in components/ui with Radix + Tailwind
              </li>
              <li>
                ✓ Use TypeScript interfaces for data models (client/data/mockData.ts)
              </li>
              <li>
                ✓ Use React Query for server state; useState for UI state
              </li>
              <li>
                ✓ Use tailwind cn() utility for conditional CSS classes
              </li>
              <li>
                ✓ Keep server routes small and focused (single responsibility)
              </li>
              <li>
                ✓ Test components with Vitest where appropriate
              </li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Information Architecture
          </h1>
          <p className="text-lg text-gray-600">
            CloudSEK Asset Inventory Management System
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-2">6</div>
            <div className="text-sm font-semibold text-gray-900">Main Routes</div>
            <div className="text-xs text-gray-600 mt-1">Protected pages + 1 fullscreen</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
            <div className="text-sm font-semibold text-gray-900">Core API Endpoints</div>
            <div className="text-xs text-gray-600 mt-1">Auth + health check</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
            <div className="text-sm font-semibold text-gray-900">Entity Models</div>
            <div className="text-xs text-gray-600 mt-1">Asset, TechStack, CVE, etc.</div>
          </div>
        </div>

        {/* Collapsible Sections */}
        <div>
          {sections.map((section) => (
            <CollapsibleSection
              key={section.id}
              section={section}
              isOpen={openSections.has(section.id)}
              onToggle={() => toggleSection(section.id)}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            This information architecture provides a comprehensive overview of the
            system structure, data models, and development patterns.
          </p>
          <p className="text-xs text-gray-500 mt-3">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
