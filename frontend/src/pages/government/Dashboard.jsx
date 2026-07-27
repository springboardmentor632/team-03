import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import userService from "../../services/user.service";
import { FileText, Award, CheckSquare, Plus, RefreshCw, BarChart2, Shield } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    policies: { total: 0, approved: 0, pending: 0, draft: 0 },
    schemes: { total: 0, approved: 0, pending: 0, draft: 0 },
    breakdowns: { policyCategories: [], schemeCategories: [] },
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await userService.getGovernmentDashboard();
      if (res.success) {
        setStats(res);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span>Official Workspace Dashboard</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Monitor state-level policy pipelines, scheme approvals, and department logs.
          </p>
        </div>
        <button
          onClick={fetchDashboard}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Policies Widget */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex justify-between items-start">
            <div className="bg-blue-50 text-blue-600 h-12 w-12 rounded-xl flex items-center justify-center">
              <FileText className="h-6 w-6" />
            </div>
            <Link
              to="/government/policies"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> New Policy
            </Link>
          </div>
          <div>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Directives</span>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{stats.policies.total}</h3>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-center text-xs font-semibold">
            <div className="bg-slate-50 rounded-lg p-2">
              <p className="text-slate-400">Live</p>
              <p className="text-blue-600 font-bold mt-1">{stats.policies.approved}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-2">
              <p className="text-slate-400">Pending</p>
              <p className="text-orange-500 font-bold mt-1">{stats.policies.pending}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-2">
              <p className="text-slate-400">Drafts</p>
              <p className="text-slate-500 font-bold mt-1">{stats.policies.draft}</p>
            </div>
          </div>
        </div>

        {/* Schemes Widget */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex justify-between items-start">
            <div className="bg-blue-50 text-blue-600 h-12 w-12 rounded-xl flex items-center justify-center">
              <Award className="h-6 w-6" />
            </div>
            <Link
              to="/government/schemes"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> New Scheme
            </Link>
          </div>
          <div>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Welfare Schemes</span>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{stats.schemes.total}</h3>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-center text-xs font-semibold">
            <div className="bg-slate-50 rounded-lg p-2">
              <p className="text-slate-400">Live</p>
              <p className="text-blue-600 font-bold mt-1">{stats.schemes.approved}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-2">
              <p className="text-slate-400">Pending</p>
              <p className="text-orange-500 font-bold mt-1">{stats.schemes.pending}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-2">
              <p className="text-slate-400">Drafts</p>
              <p className="text-slate-500 font-bold mt-1">{stats.schemes.draft}</p>
            </div>
          </div>
        </div>

        {/* Workflow Approvals Queue */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-extrabold text-lg flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-blue-400" />
              <span>Approvals Queue</span>
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
              Verify drafts from colleague officials and move them into the published directory for general citizen checkers.
            </p>
          </div>
          <div className="flex justify-between items-center pt-4">
            <div>
              <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider">Awaiting approval</span>
              <p className="text-xl font-bold mt-0.5 text-blue-400">
                {stats.policies.pending + stats.schemes.pending} items
              </p>
            </div>
            <Link
              to="/government/approvals"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-lg text-xs transition-colors"
            >
              Open Queue
            </Link>
          </div>
        </div>
      </div>

      {/* Category Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 uppercase tracking-wider">
            <BarChart2 className="h-4.5 w-4.5 text-slate-400" />
            <span>Policies by Category</span>
          </h3>
          <div className="space-y-3 pt-2">
            {stats.breakdowns.policyCategories.length === 0 ? (
              <p className="text-slate-400 text-xs text-center py-8">No data registered.</p>
            ) : (
              stats.breakdowns.policyCategories.map((c) => (
                <div key={c._id} className="flex justify-between items-center text-xs py-2 px-3 bg-slate-50 rounded-lg">
                  <span className="font-semibold text-slate-600">{c._id || "Uncategorized"}</span>
                  <span className="bg-white border border-slate-200 font-semibold px-3 py-1 rounded-md text-slate-700">
                    {c.count} policies
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 uppercase tracking-wider">
            <BarChart2 className="h-4.5 w-4.5 text-slate-400" />
            <span>Schemes by Category</span>
          </h3>
          <div className="space-y-3 pt-2">
            {stats.breakdowns.schemeCategories.length === 0 ? (
              <p className="text-slate-400 text-xs text-center py-8">No data registered.</p>
            ) : (
              stats.breakdowns.schemeCategories.map((c) => (
                <div key={c._id} className="flex justify-between items-center text-xs py-2 px-3 bg-slate-50 rounded-lg">
                  <span className="font-semibold text-slate-600">{c._id || "Uncategorized"}</span>
                  <span className="bg-white border border-slate-200 font-semibold px-3 py-1 rounded-md text-slate-700">
                    {c.count} schemes
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
