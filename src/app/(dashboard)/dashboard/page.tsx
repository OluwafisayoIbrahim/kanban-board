"use client";
import { JSX, useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "@/components/Footer";
import KanbanBoard from "../components/DashboardContent";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X, User, AlertTriangle, Tag, FileText, CalendarIcon } from 'lucide-react';
import { getBoardTasks, createTask, deleteTask, updateTask } from "@/app/api/tasks";
import { getFriends } from "@/app/api/friends";
import { Task } from "@/types/index";
import { FriendResponse } from "@/types/index";
import { useAuthStore } from "@/store/auth-store";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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
    tags: '',
    due_date: ''
  });
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (user?.id) {
      const storedBoardId = localStorage.getItem(`board_id_${user.id}`);
      if (storedBoardId) {
        setBoardId(storedBoardId);
      } else {
        setBoardId(user.id);
      }
    }
  }, [user?.id]);


  useEffect(() => {
    if (boardId && user?.id) {
      localStorage.setItem(`board_id_${user.id}`, boardId);
    }
  }, [boardId, user?.id]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!boardId) return;

      try {
        setIsLoading(true);
        setError(null);
        const fetchedTasks = await getBoardTasks(boardId);
        setTasks(fetchedTasks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [boardId]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setIsLoadingFriends(true);
        const fetchedFriends = await getFriends();
        setFriends(fetchedFriends);
      } catch {
        // error handled
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

  // Add these handlers for Select value changes
  const handleAssigneeChange = (value: string) => {
    setFormData(prev => ({ ...prev, assignee_id: value }));
  };
  const handlePriorityChange = (value: string) => {
    setFormData(prev => ({ ...prev, priority: value as 'Normal' | 'Warning' | 'Urgent' }));
  };

  // Add handler for due date
  const handleDueDateChange = (date: Date | undefined) => {
    setFormData(prev => ({ ...prev, due_date: date ? date.toISOString() : '' }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.due_date) {
      alert('Please fill in all required fields');
      return;
    }

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
        due_date: new Date(formData.due_date).toISOString(),
        position: tasks.length + 1,
        tags: tagsArray,
        ...(formData.assignee_id && { assignee_id: formData.assignee_id })
      };

      const newTask = await createTask(taskData);
      
      if (newTask.board_id && newTask.board_id !== boardId) { 
        setBoardId(newTask.board_id);
      }
      
      setTasks(prev => [...prev, newTask]);

      setFormData({
        title: '',
        description: '',
        assignee_id: '',
        dueDate: '',
        priority: 'Normal',
        tags: '',
        due_date: ''
      });
      setIsDialogOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      alert(errorMessage);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch {
      alert('Failed to delete task');
    }
  };

  const handleUpdateTask = async (taskId: string, updates: { title?: string; description?: string; status?: string; priority?: 'Normal' | 'Warning' | 'Urgent'; due_date?: string; position?: number }) => {
    try {
      const updatedTask = await updateTask(taskId, updates);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
    } catch {
      alert('Failed to update task');
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
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Describe the task in detail..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assignee" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Assignee (Optional)
                    </Label>
                    <Select value={formData.assignee_id} onValueChange={handleAssigneeChange}>
                      <SelectTrigger id="assignee" name="assignee_id">
                        <SelectValue placeholder="Select a friend..." />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingFriends ? (
                          <SelectItem value="loading" disabled>Loading friends...</SelectItem>
                        ) : (
                          friends.map((friend) => (
                            <SelectItem key={friend.friend.id} value={friend.friend.id}>
                              {friend.friend.username || friend.friend.email}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due_date" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      Due Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.due_date && "text-muted-foreground"
                          )}
                        >
                          {formData.due_date
                            ? format(new Date(formData.due_date), "PPP")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.due_date ? new Date(formData.due_date) : undefined}
                          onSelect={handleDueDateChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Priority
                    </Label>
                    <Select value={formData.priority} onValueChange={handlePriorityChange}>
                      <SelectTrigger id="priority" name="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Normal">Normal</SelectItem>
                        <SelectItem value="Warning">Warning</SelectItem>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
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