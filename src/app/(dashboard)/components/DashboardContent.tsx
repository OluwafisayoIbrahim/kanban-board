"use client";
import React from 'react';
import { Plus, Calendar, Tag, Clock, Sparkles, Trash2, ChevronDown, BarChart3, CheckCircle, AlertCircle, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/index';
import { KanbanBoardProps } from '@/types/index';



const KanbanBoard = ({ tasks, onDeleteTask, onUpdateTask, onCreateTask }: KanbanBoardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'normal': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'todo': return 'bg-slate-100 text-slate-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'review': return 'bg-purple-100 text-purple-700';
      case 'done': return 'bg-green-100 text-green-700';
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

      {onCreateTask && (
        <Button 
          onClick={onCreateTask}
          className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Create Task
        </Button>
      )}
    </div>
  );

  const TaskCard = ({ task, onDelete, onUpdate }: { 
    task: Task; 
    onDelete?: (taskId: string) => void;
    onUpdate?: (taskId: string, updates: { title?: string; description?: string; status?: string; priority?: 'Normal' | 'Warning' | 'Urgent'; due_date?: string; position?: number }) => void;
  }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 line-clamp-2">
            {task.title}
          </h3>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            {onDelete && (
              <Button
                onClick={() => onDelete(task.id)}
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded text-red-500 hover:text-red-700"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {task.description && (
          <p className="text-gray-600 text-sm line-clamp-3">{task.description}</p>
        )}

        {Array.isArray(task.tags) && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {task.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            {task.due_date ? formatDate(task.due_date) : 'No due date'}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={task.status}
                onChange={(e) => onUpdate?.(task.id, { status: e.target.value })}
                className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(task.status)} appearance-none pr-8 cursor-pointer hover:opacity-80 transition-opacity`}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              {task.assignees && task.assignees.length > 0 
                ? (task.assignees[0]?.name || task.assignees[0]?.username || "?").charAt(0).toUpperCase()
                : "?"}
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
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">
                  {tasks.length === 0 
                    ? "Welcome! Start by creating your first task." 
                    : `You have ${tasks.length} task${tasks.length !== 1 ? 's' : ''} to manage.`
                  }
                </p>
              </div>
            </div>
          </div>
          
          {tasks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Total Tasks', value: tasks.length, bgColor: 'bg-indigo-100', iconColor: 'text-indigo-600', icon: Target },
                { label: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length, bgColor: 'bg-blue-100', iconColor: 'text-blue-600', icon: Clock },
                { label: 'Completed', value: tasks.filter(t => t.status === 'done').length, bgColor: 'bg-green-100', iconColor: 'text-green-600', icon: CheckCircle },
                { label: 'Urgent', value: tasks.filter(t => t.priority === 'urgent' || t.priority === 'high').length, bgColor: 'bg-red-100', iconColor: 'text-red-600', icon: AlertCircle }
              ].map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                        <IconComponent className={`w-6 h-6 ${stat.iconColor}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tasks.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onDelete={onDeleteTask}
                  onUpdate={onUpdateTask}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default KanbanBoard; 