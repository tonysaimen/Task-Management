import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppHooks';
import { fetchDashboardStats, fetchRecentActivity } from '../store/dashboardSlice';
import StatCard from '../components/StatCard';
import RecentActivityList from '../components/RecentActivityList';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stats, activities, isLoading, onlineUsers } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchRecentActivity());
  }, [dispatch]);

  if (isLoading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's your task overview.</p>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Tasks"
          value={stats?.totalTasks || 0}
          icon="📋"
          color="blue"
        />
        <StatCard
          title="Completed"
          value={stats?.completedTasks || 0}
          icon="✓"
          color="green"
        />
        <StatCard
          title="In Progress"
          value={stats?.inProgressTasks || 0}
          icon="⏳"
          color="orange"
        />
        <StatCard
          title="Pending"
          value={stats?.pendingTasks || 0}
          icon="⏱️"
          color="red"
        />
      </div>

      <div className="presence-card">
        <h2>Live Presence</h2>
        <p>{onlineUsers} user{onlineUsers === 1 ? '' : 's'} currently online</p>
      </div>

      <div className="dashboard-content">
        <div className="completion-info">
          <h2>Completion Rate</h2>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${stats?.completionRate || 0}%` }}
            ></div>
          </div>
          <p className="completion-text">{stats?.completionRate || 0}% Complete</p>
        </div>

        <div className="alerts">
          {stats?.highPriorityTasks ? (
            <div className="alert alert-warning">
              ⚠️ {stats.highPriorityTasks} high priority task(s)
            </div>
          ) : null}
          {stats?.overdueTasks ? (
            <div className="alert alert-danger">
              ❌ {stats.overdueTasks} overdue task(s)
            </div>
          ) : null}
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <RecentActivityList activities={activities} />
      </div>
    </div>
  );
};

export default Dashboard;
