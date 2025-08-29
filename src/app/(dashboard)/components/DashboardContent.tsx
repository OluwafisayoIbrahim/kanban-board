"use client";
import React from 'react';
import { Plus, Calendar, Tag, Clock, Sparkles, Trash2, ChevronDown, BarChart3, CheckCircle, AlertCircle, Target, Edit2, PencilIcon, Laptop, Plug, Rocket, Phone, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/index';
import { KanbanBoardProps } from '@/types/index';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

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
    }).toUpperCase();
  };

  const getTaskIcon = (title: string, tags: string[]) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('design')) return <PencilIcon className="w-5 h-5" />;
    if (lowerTitle.includes('ui')) return <Laptop className="w-5 h-5" />;
    if (lowerTitle.includes('api')) return <Plug className="w-5 h-5" />;
    if (lowerTitle.includes('ci/cd')) return <Rocket className="w-5 h-5" />;
    if (lowerTitle.includes('mobile')) return <Phone className="w-5 h-5" />;
    if (lowerTitle.includes('review')) return <Eye className="w-5 h-5" />;
    return <Tag className="w-5 h-5" />;
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6 bg-white rounded-2xl border border-gray-200 p-12">
      <div className="relative">
        <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center shadow-lg">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center shadow-md">
          <Plus className="w-4 h-4 text-black" />
        </div>
      </div>
      
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-black">Ready to get started?</h2>
        <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
          Create your first task and start organizing your workflow. Every great project begins with a single task!
        </p>
      </div>

      {onCreateTask && (
        <Button 
          onClick={onCreateTask}
          className="group relative inline-flex items-center gap-3 bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Create Task
        </Button>
      )}
    </div>
  );

  const handleStatusChange = (taskId: string, value: string) => {
    onUpdateTask?.(taskId, { status: value });
  };

  const TaskCard = ({ task, onDelete, onUpdate }: { 
    task: Task; 
    onDelete?: (taskId: string) => void;
    onUpdate?: (taskId: string, updates: { title?: string; description?: string; status?: string; priority?: 'Normal' | 'Warning' | 'Urgent'; due_date?: string; position?: number }) => void;
  }) => {
    const assignee = task.assignees && task.assignees.length > 0 ? task.assignees[0] : null;
    const assigneeName = assignee ? (assignee.name || assignee.username || "Unknown") : "Unassigned";
    const tag = Array.isArray(task.tags) && task.tags.length > 0 ? task.tags[0] : null;

    return (
      <Card className="hover:shadow-lg transition-all duration-300 group bg-white border-gray-200">
        <CardHeader className="pb-2 flex flex-row items-center gap-2">
          {getTaskIcon(task.title, task.tags || [])}
          <CardTitle className="font-semibold text-black text-lg line-clamp-2">
            {task.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-6 pt-0">
          {task.description && (
            <p className="text-gray-600 text-sm line-clamp-3">{task.description}</p>
          )}

          <div className="text-sm text-gray-600">
            {task.due_date ? formatDate(task.due_date) : 'No due date'}
          </div>

          <div className="text-sm text-gray-600 flex items-center gap-2">
            Assigned to: {assigneeName}
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-black text-xs font-semibold">
              {assigneeName.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="flex items-center justify-between">
            {tag && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                {tag}
              </span>
            )}
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-black">
              <Plus className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-black" onClick={() => onUpdate?.(task.id, { title: task.title + ' (edited)' })}>
              <Edit2 className="w-4 h-4" />
            </Button>
            {onDelete && (
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-500" onClick={() => onDelete(task.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">To Do</h1>
        </div>

        {tasks.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} onDelete={onDeleteTask} onUpdate={onUpdateTask} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanBoard;