import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, ArrowLeft, RefreshCw } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export default function VerifyOTP() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "your email";

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) {
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleResend = () => {
    setCountdown(60);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    toast.success("OTP resent successfully!");
  };

  const handleVerify = () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      return toast.error("Please enter all 6 digits");
    }
    setIsVerifying(true);
    
    // Simulate OTP verification (replace with actual API call)
    setTimeout(() => {
      setIsVerifying(false);
      toast.success("OTP verified successfully!");
      navigate("/login");
    }, 1500);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Soft background glow blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <Toaster position="top-right" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Card */}
        <div className="bg-[#0b1329]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-[0_0_50px_rgba(59,130,246,0.08)]">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.15)]">
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">Verify OTP</h2>
            <p className="text-sm text-slate-400 font-medium">
              Enter the 6-digit code sent to
            </p>
            <p className="text-sm text-blue-400 font-semibold mt-1">{email}</p>
          </div>

          {/* OTP Input */}
          <div className="flex justify-center gap-2 sm:gap-3 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            ))}
          </div>

          {/* Timer & Resend */}
          <div className="text-center mb-8">
            {countdown > 0 ? (
              <p className="text-sm text-slate-400">
                Resend code in{" "}
                <span className="font-semibold text-blue-400">{formatTime(countdown)}</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="flex items-center justify-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors mx-auto"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Resend OTP</span>
              </button>
            )}
          </div>

          {/* Verify Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleVerify}
            disabled={isVerifying}
            className="w-full h-[56px] flex items-center justify-center gap-2 border border-transparent rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-[0_4px_20px_rgba(59,130,246,0.25)] hover:shadow-[0_4px_25_rgba(59,130,246,0.35)] transition-all duration-300 disabled:opacity-50 cursor-pointer"
          >
            {isVerifying ? (
              <span>Verifying...</span>
            ) : (
              <span>Verify & Continue</span>
            )}
          </motion.button>
        </div>

        {/* Help text */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Didn't receive the code? Check your spam folder or contact support.
        </p>
      </motion.div>
    </div>
  );
}
