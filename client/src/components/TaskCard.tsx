import { ArrowUp, ArrowDown, AlertCircle, Minus } from 'lucide-react';
import { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const getPriorityIcon = () => {
    switch (task.priority) {
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

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'highest':
        return 'border-red-600';
      case 'high':
        return 'border-orange-600';
      case 'medium':
        return 'border-yellow-600';
      case 'low':
        return 'border-green-600';
      default:
        return 'border-gray-300';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg border-l-4 ${getPriorityColor()} shadow-sm hover:shadow-md transition-shadow cursor-pointer p-4 mb-3`}
    >
      {/* Task ID and Priority */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-500">{task.id}</span>
        {getPriorityIcon()}
      </div>

      {/* Task Title */}
      <h4 className="text-gray-900 mb-3 line-clamp-2">
        {task.title}
      </h4>

      {/* Labels */}
      {task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.labels.slice(0, 2).map((label) => (
            <span
              key={label}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {/* Assignee */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#0052cc] text-white rounded-full flex items-center justify-center text-xs">
            {task.assignee.initials}
          </div>
          <span className="text-gray-700">{task.assignee.name}</span>
        </div>
      </div>
    </div>
  );
}
