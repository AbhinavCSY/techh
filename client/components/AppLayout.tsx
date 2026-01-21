import { MainNav } from './MainNav';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />
      <div className="flex">
        {/* Sidebar is handled by MainNav */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
