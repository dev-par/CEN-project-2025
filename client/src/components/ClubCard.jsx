import React from 'react';

function ClubCard({ club }) {
  let majors = [];
// make sure major is in array
  if (Array.isArray(club.major)) {
    majors = club.major;
  } else {
    majors = [club.major];
  }

  return (
    <div className="club-card">
      <h2>{club.name}</h2>
      <p>{club.description}</p>
      <p><strong>Major:</strong> {majors.join(', ')}</p>
      <p><strong>Chill Meter:</strong> {club.chillMeter}</p>
    </div>
  );
}

export default ClubCard;
