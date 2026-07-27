import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import policyService from "../../services/policy.service";
import { toast, Toaster } from "react-hot-toast";
import { ShieldCheck, HelpCircle, CheckCircle2, XCircle, ChevronDown, ChevronUp, UserCheck } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function Eligibility() {
  const { user } = useSelector((state) => state.auth);

  // Form states
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [income, setIncome] = useState("");
  const [state, setState] = useState("Bihar");
  const [occupation, setOccupation] = useState("Farmer");
  const [education, setEducation] = useState("10th Pass");
  const [category, setCategory] = useState("General");
  const [disability, setDisability] = useState(false);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const loadProfile = () => {
    if (user && user.profile) {
      const p = user.profile;
      setAge(p.age !== null ? String(p.age) : "");
      setGender(p.gender || "Male");
      setIncome(p.income !== null ? String(p.income) : "");
      setState(p.state || "Bihar");
      setOccupation(p.occupation || "Farmer");
      setEducation(p.education || "10th Pass");
      setCategory(p.category || "General");
      setDisability(p.disability || false);
      toast.success("Loaded profile parameters successfully");
    } else {
      toast.error("Please login to auto-load your profile attributes");
    }
  };

  useEffect(() => {
    if (user && user.profile) {
      loadProfile();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!age || !income) {
      return toast.error("Please enter age and annual income");
    }

    setLoading(true);
    try {
      const payload = {
        age: Number(age),
        gender,
        income: Number(income),
        state,
        occupation,
        education,
        category,
        disability,
      };

      setLoading(true);
      const res = await policyService.checkEligibility(payload);
      setLoading(false);
      if (res.success) {
        setResults(res.results || []);
        toast.success(`Evaluated schemes. Found matches.`);
      }
    } catch (err) {
      toast.error("Failed to run eligibility evaluation");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const eligibleSchemes = results.filter((r) => r.isEligible);
  const ineligibleSchemes = results.filter((r) => !r.isEligible);

  return (
    <div className="page-wrapper py-8 space-y-8">
      <Toaster position="top-right" />
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
            <span>Welfare Scheme Eligibility Checker</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Provide your demographic details below to instantly evaluate matching government welfare schemes.
          </p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form panel */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Parameters Form</h2>
            {user && (
              <button
                onClick={loadProfile}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <UserCheck className="h-4.5 w-4.5" />
                <span>Load Profile</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Age (Years)</label>
              <input
                type="number"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g. 25"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Transgender">Transgender</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Annual Income (₹)</label>
              <input
                type="number"
                required
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g. 150000"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">State Residency</label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                placeholder="Bihar"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Occupation</label>
              <input
                type="text"
                required
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                placeholder="Farmer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Education Level</label>
              <input
                type="text"
                required
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                placeholder="10th Pass"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Social Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
              >
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="checkerDisability"
                checked={disability}
                onChange={(e) => setDisability(e.target.checked)}
                className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
              />
              <label htmlFor="checkerDisability" className="text-xs font-bold text-slate-500">
                Has Disability status
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-sm shadow-md transition-all pt-3 cursor-pointer"
            >
              {loading ? <LoadingSpinner size={20} color="#fff" /> : "Evaluate Eligibility"}
            </button>
          </form>
        </div>

        {/* Results panel */}
        <div className="lg:col-span-2 space-y-6">
          {results.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm space-y-4">
              <HelpCircle className="h-12 w-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-700">No Assessment Loaded</h3>
              <p className="text-slate-400 text-sm max-w-sm mx-auto">
                Fill in the demographic parameters form and click Evaluate to see matches.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Eligible Schemes */}
              <div className="space-y-3">
                <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="h-4.5 w-4.5" />
                  <span>Eligible Schemes ({eligibleSchemes.length})</span>
                </h2>
                {eligibleSchemes.length === 0 ? (
                  <div className="bg-white p-4 text-center rounded-2xl text-slate-400 border border-slate-100 text-sm">
                    No schemes found matching your configuration.
                  </div>
                ) : (
                  eligibleSchemes.map((item) => (
                    <div
                      key={item.schemeId}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                    >
                      <div
                        onClick={() => toggleExpand(item.schemeId)}
                        className="p-5 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <div>
                          <span className="bg-emerald-50 text-emerald-600 text-xxs font-bold px-2 py-0.5 rounded-full uppercase">
                            {item.category}
                          </span>
                          <h3 className="font-bold text-slate-800 text-sm mt-1.5">{item.title}</h3>
                          <p className="text-slate-400 text-xxs font-semibold mt-0.5">{item.department}</p>
                        </div>
                        {expandedId === item.schemeId ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                      </div>

                      {expandedId === item.schemeId && (
                        <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-3">
                          <div>
                            <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider">Benefits</span>
                            <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">{item.benefits}</p>
                          </div>
                          <div>
                            <span className="text-xxs font-bold text-emerald-600 uppercase tracking-wider">Why you match</span>
                            <ul className="list-disc pl-4 text-slate-600 text-xs space-y-1 mt-1 font-medium">
                              {item.reasons.map((r, idx) => <li key={idx}>{r}</li>)}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Ineligible Schemes */}
              <div className="space-y-3">
                <h2 className="text-sm font-bold text-red-500 uppercase tracking-wider flex items-center gap-1.5">
                  <XCircle className="h-4.5 w-4.5" />
                  <span>Ineligible Schemes ({ineligibleSchemes.length})</span>
                </h2>
                {ineligibleSchemes.length === 0 ? (
                  <div className="bg-white p-4 text-center rounded-2xl text-slate-400 border border-slate-100 text-sm">
                    None of the schemes are ineligible. Awesome!
                  </div>
                ) : (
                  ineligibleSchemes.map((item) => (
                    <div
                      key={item.schemeId}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                    >
                      <div
                        onClick={() => toggleExpand(item.schemeId)}
                        className="p-5 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <div>
                          <span className="bg-slate-100 text-slate-500 text-xxs font-bold px-2 py-0.5 rounded-full uppercase">
                            {item.category}
                          </span>
                          <h3 className="font-bold text-slate-800 text-sm mt-1.5">{item.title}</h3>
                        </div>
                        {expandedId === item.schemeId ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                      </div>

                      {expandedId === item.schemeId && (
                        <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-3">
                          <div>
                            <span className="text-xxs font-bold text-red-500 uppercase tracking-wider">Unmatched Parameters</span>
                            <ul className="list-disc pl-4 text-red-600 text-xs space-y-1.5 mt-1 font-semibold">
                              {item.failures.map((f, idx) => <li key={idx}>{f}</li>)}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
