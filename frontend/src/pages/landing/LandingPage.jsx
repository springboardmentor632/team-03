import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ShieldCheck, Search, ArrowLeftRight, CheckCircle, Award, Landmark, User, FileText } from "lucide-react";

export default function LandingPage() {
  const { token, user } = useSelector((state) => state.auth);

  const getStartLink = () => {
    if (!token) return "/register";
    if (user?.role === "admin") return "/admin/dashboard";
    if (user?.role === "official") return "/government/dashboard";
    return "/dashboard";
  };

  return (
    <div className="bg-slate-50 text-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950 text-white py-24 md:py-32">
        <div className="page-wrapper text-center space-y-6 relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <ShieldCheck className="h-4.5 w-4.5" />
            <span>Secure Role-Based Governance Portal</span>
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight bg-gradient-to-r from-white via-slate-100 to-blue-400 bg-clip-text text-transparent">
            Government Policy & Public Scheme Intelligence
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            A secure unified environment for citizens to check scheme eligibility, and government officials to draft, audit, and approve public welfare policies.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to={getStartLink()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all text-sm"
            >
              Get Started Portal
            </Link>
            <Link
              to="/policies"
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-extrabold px-6 py-3.5 rounded-xl transition-all text-sm"
            >
              Browse Directory
            </Link>
          </div>
        </div>

        {/* Decorative Grid Backdrop */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </section>

      {/* Feature Grid */}
      <section className="page-wrapper py-16 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">Advanced Platform Capabilities</h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            Analyze welfare guidelines and policy requirements side-by-side using secure analytics engines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="bg-blue-50 text-blue-600 h-12 w-12 rounded-2xl flex items-center justify-center">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Intelligent Search Directory</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Instantly scan federal and state policy guidelines. Filter dynamically by categories, government departments, and state levels.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="bg-emerald-50 text-emerald-600 h-12 w-12 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Rule-Based Eligibility Matcher</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Evaluate matching criteria (age, residency state, category boundaries, income ceilings) and see detailed explanations of why you qualify.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="bg-purple-50 text-purple-600 h-12 w-12 rounded-2xl flex items-center justify-center">
              <ArrowLeftRight className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Side-by-Side Comparison</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Select multiple policies or schemes and align their benefits, target populations, application procedurals, and rules side-by-side.
            </p>
          </div>
        </div>
      </section>

      {/* Role Segments */}
      <section className="bg-slate-100 py-16">
        <div className="page-wrapper space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">Unified Portal Access Controls</h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              Proper Role-Based Access Control (RBAC) ensures data transparency and workflow verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Citizens */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/60 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <h3 className="font-bold text-slate-800">Citizen Console</h3>
                </div>
                <ul className="space-y-2 text-slate-500 text-xs font-semibold">
                  <li className="flex items-center gap-2">&bull; Update personal checker profile</li>
                  <li className="flex items-center gap-2">&bull; Instant eligibility reports</li>
                  <li className="flex items-center gap-2">&bull; Saved items & bookmarks</li>
                  <li className="flex items-center gap-2">&bull; Receive alert updates</li>
                </ul>
              </div>
              <Link to="/login" className="text-blue-600 font-bold text-xs mt-6 hover:underline flex items-center gap-1">
                <span>Citizen Login &rarr;</span>
              </Link>
            </div>

            {/* Officials */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/60 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Landmark className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-800">Official Console</h3>
                </div>
                <ul className="space-y-2 text-slate-500 text-xs font-semibold">
                  <li className="flex items-center gap-2">&bull; Draft policies and schemes</li>
                  <li className="flex items-center gap-2">&bull; Manage eligibility logic rules</li>
                  <li className="flex items-center gap-2">&bull; Submit / approve workflow</li>
                  <li className="flex items-center gap-2">&bull; Export PDF & Excel reports</li>
                </ul>
              </div>
              <Link to="/login" className="text-emerald-600 font-bold text-xs mt-6 hover:underline flex items-center gap-1">
                <span>Official Login &rarr;</span>
              </Link>
            </div>

            {/* Administrators */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/60 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-purple-600" />
                  <h3 className="font-bold text-slate-800">Admin Console</h3>
                </div>
                <ul className="space-y-2 text-slate-500 text-xs font-semibold">
                  <li className="flex items-center gap-2">&bull; Manage platform users & accounts</li>
                  <li className="flex items-center gap-2">&bull; Complete system audit trails</li>
                  <li className="flex items-center gap-2">&bull; Access system analytics</li>
                  <li className="flex items-center gap-2">&bull; Publish global notifications</li>
                </ul>
              </div>
              <Link to="/login" className="text-purple-600 font-bold text-xs mt-6 hover:underline flex items-center gap-1">
                <span>Admin Login &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <h2 className="text-2xl font-bold text-slate-800 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
            <h4 className="font-bold text-slate-800 text-sm">How is my scheme eligibility computed?</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              We check your profile parameters (age, state residency, social caste category, annual income, occupation) against constraints set by government departments. Any mismatch generates a breakdown in your report.
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
            <h4 className="font-bold text-slate-800 text-sm">Who has access to add policies?</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Only authorized Government Officials can draft policies. Once created, a policy goes through an approval queue. Only once approved by another official or admin is it published live to the public directory.
            </p>
          </div>
        </div>
      </section>
    </div>

  );
}