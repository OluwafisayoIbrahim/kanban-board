import { getRequest, postRequest, putRequest, deleteRequest } from "@/lib/api";
import { Task } from "@/types/index";

// Types for task operations
interface TaskCreate {
  title: string;
  description: string;
  status: string;
  priority: 'Normal' | 'Warning' | 'Urgent';
  board_id: string;
  assignee_id?: string;
  due_date: string;
  position?: number;
}

interface TaskUpdate {
  title?: string;
  description?: string;
  status?: string;
  priority?: 'Normal' | 'Warning' | 'Urgent';
  due_date?: string;
  position?: number;
}

interface TaskAssignee {
  user_id: string;
  role: string;
}

interface MoveTaskData {
  status?: string;
  position?: number;
}

// Get all tasks for a specific board
export const getBoardTasks = async (boardId: string): Promise<Task[]> => {
  try {
    const response = await getRequest(`/api/tasks/board/${boardId}`);
    
    if (Array.isArray(response)) {
      return response;
    } else if (response && Array.isArray(response.tasks)) {
      return response.tasks;
    } else if (response && Array.isArray(response.data)) {
      return response.data;
    } else {
      return [];
    }
  } catch {
    return [];
  }
};

// Get a specific task by ID
export const getTaskById = async (taskId: string): Promise<Task | null> => {
  try {
    const response = await getRequest(`/api/tasks/${taskId}`);
    return response;
  } catch {
    return null;
  }
};

// Create a new task
export const createTask = async (taskData: TaskCreate): Promise<Task> => {
  try {
    // Note: Backend should auto-create a board for the user if it doesn't exist
    // The board_id should be the user's ID, and if no board exists with that ID,
    // the backend should create one automatically
    const response = await postRequest('/api/tasks/', taskData);
    return response as Task;
  } catch {
    throw new Error('Failed to create task');
  }
};

// Update a task
export const updateTask = async (taskId: string, taskData: TaskUpdate): Promise<Task> => {
  try {
    const response = await putRequest(`/api/tasks/${taskId}`, taskData);
    return response as Task;
  } catch {
    throw new Error('Failed to update task');
  }
};

// Delete a task
export const deleteTask = async (taskId: string): Promise<{ message: string; status: string }> => {
  try {
    const response = await deleteRequest(`/api/tasks/${taskId}`);
    return response as { message: string; status: string };
  } catch {
    throw new Error('Failed to delete task');
  }
};

// Assign a user to a task
export const assignUserToTask = async (taskId: string, assigneeData: TaskAssignee): Promise<{ message: string; task_id: string; user_id: string; role: string; status: string }> => {
  try {
    const response = await postRequest(`/api/tasks/${taskId}/assignees`, assigneeData);
    return response as { message: string; task_id: string; user_id: string; role: string; status: string };
  } catch {
    throw new Error('Failed to assign user to task');
  }
};

// Remove a user from a task
export const removeUserFromTask = async (taskId: string, userId: string): Promise<{ message: string; task_id: string; user_id: string; status: string }> => {
  try {
    const response = await deleteRequest(`/api/tasks/${taskId}/assignees/${userId}`);
    return response as { message: string; task_id: string; user_id: string; status: string };
  } catch {
    throw new Error('Failed to remove user from task');
  }
};

// Get all assignees for a task
export const getTaskAssignees = async (taskId: string): Promise<any[]> => {
  try {
    const response = await getRequest(`/api/tasks/${taskId}/assignees`);
    
    if (Array.isArray(response)) {
      return response;
    } else if (response && Array.isArray(response.assignees)) {
      return response.assignees;
    } else if (response && Array.isArray(response.data)) {
      return response.data;
    } else {
      return [];
    }
  } catch {
    return [];
  }
};

// Move task to different status/position
export const moveTask = async (taskId: string, moveData: MoveTaskData): Promise<{ message: string; task: Task; status: string }> => {
  try {
    const response = await postRequest(`/api/tasks/${taskId}/move`, moveData);
    return response as { message: string; task: Task; status: string };
  } catch {
    throw new Error('Failed to move task');
  }
}; 