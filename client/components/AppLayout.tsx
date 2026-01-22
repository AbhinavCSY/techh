import { MainNav } from "./MainNav";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />
      <div>{children}</div>
    </div>
  );
}
