import React from 'react';

interface TaskFiltersProps {
  onFilterChange: (filters: any) => void;
  currentFilters: any;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ onFilterChange, currentFilters }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({
      ...currentFilters,
      [name]: value || undefined,
    });
  };

  const handleClear = () => {
    onFilterChange({});
  };

  return (
    <div className="task-filters">
      <div className="filter-group">
        <input
          type="text"
          name="search"
          placeholder="🔍 Search tasks..."
          onChange={handleChange}
          value={currentFilters.search || ''}
        />

        <select
          name="status"
          onChange={handleChange}
          value={currentFilters.status || ''}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          name="priority"
          onChange={handleChange}
          value={currentFilters.priority || ''}
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button className="btn btn-secondary" onClick={handleClear}>
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default TaskFilters;
