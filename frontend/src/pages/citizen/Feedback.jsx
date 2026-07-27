import { useState } from "react";
import { useSelector } from "react-redux";
import userService from "../../services/user.service";
import { toast, Toaster } from "react-hot-toast";
import { HelpCircle, Mail, MessageSquare, Send, CheckCircle } from "lucide-react";

export default function Feedback() {
  const { user } = useSelector((state) => state.auth);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("feedback");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      return toast.error("Please fill in all fields");
    }

    setLoading(true);
    try {
      const payload = { name, email, subject, message, type };
      await userService.submitFeedback(payload);
      toast.success("Feedback submitted successfully!");
      setSubject("");
      setMessage("");
    } catch (err) {
      toast.error("Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      <Toaster position="top-right" />
      {/* Left side: help card */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md space-y-4">
        <h2 className="font-extrabold text-lg flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-indigo-400" />
          <span>Support &amp; Help Desk</span>
        </h2>
        <p className="text-slate-400 text-xs leading-relaxed">
          Submit feedback, report a system issue, or contact our support representatives directly. We aim to respond within 24 hours.
        </p>

        <div className="pt-4 border-t border-slate-800 space-y-2 text-xxs font-semibold text-slate-400">
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-indigo-400" />
            <span>support.intel@gov.in</span>
          </p>
        </div>
      </div>

      {/* Right side: form */}
      <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
        <h2 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          <span>Submit Inquiry Form</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-500">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Inquiry Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
            >
              <option value="feedback">General Feedback</option>
              <option value="issue">Report a Technical Issue</option>
              <option value="contact">Contact Support</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Subject</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-850 font-bold"
              placeholder="Summary of the request..."
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Detailed Message</label>
            <textarea
              required
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium"
              placeholder="Describe your inquiry in detail..."
            ></textarea>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="h-4 w-4" />
              <span>{loading ? "Submitting..." : "Send Message"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
