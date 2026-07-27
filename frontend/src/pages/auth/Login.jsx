import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, clearError } from "../../redux/slices/authSlice";
import { toast, Toaster } from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (token && user) {
      toast.success(`Welcome back, ${user.name}!`);
      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (user.role === "official") {
          navigate("/government/dashboard");
        } else {
          navigate("/dashboard");
        }
      }, 1000);
    }
  }, [token, user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Please fill in all fields");
    }
    dispatch(loginUser({ email, password }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[480px] bg-[#0b1329]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-10 sm:p-12 shadow-[0_0_50px_rgba(59,130,246,0.08)]"
    >
      <Toaster position="top-right" />

      {/* Branding */}
      <div className="flex justify-center mb-5">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 shadow-[0_0_16px_rgba(59,130,246,0.15)] group-hover:border-blue-500/40 transition-all duration-300">
            <Shield className="h-4 w-4 text-blue-400" />
          </div>
          <span className="text-base font-bold text-white tracking-tight group-hover:text-blue-300 transition-colors">
            GovIntel Platform
          </span>
        </Link>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Sign in to your account</h2>
        <p className="text-sm text-slate-400 font-medium">Welcome back! Please enter your details</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[54px] pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-sm"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="block text-sm font-semibold text-white">
              Password
            </label>
            <Link to="/forgot-password" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[54px] pl-12 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-sm"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={loading}
          className="w-full h-[56px] flex items-center justify-center gap-2 border border-transparent rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-[0_4px_20px_rgba(59,130,246,0.25)] hover:shadow-[0_4px_25px_rgba(59,130,246,0.35)] transition-all duration-300 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            "Signing in..."
          ) : (
            <>
              <LogIn className="h-5 w-5" />
              <span>Sign in</span>
            </>
          )}
        </motion.button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-400 font-medium">
        Don't have an account?{" "}
        <Link to="/register" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1 group">
          <span>Register here</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </p>
    </motion.div>
  );
}