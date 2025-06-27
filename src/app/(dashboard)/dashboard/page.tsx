"use client";
import { JSX, useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "@/components/Footer";
import KanbanBoard from "../components/DashboardContent";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X, Calendar, User, AlertTriangle, Tag, FileText } from 'lucide-react';
import { getBoardTasks, createTask, deleteTask, updateTask } from "@/app/api/tasks";
import { getFriends } from "@/app/api/friends";
import { Task } from "@/types/index";
import { FriendResponse } from "@/types/index";
import { useAuthStore } from "@/store/auth-store";

export default function DashboardPage(): JSX.Element {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const user = useAuthStore.getState().user;
  const [boardId, setBoardId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [friends, setFriends] = useState<FriendResponse[]>([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee_id: '',
    dueDate: '',
    priority: 'Normal',
    tags: ''
  });
  const [tasks, setTasks] = useState<Task[]>([]);

  // Set board ID to user ID (this will be the board ID)
  useEffect(() => {
    if (user?.id) {
      // Check if we have a stored board ID for this user
      const storedBoardId = localStorage.getItem(`board_id_${user.id}`);
      if (storedBoardId) {
        setBoardId(storedBoardId);
      } else {
        setBoardId(user.id);
      }
    }
  }, [user?.id]);

  // Debug: Log the boardId and user info
  useEffect(() => {
    console.log('Current user:', user);
    console.log('Board ID:', boardId);
  }, [user, boardId]);

  // Store board ID in localStorage when it changes
  useEffect(() => {
    if (boardId && user?.id) {
      localStorage.setItem(`board_id_${user.id}`, boardId);
    }
  }, [boardId, user?.id]);

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      if (!boardId) return;

      try {
        setIsLoading(true);
        setError(null);
        console.log('Fetching tasks for board:', boardId);
        const fetchedTasks = await getBoardTasks(boardId);
        setTasks(fetchedTasks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
        console.error('Error fetching tasks:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [boardId]);

  // Fetch friends for assignee dropdown
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setIsLoadingFriends(true);
        const fetchedFriends = await getFriends();
        setFriends(fetchedFriends);
      } catch (err) {
        console.error('Error fetching friends:', err);
      } finally {
        setIsLoadingFriends(false);
      }
    };

    fetchFriends();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    // Convert tags string to array, trimming whitespace and removing empty tags
    const tagsArray = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
        status: 'todo',
        priority: formData.priority.toLowerCase(),
        board_id: boardId,
        due_date: new Date(formData.dueDate).toISOString(),
        position: tasks.length + 1,
        tags: tagsArray,
        ...(formData.assignee_id && { assignee_id: formData.assignee_id })
      };

      const newTask = await createTask(taskData);
      
      if (newTask.board_id && newTask.board_id !== boardId) { 
        console.log('Updating board ID from', boardId, 'to', newTask.board_id);
        setBoardId(newTask.board_id);
      }
      
      setTasks(prev => [...prev, newTask]);

      setFormData({
        title: '',
        description: '',
        assignee_id: '',
        dueDate: '',
        priority: 'Normal',
        tags: ''
      });
      setIsDialogOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      alert(errorMessage);
      console.error('Error creating task:', err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      alert('Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: any) => {
    try {
      const updatedTask = await updateTask(taskId, updates);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
    } catch (err) {
      alert('Failed to update task');
      console.error('Error updating task:', err);
    }
  };

  const handleCreateTask = () => {
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                <Plus className="w-6 h-6" />
                Create New Task
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 mt-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Task Title *
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full"
                    placeholder="Enter task title..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Description
                  </Label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Describe the task in detail..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assignee" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Assignee (Optional)
                    </Label>
                    <select
                      id="assignee"
                      name="assignee_id"
                      value={formData.assignee_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select a friend...</option>
                      {isLoadingFriends ? (
                        <option value="" disabled>Loading friends...</option>
                      ) : (
                        friends.map((friend) => (
                          <option key={friend.friend.id} value={friend.friend.id}>
                            {friend.friend.username || friend.friend.email}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Due Date *
                    </Label>
                    <Input
                      id="dueDate"
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Priority
                    </Label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Warning">Warning</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Tags
                    </Label>
                    <Input
                      id="tags"
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="w-full"
                      placeholder="UI, Design, Frontend (comma separated)"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {isLoading ? 'Creating...' : 'Create Task'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-lg">Loading tasks...</div>
          </div>
        ) : (
          <KanbanBoard 
            tasks={tasks} 
            onDeleteTask={handleDeleteTask}
            onUpdateTask={handleUpdateTask}
            onCreateTask={handleCreateTask}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}