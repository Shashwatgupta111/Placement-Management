import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle, Clock, AlertCircle, Calendar, User, Flag, Filter, Search, RefreshCw } from 'lucide-react';
import { fetchCoordinatorTasksApi, updateTaskStatusApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useNotifications } from '../../context/NotificationContext';
import Skeleton from '../../components/UI/Skeleton';
import EmptyState from '../../components/UI/EmptyState';

const priorityColors = {
  High: 'text-red-600 bg-red-50 border-red-200',
  Medium: 'text-amber-600 bg-amber-50 border-amber-200',
  Low: 'text-emerald-600 bg-emerald-50 border-emerald-200'
};

const statusColors = {
  Pending: 'text-blue-600 bg-blue-50 border-blue-200',
  Completed: 'text-emerald-600 bg-emerald-50 border-emerald-200'
};

const timeAgo = (date) => {
  if (!date) return 'No deadline';
  const now = new Date();
  const deadline = new Date(date);
  const diffTime = deadline - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  return `Due in ${diffDays} days`;
};

export default function Tasks() {
  const { showToast } = useToast();
  const { addNotification } = useNotifications();
  const coordinatorId = localStorage.getItem('userId');
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingTask, setUpdatingTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, [coordinatorId]);

  const loadTasks = async () => {
    if (!coordinatorId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const { data } = await fetchCoordinatorTasksApi(coordinatorId);
      // Fetch both pending and completed tasks
      const allTasks = Array.isArray(data) ? data : [];
      
      // Also fetch completed tasks by making another call or filtering
      // For now, we'll work with what we have and assume the API returns all tasks
      setTasks(allTasks);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      showToast('Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (taskId, taskTitle) => {
    try {
      setUpdatingTask(taskId);
      await updateTaskStatusApi(taskId, 'Completed');
      
      // Update local state
      setTasks(prev => prev.map(task => 
        task._id === taskId ? { ...task, status: 'Completed' } : task
      ));
      
      showToast(`Task "${taskTitle}" marked as completed!`, 'success');
      
      // Add notification
      addNotification({
        title: 'Task Completed',
        message: `You have successfully completed the task: ${taskTitle}`,
        type: 'success'
      });
    } catch (err) {
      console.error('Failed to update task:', err);
      showToast('Failed to mark task as complete', 'error');
    } finally {
      setUpdatingTask(null);
    }
  };

  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    
    // Filter by status
    if (activeFilter !== 'All') {
      filtered = filtered.filter(task => task.status === activeFilter);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [tasks, activeFilter, searchQuery]);

  const taskStats = useMemo(() => {
    const pending = tasks.filter(t => t.status === 'Pending').length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const overdue = tasks.filter(t => {
      if (t.status === 'Completed' || !t.deadline) return false;
      return new Date(t.deadline) < new Date();
    }).length;
    
    return { total: tasks.length, pending, completed, overdue };
  }, [tasks]);

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-indigo-600" /> Tasks
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage your assigned tasks and track progress</p>
        </div>
        <button
          onClick={loadTasks}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{taskStats.total}</p>
            </div>
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-blue-600">{taskStats.pending}</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-emerald-600">{taskStats.completed}</p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{taskStats.overdue}</p>
            </div>
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-4">
        <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200 inline-flex w-fit">
          {['All', 'Pending', 'Completed'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                activeFilter === filter
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {filter}
              {filter === 'Pending' && taskStats.pending > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-700 px-1.5 rounded text-[10px]">
                  {taskStats.pending}
                </span>
              )}
            </button>
          ))}
        </div>
        
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <EmptyState
            icon={CheckCircle}
            title="No tasks found"
            description={searchQuery ? "Try adjusting your search or filters" : "You don't have any tasks assigned yet"}
          />
        ) : (
          filteredTasks.map(task => (
            <div
              key={task._id}
              className={`bg-white rounded-xl border shadow-sm p-6 hover:shadow-md transition-all ${
                task.status === 'Completed' ? 'border-gray-100 opacity-75' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`text-lg font-bold ${task.status === 'Completed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                      {task.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[task.status]}`}>
                      {task.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}>
                      <Flag className="w-3 h-3 inline mr-1" />
                      {task.priority}
                    </span>
                  </div>
                  
                  {task.description && (
                    <p className="text-gray-600 mb-3 leading-relaxed">{task.description}</p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {task.deadline && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span className={new Date(task.deadline) < new Date() && task.status !== 'Completed' ? 'text-red-600 font-medium' : ''}>
                          {timeAgo(task.deadline)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>Assigned to you</span>
                    </div>
                  </div>
                </div>
                
                {task.status === 'Pending' && (
                  <button
                    onClick={() => handleMarkComplete(task._id, task.title)}
                    disabled={updatingTask === task._id}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                  >
                    {updatingTask === task._id ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    Mark Complete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
