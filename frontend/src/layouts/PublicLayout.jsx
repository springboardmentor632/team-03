import { Outlet, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";
import { useState } from "react";
import { ShieldCheck, Menu, X, LogOut, LayoutDashboard, FileText, Award, HelpCircle } from "lucide-react";

export default function PublicLayout() {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const getDashboardLink = () => {
    if (!user) return "/dashboard";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "official") return "/government/dashboard";
    return "/dashboard";
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="page-wrapper h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 text-blue-600 font-extrabold text-xl tracking-tight">
            <ShieldCheck className="h-6 w-6 stroke-[2.5]" />
            <span>GovIntel Platform</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10 font-medium text-slate-600">
            <Link to="/policies" className="hover:text-blue-600 transition-colors flex items-center gap-2">
              <FileText className="h-4 w-4" /> Policies
            </Link>
            <Link to="/schemes" className="hover:text-blue-600 transition-colors flex items-center gap-2">
              <Award className="h-4 w-4" /> Schemes
            </Link>
            <Link to="/eligibility" className="hover:text-blue-600 transition-colors flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Eligibility
            </Link>
            <Link to="/feedback" className="hover:text-blue-600 transition-colors flex items-center gap-2">
              <HelpCircle className="h-4 w-4" /> Support
            </Link>
          </nav>

          {/* Session Actions */}
          <div className="hidden md:flex items-center gap-3">
            {token ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                >
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-slate-600 hover:text-red-600 font-semibold px-4 py-2.5 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-700 hover:text-blue-600 font-semibold px-4 py-2.5">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-slate-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white/95 px-4 py-4 flex flex-col gap-4 shadow-lg backdrop-blur-md">
            <Link
              to="/policies"
              className="hover:text-blue-600 py-1 border-b border-slate-100 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Policies
            </Link>
            <Link
              to="/schemes"
              className="hover:text-blue-600 py-1 border-b border-slate-100 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Schemes
            </Link>
            <Link
              to="/eligibility"
              className="hover:text-blue-600 py-1 border-b border-slate-100 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Check Eligibility
            </Link>
            <Link
              to="/feedback"
              className="hover:text-blue-600 py-1 border-b border-slate-100 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Support & Feedback
            </Link>

            {token ? (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to={getDashboardLink()}
                  className="bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg text-center shadow-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-red-600 hover:bg-red-50 font-semibold py-2 px-4 rounded-lg border border-red-200 text-center"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/login"
                  className="text-center font-semibold py-2 rounded-lg border border-slate-200 hover:bg-slate-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-center bg-blue-600 text-white font-semibold py-2.5 rounded-lg shadow-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="page-wrapper grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-4">
              <ShieldCheck className="h-5 w-5 text-blue-500" />
              <span>GovIntel Platform</span>
            </div>
            <p className="text-sm">
              Providing intelligence tools for government policies, citizen schemes, and role-based workflows.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Features</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><Link to="/policies" className="hover:text-white transition-colors">Policy Directory</Link></li>
              <li><Link to="/schemes" className="hover:text-white transition-colors">Welfare Schemes</Link></li>
              <li><Link to="/eligibility" className="hover:text-white transition-colors">Eligibility Checker</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><Link to="/feedback" className="hover:text-white transition-colors">Submit Feedback</Link></li>
              <li><Link to="/feedback" className="hover:text-white transition-colors">FAQs & Help</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Official Portal</h4>
            <p className="text-sm mb-3">Officials and admins can log in to manage policy directives.</p>
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold text-sm">Access Portal &rarr;</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} GovIntel Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}