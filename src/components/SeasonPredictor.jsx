import { useState, useMemo } from 'react';
import { DEFAULT_WEIGHTS, WEIGHT_LABELS, getWeeks, TEAMS } from './seasonData';
import { simulateSeason } from './predictionEngine';

export default function SeasonPredictor() {
  const [weights, setWeights] = useState({ ...DEFAULT_WEIGHTS });
  const [homeAdvantage, setHomeAdvantage] = useState(3);
  const [scaleFactor, setScaleFactor] = useState(10);
  const [selectedWeek, setSelectedWeek] = useState(null); // null = standings view
  const [filterConf, setFilterConf] = useState('All');

  const params = useMemo(
    () => ({ homeAdvantage, scaleFactor }),
    [homeAdvantage, scaleFactor]
  );

  const { predictionsByWeek, rankings } = useMemo(
    () => simulateSeason(weights, params),
    [weights, params]
  );

  const weeks = useMemo(() => getWeeks(), []);
  const conferences = useMemo(() => {
    const set = new Set(rankings.map((t) => t.conf));
    return ['All', ...([...set].sort())];
  }, [rankings]);

  const filteredRankings = useMemo(() => {
    if (filterConf === 'All') return rankings;
    return rankings.filter((t) => t.conf === filterConf);
  }, [rankings, filterConf]);

  function updateWeight(key, value) {
    setWeights((prev) => ({ ...prev, [key]: value }));
  }

  function resetAll() {
    setWeights({ ...DEFAULT_WEIGHTS });
    setHomeAdvantage(3);
    setScaleFactor(10);
  }

  return (
    <div className="panel">
      <h2>2025 Season Predictor</h2>
      <p className="subtitle">
        A transparent model that predicts every game of the 2025 college football
        season. Adjust the parameters below to see how different weightings
        change the outcomes.
      </p>

      {/* Model Parameters */}
      <details className="sp-params" open>
        <summary className="sp-params-toggle">
          ⚙️ Model Parameters
        </summary>
        <div className="sp-params-body">
          <div className="sp-weight-grid">
            {Object.entries(WEIGHT_LABELS).map(([key, label]) => (
              <div key={key} className="sp-slider-group">
                <label>
                  <span className="sp-slider-label">{label}</span>
                  <span className="sp-slider-value">{weights[key]}</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={weights[key]}
                  onChange={(e) => updateWeight(key, Number(e.target.value))}
                />
              </div>
            ))}
            <div className="sp-slider-group">
              <label>
                <span className="sp-slider-label">Home-Field Advantage</span>
                <span className="sp-slider-value">{homeAdvantage} pts</span>
              </label>
              <input
                type="range"
                min={0}
                max={10}
                step={0.5}
                value={homeAdvantage}
                onChange={(e) => setHomeAdvantage(Number(e.target.value))}
              />
            </div>
            <div className="sp-slider-group">
              <label>
                <span className="sp-slider-label">Upset Sensitivity</span>
                <span className="sp-slider-value">{scaleFactor}</span>
              </label>
              <input
                type="range"
                min={5}
                max={25}
                value={scaleFactor}
                onChange={(e) => setScaleFactor(Number(e.target.value))}
              />
            </div>
          </div>
          <button className="reset-button" onClick={resetAll}>
            Reset to Defaults
          </button>
        </div>
      </details>

      {/* Navigation: Standings vs Weeks */}
      <div className="sp-nav">
        <button
          className={`sp-nav-btn ${selectedWeek === null ? 'active' : ''}`}
          onClick={() => setSelectedWeek(null)}
        >
          📊 Standings
        </button>
        {weeks.map((w) => (
          <button
            key={w}
            className={`sp-nav-btn ${selectedWeek === w ? 'active' : ''}`}
            onClick={() => setSelectedWeek(w)}
          >
            Wk {w}
          </button>
        ))}
      </div>

      {/* Standings View */}
      {selectedWeek === null && (
        <div className="sp-standings">
          <div className="sp-standings-header">
            <h3>Predicted Final Standings</h3>
            <label>
              Conference:{' '}
              <select
                value={filterConf}
                onChange={(e) => setFilterConf(e.target.value)}
              >
                {conferences.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <table className="sp-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Team</th>
                <th>Conf</th>
                <th>W</th>
                <th>L</th>
                <th>Conf W-L</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {filteredRankings.map((team, idx) => (
                <tr key={team.name}>
                  <td className="sp-rank">{idx + 1}</td>
                  <td>
                    <span
                      className="sp-team-dot"
                      style={{ background: team.color }}
                    />
                    {team.name}
                  </td>
                  <td className="sp-conf">{team.conf}</td>
                  <td className="sp-w">{team.wins}</td>
                  <td className="sp-l">{team.losses}</td>
                  <td className="sp-conf-record">
                    {team.confWins}-{team.confLosses}
                  </td>
                  <td className="sp-rating">{team.rating.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Week View */}
      {selectedWeek !== null && predictionsByWeek[selectedWeek] && (
        <div className="sp-week">
          <h3>Week {selectedWeek} Predictions</h3>
          <div className="sp-games">
            {predictionsByWeek[selectedWeek].map((game, idx) => {
              const awayTeam = TEAMS[game.away];
              const homeTeam = TEAMS[game.home];
              const awayIsWinner = game.predictedWinner === game.away;
              return (
                <div key={idx} className="sp-game-card">
                  <div className="sp-matchup">
                    <div
                      className={`sp-team ${awayIsWinner ? 'sp-winner' : ''}`}
                    >
                      <span
                        className="sp-team-dot"
                        style={{ background: awayTeam?.color || '#888' }}
                      />
                      <span className="sp-team-name">{game.away}</span>
                      <span className="sp-team-rating">{game.awayRating}</span>
                    </div>
                    <div className="sp-at">@</div>
                    <div
                      className={`sp-team ${!awayIsWinner ? 'sp-winner' : ''}`}
                    >
                      <span
                        className="sp-team-dot"
                        style={{ background: homeTeam?.color || '#888' }}
                      />
                      <span className="sp-team-name">{game.home}</span>
                      <span className="sp-team-rating">{game.homeRating}</span>
                    </div>
                  </div>
                  <div className="sp-prediction">
                    <span className="sp-pred-winner">
                      {game.predictedWinner}
                    </span>{' '}
                    wins by ~{game.margin} pts
                    <div className="sp-prob-bar-wrapper">
                      <div
                        className="sp-prob-bar sp-prob-away"
                        style={{
                          width: `${game.awayWinProb}%`,
                          background: awayTeam?.color || '#888',
                        }}
                      />
                      <div
                        className="sp-prob-bar sp-prob-home"
                        style={{
                          width: `${game.homeWinProb}%`,
                          background: homeTeam?.color || '#888',
                        }}
                      />
                    </div>
                    <div className="sp-prob-labels">
                      <span>{game.away} {game.awayWinProb}%</span>
                      <span>{game.home} {game.homeWinProb}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="info-box">
        <h4>How the Model Works</h4>
        <p>
          Each team has five base attributes: <strong>Talent</strong> (recruiting
          rankings), <strong>Returning Production</strong>,{' '}
          <strong>Momentum</strong> (recent trajectory),{' '}
          <strong>Coaching Quality</strong>, and <strong>Strength of Schedule</strong>.
          These are combined into a composite power rating using the weights you set above.
        </p>
        <p>
          Game outcomes are predicted using a <strong>logistic model</strong>: the
          difference in composite ratings (plus home-field advantage) is fed into
          a sigmoid function to produce a win probability.{' '}
          <strong>Upset Sensitivity</strong> controls how quickly probabilities
          shift — lower values mean small rating differences produce more
          decisive outcomes; higher values allow more upsets.
        </p>
        <p>
          All data is transparent and editable. This is a parametric model, not
          a black box — every prediction is traceable to the input ratings and
          weights.
        </p>
      </div>
    </div>
  );
}
