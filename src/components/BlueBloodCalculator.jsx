import { useState, useMemo } from 'react';

/*
 * "Blue Blood" datasets for each league.
 * Each franchise has stats relevant to its sport; the calculator scores them
 * using user-adjustable weights so fans can emphasize what matters most to them.
 *
 * Stat values are approximate / historically recognised totals.
 */

const LEAGUES = {
  ncaaf: {
    label: 'NCAAF',
    icon: '🏈',
    description: 'College football programs ranked by historical dominance.',
    weights: {
      championships: { label: 'National Titles', default: 40 },
      wins: { label: 'All-Time Wins', default: 20 },
      bowlWins: { label: 'Bowl Wins', default: 15 },
      heismanWinners: { label: 'Heisman Winners', default: 10 },
      weeksRanked: { label: 'Weeks Ranked AP #1', default: 15 },
    },
    teams: [
      { name: 'Alabama', color: '#9E1B32', championships: 18, wins: 960, bowlWins: 45, heismanWinners: 3, weeksRanked: 130 },
      { name: 'Ohio State', color: '#BB0000', championships: 8, wins: 950, bowlWins: 27, heismanWinners: 7, weeksRanked: 105 },
      { name: 'Notre Dame', color: '#0C2340', championships: 11, wins: 940, bowlWins: 19, heismanWinners: 7, weeksRanked: 100 },
      { name: 'Michigan', color: '#00274C', championships: 12, wins: 980, bowlWins: 22, heismanWinners: 3, weeksRanked: 75 },
      { name: 'USC', color: '#990000', championships: 11, wins: 860, bowlWins: 34, heismanWinners: 7, weeksRanked: 90 },
      { name: 'Oklahoma', color: '#841617', championships: 7, wins: 920, bowlWins: 30, heismanWinners: 7, weeksRanked: 100 },
      { name: 'Nebraska', color: '#E41C38', championships: 5, wins: 900, bowlWins: 26, heismanWinners: 3, weeksRanked: 70 },
      { name: 'Texas', color: '#BF5700', championships: 4, wins: 920, bowlWins: 30, heismanWinners: 2, weeksRanked: 65 },
      { name: 'Clemson', color: '#F56600', championships: 3, wins: 790, bowlWins: 25, heismanWinners: 1, weeksRanked: 50 },
      { name: 'Penn State', color: '#001E44', championships: 2, wins: 910, bowlWins: 30, heismanWinners: 1, weeksRanked: 40 },
      { name: 'LSU', color: '#461D7C', championships: 4, wins: 830, bowlWins: 29, heismanWinners: 2, weeksRanked: 45 },
      { name: 'Florida State', color: '#782F40', championships: 3, wins: 580, bowlWins: 27, heismanWinners: 3, weeksRanked: 55 },
    ],
  },
  nfl: {
    label: 'NFL',
    icon: '🏈',
    description: 'NFL franchises ranked by historical success.',
    weights: {
      championships: { label: 'Super Bowls', default: 40 },
      wins: { label: 'All-Time Wins', default: 20 },
      conferenceChamps: { label: 'Conference Titles', default: 15 },
      playoffAppearances: { label: 'Playoff Appearances', default: 15 },
      hallOfFamers: { label: 'Hall of Famers', default: 10 },
    },
    teams: [
      { name: 'New England Patriots', color: '#002244', championships: 6, wins: 580, conferenceChamps: 11, playoffAppearances: 33, hallOfFamers: 10 },
      { name: 'Pittsburgh Steelers', color: '#FFB612', championships: 6, wins: 610, conferenceChamps: 8, playoffAppearances: 33, hallOfFamers: 14 },
      { name: 'Dallas Cowboys', color: '#003594', championships: 5, wins: 560, conferenceChamps: 8, playoffAppearances: 34, hallOfFamers: 15 },
      { name: 'San Francisco 49ers', color: '#AA0000', championships: 5, wins: 560, conferenceChamps: 7, playoffAppearances: 28, hallOfFamers: 14 },
      { name: 'Green Bay Packers', color: '#203731', championships: 4, wins: 570, conferenceChamps: 9, playoffAppearances: 34, hallOfFamers: 21 },
      { name: 'Kansas City Chiefs', color: '#E31837', championships: 4, wins: 500, conferenceChamps: 6, playoffAppearances: 24, hallOfFamers: 8 },
      { name: 'New York Giants', color: '#0B2265', championships: 4, wins: 560, conferenceChamps: 5, playoffAppearances: 30, hallOfFamers: 12 },
      { name: 'Las Vegas Raiders', color: '#A5ACAF', championships: 3, wins: 500, conferenceChamps: 5, playoffAppearances: 22, hallOfFamers: 13 },
      { name: 'Baltimore Ravens', color: '#241773', championships: 2, wins: 260, conferenceChamps: 2, playoffAppearances: 15, hallOfFamers: 4 },
      { name: 'Denver Broncos', color: '#FB4F14', championships: 3, wins: 500, conferenceChamps: 8, playoffAppearances: 25, hallOfFamers: 9 },
    ],
  },
  nba: {
    label: 'NBA',
    icon: '🏀',
    description: 'NBA franchises ranked by historical dominance.',
    weights: {
      championships: { label: 'Championships', default: 40 },
      wins: { label: 'All-Time Wins', default: 15 },
      conferenceChamps: { label: 'Conference Titles', default: 15 },
      mvps: { label: 'MVP Awards', default: 15 },
      hallOfFamers: { label: 'Hall of Famers', default: 15 },
    },
    teams: [
      { name: 'Boston Celtics', color: '#007A33', championships: 18, wins: 3600, conferenceChamps: 22, mvps: 10, hallOfFamers: 40 },
      { name: 'Los Angeles Lakers', color: '#552583', championships: 17, wins: 3500, conferenceChamps: 32, mvps: 12, hallOfFamers: 30 },
      { name: 'Chicago Bulls', color: '#CE1141', championships: 6, wins: 2300, conferenceChamps: 6, mvps: 7, hallOfFamers: 14 },
      { name: 'Golden State Warriors', color: '#006BB6', championships: 7, wins: 2800, conferenceChamps: 12, mvps: 4, hallOfFamers: 12 },
      { name: 'San Antonio Spurs', color: '#C4CED4', championships: 5, wins: 2500, conferenceChamps: 6, mvps: 3, hallOfFamers: 10 },
      { name: 'Philadelphia 76ers', color: '#006BB6', championships: 3, wins: 2900, conferenceChamps: 9, mvps: 5, hallOfFamers: 15 },
      { name: 'Miami Heat', color: '#98002E', championships: 3, wins: 1400, conferenceChamps: 6, mvps: 2, hallOfFamers: 5 },
      { name: 'Detroit Pistons', color: '#C8102E', championships: 3, wins: 2600, conferenceChamps: 7, mvps: 1, hallOfFamers: 13 },
      { name: 'Milwaukee Bucks', color: '#00471B', championships: 2, wins: 2400, conferenceChamps: 3, mvps: 5, hallOfFamers: 10 },
      { name: 'Houston Rockets', color: '#CE1141', championships: 2, wins: 2400, conferenceChamps: 4, mvps: 3, hallOfFamers: 8 },
    ],
  },
  mlb: {
    label: 'MLB',
    icon: '⚾',
    description: 'MLB franchises ranked by historical greatness.',
    weights: {
      championships: { label: 'World Series Titles', default: 40 },
      wins: { label: 'All-Time Wins', default: 15 },
      pennants: { label: 'Pennants', default: 20 },
      hallOfFamers: { label: 'Hall of Famers', default: 15 },
      mvps: { label: 'MVP Awards', default: 10 },
    },
    teams: [
      { name: 'New York Yankees', color: '#003087', championships: 27, wins: 10500, pennants: 40, hallOfFamers: 44, mvps: 22 },
      { name: 'St. Louis Cardinals', color: '#C41E3A', championships: 11, wins: 10400, pennants: 19, hallOfFamers: 30, mvps: 17 },
      { name: 'Boston Red Sox', color: '#BD3039', championships: 9, wins: 9800, pennants: 14, hallOfFamers: 27, mvps: 12 },
      { name: 'San Francisco Giants', color: '#FD5A1E', championships: 8, wins: 11000, pennants: 23, hallOfFamers: 32, mvps: 10 },
      { name: 'Los Angeles Dodgers', color: '#005A9C', championships: 7, wins: 10900, pennants: 24, hallOfFamers: 27, mvps: 13 },
      { name: 'Oakland Athletics', color: '#003831', championships: 9, wins: 9400, pennants: 15, hallOfFamers: 18, mvps: 11 },
      { name: 'Cincinnati Reds', color: '#C6011F', championships: 5, wins: 10500, pennants: 10, hallOfFamers: 22, mvps: 8 },
      { name: 'Atlanta Braves', color: '#CE1141', championships: 4, wins: 10300, pennants: 18, hallOfFamers: 25, mvps: 9 },
      { name: 'Detroit Tigers', color: '#0C2C56', championships: 4, wins: 9500, pennants: 11, hallOfFamers: 20, mvps: 6 },
      { name: 'Chicago Cubs', color: '#0E3386', championships: 3, wins: 10700, pennants: 17, hallOfFamers: 24, mvps: 7 },
    ],
  },
  nhl: {
    label: 'NHL',
    icon: '🏒',
    description: 'NHL franchises ranked by historical success.',
    weights: {
      championships: { label: 'Stanley Cups', default: 40 },
      wins: { label: 'All-Time Wins', default: 20 },
      conferenceChamps: { label: 'Conference Titles', default: 15 },
      playoffAppearances: { label: 'Playoff Appearances', default: 15 },
      hallOfFamers: { label: 'Hall of Famers', default: 10 },
    },
    teams: [
      { name: 'Montreal Canadiens', color: '#AF1E2D', championships: 24, wins: 3500, conferenceChamps: 10, playoffAppearances: 85, hallOfFamers: 50 },
      { name: 'Toronto Maple Leafs', color: '#00205B', championships: 13, wins: 3000, conferenceChamps: 5, playoffAppearances: 68, hallOfFamers: 35 },
      { name: 'Detroit Red Wings', color: '#CE1126', championships: 11, wins: 3100, conferenceChamps: 6, playoffAppearances: 65, hallOfFamers: 35 },
      { name: 'Boston Bruins', color: '#FFB81C', championships: 6, wins: 3200, conferenceChamps: 4, playoffAppearances: 72, hallOfFamers: 30 },
      { name: 'Chicago Blackhawks', color: '#CF0A2C', championships: 6, wins: 2800, conferenceChamps: 4, playoffAppearances: 63, hallOfFamers: 25 },
      { name: 'Edmonton Oilers', color: '#041E42', championships: 5, wins: 1700, conferenceChamps: 3, playoffAppearances: 28, hallOfFamers: 10 },
      { name: 'Pittsburgh Penguins', color: '#FCB514', championships: 5, wins: 2000, conferenceChamps: 4, playoffAppearances: 35, hallOfFamers: 8 },
      { name: 'New York Rangers', color: '#0038A8', championships: 4, wins: 2800, conferenceChamps: 4, playoffAppearances: 60, hallOfFamers: 20 },
      { name: 'New York Islanders', color: '#00539B', championships: 4, wins: 1800, conferenceChamps: 1, playoffAppearances: 28, hallOfFamers: 8 },
      { name: 'Colorado Avalanche', color: '#6F263D', championships: 3, wins: 1100, conferenceChamps: 2, playoffAppearances: 20, hallOfFamers: 8 },
    ],
  },
};

/**
 * Normalise a raw stat value to 0-100 based on the max within the group.
 */
function normalise(value, max) {
  if (max === 0) return 0;
  return (value / max) * 100;
}

/**
 * Score every team in a league using the provided weights.
 */
function scoreTeams(league, weights) {
  const statKeys = Object.keys(league.weights);
  // Find the max for each stat for normalisation
  const maxes = {};
  for (const key of statKeys) {
    maxes[key] = Math.max(...league.teams.map((t) => t[key]));
  }

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0) || 1;

  return league.teams
    .map((team) => {
      let score = 0;
      for (const key of statKeys) {
        const normalisedValue = normalise(team[key], maxes[key]);
        score += normalisedValue * (weights[key] / totalWeight);
      }
      return { ...team, score: Math.round(score * 10) / 10 };
    })
    .sort((a, b) => b.score - a.score);
}

export default function BlueBloodCalculator() {
  const [leagueId, setLeagueId] = useState('ncaaf');
  const league = LEAGUES[leagueId];

  // Initialise weights from the league defaults
  const [weightOverrides, setWeightOverrides] = useState({});

  const weights = useMemo(() => {
    const w = {};
    for (const [key, def] of Object.entries(league.weights)) {
      w[key] = weightOverrides[`${leagueId}_${key}`] ?? def.default;
    }
    return w;
  }, [league, leagueId, weightOverrides]);

  const scored = useMemo(() => scoreTeams(league, weights), [league, weights]);

  function setWeight(key, value) {
    setWeightOverrides((prev) => ({
      ...prev,
      [`${leagueId}_${key}`]: value,
    }));
  }

  function resetWeights() {
    setWeightOverrides((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(league.weights)) {
        delete next[`${leagueId}_${key}`];
      }
      return next;
    });
  }

  const topScore = scored[0]?.score ?? 1;

  return (
    <div className="panel">
      <h2>Blue Blood Calculator</h2>
      <p className="subtitle">
        Rank franchises across leagues using a weighted scoring algorithm.
        Adjust the sliders to emphasise what matters most to you.
      </p>

      <div className="controls bb-controls">
        <div className="control-row">
          <label>
            League:{' '}
            <select value={leagueId} onChange={(e) => setLeagueId(e.target.value)}>
              {Object.entries(LEAGUES).map(([id, l]) => (
                <option key={id} value={id}>
                  {l.icon} {l.label}
                </option>
              ))}
            </select>
          </label>
          <button className="reset-button" onClick={resetWeights}>
            Reset Weights
          </button>
        </div>

        <p className="league-desc">{league.description}</p>

        <div className="weight-sliders">
          {Object.entries(league.weights).map(([key, def]) => (
            <div key={key} className="weight-slider">
              <label>
                <span className="weight-label">{def.label}</span>
                <span className="weight-value">{weights[key]}</span>
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={weights[key]}
                onChange={(e) => setWeight(key, Number(e.target.value))}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bb-rankings">
        {scored.map((team, idx) => (
          <div key={team.name} className="bb-rank-row">
            <span className="bb-rank">#{idx + 1}</span>
            <div
              className="bb-color-dot"
              style={{ background: team.color }}
            />
            <span className="bb-team-name">{team.name}</span>
            <div className="bb-bar-wrapper">
              <div
                className="bb-bar"
                style={{
                  width: `${(team.score / topScore) * 100}%`,
                  background: team.color,
                }}
              />
            </div>
            <span className="bb-score">{team.score}</span>
          </div>
        ))}
      </div>

      <div className="info-box">
        <h4>How the Calculator Works</h4>
        <p>
          Each stat is normalised to a 0–100 scale relative to the best team
          in that category, then multiplied by the weight you assign.
          The final score is the weighted sum — the higher the score, the
          stronger the &quot;blue blood&quot; claim.
        </p>
      </div>
    </div>
  );
}
