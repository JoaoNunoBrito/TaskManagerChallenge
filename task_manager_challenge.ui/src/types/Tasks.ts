export interface Task {
  id: string;
  title: string;
  dueDate: string;
  description?: string;
  isCompleted?: boolean;
}

export interface CreateTask {
  title: string;
  dueDate: string;
  description: string;
  isCompleted: boolean;
}
