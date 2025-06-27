"use client";
import { JSX, useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "@/components/Footer";
import KanbanBoard from "../components/DashboardContent";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getBoardTasks, createTask } from "@/app/api/tasks";
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
      setBoardId(user.id);
    }
  }, [user?.id]);

  // Debug: Log the boardId and user info
  useEffect(() => {
    console.log('Current user:', user);
    console.log('Board ID:', boardId);
  }, [user, boardId]);

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

    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
        status: 'To Do',
        priority: formData.priority as 'Normal' | 'Warning' | 'Urgent',
        board_id: boardId,
        due_date: new Date(formData.dueDate).toISOString(),
        position: tasks.length + 1,
        ...(formData.assignee_id && { assignee_id: formData.assignee_id })
      };

      console.log('Creating task with data:', taskData);
      console.log('Board ID being sent:', boardId);

      const newTask = await createTask(taskData);
      setTasks(prev => [...prev, newTask]);

      // Reset form
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

  return (
    <>
      <Header />
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {tasks.length === 0 && (
          <DialogTrigger asChild>
            <button onClick={() => setIsDialogOpen(true)} className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Create Task
            </button>
          </DialogTrigger>
        )}
        <DialogContent showCloseButton={false} className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Create New Task
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter task title..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Description</label>
                <textarea
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
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Assignee (Optional)
                  </label>
                  <select
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
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Priority
                  </label>
                  <select
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
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="UI, Design, Frontend (comma separated)"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg">Loading tasks...</div>
        </div>
      ) : (
        <KanbanBoard tasks={tasks} />
      )}
      <Footer />
    </>
  );
}