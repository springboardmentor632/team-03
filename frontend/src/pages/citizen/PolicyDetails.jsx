import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import policyService from "../../services/policy.service";
import { ArrowLeft, Calendar, FileText, Landmark, User, Award, CheckCircle } from "lucide-react";

export default function PolicyDetails() {
  const { id } = useParams();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await policyService.getPolicyById(id);
        if (res.success) {
          setPolicy(res.policy);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load policy details");
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

  if (error || !policy) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center space-y-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-semibold">
          {error || "Policy details not found"}
        </div>
        <Link to="/policies" className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Policies Search</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link to="/policies" className="text-slate-500 hover:text-slate-800 font-semibold text-sm inline-flex items-center gap-1.5 mb-2">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to search</span>
      </Link>

      {/* Main card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
        <div className="space-y-3.5">
          <div className="flex items-center gap-2">
            <span className="bg-blue-50 text-blue-600 text-xxs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {policy.category}
            </span>
            <span className="bg-slate-100 text-slate-600 text-xxs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Landmark className="h-3 w-3" />
              <span>{policy.state === "Global" ? "Federal / Global" : policy.state}</span>
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
            {policy.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-1.5">
              <Landmark className="h-4 w-4" /> {policy.department}
            </span>
            {policy.deadline && (
              <span className="flex items-center gap-1.5 text-red-500">
                <Calendar className="h-4 w-4" /> Deadline: {new Date(policy.deadline).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>Policy Description</span>
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{policy.description}</p>
        </div>

        {policy.benefits && (
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-600" />
              <span>Benefits Summary</span>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{policy.benefits}</p>
          </div>
        )}

        {policy.applicationProcess && (
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-indigo-600" />
              <span>Application Procedure</span>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{policy.applicationProcess}</p>
          </div>
        )}

        {/* Workflow Approval Metadata */}
        <div className="pt-6 mt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-500 bg-slate-50 p-4 rounded-2xl">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400" />
            <div>
              <p className="font-semibold text-slate-400">Created By</p>
              <p className="text-slate-700 font-bold mt-0.5">{policy.createdBy?.name || "Official Operator"}</p>
            </div>
          </div>
          {policy.approvedBy && (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <div>
                <p className="font-semibold text-slate-400">Approved & Verified By</p>
                <p className="text-slate-700 font-bold mt-0.5">{policy.approvedBy?.name}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
