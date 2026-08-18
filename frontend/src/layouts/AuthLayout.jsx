import { Outlet, Link } from "react-router-dom";
import { ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import authHero from "../assets/govintel-auth-hero.png";

export default function AuthLayout() {
  return <main className="min-h-[100dvh] w-full max-w-full overflow-x-hidden bg-slate-50 font-sans lg:flex lg:h-[100dvh] lg:overflow-hidden">
    <section className="relative z-10 flex min-h-[100dvh] items-center justify-center px-5 py-6 sm:py-8 lg:basis-[38%] lg:shrink-0 lg:min-h-0 lg:h-full lg:py-4 lg:bg-white lg:px-8 xl:px-12">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-6 sm:mb-10 inline-flex items-center gap-2.5 text-slate-950"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200"><ShieldCheck className="h-5 w-5" /></span><span className="text-xl font-extrabold tracking-tight">GovIntel</span></Link>
        <Outlet />
      </div>
    </section>
    <section className="relative hidden overflow-hidden bg-[#0b1e4b] lg:min-w-0 lg:flex-1 lg:flex lg:min-h-0 lg:h-full lg:items-center lg:justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(59,130,246,.45),transparent_38%),radial-gradient(circle_at_75%_75%,rgba(30,64,175,.5),transparent_45%)]" />
      <motion.img initial={{opacity:0,y:25}} animate={{opacity:1,y:0}} transition={{duration:.7}} src={authHero} alt="Government intelligence operations center" className="relative z-10 w-[80%] max-h-[72vh] rounded-3xl object-cover shadow-2xl shadow-blue-950/50" />
      <div className="absolute right-8 top-8 z-20 rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur">Secure • Fast • Intelligent</div>
      <motion.div animate={{y:[0,-8,0]}} transition={{duration:4,repeat:Infinity}} className="absolute right-8 top-[28%] z-20 rounded-2xl border border-white/15 bg-slate-950/40 p-3 text-xs text-white backdrop-blur"><b>Live notifications</b><p className="mt-1 text-blue-200">Scheme update received</p></motion.div>
      <motion.div animate={{y:[0,8,0]}} transition={{duration:4.5,repeat:Infinity}} className="absolute bottom-24 right-10 z-20 rounded-2xl border border-white/15 bg-white/10 p-3 text-xs text-white backdrop-blur"><b>AI recommendation</b><p className="mt-1 text-blue-200">3 eligible schemes found</p></motion.div>
      <div className="absolute bottom-8 left-10 z-20 max-w-sm text-white"><span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur"><Sparkles className="h-3.5 w-3.5"/> Government intelligence, simplified</span><h2 className="text-3xl font-bold leading-tight">Make every policy decision more accessible.</h2></div>
    </section>
  </main>;
}
