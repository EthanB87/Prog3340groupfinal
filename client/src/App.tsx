import { useState, useEffect } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { KanbanBoard } from "./components/KanbanBoard";
import { TaskDetailView } from "./components/TaskDetailView";
import { AdminDashboard } from "./components/AdminDashboard";
import { ToastNotifications } from "./components/ToastNotifications";
import { Sidebar } from "./components/Sidebar";
// 1. Import User type so we can use it in state
import { Header } from "./components/Header";
import { saveTokenToStorage, authFetch } from "./utils/auth";
import { UserSummary } from "./api/users";

export type Screen = "login" | "kanban" | "task-detail" | "admin";

const API_BASE_URL = "https://localhost:7007";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // 2. Add State to hold the User object
  const [user, setUser] = useState<UserSummary | null>(null);

  // --- 1. Effect to Check Authentication Status on Load ---
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await authFetch(`${API_BASE_URL}/api/Auth/me`);

        if (response.ok) {
          // 3. Parse the JSON to get user details
          const userData = await response.json();
          setUser(userData); // Save to state

          setIsLoggedIn(true);
          setCurrentScreen("kanban");
        } else {
          localStorage.removeItem("authToken");
          setUser(null);
          setIsLoggedIn(false);
          setCurrentScreen("login");
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
        localStorage.removeItem("authToken");
        setUser(null);
        setIsLoggedIn(false);
        setCurrentScreen("login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // --- Login Handler ---
  const handleLogin = async () => {
    // 4. Fetch user data immediately after login so UI updates without refresh
    try {
      const response = await authFetch(`${API_BASE_URL}/api/Auth/me`);
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (e) {
      console.error("Failed to fetch user on login", e);
    }

    setIsLoggedIn(true);
    setCurrentScreen("kanban");
  };

  const handleSaveToken = (token: string) => {
    saveTokenToStorage(token);
    handleLogin();
  };

  // --- 2. Updated Logout Handler ---
  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    const redirectUrl = window.location.origin;

    try {
      window.location.href = `${API_BASE_URL}/api/Auth/logout?returnUrl=${encodeURIComponent(
        redirectUrl
      )}`;

      setIsLoggedIn(false);
      setUser(null); // Clear user state
      setCurrentScreen("login");
    } catch (error) {
      console.error("Error during logout:", error);
      setIsLoggedIn(false);
      setUser(null);
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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl text-gray-700">
        Loading...
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <>
        <LoginScreen
          onLogin={handleLogin}
          apiBaseUrl={API_BASE_URL}
          saveToken={handleSaveToken}
        />
        <ToastNotifications />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 5. Pass User to Sidebar (for Role check) */}
      <Sidebar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        user={user}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 6. Pass User to Header (for Name/Avatar) */}
        <Header onLogout={handleLogout} user={user} />

        <main className="flex-1 overflow-auto">
          {currentScreen === "kanban" && (
            <KanbanBoard
              apiBaseUrl={API_BASE_URL}
              onTaskClick={handleTaskClick}
            />
          )}
          {currentScreen === "task-detail" && (
            <TaskDetailView
              taskId={selectedTaskId}
              onBack={handleBackToKanban}
              apiBaseUrl={API_BASE_URL}
            />
          )}
          {currentScreen === "admin" && (
            <AdminDashboard apiBaseUrl={API_BASE_URL} />
          )}
        </main>
      </div>
      <ToastNotifications />
    </div>
  );
}
