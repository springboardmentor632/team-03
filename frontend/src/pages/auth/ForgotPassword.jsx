import { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../../services/auth.service";
import { toast, Toaster } from "react-hot-toast";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please specify your email");
    setLoading(true);

    try {
      const data = await authService.forgotPassword(email);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to trigger password reset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[480px] bg-[#0b1329]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-10 sm:p-12 shadow-[0_0_50px_rgba(59,130,246,0.08)]"
    >
      <Toaster position="top-right" />
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Forgot Password</h2>
        <p className="text-sm text-slate-400 font-medium leading-relaxed">
          Enter your registered email address. If an account exists, reset instructions will be sent securely.
        </p>
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
              placeholder="john@example.com"
            />
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
            "Requesting Link..."
          ) : (
            <>
              <Send className="h-5 w-5" />
              <span>Send Reset Instructions</span>
            </>
          )}
        </motion.button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-400 font-medium">
        <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1.5 group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Login</span>
        </Link>
      </p>
    </motion.div>
  );
}