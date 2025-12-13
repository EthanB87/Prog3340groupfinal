import { useEffect, useState } from 'react';
import { Plus, RefreshCcw, X } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { Task, TaskStatus } from '../types/task';
import { createTask, fetchTasks, updateTaskStatus } from '../api/tasks';

interface KanbanBoardProps {
  apiBaseUrl: string;
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

export function KanbanBoard({ apiBaseUrl, onTaskClick }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [createStatus, setCreateStatus] = useState<TaskStatus | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchTasks(apiBaseUrl);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter(task => task.status === status && !task.archived);

  const handleMoveTask = async (taskId: string, newStatus: TaskStatus) => {
    const previous = tasks;
    const existing = tasks.find(t => t.id === taskId);
    if (!existing || existing.status === newStatus) return;

    const optimistic = tasks.map(t =>
      t.id === taskId ? { ...t, status: newStatus } : t
    );
    setTasks(optimistic);
    setError(null);

    try {
      const updated = await updateTaskStatus(apiBaseUrl, taskId, {
        ...existing,
        status: newStatus
      });
      setTasks((current) =>
        current.map(t => (t.id === taskId ? updated : t))
      );
    } catch (err) {
      setTasks(previous);
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const handleDrop = (status: TaskStatus) => {
    if (draggingId) {
      handleMoveTask(draggingId, status);
      setDraggingId(null);
    }
  };

  return (
    <div className="h-full p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Project Board</h1>
        <div className="flex items-center gap-3 text-gray-600">
          <p>Manage and track your team&apos;s tasks</p>
          <button
            onClick={loadTasks}
            className="inline-flex items-center gap-2 text-sm text-[#0052cc] hover:underline disabled:opacity-50"
            disabled={isLoading}
            title="Refresh tasks"
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </button>
          {error && <span className="text-red-600 text-sm">{error}</span>}
          {createError && <span className="text-red-600 text-sm">{createError}</span>}
        </div>
      </div>

      {isLoading ? (
        <div className="h-[60vh] flex items-center justify-center text-gray-600">
          Loading tasks...
        </div>
      ) : (
        <div className="flex gap-4 h-[calc(100vh-200px)] overflow-x-auto pb-4">
          {columns.map((column) => {
            const tasks = getTasksByStatus(column.id);
            return (
              <div
                key={column.id}
                className="flex-shrink-0 w-80 flex flex-col"
                style={{ backgroundColor: column.color }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(column.id)}
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
                      draggable
                      onDragStart={() => setDraggingId(task.id)}
                      onDragEnd={() => setDraggingId(null)}
                    />
                  ))}

                  {/* Add Task Button */}
                  {createStatus === column.id ? (
                    <div className="bg-white rounded-lg shadow p-3 space-y-2">
                      <input
                        className="w-full border border-gray-300 rounded px-2 py-1"
                        placeholder="Task title"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                      />
                      <textarea
                        className="w-full border border-gray-300 rounded px-2 py-1"
                        placeholder="Description (optional)"
                        rows={2}
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={async () => {
                            if (!newTitle.trim()) {
                              setCreateError('Title is required');
                              return;
                            }
                            try {
                              setIsCreating(true);
                              setCreateError(null);
                              const created = await createTask(apiBaseUrl, {
                                title: newTitle,
                                description: newDescription,
                                status: column.id,
                              });
                              setTasks((prev) => [created, ...prev]);
                              setNewTitle('');
                              setNewDescription('');
                              setCreateStatus(null);
                            } catch (err) {
                              setCreateError(err instanceof Error ? err.message : 'Failed to create task');
                            } finally {
                              setIsCreating(false);
                            }
                          }}
                          disabled={isCreating}
                          className="px-3 py-2 bg-[#0052cc] text-white rounded hover:bg-[#0747a6] disabled:opacity-60"
                        >
                          {isCreating ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => {
                            setCreateStatus(null);
                            setNewTitle('');
                            setNewDescription('');
                            setCreateError(null);
                          }}
                          className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg inline-flex items-center gap-1"
                        >
                          <X className="w-4 h-4" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setCreateStatus(column.id);
                        setNewTitle('');
                        setNewDescription('');
                        setCreateError(null);
                      }}
                      className="w-full flex items-center gap-2 p-3 text-gray-600 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add task</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
