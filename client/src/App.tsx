import { useState, useEffect } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { KanbanBoard } from "./components/KanbanBoard";
import { TaskDetailView } from "./components/TaskDetailView";
import { AdminDashboard } from "./components/AdminDashboard";
import { ToastNotifications } from "./components/ToastNotifications";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";

export type Screen = "login" | "kanban" | "task-detail" | "admin";

// Define your API base URL here for easy maintenance
const API_BASE_URL = "https://localhost:7007";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // New state to handle loading
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // --- 1. Effect to Check Authentication Status on Load ---
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Call the C# API's "me" endpoint.
        // The API relies on the presence of the authentication cookie.
        const response = await fetch(`${API_BASE_URL}/api/Auth/me`);

        if (response.ok) {
          // User is authenticated, retrieve user data if needed
          // const userData = await response.json();
          setIsLoggedIn(true);
          setCurrentScreen("kanban");
        } else {
          // User is not authenticated (status 401 Unauthorized or 404 Not Found)
          setIsLoggedIn(false);
          setCurrentScreen("login");
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
        setIsLoggedIn(false);
        setCurrentScreen("login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []); // Run only once on component mount

  const handleLogin = () => {
    // This function will primarily handle local state change
    // after the OIDC flow redirects back to the app root.
    setIsLoggedIn(true);
    setCurrentScreen("kanban");
  };

  // --- 2. Updated Logout Handler to Call API ---
  const handleLogout = async () => {
    // The API needs to clear the authentication cookie.
    // We redirect the API back to the current frontend address.
    const redirectUrl = window.location.origin;

    try {
      // Calling the API endpoint which performs SignOut and redirects the browser.
      window.location.href = `${API_BASE_URL}/api/Auth/logout?returnUrl=${encodeURIComponent(
        redirectUrl
      )}`;

      // Note: Because this triggers a full browser redirect, the lines below
      // will not execute if the redirect is successful. We leave them as a
      // fallback/cleanup for non-redirect scenarios.
      setIsLoggedIn(false);
      setCurrentScreen("login");
    } catch (error) {
      console.error("Error during logout:", error);
      // Fallback for failed network call
      setIsLoggedIn(false);
      setCurrentScreen("login");
    }
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setCurrentScreen("task-detail");
  };

  const handleBackToKanban = () => {
    setCurrentScreen("kanban");
  };

  // --- Loading State Render ---
  if (isLoading) {
    // Display a simple loading message while checking auth status
    return (
      <div className="flex h-screen items-center justify-center text-xl text-gray-700">
        Loading...
      </div>
    );
  }

  // --- Login Screen Render (If Not Logged In) ---
  if (!isLoggedIn) {
    return (
      <>
        <LoginScreen
          onLogin={handleLogin}
          apiBaseUrl={API_BASE_URL} // Use the defined constant
        />
        <ToastNotifications />
      </>
    );
  }

  // --- Main App Render (If Logged In) ---
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLogout={handleLogout} />
        <main className="flex-1 overflow-auto">
          {currentScreen === "kanban" && (
            <KanbanBoard onTaskClick={handleTaskClick} />
          )}
          {currentScreen === "task-detail" && (
            <TaskDetailView
              taskId={selectedTaskId}
              onBack={handleBackToKanban}
            />
          )}
          {currentScreen === "admin" && <AdminDashboard />}
        </main>
      </div>
      <ToastNotifications />
    </div>
  );
}
