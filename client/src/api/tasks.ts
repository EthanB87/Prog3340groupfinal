import { Task, TaskStatus } from "../types/task";

const statusFromApiValue = (rawStatus: unknown): TaskStatus => {
  const mapByNumber: Record<number, TaskStatus> = {
    0: "todo",
    1: "development",
    2: "review",
    3: "merge",
    4: "done",
  };

  if (typeof rawStatus === "number" && rawStatus in mapByNumber) {
    return mapByNumber[rawStatus];
  }

  if (typeof rawStatus === "string") {
    const normalized = rawStatus.toLowerCase();
    switch (normalized) {
      case "todo":
      case "to-do":
      case "to_do":
        return "todo";
      case "development":
        return "development";
      case "review":
        return "review";
      case "merge":
        return "merge";
      case "done":
        return "done";
      default:
        break;
    }
  }

  return "todo";
};

const getInitials = (value: string) => {
  const parts = value.split(" ").filter(Boolean);
  if (parts.length === 0) return "NA";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const mapApiTask = (apiTask: any): Task => {
  const assigneeName =
    apiTask?.assignedTo?.username ||
    apiTask?.assignedTo?.email ||
    apiTask?.assignedTo?.name ||
    "Unassigned";
  const reporterName =
    apiTask?.createdBy?.username ||
    apiTask?.createdBy?.email ||
    apiTask?.createdBy?.name ||
    "Reporter";

  return {
    id: apiTask?.id?.toString?.() ?? `${apiTask?.id ?? "0"}`,
    title: apiTask?.title ?? "Untitled Task",
    description: apiTask?.description ?? "",
    status: statusFromApiValue(apiTask?.status),
    priority: "medium",
    assignee: {
      id: apiTask?.assignedToId ?? apiTask?.assignedTo?.id,
      name: assigneeName,
      avatar: "",
      initials: getInitials(assigneeName),
    },
    reporter: {
      id: apiTask?.createdById ?? apiTask?.createdBy?.id,
      name: reporterName,
      avatar: "",
      initials: getInitials(reporterName),
    },
    createdAt: apiTask?.createdAt ?? new Date().toISOString(),
    updatedAt: apiTask?.updatedAt ?? new Date().toISOString(),
    dueDate: apiTask?.updatedAt ?? new Date().toISOString(),
    labels: [],
    archived: apiTask?.isArchived ?? false,
    activity: [],
  };
};

const mapToApiStatus = (status: TaskStatus): number => {
  switch (status) {
    case "todo":
      return 0;
    case "development":
      return 1;
    case "review":
      return 2;
    case "merge":
      return 3;
    case "done":
      return 4;
    default:
      return 0;
  }
};

export const createTask = async (
  apiBaseUrl: string,
  payload: {
    title: string;
    description?: string;
    status: TaskStatus;
    assignedToId?: number | null;
  }
): Promise<Task> => {
  const response = await fetch(`${apiBaseUrl}/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      title: payload.title,
      description: payload.description,
      status: mapToApiStatus(payload.status),
      assignedToId: payload.assignedToId ?? null,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to create task: ${response.status} ${response.statusText}`
    );
  }

  const body = await response.json();
  return mapApiTask(body);
};

export const fetchTasks = async (apiBaseUrl: string): Promise<Task[]> => {
  const response = await fetch(`${apiBaseUrl}/api/tasks`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to load tasks: ${response.status} ${response.statusText}`
    );
  }

  const payload = await response.json();
  const list = Array.isArray(payload?.data) ? payload.data : payload;
  return (list as any[]).map(mapApiTask);
};

export async function fetchTaskById(
  apiBaseUrl: string,
  taskId: string
): Promise<{ task: Task; cacheStatus: 'HIT' | 'MISS' }> {
  const response = await fetch(`${apiBaseUrl}/api/tasks/${taskId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error('Failed to fetch task');
  }

  const header = response.headers.get('X-Cache')?.toUpperCase().trim();
  const cacheStatus = header === 'HIT' ? 'HIT' : 'MISS';

  const task = await response.json();

  return { task, cacheStatus };
}

export const updateTaskStatus = async (
  apiBaseUrl: string,
  id: string,
  task: Task
): Promise<Task> => {
  const response = await fetch(`${apiBaseUrl}/api/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      title: task.title,
      description: task.description,
      status: mapToApiStatus(task.status),
      assignedToId: task.assignee?.id ?? null,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to update task: ${response.status} ${response.statusText}`
    );
  }

  const payload = await response.json();
  const mapped = mapApiTask(payload);

  // If the API does not return navigation data, preserve the known assignee info
  if (
    mapped.assignee &&
    mapped.assignee.id === (task.assignee?.id ?? mapped.assignee.id) &&
    mapped.assignee.name === "Unassigned" &&
    task.assignee?.name
  ) {
    mapped.assignee = {
      ...mapped.assignee,
      name: task.assignee.name,
      initials: task.assignee.initials,
      avatar: task.assignee.avatar,
    };
  }

  return mapped;
};

export const updateTask = async (
  apiBaseUrl: string,
  id: string,
  payload: {
    title: string;
    description?: string;
    status: TaskStatus;
    assignedToId?: number | null;
  }
): Promise<Task> => {
  const response = await fetch(`${apiBaseUrl}/api/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      title: payload.title,
      description: payload.description,
      status: mapToApiStatus(payload.status),
      assignedToId: payload.assignedToId ?? null,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to update task: ${response.status} ${response.statusText}`
    );
  }

  const body = await response.json();
  return mapApiTask(body);
};

export async function deleteTask(
  apiBaseUrl: string,
  taskId: string
): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/api/tasks/${taskId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete task");
  }
}
