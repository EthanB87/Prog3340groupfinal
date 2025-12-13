import { Plus } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { mockTasks } from "../data/mockTasks";
import { TaskStatus } from "../types/task";

interface KanbanBoardProps {
  onTaskClick: (taskId: string) => void;
}

interface Column {
  id: TaskStatus;
  title: string;
  color: string;
}

const columns: Column[] = [
  { id: "todo", title: "To-Do", color: "#dfe1e6" },
  { id: "development", title: "Development", color: "#deebff" },
  { id: "review", title: "Review", color: "#fff0b3" },
  { id: "merge", title: "Merge", color: "#eae6ff" },
  { id: "done", title: "Done", color: "#e3fcef" },
];

export function KanbanBoard({ onTaskClick }: KanbanBoardProps) {
  const getTasksByStatus = (status: TaskStatus) => {
    return mockTasks.filter((task) => task.status === status && !task.archived);
  };

  return (
    <div className="h-full p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Project Board</h1>
        <p className="text-gray-600">Manage and track your team&apos;s tasks</p>
      </div>

      {/* Kanban Columns */}
      <div className="flex gap-4 h-[calc(100vh-200px)] overflow-x-auto pb-4">
        {columns.map((column) => {
          const tasks = getTasksByStatus(column.id);
          return (
            <div
              key={column.id}
              className="flex-shrink-0 w-80 flex flex-col"
              style={{ backgroundColor: column.color }}
            >
              {/* Column Header */}
              <div className="p-4 border-b border-gray-300">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-gray-900">{column.title}</h3>
                  <span className="px-2 py-1 bg-white bg-opacity-70 rounded text-gray-700">
                    {tasks.length}
                  </span>
                </div>
              </div>

              {/* Column Content */}
              <div className="flex-1 p-4 overflow-y-auto">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => onTaskClick(task.id)}
                  />
                ))}

                {/* Add Task Button */}
                <button className="w-full flex items-center gap-2 p-3 text-gray-600 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Add task</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
