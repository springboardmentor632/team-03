import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Database,
  FileBarChart,
  MessageSquare,
  User,
  LogOut,
  Menu,
  X,
  Settings,
  ShieldCheck,
  FileText,
  Award
} from "lucide-react";

export default function AdminLayout() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
    setShowLogoutModal(false);
  };

  const navItems = [
    { name: "Admin Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Manage Users", path: "/admin/users", icon: Users },
    { name: "Audit Logs", path: "/admin/logs", icon: Database },
    { name: "System Policies", path: "/admin/policies", icon: FileText },
    { name: "System Schemes", path: "/admin/schemes", icon: Award },
    { name: "Citizen Support", path: "/admin/feedback", icon: MessageSquare },
    { name: "My Profile", path: "/profile", icon: User },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-slate-900 text-slate-300 border-r border-slate-800 flex-shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-2.5">
          <Settings className="h-6 w-6 text-blue-500 stroke-[2.5]" />
          <span className="text-white font-bold text-lg tracking-tight">Admin Console</span>
        </div>

        <div className="flex-1 py-6 overflow-y-auto px-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all group ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "hover:bg-slate-800 hover:text-white text-slate-400"
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-slate-800 flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2">
            <div className="bg-blue-600/10 text-blue-400 h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm">
              {user?.name?.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
              <p className="text-slate-500 text-xs truncate capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 font-medium text-sm transition-all"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <header className="md:hidden h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 z-30">
          <div className="flex items-center gap-2.5">
            <Settings className="h-5 w-5 text-blue-500" />
            <span className="text-white font-bold tracking-tight">Admin Console</span>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-slate-300 p-1.5 hover:bg-slate-800 rounded-lg">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </header>

        {/* Mobile Sidebar Overlay */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-20 flex bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
            <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-500" />
                  <span className="text-white font-bold">Admin Console</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="text-slate-400">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 py-6 overflow-y-auto px-4 space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm ${
                        isActive ? "bg-blue-600 text-white" : "hover:bg-slate-800 text-slate-400"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Icon className="h-4.5 w-4.5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
              <div className="p-6 border-t border-slate-800 flex flex-col gap-3">
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="flex items-center gap-3 w-full px-4 py-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 font-medium text-sm"
                >
                  <LogOut className="h-4.5 w-4.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Outlet Panel */}
        <main className="flex-1 overflow-y-auto">
          <div className="mt-8 mb-8">
            <div className="page-wrapper"><Outlet /></div>
          </div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Logout?</h3>
            <p className="text-slate-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
