import React from 'react';
import '../styles/SideBar.css';

function Sidebar({ filters, setFilter }) {
  // List of majors to display in the sidebar
  const majorsToShow = [
    'Any',
    'Arts',
    'Computer Science',
    'Finance',
    'Engineering',
    'Data Science',
    'Business',
    'Pre-Med'
  ];

  // when user clicks a checkbox
  function toggleMajor(major) {
    // Check if the major is already in the selected list
    const isSelected = filters.majors.includes(major);

    let updatedMajors;

    if (isSelected) {
      // Remove major if it was already selected
      updatedMajors = filters.majors.filter((m) => m !== major);
    } else {
      // Add major to the selected list
      updatedMajors = [...filters.majors, major];
    }

    // Update the filter state with new majors list
    setFilter({
      ...filters,
      majors: updatedMajors
    });
  }

  return (
    <div className="sidebar">
      <h2>Filter by Major</h2>

      {majorsToShow.map((major) => (
        <label key={major}>
          <input
            type="checkbox"
            checked={filters.majors.includes(major)}
            onChange={() => toggleMajor(major)}
          />
          {major}
        </label>
      ))}
    </div>
  );
}

export default Sidebar;
