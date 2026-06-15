import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  const colorClass = {
    blue: '#3498db',
    green: '#2ecc71',
    orange: '#f39c12',
    red: '#e74c3c',
  }[color] || '#3498db';

  return (
    <div className="stat-card" style={{ borderLeftColor: colorClass }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <p className="stat-label">{title}</p>
        <h3 className="stat-value">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
