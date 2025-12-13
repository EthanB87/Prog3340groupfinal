import { useState, useEffect } from "react";
import { Mail, Lock, Loader2 } from "lucide-react";

interface LoginScreenProps {
  onLogin: () => void;
  apiBaseUrl: string;
  // Prop to save the token and trigger the post-login state change
  saveToken: (token: string) => void;
}

export function LoginScreen({
  onLogin,
  apiBaseUrl,
  saveToken,
}: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      saveToken(token); // store token in localStorage / state
      window.history.replaceState({}, "", "/"); // remove token from URL
    }
  }, []);

  // --- 1. LOCAL (EMAIL/PASSWORD) LOGIN HANDLER (JWT Flow) ---
  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Send credentials to the C# API
      const response = await fetch(`${apiBaseUrl}/api/Auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // Attempt to parse the specific error message from the API
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Login failed. Check your credentials."
        );
      }

      const data = await response.json();

      // Success: Extract the token and save it using the App's handler
      // This will automatically transition the user to the Kanban screen
      const jwtToken = data.token;
      saveToken(jwtToken);
    } catch (err: any) {
      console.error("Local Login Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. GOOGLE (OIDC) LOGIN HANDLER (Cookie Flow) ---
  const handleGoogleLogin = () => {
  // This is your backend endpoint that starts the Google OAuth flow
  const loginUrl = `${apiBaseUrl}/api/Auth/login`;
  // Return URL after successful login
  const returnUrl = window.location.origin;

  // Redirect browser to backend login endpoint
  const finalRedirectUrl = `${loginUrl}?returnUrl=${encodeURIComponent(returnUrl)}`;
  window.location.href = finalRedirectUrl;
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0052cc] rounded-lg mb-4">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded"></div>
          </div>
          <h1 className="text-gray-900 mb-2 font-bold text-2xl">TaskFlow</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleLocalLogin} className="space-y-6">
            {/* Error Message Display */}
            {error && (
              <div className="p-3 text-sm font-medium text-red-700 bg-red-100 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 mb-2 font-medium"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent transition-all"
                  placeholder="you@company.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 mb-2 font-medium"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Remember Me / Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#0052cc] border-gray-300 rounded focus:ring-[#0052cc]"
                />
                <span className="ml-2 text-gray-700 text-sm">Remember me</span>
              </label>
              <a
                href="#"
                className="text-[#0052cc] hover:underline text-sm font-medium"
              >
                Forgot password?
              </a>
            </div>

            {/* Sign In Button (Dynamic Loading State) */}
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full py-3 rounded-lg transition-colors flex items-center justify-center font-medium
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#0052cc] hover:bg-[#0747a6] text-white"
                }
              `}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign in"
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-gray-500 text-sm">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <a
                href="#"
                className="text-[#0052cc] hover:underline font-medium"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>&copy; 2025 TaskFlow. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
