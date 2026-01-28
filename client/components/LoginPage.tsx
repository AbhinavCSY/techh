import React, { useState, useEffect } from "react";
import { Lock, AlertCircle } from "lucide-react";

interface LoginPageProps {
  onAuthenticated: () => void;
}

export function LoginPage({ onAuthenticated }: LoginPageProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [devPassword, setDevPassword] = useState<string | null>(null);

  // Get password from environment on component mount
  useEffect(() => {
    const envPassword = import.meta.env.VITE_APP_PASSWORD || "demo123";
    // Show dev password if we're in development
    const isDev = import.meta.env.DEV;
    if (isDev) {
      setDevPassword(envPassword);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Get password from environment
    const correctPassword = import.meta.env.VITE_APP_PASSWORD || "demo123";

    // Simulate slight delay for better UX
    setTimeout(() => {
      if (password === correctPassword) {
        // Store auth token in localStorage
        localStorage.setItem("app_auth_token", "authenticated");
        onAuthenticated();
      } else {
        setError("Incorrect password. Please try again.");
        setPassword("");
      }
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Lock width="32" height="32" className="text-blue-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Secure Dashboard</h1>
            <p className="text-sm text-gray-600">
              Enter the password to access the security dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm"
                  disabled={isLoading}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle width="16" height="16" className="text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Dev Password Display */}
            {devPassword && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle width="16" height="16" className="text-amber-600 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-amber-700 font-medium">Dev Mode</p>
                  <p className="text-amber-600 font-mono text-xs">Password: {devPassword}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200"
            >
              {isLoading ? "Verifying..." : "Access Dashboard"}
            </button>
          </form>

          {/* Footer */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              This is a secure dashboard for viewing security metrics and dependencies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
