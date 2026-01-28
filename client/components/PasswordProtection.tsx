import { useEffect, useState } from "react";
import { AlertCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PasswordProtectionProps {
  children: React.ReactNode;
}

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const AUTH_TOKEN = "app_auth_token";
const AUTH_EXPIRY = "app_auth_expiry";

export function PasswordProtection({ children }: PasswordProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [devPassword, setDevPassword] = useState<string | null>(null);

  // Check if user is already authenticated and get dev password
  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem(AUTH_TOKEN);
      const expiry = localStorage.getItem(AUTH_EXPIRY);

      if (token && expiry) {
        const expiryTime = parseInt(expiry, 10);
        if (Date.now() < expiryTime) {
          setIsAuthenticated(true);
          setIsCheckingAuth(false);
          return;
        } else {
          // Token expired
          localStorage.removeItem(AUTH_TOKEN);
          localStorage.removeItem(AUTH_EXPIRY);
        }
      }
      setIsCheckingAuth(false);
    };

    // Get dev password from environment if in development
    const envPassword = import.meta.env.VITE_APP_PASSWORD;
    if (import.meta.env.DEV && envPassword) {
      setDevPassword(envPassword);
    }

    checkAuthentication();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/verify-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Set authentication token with expiry
        const expiryTime = Date.now() + SESSION_DURATION;
        localStorage.setItem(AUTH_TOKEN, "true");
        localStorage.setItem(AUTH_EXPIRY, expiryTime.toString());

        setIsAuthenticated(true);
        setPassword("");
      } else {
        setError(data.message || "Invalid password");
      }
    } catch (err) {
      setError("Failed to verify password. Please try again.");
      console.error("Password verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Lock className="w-8 h-8 mx-auto text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-full max-w-md">
          <div className="rounded-lg border bg-card p-8 shadow-lg">
            <div className="flex justify-center mb-6">
              <Lock className="w-12 h-12 text-primary" />
            </div>

            <h1 className="text-2xl font-bold text-center mb-2">
              Access Required
            </h1>
            <p className="text-center text-muted-foreground mb-6">
              This application is password protected
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !isLoading) {
                      handleSubmit(e as any);
                    }
                  }}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !password}
              >
                {isLoading ? "Verifying..." : "Unlock"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
