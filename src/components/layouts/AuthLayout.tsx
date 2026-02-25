import { Outlet } from "react-router-dom";
import appLogo from "../../assets/logo.png";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 py-8">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-20 h-20 rounded-full bg-brand-red/20 border border-brand-gold/40 shadow-lg shadow-brand-red/20 mx-auto mb-3 flex items-center justify-center">
          <img
            src={appLogo}
            alt="JuetengPH"
            className="h-14 w-auto"
          />
        </div>
        <p className="text-text-muted text-sm mt-1">Digital Betting Platform</p>
      </div>

      {/* Content */}
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
