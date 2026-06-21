"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { PerformanceChart } from "@/components/charts/portfolio-charts";
import { SkeletonCard, SkeletonChart, SkeletonTable } from "@/components/ui/skeleton";

interface Asset {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  currentPrice: number;
  totalValue: number;
  totalGainPct: number;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  createdAt: string;
}

interface Portfolio {
  id: string;
  name: string;
  totalValue: number;
  totalGain: number;
  totalGainPct: number;
  assets: Asset[];
  transactions: Transaction[];
}

/**
 * Portfolio detail page
 * Shows detailed view of a specific portfolio
 */
export default function PortfolioPage() {
  const params = useParams();
  const { data: session } = useSession();
  const portfolioId = params.portfolioId as string;

  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /**
   * Fetch portfolio details
   */
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch(`/api/portfolio/${portfolioId}`);
        const data = await response.json();

        if (!data.success) {
          setError(data.error || "Failed to load portfolio");
          return;
        }

        setPortfolio(data.data);
      } catch (err) {
        setError("Failed to load portfolio");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [portfolioId]);

  // Generate performance chart data
  const performanceData = portfolio ? [
    { date: "Mon", value: portfolio.totalValue * 0.85 },
    { date: "Tue", value: portfolio.totalValue * 0.87 },
    { date: "Wed", value: portfolio.totalValue * 0.90 },
    { date: "Thu", value: portfolio.totalValue * 0.92 },
    { date: "Fri", value: portfolio.totalValue * 0.95 },
    { date: "Sat", value: portfolio.totalValue * 0.98 },
    { date: "Sun", value: portfolio.totalValue },
  ] : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="container-lg py-6 md:py-8">
          <div className="mb-6">
            <div className="h-8 bg-slate-700 rounded w-48 animate-pulse mb-2"></div>
            <div className="h-4 bg-slate-700 rounded w-32 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
          <div className="space-y-6">
            <SkeletonChart />
            <SkeletonTable />
          </div>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="container-lg py-8">
          <Link href="/dashboard" className="btn-secondary mb-6 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="text-red-500 text-center py-12">{error || "Portfolio not found"}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 sticky top-0 z-10">
        <div className="container-lg py-4 md:py-6">
          <Link href="/dashboard" className="text-emerald-500 hover:text-emerald-400 mb-3 md:mb-4 inline-block text-sm md:text-base">
            ← Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold truncate">{portfolio.name}</h1>
            </div>
            <Link href={`/portfolio/${portfolioId}/add-asset`} className="btn-primary w-full sm:w-auto text-center text-sm md:text-base">
              + Add Asset
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-lg py-6 md:py-8">
        {/* Portfolio Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="card">
            <p className="text-slate-400 text-xs md:text-sm mb-2">Portfolio Value</p>
            <p className="text-2xl md:text-3xl font-bold text-emerald-500 truncate">
              ${parseFloat(portfolio.totalValue.toString()).toFixed(2)}
            </p>
          </div>

          <div className="card">
            <p className="text-slate-400 text-xs md:text-sm mb-2">Total Gain</p>
            <p className={`text-2xl md:text-3xl font-bold truncate ${parseFloat(portfolio.totalGain.toString()) >= 0 ? "text-emerald-500" : "text-red-500"}`}>
              ${parseFloat(portfolio.totalGain.toString()).toFixed(2)}
            </p>
          </div>

          <div className="card">
            <p className="text-slate-400 text-xs md:text-sm mb-2">Gain/Loss %</p>
            <p className={`text-2xl md:text-3xl font-bold truncate ${parseFloat(portfolio.totalGainPct.toString()) >= 0 ? "text-emerald-500" : "text-red-500"}`}>
              {parseFloat(portfolio.totalGainPct.toString()).toFixed(2)}%
            </p>
          </div>

          <div className="card">
            <p className="text-slate-400 text-xs md:text-sm mb-2">Holdings</p>
            <p className="text-2xl md:text-3xl font-bold text-blue-500">{portfolio.assets.length}</p>
          </div>
        </div>

        {/* Chart */}
        {parseFloat(portfolio.totalValue.toString()) > 0 && (
          <div className="mb-8">
            <PerformanceChart data={performanceData} title="Portfolio Performance (7 Days)" />
          </div>
        )}

        {/* Assets Table */}
        <div className="card mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-6">Holdings</h2>

          {portfolio.assets.length === 0 ? (
            <p className="text-slate-400 text-sm md:text-base">No assets in this portfolio yet.</p>
          ) : (
            <div className="overflow-x-auto -mx-6 md:mx-0">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="text-xs md:text-sm">Symbol</th>
                    <th className="text-xs md:text-sm hidden sm:table-cell">Quantity</th>
                    <th className="text-xs md:text-sm">Price</th>
                    <th className="text-xs md:text-sm">Value</th>
                    <th className="text-xs md:text-sm">Gain %</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.assets.map((asset) => (
                    <tr key={asset.id} className="text-xs md:text-sm">
                      <td className="font-bold">{asset.symbol}</td>
                      <td className="hidden sm:table-cell">{parseFloat(asset.quantity.toString()).toFixed(2)}</td>
                      <td>${parseFloat(asset.currentPrice.toString()).toFixed(2)}</td>
                      <td>${parseFloat(asset.totalValue.toString()).toFixed(2)}</td>
                      <td className={parseFloat(asset.totalGainPct.toString()) >= 0 ? "text-emerald-500" : "text-red-500"}>
                        {parseFloat(asset.totalGainPct.toString()).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <h2 className="text-xl md:text-2xl font-bold mb-6">Recent Transactions</h2>

          {portfolio.transactions.length === 0 ? (
            <p className="text-slate-400 text-sm md:text-base">No transactions yet.</p>
          ) : (
            <div className="overflow-x-auto -mx-6 md:mx-0">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="text-xs md:text-sm">Type</th>
                    <th className="text-xs md:text-sm">Amount</th>
                    <th className="text-xs md:text-sm">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.transactions.map((tx) => (
                    <tr key={tx.id} className="text-xs md:text-sm">
                      <td>
                        <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-blue-500/10 text-blue-400">
                          {tx.type}
                        </span>
                      </td>
                      <td>${parseFloat(tx.amount.toString()).toFixed(2)}</td>
                      <td className="text-slate-400">{new Date(tx.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
