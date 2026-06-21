"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Dashboard layout component
 * Main layout for authenticated pages
 */
export function DashboardLayout({ children }: LayoutProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/portfolio", label: "Portfolios", icon: "💼" },
    { href: "/transactions", label: "Transactions", icon: "📋" },
    { href: "/ai-assistant", label: "AI Assistant", icon: "🤖" },
  ];

  const adminItems = session?.user?.role === "ADMIN" ? [
    { href: "/admin", label: "Admin Panel", icon: "⚙️" },
  ] : [];

  const allNavItems = [...navItems, ...adminItems];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-slate-900 border-r border-slate-800 transition-all duration-300`}>
        <div className="p-6">
          <Link href="/dashboard" className="text-2xl font-bold text-emerald-500 block mb-8">
            {sidebarOpen ? "Fortress Fund" : "FF"}
          </Link>

          <nav className="space-y-2">
            {allNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 rounded-lg transition-colors"
          >
            {sidebarOpen ? "←" : "→"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col">
        {/* Header */}
        <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">
              {allNavItems.find((item) => isActive(item.href))?.label || "Dashboard"}
            </h1>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-400">{session?.user?.email}</span>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 rounded-lg text-sm font-medium text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
