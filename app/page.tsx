import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Home page
 * Landing page for unauthenticated users
 */
export default async function HomePage() {
  const session = await auth();

  // Redirect authenticated users to dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-slate">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="container-lg flex flex-col sm:flex-row items-center justify-between py-3 sm:py-4 gap-4 sm:gap-0">
          <h1 className="text-xl md:text-2xl font-bold text-emerald-500">Fortress Fund</h1>
          <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
            <Link href="/login" className="btn-secondary flex-1 sm:flex-initial text-center text-sm md:text-base py-2 md:py-2">
              Sign In
            </Link>
            <Link href="/register" className="btn-primary flex-1 sm:flex-initial text-center text-sm md:text-base py-2 md:py-2">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container-lg py-12 md:py-20">
        <div className="max-w-3xl mx-auto text-center px-4 md:px-0">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">
            AI-Powered Investment & Wealth Management
          </h2>
          <p className="text-base md:text-xl text-slate-400 mb-6 md:mb-8 leading-relaxed">
            Fortress Fund combines modern financial tools, AI-driven insights, and enterprise-grade
            security to help you grow and manage your wealth with confidence.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/register" className="btn-primary px-6 md:px-8 py-2 md:py-3 text-base md:text-lg text-center">
              Get Started Free
            </Link>
            <Link href="/login" className="btn-secondary px-6 md:px-8 py-2 md:py-3 text-base md:text-lg text-center">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-900/50 py-12 md:py-20 border-t border-slate-800">
        <div className="container-lg px-4 md:px-0">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Why Choose Fortress Fund?</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Feature 1 */}
            <div className="card">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="text-lg md:text-xl font-bold mb-2">Portfolio Management</h4>
              <p className="text-slate-400 text-sm md:text-base">
                Easily track and manage multiple investment portfolios in one place
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h4 className="text-lg md:text-xl font-bold mb-2">AI Assistant</h4>
              <p className="text-slate-400 text-sm md:text-base">
                Get AI-powered financial insights and investment recommendations
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔐</span>
              </div>
              <h4 className="text-lg md:text-xl font-bold mb-2">Enterprise Security</h4>
              <p className="text-slate-400 text-sm md:text-base">
                Your data is protected with industry-leading security standards
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h4 className="text-lg md:text-xl font-bold mb-2">Real-time Analytics</h4>
              <p className="text-slate-400 text-sm md:text-base">
                Track portfolio performance with interactive charts and insights
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="text-lg md:text-xl font-bold mb-2">Fast & Responsive</h4>
              <p className="text-slate-400 text-sm md:text-base">
                Lightning-fast performance on desktop, tablet, and mobile devices
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💼</span>
              </div>
              <h4 className="text-lg md:text-xl font-bold mb-2">Professional Dashboard</h4>
              <p className="text-slate-400 text-sm md:text-base">
                Premium interface designed for serious investors and traders
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-lg py-12 md:py-20 text-center px-4 md:px-0">
        <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Ready to take control of your investments?</h3>
        <p className="text-slate-400 mb-6 md:mb-8 text-sm md:text-base">
          Join thousands of investors using Fortress Fund to grow their wealth
        </p>
        <Link href="/register" className="btn-primary px-8 md:px-12 py-3 md:py-4 text-base md:text-lg inline-block">
          Start Your Free Account
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-6 md:py-8">
        <div className="container-lg text-center text-slate-500 text-xs md:text-sm px-4 md:px-0">
          <p>© 2026 Fortress Fund. All rights reserved.</p>
          <div className="mt-4 space-x-4 text-slate-400">
            <Link href="#" className="hover:text-slate-100 transition-colors">Privacy</Link>
            <span>•</span>
            <Link href="#" className="hover:text-slate-100 transition-colors">Terms</Link>
            <span>•</span>
            <Link href="#" className="hover:text-slate-100 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
