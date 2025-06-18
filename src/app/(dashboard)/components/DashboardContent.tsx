"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Calendar, User, AlertTriangle, Tag, FileText, Clock, Sparkles } from 'lucide-react';
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'To Do' | 'In Progress' | 'Review' | 'Done';
  tags: string[];
  createdAt: string;
}

const DashboardPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: '',
    dueDate: '',
    priority: 'Medium' as Task['priority'],
    tags: ''
  });

  // Load tasks from memory on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('kanban-tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to memory whenever tasks change
  useEffect(() => {
    localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.assignee || !formData.dueDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    const newTask: Task = {
      id: Date.now().toString(),
      ...formData,
      status: 'To Do',
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      createdAt: new Date().toISOString()
    };

    setTasks(prev => [...prev, newTask]);
    setFormData({
      title: '',
      description: '',
      assignee: '',
      dueDate: '',
      priority: 'Medium',
      tags: ''
    });
    setIsDialogOpen(false);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Urgent': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'To Do': return 'bg-slate-100 text-slate-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Review': return 'bg-purple-100 text-purple-700';
      case 'Done': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6 bg-gradient-to-br from-indigo-50 to-white rounded-2xl border border-indigo-100 p-12">
      <div className="relative">
        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
          <Plus className="w-4 h-4 text-white" />
        </div>
      </div>
      
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-900">Ready to get started?</h2>
        <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
          Create your first task and start organizing your workflow. Every great project begins with a single task!
        </p>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
          <button className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Create Your First Task
            <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </AlertDialogTrigger>
        <TaskFormDialog />
      </AlertDialog>
    </div>
  );

  const TaskFormDialog = () => (
    <AlertDialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <AlertDialogHeader>
        <AlertDialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Create New Task
        </AlertDialogTitle>
      </AlertDialogHeader>
      
      <div className="space-y-6 mt-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FileText className="w-4 h-4" />
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
                <User className="w-4 h-4" />
                Assignee *
              </label>
              <input
                type="text"
                name="assignee"
                value={formData.assignee}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter assignee name..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
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

          {/* Priority and Tags Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Tag className="w-4 h-4" />
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

        {/* Submit Button */}
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
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Create Task
          </button>
        </div>
      </div>
    </AlertDialogContent>
  );

  // Task card component
  const TaskCard = ({ task }: { task: Task }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 line-clamp-2">
            {task.title}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-gray-600 text-sm line-clamp-3">{task.description}</p>
        )}

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {task.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            {formatDate(task.dueDate)}
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
              {task.status}
            </span>
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              {task.assignee.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                {tasks.length === 0 
                  ? "Welcome! Start by creating your first task." 
                  : `You have ${tasks.length} task${tasks.length !== 1 ? 's' : ''} to manage.`
                }
              </p>
            </div>
            
            {tasks.length > 0 && (
              <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogTrigger asChild>
                  <button className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
                    <Plus className="w-5 h-5" />
                    New Task
                  </button>
                </AlertDialogTrigger>
                <TaskFormDialog />
              </AlertDialog>
            )}
          </div>

          {/* Stats Cards */}
          {tasks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Total Tasks', value: tasks.length, color: 'indigo' },
                { label: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length, color: 'blue' },
                { label: 'Completed', value: tasks.filter(t => t.status === 'Done').length, color: 'green' },
                { label: 'Urgent', value: tasks.filter(t => t.priority === 'Urgent').length, color: 'red' }
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                      <Clock className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Main Content */}
          {tasks.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;