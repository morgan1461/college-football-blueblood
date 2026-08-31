import { useState } from 'react';

const BLUE_BLOODS = [
  {
    name: 'Alabama Crimson Tide',
    conference: 'SEC',
    nationalTitles: 18,
    color: '#9E1B32',
  },
  {
    name: 'Ohio State Buckeyes',
    conference: 'Big Ten',
    nationalTitles: 8,
    color: '#BB0000',
  },
  {
    name: 'Oklahoma Sooners',
    conference: 'SEC',
    nationalTitles: 7,
    color: '#841617',
  },
  {
    name: 'Notre Dame Fighting Irish',
    conference: 'Independent',
    nationalTitles: 11,
    color: '#0C2340',
  },
  {
    name: 'USC Trojans',
    conference: 'Big Ten',
    nationalTitles: 11,
    color: '#990000',
  },
  {
    name: 'Michigan Wolverines',
    conference: 'Big Ten',
    nationalTitles: 12,
    color: '#00274C',
  },
  {
    name: 'Nebraska Cornhuskers',
    conference: 'Big Ten',
    nationalTitles: 5,
    color: '#E41C38',
  },
  {
    name: 'Texas Longhorns',
    conference: 'SEC',
    nationalTitles: 4,
    color: '#BF5700',
  },
];

export default function BlueBloods() {
  const [sortBy, setSortBy] = useState('nationalTitles');

  const sorted = [...BLUE_BLOODS].sort((a, b) => {
    if (sortBy === 'nationalTitles') return b.nationalTitles - a.nationalTitles;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="panel">
      <h2>College Football Blue Bloods</h2>
      <p className="subtitle">
        The eight programs historically recognized as college football&apos;s elite.
      </p>
      <div className="controls">
        <label>
          Sort by:{' '}
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="nationalTitles">National Titles</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>
      <div className="card-grid">
        {sorted.map((team) => (
          <div
            key={team.name}
            className="card"
            style={{ borderLeft: `4px solid ${team.color}` }}
          >
            <h3>{team.name}</h3>
            <p>Conference: {team.conference}</p>
            <p className="stat">
              <span className="stat-number">{team.nationalTitles}</span> National
              Titles
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
