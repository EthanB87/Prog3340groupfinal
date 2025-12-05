import { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { KanbanBoard } from './components/KanbanBoard';
import { TaskDetailView } from './components/TaskDetailView';
import { AdminDashboard } from './components/AdminDashboard';
import { ToastNotifications } from './components/ToastNotifications';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

export type Screen = 'login' | 'kanban' | 'task-detail' | 'admin';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentScreen('kanban');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen('login');
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setCurrentScreen('task-detail');
  };

  const handleBackToKanban = () => {
    setCurrentScreen('kanban');
  };

  if (!isLoggedIn) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} />
        <ToastNotifications />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLogout={handleLogout} />
        <main className="flex-1 overflow-auto">
          {currentScreen === 'kanban' && (
            <KanbanBoard onTaskClick={handleTaskClick} />
          )}
          {currentScreen === 'task-detail' && (
            <TaskDetailView taskId={selectedTaskId} onBack={handleBackToKanban} />
          )}
          {currentScreen === 'admin' && <AdminDashboard />}
        </main>
      </div>
      <ToastNotifications />
    </div>
  );
}
