import { useState, useEffect } from "react";
import policyService from "../../services/policy.service";
import { toast, Toaster } from "react-hot-toast";
import { Award, Plus, Trash2, Edit2, Archive, Landmark, X, PlusCircle, Activity, ChevronDown } from "lucide-react";

export default function Schemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modals management
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [targetId, setTargetId] = useState(null);

  // Scheme update modal
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateContent, setUpdateContent] = useState("");

  // Base fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Healthcare");
  const [department, setDepartment] = useState("Department of Health");
  const [state, setState] = useState("Global");
  const [benefits, setBenefits] = useState("");
  const [applicationProcess, setApplicationProcess] = useState("");

  // Eligibility Rules
  const [ageMin, setAgeMin] = useState("0");
  const [ageMax, setAgeMax] = useState("120");
  const [gender, setGender] = useState("All");
  const [incomeMax, setIncomeMax] = useState("");
  const [ruleState, setRuleState] = useState("All");
  const [ruleCategory, setRuleCategory] = useState("All");
  const [occupation, setOccupation] = useState("All");
  const [education, setEducation] = useState("All");
  const [disabilityRequired, setDisabilityRequired] = useState(false);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const res = await policyService.getSchemes({ status: "" });
      setSchemes(res.schemes || []);
    } catch (err) {
      toast.error("Failed to load schemes database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  const openCreateModal = () => {
    setEditMode(false);
    setTitle("");
    setDescription("");
    setCategory("Healthcare");
    setDepartment("Department of Health");
    setState("Global");
    setBenefits("");
    setApplicationProcess("");

    setAgeMin("0");
    setAgeMax("120");
    setGender("All");
    setIncomeMax("");
    setRuleState("All");
    setRuleCategory("All");
    setOccupation("All");
    setEducation("All");
    setDisabilityRequired(false);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditMode(true);
    setTargetId(item._id);
    setTitle(item.title);
    setDescription(item.description);
    setCategory(item.category);
    setDepartment(item.department);
    setState(item.state || "Global");
    setBenefits(item.benefits || "");
    setApplicationProcess(item.applicationProcess || "");

    const rules = item.eligibilityRules || {};
    setAgeMin(rules.ageMin !== undefined ? String(rules.ageMin) : "0");
    setAgeMax(rules.ageMax !== undefined ? String(rules.ageMax) : "120");
    setGender(rules.gender || "All");
    setIncomeMax(rules.incomeMax !== undefined && rules.incomeMax !== null ? String(rules.incomeMax) : "");
    setRuleState(rules.state || "All");
    setRuleCategory(rules.category || "All");
    setOccupation(rules.occupation || "All");
    setEducation(rules.education || "All");
    setDisabilityRequired(rules.disabilityRequired || false);
    setShowModal(true);
  };

  const openUpdateModal = (id) => {
    setTargetId(id);
    setUpdateContent("");
    setShowUpdateModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return toast.error("Title and description are required");

    const payload = {
      title,
      description,
      category,
      department,
      state,
      benefits,
      applicationProcess,
      eligibilityRules: {
        ageMin: Number(ageMin),
        ageMax: Number(ageMax),
        gender,
        incomeMax: incomeMax ? Number(incomeMax) : null,
        state: ruleState,
        category: ruleCategory,
        occupation,
        education,
        disabilityRequired,
      },
    };

    try {
      if (editMode) {
        await policyService.updateScheme(targetId, payload);
        toast.success("Scheme updated successfully");
      } else {
        await policyService.createScheme(payload);
        toast.success("Scheme draft created successfully");
      }
      setShowModal(false);
      fetchSchemes();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save scheme criteria");
    }
  };

  const handlePostUpdate = async (e) => {
    e.preventDefault();
    if (!updateContent) return toast.error("Content is required");
    try {
      await policyService.addSchemeUpdate(targetId, updateContent);
      toast.success("Scheme bulletin updated successfully");
      setShowUpdateModal(false);
      fetchSchemes();
    } catch (err) {
      toast.error("Failed to add bulletin log");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this scheme?")) return;
    try {
      await policyService.deleteScheme(id);
      setSchemes(schemes.filter((s) => s._id !== id));
      toast.success("Scheme deleted successfully", {
        style: {
          background: "#22C55E",
          color: "white",
        },
        iconTheme: {
          primary: "#ffffff",
          secondary: "#22C55E",
        },
      });
    } catch (e) {
      toast.error("Failed to delete scheme");
    }
  };

  const handleWorkflow = async (id, action) => {
    try {
      if (action === "submit") {
        await policyService.submitSchemeApproval(id);
        toast.success("Submitted scheme for approval check");
      } else if (action === "archive") {
        await policyService.archiveScheme(id);
        toast.success("Scheme archived successfully");
      }
      fetchSchemes();
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  const categories = ["Healthcare", "Education", "Agriculture", "Finance", "Social Welfare", "Employment", "Housing"];

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Award className="h-6 w-6 text-purple-600" />
            <span>Public Welfare Schemes Database</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Configure eligibility matrices, add updates bulletins, and submit schemes for validation.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>New Scheme Draft</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-600">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-5 font-bold text-xs text-slate-400 uppercase tracking-wider">Scheme Name</th>
                  <th className="p-5 font-bold text-xs text-slate-400 uppercase tracking-wider">Department</th>
                  <th className="p-5 font-bold text-xs text-slate-400 uppercase tracking-wider">State</th>
                  <th className="p-5 font-bold text-xs text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="p-5 font-bold text-xs text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schemes.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-slate-400 font-semibold">
                      No schemes found. Start by creating a draft!
                    </td>
                  </tr>
                ) : (
                  schemes.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-5">
                        <p className="font-bold text-slate-800 text-sm truncate max-w-xs">{item.title}</p>
                        <p className="text-xxs text-slate-400 font-semibold mt-0.5">{item.category}</p>
                      </td>
                      <td className="p-5 font-medium text-slate-700">{item.department}</td>
                      <td className="p-5">
                        <span className="text-slate-500 font-semibold text-xs flex items-center gap-1">
                          <Landmark className="h-3.5 w-3.5" />
                          <span>{item.state || "Global"}</span>
                        </span>
                      </td>
                      <td className="p-5">
                        <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg uppercase tracking-wide ${
                          item.status === "approved"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : item.status === "pending_approval"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : item.status === "archived"
                            ? "bg-slate-100 text-slate-600 border border-slate-200"
                            : item.status === "revoked"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-slate-50 text-slate-700 border border-slate-200"
                        }`}>
                          {item.status?.replace("_", " ")}
                        </span>
                      </td>
                      <td className="p-5 text-right space-x-1.5 whitespace-nowrap">
                        {item.status === "draft" && (
                          <button
                            onClick={() => handleWorkflow(item._id, "submit")}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold px-2.5 py-1 rounded-lg text-xs"
                          >
                            Submit
                          </button>
                        )}
                        {item.status === "approved" && (
                          <>
                            <button
                              onClick={() => openUpdateModal(item._id)}
                              className="bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold p-1 rounded-lg"
                              title="Add Update Log"
                            >
                              <Activity className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleWorkflow(item._id, "archive")}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold p-1 rounded-lg"
                            >
                              <Archive className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => openEditModal(item)}
                          className="bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold p-1 rounded-lg border border-slate-200/50"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 font-bold p-1 rounded-lg"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 animate-gradient p-6 space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h2 className="font-extrabold text-slate-800 text-lg">
                {editMode ? "Modify Welfare Scheme" : "Create New Welfare Scheme"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-500">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Scheme Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-850 font-bold"
                    placeholder="e.g. Rural Farmer Tractor Subsidy"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full appearance-none bg-white border border-slate-200 text-slate-900 text-sm font-medium rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 transition-all duration-200 cursor-pointer [&>option]:bg-white [&>option]:text-slate-900"
                    >
                      {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" strokeWidth={2.5} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">State Boundaries</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    placeholder="Global"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description</label>
                <textarea
                  required
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium"
                ></textarea>
              </div>

              {/* Eligibility Rules */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h3 className="text-xs font-extrabold text-purple-600 uppercase tracking-wider">Configure Eligibility Constraints</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1">Min Age</label>
                    <input
                      type="number"
                      value={ageMin}
                      onChange={(e) => setAgeMin(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Max Age</label>
                    <input
                      type="number"
                      value={ageMax}
                      onChange={(e) => setAgeMax(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Max Income Cap (₹)</label>
                    <input
                      type="number"
                      value={incomeMax}
                      onChange={(e) => setIncomeMax(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                      placeholder="No limit"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <option value="All">All</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Transgender">Transgender</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1">Residency State</label>
                    <input
                      type="text"
                      value={ruleState}
                      onChange={(e) => setRuleState(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Caste/Category</label>
                    <select
                      value={ruleCategory}
                      onChange={(e) => setRuleCategory(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <option value="All">All Categories</option>
                      <option value="General">General</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Occupation Limit</label>
                    <input
                      type="text"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="createDisability"
                      checked={disabilityRequired}
                      onChange={(e) => setDisabilityRequired(e.target.checked)}
                      className="h-4.5 w-4.5 rounded text-purple-600 border-slate-300"
                    />
                    <label htmlFor="createDisability" className="text-slate-400">Needs Disability</label>
                  </div>
                </div>
              </div>

              {/* Extra panels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Benefits Details</label>
                  <textarea
                    rows="3"
                    value={benefits}
                    onChange={(e) => setBenefits(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">How to Apply Steps</label>
                  <textarea
                    rows="3"
                    value={applicationProcess}
                    onChange={(e) => setApplicationProcess(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium"
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-750 font-bold px-4 py-2 rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2 rounded-xl text-sm shadow-md cursor-pointer"
                >
                  {editMode ? "Save Changes" : "Create Draft"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scheme Updates Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h2 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Post Scheme Bulletin Update</h2>
              <button onClick={() => setShowUpdateModal(false)} className="text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handlePostUpdate} className="space-y-4">
              <div>
                <label className="block text-xxs font-bold text-slate-400 uppercase tracking-wider mb-1">Update Description</label>
                <textarea
                  required
                  rows="3"
                  value={updateContent}
                  onChange={(e) => setUpdateContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl text-xs"
                  placeholder="e.g. Budget allocation increased by 10% for FY 2026."
                ></textarea>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg text-xs"
                >
                  Post Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
