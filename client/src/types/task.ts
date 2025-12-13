export type TaskStatus = "todo" | "development" | "review" | "merge" | "done";
export type TaskPriority = "highest" | "high" | "medium" | "low";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: {
    id?: number;
    name: string;
    avatar: string;
    initials: string;
  };
  reporter: {
    id?: number;
    name: string;
    avatar: string;
    initials: string;
  };
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  labels: string[];
  archived?: boolean;
  activity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: "comment" | "status" | "assignment" | "update";
  user: {
    name: string;
    avatar: string;
    initials: string;
  };
  timestamp: string;
  content: string;
}
