import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import policyService from "../../services/policy.service";
import { ArrowLeft, Landmark, Award, ShieldCheck, HelpCircle, Activity, User, BookOpen } from "lucide-react";

export default function SchemeDetails() {
  const { id } = useParams();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await policyService.getSchemeById(id);
        if (res.success) {
          setScheme(res.scheme);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load scheme details");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] px-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center space-y-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-semibold">
          {error || "Scheme details not found"}
        </div>
        <Link to="/schemes" className="text-purple-600 font-bold hover:underline inline-flex items-center gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Schemes Search</span>
        </Link>
      </div>
    );
  }

  const rules = scheme.eligibilityRules || {};

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link to="/schemes" className="text-slate-500 hover:text-slate-800 font-semibold text-sm inline-flex items-center gap-1.5 mb-2">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to search</span>
      </Link>

      {/* Main Container */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
        <div className="space-y-3.5">
          <div className="flex items-center gap-2">
            <span className="bg-purple-50 text-purple-600 text-xxs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {scheme.category}
            </span>
            <span className="bg-slate-100 text-slate-600 text-xxs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Landmark className="h-3 w-3" />
              <span>{scheme.state === "Global" ? "Federal / Global" : scheme.state}</span>
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
            {scheme.title}
          </h1>
          <div className="flex items-center gap-4 text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-1.5">
              <Landmark className="h-4 w-4" /> {scheme.department}
            </span>
          </div>
        </div>

        {/* Eligibility Criteria Cards */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-purple-600" />
            <span>Eligibility Requirements</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Age Limit</span>
              <p className="text-slate-700 font-extrabold mt-0.5 text-sm">
                {rules.ageMin || 0} - {rules.ageMax || 120} yrs
              </p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Gender limit</span>
              <p className="text-slate-700 font-extrabold mt-0.5 text-sm">{rules.gender || "All"}</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Max Income</span>
              <p className="text-slate-700 font-extrabold mt-0.5 text-sm">
                {rules.incomeMax ? `₹${rules.incomeMax}` : "No Max Limit"}
              </p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Caste/Category</span>
              <p className="text-slate-700 font-extrabold mt-0.5 text-sm">{rules.category || "All"}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Disability status</span>
              <p className="text-slate-700 font-extrabold mt-0.5 text-sm">{rules.disabilityRequired ? "Required" : "Not Required"}</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Occupation</span>
              <p className="text-slate-700 font-extrabold mt-0.5 text-sm">{rules.occupation || "All"}</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 col-span-2">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Education Requirement</span>
              <p className="text-slate-700 font-extrabold mt-0.5 text-sm truncate">{rules.education || "All"}</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <span>Scheme Description</span>
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{scheme.description}</p>
        </div>

        {scheme.benefits && (
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-600" />
              <span>Scheme Benefits</span>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{scheme.benefits}</p>
          </div>
        )}

        {scheme.applicationProcess && (
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-indigo-600" />
              <span>How to Apply</span>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{scheme.applicationProcess}</p>
          </div>
        )}

        {/* Updates Feed */}
        {scheme.updates && scheme.updates.length > 0 && (
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-600" />
              <span>News & Scheme Updates</span>
            </h2>
            <div className="space-y-3.5">
              {scheme.updates.map((update) => (
                <div key={update._id} className="border-l-4 border-orange-500 pl-4 py-1.5 bg-orange-50/20 rounded-r-xl">
                  <span className="text-xxs font-bold text-slate-400">{new Date(update.date).toLocaleDateString()}</span>
                  <p className="text-slate-700 text-sm font-semibold mt-0.5">{update.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Officer info */}
        <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-4 rounded-2xl">
          <User className="h-4 w-4 text-slate-400" />
          <div>
            <p className="font-semibold text-slate-400">Authorized Official Creator</p>
            <p className="text-slate-700 font-bold mt-0.5">{scheme.createdBy?.name || "Official operator"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
