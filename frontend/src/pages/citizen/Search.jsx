import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import policyService from "../../services/policy.service";
import userService from "../../services/user.service";
import { toast, Toaster } from "react-hot-toast";
import { Search as SearchIcon, Filter, Bookmark, Award, FileText, ArrowLeftRight, ArrowRight, ChevronDown } from "lucide-react";

export default function Search() {
  const location = useLocation();
  const isSchemesMode = location.pathname.includes("schemes");

  // Tab management
  const [activeTab, setActiveTab] = useState(isSchemesMode ? "schemes" : "policies");

  // Filter states
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [department, setDepartment] = useState("");
  const [state, setState] = useState("");

  const [policies, setPolicies] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [savedPolicies, setSavedPolicies] = useState([]);
  const [savedSchemes, setSavedSchemes] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sync tab with pathname changes
  useEffect(() => {
    setActiveTab(location.pathname.includes("schemes") ? "schemes" : "policies");
  }, [location]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (department) params.department = department;
      if (state) params.state = state;

      if (activeTab === "policies") {
        const res = await policyService.getPolicies(params);
        setPolicies(res.policies || []);
      } else {
        const res = await policyService.getSchemes(params);
        setSchemes(res.schemes || []);
      }
    } catch (err) {
      toast.error("Failed to load list data");
    } finally {
      setLoading(false);
    }
  };

  const fetchSaved = async () => {
    try {
      const res = await userService.getSavedItems();
      if (res.success) {
        setSavedPolicies(res.savedPolicies.map((p) => p._id));
        setSavedSchemes(res.savedSchemes.map((s) => s._id));
      }
    } catch (e) {
      // Ignore
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab, category, department, state]);

  useEffect(() => {
    fetchSaved();
    // Load local compare list
    const savedCompare = localStorage.getItem("compareList");
    if (savedCompare) setCompareList(JSON.parse(savedCompare));
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
    // Save to user search history if search string isn't empty
    if (search.trim()) {
      userService.addSearchQuery(search.trim()).catch(() => {});
    }
  };

  const handleBookmark = async (id, isPolicy) => {
    try {
      if (isPolicy) {
        const isSaved = savedPolicies.includes(id);
        if (isSaved) {
          await userService.unsavePolicy(id);
          setSavedPolicies(savedPolicies.filter((pid) => pid !== id));
          toast.success("Policy removed from saved bookmarks");
        } else {
          await userService.savePolicy(id);
          setSavedPolicies([...savedPolicies, id]);
          toast.success("Policy bookmarked successfully");
        }
      } else {
        const isSaved = savedSchemes.includes(id);
        if (isSaved) {
          await userService.unsaveScheme(id);
          setSavedSchemes(savedSchemes.filter((sid) => sid !== id));
          toast.success("Scheme removed from saved bookmarks");
        } else {
          await userService.saveScheme(id);
          setSavedSchemes([...savedSchemes, id]);
          toast.success("Scheme bookmarked successfully");
        }
      }
    } catch (err) {
      toast.error("Failed to update bookmark parameters");
    }
  };

  const toggleCompare = (item, isPolicy) => {
    const compareItem = {
      _id: item._id,
      title: item.title,
      category: item.category,
      department: item.department,
      benefits: item.benefits,
      applicationProcess: item.applicationProcess,
      eligibilityRules: item.eligibilityRules,
      type: isPolicy ? "policy" : "scheme",
    };

    let updatedList = [...compareList];
    const existsIndex = compareList.findIndex((x) => x._id === item._id);

    if (existsIndex > -1) {
      updatedList.splice(existsIndex, 1);
      toast.success("Removed from comparison list");
    } else {
      if (compareList.length >= 3) {
        return toast.error("You can compare up to 3 items at a time");
      }
      updatedList.push(compareItem);
      toast.success("Added to comparison list");
    }

    setCompareList(updatedList);
    localStorage.setItem("compareList", JSON.stringify(updatedList));
  };

  const categories = ["Healthcare", "Education", "Agriculture", "Finance", "Social Welfare", "Employment", "Housing"];
  const departments = ["Department of Health", "Department of Education", "Ministry of Agriculture", "Ministry of Finance", "Ministry of Social Justice"];
  const states = ["Global", "Bihar", "Uttar Pradesh", "Maharashtra", "Tamil Nadu", "Karnataka", "Delhi"];

  return (
    <div className="page-wrapper py-8 space-y-6">
      <Toaster position="top-right" />
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 capitalize">
          Search Government {activeTab}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Explore policies and scheme eligibility parameters. Select multiple items to compare benefits.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <Link
          to="/policies"
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
            activeTab === "policies"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
          onClick={() => setActiveTab("policies")}
        >
          Policies
        </Link>
        <Link
          to="/schemes"
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
            activeTab === "schemes"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
          onClick={() => setActiveTab("schemes")}
        >
          Welfare Schemes
        </Link>
      </div>

      {/* Search Bar & Filters */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab} by keyword...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Search</span>
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Category</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none bg-white border border-slate-200 text-slate-900 text-sm font-medium rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 transition-all duration-200 cursor-pointer [&>option]:bg-white [&>option]:text-slate-900"
              >
                <option value="">All Categories</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" strokeWidth={2.5} />
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Department</label>
            <div className="relative">
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full appearance-none bg-white border border-slate-200 text-slate-900 text-sm font-medium rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 transition-all duration-200 cursor-pointer [&>option]:bg-white [&>option]:text-slate-900"
              >
                <option value="">All Departments</option>
                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" strokeWidth={2.5} />
            </div>
          </div>

          {/* State */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Residency State</label>
            <div className="relative">
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full appearance-none bg-white border border-slate-200 text-slate-900 text-sm font-medium rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 transition-all duration-200 cursor-pointer [&>option]:bg-white [&>option]:text-slate-900"
              >
                <option value="">All States / Global</option>
                {states.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>

      {/* Results grid */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Search Results ({activeTab === "policies" ? policies.length : schemes.length})
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeTab === "policies"
              ? policies.map((item) => {
                  const isSaved = savedPolicies.includes(item._id);
                  const isComparing = compareList.some((x) => x._id === item._id);
                  return (
                    <div
                      key={item._id}
                      className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <span className="bg-blue-50 text-blue-600 text-xxs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {item.category}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleCompare(item, true)}
                              title="Compare Policy"
                              className={`p-1.5 rounded-lg border transition-all ${
                                isComparing ? "bg-orange-50 border-orange-200 text-orange-600" : "bg-slate-50 border-slate-100 text-slate-400 hover:text-slate-600"
                              }`}
                            >
                              <ArrowLeftRight className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleBookmark(item._id, true)}
                              title="Save Policy"
                              className={`p-1.5 rounded-lg border transition-all ${
                                isSaved ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-slate-50 border-slate-100 text-slate-400 hover:text-slate-600"
                              }`}
                            >
                              <Bookmark className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <h3 className="font-extrabold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-slate-500 text-sm line-clamp-3">{item.description}</p>
                      </div>

                      <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-semibold">
                        <span>{item.department}</span>
                        <Link
                          to={`/policies/${item._id}`}
                          className="text-blue-600 hover:text-blue-700 flex items-center gap-1.5 group/link font-bold text-sm"
                        >
                          <span>Details</span>
                          <ArrowRight className="h-4 w-4 transform group-hover/link:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  );
                })
              : schemes.map((item) => {
                  const isSaved = savedSchemes.includes(item._id);
                  const isComparing = compareList.some((x) => x._id === item._id);
                  return (
                    <div
                      key={item._id}
                      className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <span className="bg-purple-50 text-purple-600 text-xxs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {item.category}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleCompare(item, false)}
                              title="Compare Scheme"
                              className={`p-1.5 rounded-lg border transition-all ${
                                isComparing ? "bg-orange-50 border-orange-200 text-orange-600" : "bg-slate-50 border-slate-100 text-slate-400 hover:text-slate-600"
                              }`}
                            >
                              <ArrowLeftRight className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleBookmark(item._id, false)}
                              title="Save Scheme"
                              className={`p-1.5 rounded-lg border transition-all ${
                                isSaved ? "bg-purple-50 border-purple-200 text-purple-600" : "bg-slate-50 border-slate-100 text-slate-400 hover:text-slate-600"
                              }`}
                            >
                              <Bookmark className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <h3 className="font-extrabold text-slate-800 text-lg group-hover:text-purple-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-slate-500 text-sm line-clamp-3">{item.description}</p>
                      </div>

                      <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-semibold">
                        <span>{item.department}</span>
                        <Link
                          to={`/schemes/${item._id}`}
                          className="text-purple-600 hover:text-purple-700 flex items-center gap-1.5 group/link font-bold text-sm"
                        >
                          <span>Details</span>
                          <ArrowRight className="h-4 w-4 transform group-hover/link:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
          </div>

          {((activeTab === "policies" && policies.length === 0) || (activeTab === "schemes" && schemes.length === 0)) && (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
              <p className="text-slate-400 font-medium">No results found matching your search parameters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
