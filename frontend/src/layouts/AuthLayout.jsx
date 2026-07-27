import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen lg:h-screen bg-[#030712] text-white flex items-center justify-center px-4 sm:px-6 lg:px-8 relative lg:overflow-hidden font-sans">
      {/* Soft background glow blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full flex justify-center py-8 lg:py-0">
        <Outlet />
      </div>
    </div>
  );
}