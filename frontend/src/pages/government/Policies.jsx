import { useState, useEffect } from "react";
import policyService from "../../services/policy.service";
import { toast, Toaster } from "react-hot-toast";
import { FileText, Plus, Trash2, Edit2, CheckCircle2, Archive, Landmark, X, ChevronDown } from "lucide-react";

export default function Policies() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [targetId, setTargetId] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Healthcare");
  const [department, setDepartment] = useState("Department of Health");
  const [state, setState] = useState("Global");
  const [benefits, setBenefits] = useState("");
  const [applicationProcess, setApplicationProcess] = useState("");
  const [deadline, setDeadline] = useState("");

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      // Officials query all statuses
      const res = await policyService.getPolicies({ status: "" });
      setPolicies(res.policies || []);
    } catch (err) {
      toast.error("Failed to load policy inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
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
    setDeadline("");
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
    setDeadline(item.deadline ? item.deadline.slice(0, 10) : "");
    setShowModal(true);
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
      deadline: deadline || null,
    };

    try {
      if (editMode) {
        await policyService.updatePolicy(targetId, payload);
        toast.success("Policy updated successfully");
      } else {
        await policyService.createPolicy(payload);
        toast.success("Policy draft created successfully");
      }
      setShowModal(false);
      fetchPolicies();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save policy directive");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this policy?")) return;
    try {
      await policyService.deletePolicy(id);
      setPolicies(policies.filter((p) => p._id !== id));
      toast.success("Policy deleted successfully");
    } catch (e) {
      toast.error("Failed to delete policy");
    }
  };

  const handleWorkflow = async (id, action) => {
    try {
      if (action === "submit") {
        await policyService.submitPolicyApproval(id);
        toast.success("Submitted policy for official approval");
      } else if (action === "archive") {
        await policyService.archivePolicy(id);
        toast.success("Policy directive archived");
      }
      fetchPolicies();
    } catch (e) {
      toast.error("Failed to execute workflow action");
    }
  };

  const categories = ["Healthcare", "Education", "Agriculture", "Finance", "Social Welfare", "Employment", "Housing"];

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="h-6 w-6 text-emerald-600" />
            <span>Policy Directives Database</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Draft, edit, delete, and manage verification workflows for public policies.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>New Policy Draft</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-600">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-5 font-bold text-xs text-slate-400 uppercase tracking-wider">Policy Name</th>
                  <th className="p-5 font-bold text-xs text-slate-400 uppercase tracking-wider">Department</th>
                  <th className="p-5 font-bold text-xs text-slate-400 uppercase tracking-wider">Scope</th>
                  <th className="p-5 font-bold text-xs text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="p-5 font-bold text-xs text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {policies.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-slate-400 font-semibold">
                      No policy records found. Create a new draft!
                    </td>
                  </tr>
                ) : (
                  policies.map((item) => (
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
                          <button
                            onClick={() => handleWorkflow(item._id, "archive")}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold p-1 rounded-lg"
                            title="Archive Directive"
                          >
                            <Archive className="h-3.5 w-3.5" />
                          </button>
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

      {/* Editor Modal Dialog Sheet */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 animate-gradient p-6 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h2 className="font-extrabold text-slate-800 text-lg">
                {editMode ? "Modify Policy Directive" : "Compose New Policy Directive"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-500">
              <div>
                <label className="block text-slate-400 mb-1">Policy Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800 font-bold"
                  placeholder="e.g. National Healthcare Accessibility Act"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Brief Description</label>
                <textarea
                  required
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none text-slate-700 font-medium"
                  placeholder="Summarize the core directive guidelines..."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <div>
                  <label className="block text-slate-400 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-850"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Residency State Scope</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    placeholder="Global"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Benefits Details (Optional)</label>
                  <textarea
                    rows="3"
                    value={benefits}
                    onChange={(e) => setBenefits(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
                    placeholder="Specify financial or social advantages..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Application Procedure (Optional)</label>
                  <textarea
                    rows="3"
                    value={applicationProcess}
                    onChange={(e) => setApplicationProcess(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
                    placeholder="Describe how to register or apply..."
                  ></textarea>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Closing Application Deadline (Optional)</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-sm shadow-md cursor-pointer"
                >
                  {editMode ? "Save Changes" : "Create Draft"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
