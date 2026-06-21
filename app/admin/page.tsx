"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { SkeletonCard, SkeletonTable } from "@/components/ui/skeleton";

interface UserStats {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  lastLoginAt: string | null;
  _count: { portfolios: number };
}

/**
 * Admin dashboard page
 * Administrative interface for user management and platform analytics
 */
export default function AdminPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterRole, setFilterRole] = useState<"ALL" | "ADMIN" | "USER">("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Redirect if not admin
  useEffect(() => {
    if (session && session.user.role !== "ADMIN") {
      redirect("/dashboard");
    }
  }, [session]);

  /**
   * Load users on mount
   */
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetch("/api/admin/users");
        const data = await response.json();

        if (data.success) {
          setUsers(data.data);
        } else {
          setError(data.error || "Failed to load users");
        }
      } catch (err) {
        setError("Failed to load users");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Filter and search users
  const filteredUsers = users.filter((user) => {
    const matchesRole = filterRole === "ALL" || user.role === filterRole;
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  const totalUsers = users.length;
  const totalPortfolios = users.reduce((sum, u) => sum + u._count.portfolios, 0);
  const activeUsers = users.filter((u) => u.lastLoginAt).length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 sticky top-0 z-10">
        <div className="container-lg py-4 md:py-6">
          <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm md:text-base mt-1">Platform administration and user management</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-lg py-6 md:py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <div className="card">
              <p className="text-slate-400 text-xs md:text-sm mb-2">Total Users</p>
              <p className="text-2xl md:text-3xl font-bold text-emerald-500">{totalUsers}</p>
            </div>

            <div className="card">
              <p className="text-slate-400 text-xs md:text-sm mb-2">Active Users</p>
              <p className="text-2xl md:text-3xl font-bold text-blue-500">{activeUsers}</p>
            </div>

            <div className="card">
              <p className="text-slate-400 text-xs md:text-sm mb-2">Total Portfolios</p>
              <p className="text-2xl md:text-3xl font-bold text-purple-500">{totalPortfolios}</p>
            </div>

            <div className="card">
              <p className="text-slate-400 text-xs md:text-sm mb-2">Admin Users</p>
              <p className="text-2xl md:text-3xl font-bold text-red-500">{adminCount}</p>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="card">
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold mb-4">User Management</h2>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* Search */}
              <input
                type="text"
                placeholder="Search by email or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input text-sm md:text-base"
              />

              {/* Role Filter */}
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as "ALL" | "ADMIN" | "USER")}
                className="input text-sm md:text-base"
              >
                <option value="ALL">All Users</option>
                <option value="ADMIN">Admins Only</option>
                <option value="USER">Regular Users</option>
              </select>
            </div>
          </div>

          {loading ? (
            <SkeletonTable />
          ) : filteredUsers.length === 0 ? (
            <p className="text-slate-400 text-sm md:text-base text-center py-8">No users found.</p>
          ) : (
            <div className="overflow-x-auto -mx-6 md:mx-0">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="text-xs md:text-sm">Email</th>
                    <th className="text-xs md:text-sm hidden sm:table-cell">Name</th>
                    <th className="text-xs md:text-sm">Role</th>
                    <th className="text-xs md:text-sm hidden md:table-cell">Portfolios</th>
                    <th className="text-xs md:text-sm hidden lg:table-cell">Joined</th>
                    <th className="text-xs md:text-sm hidden lg:table-cell">Last Login</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="text-xs md:text-sm">
                      <td className="font-mono truncate">{user.email}</td>
                      <td className="hidden sm:table-cell">{user.name || "-"}</td>
                      <td>
                        <span
                          className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                            user.role === "ADMIN"
                              ? "bg-red-500/10 text-red-400"
                              : "bg-blue-500/10 text-blue-400"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="hidden md:table-cell">{user._count.portfolios}</td>
                      <td className="hidden lg:table-cell text-slate-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="hidden lg:table-cell text-slate-400">
                        {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : "Never"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Results Count */}
          {!loading && filteredUsers.length > 0 && (
            <div className="mt-4 text-slate-400 text-xs md:text-sm">
              Showing {filteredUsers.length} of {totalUsers} users
            </div>
          )}
        </div>

        {/* User Statistics Section */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Activity Distribution */}
            <div className="card">
              <h3 className="text-lg font-bold mb-4">User Activity</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span>Active (logged in last 30 days)</span>
                  <span className="font-bold text-emerald-500">{activeUsers}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Inactive</span>
                  <span className="font-bold text-yellow-500">{totalUsers - activeUsers}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 mt-4">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: totalUsers > 0 ? `${(activeUsers / totalUsers) * 100}%` : "0%" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Portfolio Statistics */}
            <div className="card">
              <h3 className="text-lg font-bold mb-4">Portfolio Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span>Total Portfolios</span>
                  <span className="font-bold text-blue-500">{totalPortfolios}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Average per User</span>
                  <span className="font-bold text-purple-500">
                    {totalUsers > 0 ? (totalPortfolios / totalUsers).toFixed(2) : "0"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Users with Portfolios</span>
                  <span className="font-bold text-cyan-500">
                    {users.filter((u) => u._count.portfolios > 0).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
