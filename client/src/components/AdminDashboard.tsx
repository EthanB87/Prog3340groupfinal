import { useEffect, useMemo, useState } from 'react';
import { Search, Filter, Download, ArrowUp, ArrowDown, Minus, Archive } from 'lucide-react';
import { Task, TaskStatus } from '../types/task';
import { fetchTasks } from '../api/tasks';

interface AdminDashboardProps {
  apiBaseUrl: string;
}

export function AdminDashboard({ apiBaseUrl }: AdminDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [showArchived, setShowArchived] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
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

    load();
  }, [apiBaseUrl]);

  // Get unique assignees
  const assignees = useMemo(
    () => Array.from(new Set(tasks.map(t => t.assignee.name))),
    [tasks]
  );

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesAssignee = assigneeFilter === 'all' || task.assignee.name === assigneeFilter;
    const matchesArchived = showArchived || !task.archived;
    
    return matchesSearch && matchesStatus && matchesAssignee && matchesArchived;
  });

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'highest':
        return <ArrowUp className="w-4 h-4 text-red-600" />;
      case 'high':
        return <ArrowUp className="w-4 h-4 text-orange-600" />;
      case 'medium':
        return <Minus className="w-4 h-4 text-yellow-600" />;
      case 'low':
        return <ArrowDown className="w-4 h-4 text-green-600" />;
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    const colors: Record<TaskStatus, string> = {
      todo: 'bg-gray-100 text-gray-800',
      development: 'bg-blue-100 text-blue-800',
      review: 'bg-yellow-100 text-yellow-800',
      merge: 'bg-purple-100 text-purple-800',
      done: 'bg-green-100 text-green-800'
    };

    const labels: Record<TaskStatus, string> = {
      todo: 'To-Do',
      development: 'Development',
      review: 'Review',
      merge: 'Merge',
      done: 'Done'
    };

    return (
      <span className={`px-2 py-1 rounded-full ${colors[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="h-full p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">View and manage all tasks across projects</p>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="todo">To-Do</option>
              <option value="development">Development</option>
              <option value="review">Review</option>
              <option value="merge">Merge</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* Assignee Filter */}
          <div>
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent"
            >
              <option value="all">All Assignees</option>
              {assignees.map((assignee) => (
                <option key={assignee} value={assignee}>
                  {assignee}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Additional Filters */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
                className="w-4 h-4 text-[#0052cc] border-gray-300 rounded focus:ring-[#0052cc]"
              />
              <span className="text-gray-700">Show Archived</span>
            </label>
            <div className="flex items-center gap-2 text-gray-600">
              <Filter className="w-4 h-4" />
              <span>{filteredTasks.length} tasks</span>
            </div>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 text-[#0052cc] hover:bg-blue-50 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Task ID</th>
                <th className="px-6 py-3 text-left text-gray-700">Title</th>
                <th className="px-6 py-3 text-left text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-gray-700">Priority</th>
                <th className="px-6 py-3 text-left text-gray-700">Assignee</th>
                <th className="px-6 py-3 text-left text-gray-700">Due Date</th>
                <th className="px-6 py-3 text-left text-gray-700">Labels</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-600">
                    Loading tasks...
                  </td>
                </tr>
              ) : (
              filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    task.archived ? 'bg-gray-50 opacity-60' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900">{task.id}</span>
                      {task.archived && (
                        <Archive className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 max-w-md truncate">
                      {task.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(task.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(task.priority)}
                      <span className="text-gray-700 capitalize">{task.priority}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-[#0052cc] text-white rounded-full flex items-center justify-center text-xs">
                        {task.assignee.initials}
                      </div>
                      <span className="text-gray-900">{task.assignee.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-700">
                      {new Date(task.dueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {task.labels.slice(0, 2).map((label) => (
                        <span
                          key={label}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {label}
                        </span>
                      ))}
                      {task.labels.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          +{task.labels.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No tasks found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
