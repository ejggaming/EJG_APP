import { Link } from "react-router-dom";
import { Button } from "../components";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
      <div className="w-20 h-20 rounded-full bg-brand-red/20 flex items-center justify-center mb-6">
        <span className="text-4xl">🎱</span>
      </div>
      <h1 className="text-5xl font-bold text-brand-red mb-2">404</h1>
      <p className="text-gray-400 mb-6 text-center">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button variant="primary">Go Home</Button>
      </Link>
    </div>
  );
}
