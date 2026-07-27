import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, clearError, logoutUser } from "../../redux/slices/authSlice";
import { toast, Toaster } from "react-hot-toast";
import { User, Mail, Lock, Eye, EyeOff, Users, ArrowRight, UserCheck, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("citizen");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (token && user) {
      toast.success("Account registered successfully!");
      const registeredEmail = user.email;
      dispatch(logoutUser());
      setTimeout(() => {
        navigate("/verify-otp", { state: { email: registeredEmail } });
      }, 1000);
    }
  }, [token, user, navigate, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return toast.error("Please fill in all required fields");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    const userData = {
      name: `${firstName} ${lastName}`,
      email,
      password,
      role,
    };

    dispatch(registerUser(userData));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[540px] bg-[#0b1329]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-[0_0_50px_rgba(59,130,246,0.08)]"
    >
      <Toaster position="top-right" />

      {/* Branding */}
      <div className="flex justify-center mb-3">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 shadow-[0_0_16px_rgba(59,130,246,0.15)] group-hover:border-blue-500/40 transition-all duration-300">
            <Shield className="h-3.5 w-3.5 text-blue-400" />
          </div>
          <span className="text-base font-bold text-white tracking-tight group-hover:text-blue-300 transition-colors">
            GovIntel Platform
          </span>
        </Link>
      </div>

      {/* Heading */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-extrabold text-white tracking-tight mb-0.5">Create your account</h2>
        <p className="text-xs text-slate-400 font-medium">Join thousands of citizens using GovIntel</p>
      </div>

      <form className="space-y-3" onSubmit={handleSubmit}>
        {/* First & Last Name */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-white mb-1">First Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full h-[42px] pl-9 pr-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-sm"
                placeholder="John"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-white mb-1">Last Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full h-[42px] pl-9 pr-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-sm"
                placeholder="Doe"
              />
            </div>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-white mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[42px] pl-9 pr-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-sm"
              placeholder="Enter your email address"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-white mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[42px] pl-9 pr-10 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-sm"
              placeholder="Create a strong password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-white mb-1">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-[42px] pl-9 pr-10 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-sm"
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Role */}
        <div>
          <label className="block text-xs font-semibold text-white mb-1">Select Role</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full h-[42px] pl-9 pr-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-sm appearance-none [&>option]:bg-slate-900"
            >
              <option value="citizen">Citizen (Welfare seeker)</option>
              <option value="official">Government Official</option>
              <option value="researcher">Researcher</option>
              <option value="organization">Organization</option>
              <option value="admin">Platform Administrator</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-400" />
          </div>
        </div>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={loading}
          className="w-full h-[46px] flex items-center justify-center gap-2 border border-transparent rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-[0_4px_20px_rgba(59,130,246,0.25)] hover:shadow-[0_4px_25px_rgba(59,130,246,0.35)] transition-all duration-300 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            "Registering..."
          ) : (
            <>
              <UserCheck className="h-4 w-4" />
              <span>Create Account</span>
            </>
          )}
        </motion.button>
      </form>

      <p className="mt-3 text-center text-sm text-slate-400 font-medium">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1 group">
          <span>Login here</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </p>
    </motion.div>
  );
}