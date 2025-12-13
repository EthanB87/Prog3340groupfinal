import { useState, useEffect } from "react";
import { CheckCircle, Info, AlertTriangle, XCircle, X } from "lucide-react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

interface Toast {
  id: number;
  type: "success" | "info" | "warning" | "error";
  title: string;
  message: string;
}

// Ensure this matches your API URL
const API_BASE_URL = "https://localhost:7007";

// Exact Hex Colors from Requirements
const COLORS = {
  success: "#00875a",
  info: "#0052cc",
  warning: "#ff991f",
  error: "#de350b",
};

export function ToastNotifications() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const formatStatus = (status: string | number) => {
    const statusMap: Record<string | number, string> = {
      // String keys (from your TaskStatus type)
      todo: "To-Do",
      development: "Development",
      review: "Review",
      merge: "Merge",
      done: "Done",

      // Integer fallbacks (just in case backend sends Enum ints)
      0: "To-Do",
      1: "Development",
      2: "Review",
      3: "Merge",
      4: "Done",
    };

    // Return the mapped title, or capitalization of the raw value if unknown
    return statusMap[status] || String(status);
  };

  const addToast = (type: Toast["type"], title: string, message: string) => {
    const id = Date.now();
    const newToast: Toast = { id, type, title, message };
    setToasts((prev) => [newToast, ...prev]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/notificationHub`)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    connection
      .start()
      .then(() => console.log("🔔 Toast System Connected"))
      .catch((err) => console.error("SignalR Error:", err));

    // --- LISTENERS ---

    // Requirement: Task created
    connection.on("Task Created", (task: any) => {
      addToast(
        "success",
        "Task Created",
        `✅ Task ‘${task.title}’ created successfully`
      );
    });

    // Requirement: Task updated
    connection.on("Task Updated", (task: any) => {
      // 1. USE THE FORMATTER HERE
      const prettyStatus = formatStatus(task.status);

      addToast(
        "info",
        "Task Updated",
        `ℹ️ Task ‘${task.title}’ status updated to: ${prettyStatus}`
      );
    });

    // Requirement: Task deleted
    connection.on("Task Deleted", (taskId: any) => {
      addToast("error", "Task Deleted", `🗑️ Task deleted: ID #${taskId}`);
    });

    // Requirement: Error
    connection.on("Error", (errorMessage: string) => {
      addToast("error", "Error Occurred", errorMessage);
    });

    return () => {
      connection.stop();
    };
  }, []);

  const getStyles = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return {
          icon: CheckCircle,
          color: COLORS.success,
          bg: "#E3FCEF",
          border: COLORS.success,
        };
      case "info":
        return {
          icon: Info,
          color: COLORS.info,
          bg: "#DEEBFF",
          border: COLORS.info,
        };
      case "warning":
        return {
          icon: AlertTriangle,
          color: COLORS.warning,
          bg: "#FFFAE6",
          border: COLORS.warning,
        };
      case "error":
        return {
          icon: XCircle,
          color: COLORS.error,
          bg: "#FFEBE6",
          border: COLORS.error,
        };
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-3 w-96 flex flex-col gap-2">
      {toasts.map((toast) => {
        const style = getStyles(toast.type);
        const Icon = style.icon;

        return (
          <div
            key={toast.id}
            className="flex items-start p-4 rounded shadow-lg animate-in slide-in-from-right duration-300 bg-white"
            style={{
              borderLeft: `6px solid ${style.border}`,
              backgroundColor: "white",
            }}
          >
            <Icon
              className="w-6 h-6 flex-shrink-0 mt-0.5"
              style={{ color: style.color }}
            />
            <div className="ml-3 flex-1">
              <h4
                className="text-sm font-bold mb-1"
                style={{ color: style.color }}
              >
                {toast.title}
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-gray-400 hover:text-gray-900 focus:outline-none transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
