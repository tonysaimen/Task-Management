import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppHooks';
import { fetchTasks, createTask, deleteTask, updateTask, setFilters } from '../store/taskSlice';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import TaskFilters from '../components/TaskFilters';
import '../styles/Tasks.css';

const Tasks: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tasks, isLoading, error, filters } = useAppSelector((state) => state.tasks);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks(filters));
  }, [filters, dispatch]);

  const handleCreateTask = (taskData: any) => {
    dispatch(createTask(taskData));
    setShowForm(false);
  };

  const handleUpdateTask = (id: string, taskData: any) => {
    dispatch(updateTask({ id, taskData }));
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(id));
    }
  };

  const handleFilterChange = (newFilters: any) => {
    dispatch(setFilters(newFilters));
  };

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1>My Tasks</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancel' : '+ New Task'}
        </button>
      </div>

      {showForm && (
        <TaskForm onSubmit={handleCreateTask} onCancel={() => setShowForm(false)} />
      )}

      <TaskFilters onFilterChange={handleFilterChange} currentFilters={filters} />

      {error && <div className="error-alert">{error}</div>}

      <div className="tasks-list">
        {isLoading ? (
          <div className="loading">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks found. Create your first task!</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Tasks;
