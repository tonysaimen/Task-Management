import React from 'react';
import { Task } from '../types';

interface RecentActivityListProps {
  activities: Task[];
}

const RecentActivityList: React.FC<RecentActivityListProps> = ({ activities }) => {
  if (activities.length === 0) {
    return <p>No recent activity</p>;
  }

  return (
    <div className="activity-list">
      {activities.map((task) => (
        <div key={task._id} className="activity-item">
          <div className="activity-status">
            {task.status === 'completed' && '✓'}
            {task.status === 'in-progress' && '⏳'}
            {task.status === 'pending' && '⏱️'}
          </div>
          <div className="activity-content">
            <h4>{task.title}</h4>
            <p>{new Date(task.updatedAt).toLocaleDateString()}</p>
          </div>
          <span className="activity-badge">{task.status}</span>
        </div>
      ))}
    </div>
  );
};

export default RecentActivityList;
