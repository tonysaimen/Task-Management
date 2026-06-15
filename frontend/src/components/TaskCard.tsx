import React from 'react';
import { Task } from '../types';
import '../styles/Components.css';

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete }) => {
  const priorityColor = {
    low: '#94c973',
    medium: '#ffc966',
    high: '#ff6b6b',
  };

  const statusColor = {
    pending: '#ccc',
    'in-progress': '#4ecdc4',
    completed: '#95e1d3',
  };

  const daysUntilDue = Math.ceil(
    (new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="task-card">
      <div className="task-header">
        <div className="task-badges">
          <span
            className="badge priority"
            style={{ backgroundColor: priorityColor[task.priority] }}
          >
            {task.priority}
          </span>
          <span
            className="badge status"
            style={{ backgroundColor: statusColor[task.status] }}
          >
            {task.status}
          </span>
        </div>
        <div className="task-actions">
          <button onClick={() => onDelete(task._id)} className="btn-delete">
            🗑️
          </button>
        </div>
      </div>

      <h3 className="task-title">{task.title}</h3>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      {task.tags && task.tags.length > 0 && (
        <div className="task-tags">
          {task.tags.map((tag) => (
            <span key={tag} className="tag">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="task-footer">
        <div className="task-date">
          📅 {new Date(task.dueDate).toLocaleDateString()}
          {daysUntilDue < 0 && <span className="overdue"> (overdue)</span>}
          {daysUntilDue === 0 && <span className="today"> (today)</span>}
          {daysUntilDue > 0 && daysUntilDue <= 3 && (
            <span className="soon"> ({daysUntilDue} days left)</span>
          )}
        </div>
        <select
          value={task.status}
          onChange={(e) =>
            onUpdate(task._id, { ...task, status: e.target.value })
          }
          className="status-select"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );
};

export default TaskCard;
