import { useState } from "react";
import { Mail, Lock } from "lucide-react";

interface LoginScreenProps {
  onLogin: () => void;
  // Prop to define the base URL of your C# API
  apiBaseUrl: string;
}

export function LoginScreen({ onLogin, apiBaseUrl }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 1. Function to handle the traditional (email/password) login
  const handleLocalLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual email/password login logic (e.g., fetch(apiBaseUrl + '/api/Auth/local-login', ...))
    console.log("Attempting local login with:", email, password);
    onLogin(); // Placeholder for success
  };

  // 2. Function to handle Google Sign-In redirect
  const handleGoogleLogin = () => {
    // Construct the full URL for the C# login endpoint
    const loginUrl = `${apiBaseUrl}/api/Auth/login`;

    // Optionally, you can add a returnUrl query parameter
    // so the API redirects the user back to a specific page after successful auth.
    // For example, redirect back to the app's root page ('/')
    const returnUrl = "/";
    const finalRedirectUrl = `${loginUrl}?returnUrl=${encodeURIComponent(
      returnUrl
    )}`;

    // Redirect the browser. This initiates the ASP.NET Core OIDC Challenge.
    window.location.href = finalRedirectUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* ... (Logo and Title content remains the same) ... */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0052cc] rounded-lg mb-4">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded"></div>
          </div>
          <h1 className="text-gray-900 mb-2">TaskFlow</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Use the new local login handler */}
          <form onSubmit={handleLocalLogin} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent"
                  placeholder="you@company.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* ... (Remember Me and Forgot Password content remains the same) ... */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#0052cc] border-gray-300 rounded focus:ring-[#0052cc]"
                />
                <span className="ml-2 text-gray-700">Remember me</span>
              </label>
              <a href="#" className="text-[#0052cc] hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-[#0052cc] text-white py-3 rounded-lg hover:bg-[#0747a6] transition-colors"
            >
              Sign in
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign In - UPDATED */}
            <button
              type="button"
              // Use the new Google login handler
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {/* ... (Google SVG icon remains the same) ... */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                {/* ... paths for Google icon ... */}
              </svg>
              <span className="text-gray-700">Sign in with Google</span>
            </button>
          </form>

          {/* ... (Register Link and Footer content remains the same) ... */}
        </div>
        <div className="mt-8 text-center text-gray-500">
          <p>&copy; 2025 TaskFlow. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

// Example usage in your main App component:
/*
  function App() {
    const apiBase = 'https://localhost:7001'; // <-- CHANGE THIS TO YOUR API URL
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    if (!isLoggedIn) {
      return <LoginScreen onLogin={() => setIsLoggedIn(true)} apiBaseUrl={apiBase} />;
    }
    return <div>Welcome to the App!</div>;
  }
*/
