import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 py-8">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 rounded-full bg-brand-red mx-auto mb-3 flex items-center justify-center shadow-lg shadow-brand-red/30">
          <span className="text-white font-bold text-2xl">J</span>
        </div>
        <h1 className="text-2xl font-bold">
          <span className="text-brand-red">Jueteng</span>
          <span className="text-brand-gold">PH</span>
        </h1>
        <p className="text-text-muted text-sm mt-1">Digital Betting Platform</p>
      </div>

      {/* Content */}
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
