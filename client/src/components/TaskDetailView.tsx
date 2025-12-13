import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Minus,
  AlertCircle,
  Calendar,
  User,
  Flag,
  Save,
  X
} from 'lucide-react';
import { fetchTaskById, updateTask } from '../api/tasks';
import { fetchUsers, UserSummary } from '../api/users';
import { Task, TaskStatus } from '../types/task';

interface TaskDetailViewProps {
  taskId: string | null;
  onBack: () => void;
  apiBaseUrl: string;
}

export function TaskDetailView({ taskId, onBack, apiBaseUrl }: TaskDetailViewProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [draft, setDraft] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<UserSummary[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!taskId) {
        setError('No task selected');
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const [data, userList] = await Promise.all([
          fetchTaskById(apiBaseUrl, taskId),
          fetchUsers(apiBaseUrl).catch(() => [] as UserSummary[])
        ]);
        setTask(data);
        setDraft(data);
        setUsers(userList);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load task');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [taskId, apiBaseUrl]);

  const viewTask = (isEditing && draft) ? draft : task;

  const assigneeOptions = useMemo(() => {
    const base = [{ id: 0, label: 'Unassigned' }];
    return base.concat(
      users.map(u => ({
        id: u.id,
        label: u.username || u.email || `User ${u.id}`
      }))
    );
  }, [users]);

  const getPriorityIcon = () => {
    switch (viewTask?.priority) {
      case 'highest':
        return <ArrowUp className="w-4 h-4 text-red-600" />;
      case 'high':
        return <ArrowUp className="w-4 h-4 text-orange-600" />;
      case 'medium':
        return <Minus className="w-4 h-4 text-yellow-600" />;
      case 'low':
        return <ArrowDown className="w-4 h-4 text-green-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityLabel = () => {
    if (!viewTask) return '';
    return viewTask.priority.charAt(0).toUpperCase() + viewTask.priority.slice(1);
  };

  const getStatusColor = () => {
    if (!viewTask) return 'bg-gray-100 text-gray-800';
    const colors: Record<string, string> = {
      todo: 'bg-gray-100 text-gray-800',
      development: 'bg-blue-100 text-blue-800',
      review: 'bg-yellow-100 text-yellow-800',
      merge: 'bg-purple-100 text-purple-800',
      done: 'bg-green-100 text-green-800'
    };
    return colors[viewTask.status] || 'bg-gray-100 text-gray-800';
  };

  const handleDraftChange = <K extends keyof Task>(key: K, value: Task[K]) => {
    if (!draft) return;
    setDraft({ ...draft, [key]: value });
  };

  const handleAssigneeChange = (value: string) => {
    if (!draft) return;
    const idNum = Number(value);
    if (!idNum) {
      setDraft({
        ...draft,
        assignee: { id: undefined, name: 'Unassigned', avatar: '', initials: 'UN' }
      });
      return;
    }
    const selected = users.find(u => u.id === idNum);
    const name = selected?.username || selected?.email || `User ${idNum}`;
    setDraft({
      ...draft,
      assignee: {
        id: idNum,
        name,
        avatar: '',
        initials: name.slice(0, 2).toUpperCase()
      }
    });
  };

  const handleSave = async () => {
    if (!draft) return;
    try {
      setIsSaving(true);
      const updated = await updateTask(apiBaseUrl, draft.id, {
        title: draft.title,
        description: draft.description,
        status: draft.status,
        assignedToId: draft.assignee?.id ?? null
      });
      // Preserve front-end only fields (priority, due date)
      const merged: Task = {
        ...updated,
        priority: draft.priority,
        dueDate: draft.dueDate
      };
      setTask(merged);
      setDraft(merged);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update task');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setDraft(task);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-600">
        Loading task...
      </div>
    );
  }

  if (!task || !viewTask || error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error ?? 'Task not found'}</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-[#0052cc] text-white rounded-lg hover:bg-[#0747a6]"
          >
            Back to Board
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <span>{viewTask.id}</span>
              <span>ƒ?›</span>
              <span>Created {formatDate(viewTask.createdAt)}</span>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-2 bg-[#0052cc] text-white rounded-lg hover:bg-[#0747a6]"
            >
              Edit
            </button>
          )}
          {isEditing && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg font-semibold shadow-md border border-green-700"
                style={{
                  backgroundColor: '#16a34a',
                  color: '#ffffff',
                  opacity: isSaving ? 0.6 : 1
                }}
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-60"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Title */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              {isEditing ? (
                <input
                  value={draft?.title ?? ''}
                  onChange={(e) => handleDraftChange('title', e.target.value)}
                  className="w-full text-gray-900 mb-4 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0052cc]"
                />
              ) : (
                <h1 className="text-gray-900 mb-4">{viewTask.title}</h1>
              )}
              
              {/* Labels */}
              <div className="flex flex-wrap gap-2">
                {viewTask.labels.map((label) => (
                  <span
                    key={label}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-gray-900 mb-3">Description</h3>
              {isEditing ? (
                <textarea
                  value={draft?.description ?? ''}
                  onChange={(e) => handleDraftChange('description', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent"
                  rows={4}
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">
                  {viewTask.description}
                </p>
              )}
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-gray-900 mb-4">Activity</h3>
              
              {/* Comment Input */}
              <div className="mb-6">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-[#0052cc] text-white rounded-full flex items-center justify-center flex-shrink-0">
                    JD
                  </div>
                  <div className="flex-1">
                    <textarea
                      placeholder="Add a comment..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent resize-none"
                      rows={3}
                    />
                    <div className="flex gap-2 mt-2">
                      <button className="px-4 py-2 bg-[#0052cc] text-white rounded-lg hover:bg-[#0747a6]">
                        Save
                      </button>
                      <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Items */}
              <div className="space-y-4">
                {viewTask.activity.length > 0 ? (
                  viewTask.activity.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-8 h-8 bg-[#0052cc] text-white rounded-full flex items-center justify-center flex-shrink-0">
                        {item.user.initials}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-gray-900">{item.user.name}</span>
                          <span className="text-gray-500">{formatTimestamp(item.timestamp)}</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-gray-700">{item.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No activity yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-4">
            {/* Status */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <Flag className="w-4 h-4" />
                <span>Status</span>
              </div>
              {isEditing ? (
                <select
                  value={draft?.status}
                  onChange={(e) => handleDraftChange('status', e.target.value as TaskStatus)}
                  disabled={isSaving}
                  className={`w-full px-3 py-2 rounded-lg border ${isSaving ? 'opacity-60 cursor-wait' : ''}`}
                >
                  <option value="todo">To-Do</option>
                  <option value="development">Development</option>
                  <option value="review">Review</option>
                  <option value="merge">Merge</option>
                  <option value="done">Done</option>
                </select>
              ) : (
                <div className={`w-full px-3 py-2 rounded-lg ${getStatusColor()}`}>
                  {viewTask.status}
                </div>
              )}
            </div>

            {/* Priority */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                {getPriorityIcon()}
                <span>Priority</span>
              </div>
              {isEditing ? (
                <select
                  value={draft?.priority}
                  onChange={(e) => handleDraftChange('priority', e.target.value as Task['priority'])}
                  className="w-full px-3 py-2 rounded-lg border"
                >
                  <option value="highest">Highest</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                  {getPriorityIcon()}
                  <span className="text-gray-900">{getPriorityLabel()}</span>
                </div>
              )}
            </div>

            {/* Assignee */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <User className="w-4 h-4" />
                <span>Assignee</span>
              </div>
              {isEditing ? (
                <select
                  value={draft?.assignee?.id ?? 0}
                  onChange={(e) => handleAssigneeChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border"
                >
                  {assigneeOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex items-center gap-3 p-2">
                  <div className="w-8 h-8 bg-[#0052cc] text-white rounded-full flex items-center justify-center">
                    {viewTask.assignee.initials}
                  </div>
                  <span className="text-gray-900">{viewTask.assignee.name}</span>
                </div>
              )}
            </div>

            {/* Reporter */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <User className="w-4 h-4" />
                <span>Reporter</span>
              </div>
              <div className="flex items-center gap-3 p-2">
                <div className="w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center">
                  {viewTask.reporter.initials}
                </div>
                <span className="text-gray-900">{viewTask.reporter.name}</span>
              </div>
            </div>

            {/* Dates */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-2 text-gray-700 mb-3">
                <Calendar className="w-4 h-4" />
                <span>Dates</span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-gray-600 mb-1">Created</div>
                  <div className="text-gray-900">{formatDate(viewTask.createdAt)}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Updated</div>
                  <div className="text-gray-900">{formatDate(viewTask.updatedAt)}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Due Date</div>
                  {isEditing ? (
                    <input
                      type="date"
                      value={draft?.dueDate?.slice(0, 10) ?? ''}
                      onChange={(e) => handleDraftChange('dueDate', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border"
                    />
                  ) : (
                    <div className="text-gray-900">{formatDate(viewTask.dueDate)}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
