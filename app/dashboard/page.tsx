"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { PerformanceChart, AllocationChart } from "@/components/charts/portfolio-charts";
import { SkeletonCard, SkeletonChart } from "@/components/ui/skeleton";

interface Asset {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  currentPrice: number;
  totalValue: number;
  totalGainPct: number;
}

interface Portfolio {
  id: string;
  name: string;
  totalValue: number;
  totalGain: number;
  totalGainPct: number;
  assets: Asset[];
  _count: { transactions: number };
}

/**
 * Dashboard page
 * Main user dashboard showing portfolio overview and charts
 */
export default function DashboardPage() {
  const { data: session } = useSession();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /**
   * Fetch portfolios on mount
   */
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await fetch("/api/portfolio");
        const data = await response.json();

        if (!data.success) {
          setError(data.error || "Failed to load portfolios");
          return;
        }

        setPortfolios(data.data);
      } catch (err) {
        setError("Failed to load portfolios");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  const totalValue = portfolios.reduce((sum, p) => sum + parseFloat(p.totalValue.toString()), 0);
  const totalGain = portfolios.reduce((sum, p) => sum + parseFloat(p.totalGain.toString()), 0);
  
  // Generate sample performance data
  const performanceData = [
    { date: "Mon", value: totalValue * 0.85 },
    { date: "Tue", value: totalValue * 0.87 },
    { date: "Wed", value: totalValue * 0.90 },
    { date: "Thu", value: totalValue * 0.92 },
    { date: "Fri", value: totalValue * 0.95 },
    { date: "Sat", value: totalValue * 0.98 },
    { date: "Sun", value: totalValue },
  ];

  // Calculate allocation data from all assets
  const allAssets = portfolios.flatMap((p) => p.assets);
  const assetTypes: Record<string, number> = {};
  allAssets.forEach((asset) => {
    assetTypes[asset.symbol] = (assetTypes[asset.symbol] || 0) + parseFloat(asset.totalValue.toString());
  });

  const allocationData = Object.entries(assetTypes)
    .map(([name, value]) => ({
      name,
      value: (value / totalValue) * 100,
    }))
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 sticky top-0 z-10">
        <div className="container-lg py-4 md:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="w-full">
              <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
              <p className="text-slate-400 text-sm md:text-base mt-1">Welcome back, {session?.user?.name}</p>
            </div>
            <Link href="/portfolio/new" className="btn-primary whitespace-nowrap w-full sm:w-auto text-center">
              + New Portfolio
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-lg py-6 md:py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => <SkeletonChart key={i} />)}
            </div>
          </div>
        ) : portfolios.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">No portfolios yet</h2>
            <p className="text-slate-400 mb-6">Create your first portfolio to get started</p>
            <Link href="/portfolio/new" className="btn-primary">
              Create First Portfolio
            </Link>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
              {/* Total Value Card */}
              <div className="card">
                <p className="text-slate-400 text-xs md:text-sm mb-2">Total Portfolio Value</p>
                <p className="text-2xl md:text-3xl font-bold text-emerald-500 truncate">
                  ${totalValue.toFixed(2)}
                </p>
              </div>

              {/* Total Gain Card */}
              <div className="card">
                <p className="text-slate-400 text-xs md:text-sm mb-2">Total Gain</p>
                <p className={`text-2xl md:text-3xl font-bold truncate ${totalGain >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                  ${totalGain.toFixed(2)}
                </p>
              </div>

              {/* Portfolios Count Card */}
              <div className="card">
                <p className="text-slate-400 text-xs md:text-sm mb-2">Portfolios</p>
                <p className="text-2xl md:text-3xl font-bold text-blue-500">{portfolios.length}</p>
              </div>

              {/* ROI Card */}
              <div className="card">
                <p className="text-slate-400 text-xs md:text-sm mb-2">Total ROI</p>
                <p className={`text-2xl md:text-3xl font-bold ${totalValue > 0 ? (totalGain / totalValue * 100) >= 0 ? "text-emerald-500" : "text-red-500" : "text-slate-400"}`}>
                  {totalValue > 0 ? ((totalGain / totalValue) * 100).toFixed(2) : "0.00"}%
                </p>
              </div>
            </div>

            {/* Charts */}
            {totalValue > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <PerformanceChart data={performanceData} title="Portfolio Performance (7 Days)" />
                {allocationData.length > 0 && <AllocationChart data={allocationData} title="Asset Allocation" />}
              </div>
            )}

            {/* Portfolios Grid */}
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold">Your Portfolios</h2>
                <Link href="/portfolio/new" className="btn-secondary text-sm">
                  + Add Another
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {portfolios.map((portfolio) => (
                  <Link
                    key={portfolio.id}
                    href={`/portfolio/${portfolio.id}`}
                    className="card hover:border-emerald-500/50 transition-all cursor-pointer"
                  >
                    <h3 className="text-lg font-bold mb-4 truncate">{portfolio.name}</h3>

                    <div className="space-y-3">
                      <div>
                        <p className="text-slate-400 text-xs md:text-sm">Value</p>
                        <p className="text-xl font-bold truncate">
                          ${parseFloat(portfolio.totalValue.toString()).toFixed(2)}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-400 text-xs md:text-sm">Gain/Loss</p>
                        <p className={`text-lg font-bold ${parseFloat(portfolio.totalGain.toString()) >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                          ${parseFloat(portfolio.totalGain.toString()).toFixed(2)} (
                          {parseFloat(portfolio.totalGainPct.toString()).toFixed(2)}%)
                        </p>
                      </div>

                      <div className="text-slate-400 text-xs md:text-sm">
                        {portfolio._count.transactions} transactions
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
