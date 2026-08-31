import { useState, useEffect, useCallback } from 'react';
import { findArbitrageOpportunities } from './arbitrageUtils';

const ODDS_API_BASE = 'https://api.the-odds-api.com/v4/sports';

const SPORTS = [
  { key: 'americanfootball_ncaaf', label: 'NCAAF' },
  { key: 'americanfootball_nfl', label: 'NFL' },
  { key: 'basketball_nba', label: 'NBA' },
  { key: 'basketball_ncaab', label: 'NCAAB' },
  { key: 'baseball_mlb', label: 'MLB' },
  { key: 'icehockey_nhl', label: 'NHL' },
  { key: 'soccer_epl', label: 'EPL Soccer' },
  { key: 'mma_mixed_martial_arts', label: 'MMA' },
];

export default function ArbitrageFinder() {
  const [apiKey, setApiKey] = useState('');
  const [sport, setSport] = useState(SPORTS[0].key);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);
  const [useSample, setUseSample] = useState(false);

  const fetchOdds = useCallback(async () => {
    setLoading(true);
    setError(null);
    setOpportunities([]);

    if (useSample) {
      // Use sample data for demo/testing without an API key
      const sampleData = getSampleData();
      const arbs = findArbitrageOpportunities(sampleData);
      setOpportunities(arbs);
      setLastFetched(new Date().toLocaleString());
      setLoading(false);
      return;
    }

    if (!apiKey.trim()) {
      setError('Please enter an API key or use sample data.');
      setLoading(false);
      return;
    }

    try {
      const params = new URLSearchParams({
        apiKey: apiKey.trim(),
        regions: 'us,us2,eu',
        markets: 'h2h',
        oddsFormat: 'decimal',
      });

      const response = await fetch(
        `${ODDS_API_BASE}/${sport}/odds/?${params}`
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`API error ${response.status}: ${text}`);
      }

      const data = await response.json();
      const arbs = findArbitrageOpportunities(data);
      setOpportunities(arbs);
      setLastFetched(new Date().toLocaleString());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiKey, sport, useSample]);

  useEffect(() => {
    if (useSample) {
      fetchOdds();
    }
  }, [useSample, fetchOdds]);

  return (
    <div className="panel">
      <h2>Arbitrage Betting Finder</h2>
      <p className="subtitle">
        Detect arbitrage opportunities across sportsbooks using live odds data
        from{' '}
        <a
          href="https://the-odds-api.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          The Odds API
        </a>
        .
      </p>

      <div className="controls arb-controls">
        <div className="control-row">
          <label>
            Sport:{' '}
            <select value={sport} onChange={(e) => setSport(e.target.value)}>
              {SPORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={useSample}
              onChange={(e) => setUseSample(e.target.checked)}
            />
            Use sample data (no API key needed)
          </label>
        </div>

        {!useSample && (
          <div className="control-row">
            <label className="api-key-label">
              API Key:{' '}
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Odds API key"
                className="api-key-input"
              />
            </label>
          </div>
        )}

        <button
          onClick={fetchOdds}
          disabled={loading}
          className="fetch-button"
        >
          {loading ? 'Scanning...' : 'Scan for Arbitrage'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {lastFetched && (
        <p className="last-fetched">Last scanned: {lastFetched}</p>
      )}

      {!loading && lastFetched && opportunities.length === 0 && (
        <div className="no-results">
          <p>No arbitrage opportunities found for this sport right now.</p>
          <p className="hint">
            Arbitrage windows are rare and short-lived. Try different sports or
            check back later.
          </p>
        </div>
      )}

      {opportunities.length > 0 && (
        <div className="arb-results">
          <h3>
            {opportunities.length} Opportunit
            {opportunities.length === 1 ? 'y' : 'ies'} Found
          </h3>
          {opportunities.map((opp, idx) => (
            <div key={idx} className="arb-card">
              <div className="arb-header">
                <span className="arb-event">{opp.event}</span>
                <span className="arb-sport">{opp.sport}</span>
              </div>
              <div className="arb-stats">
                <div className="arb-stat">
                  <span className="arb-stat-label">ROI</span>
                  <span className="arb-stat-value positive">
                    +{opp.roi}%
                  </span>
                </div>
                <div className="arb-stat">
                  <span className="arb-stat-label">Profit per $100</span>
                  <span className="arb-stat-value positive">
                    ${opp.guaranteedProfit}
                  </span>
                </div>
                <div className="arb-stat">
                  <span className="arb-stat-label">Margin</span>
                  <span className="arb-stat-value">{opp.margin}%</span>
                </div>
              </div>
              <table className="arb-table">
                <thead>
                  <tr>
                    <th>Outcome</th>
                    <th>Best Odds</th>
                    <th>Bookmaker</th>
                    <th>Stake ($100 total)</th>
                  </tr>
                </thead>
                <tbody>
                  {opp.outcomes.map((o, i) => (
                    <tr key={i}>
                      <td>{o.name}</td>
                      <td>{o.odds.toFixed(2)}</td>
                      <td>{o.bookmaker}</td>
                      <td>${o.stake}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="arb-time">
                Game starts:{' '}
                {new Date(opp.commenceTime).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="info-box">
        <h4>How Arbitrage Betting Works</h4>
        <p>
          An arbitrage opportunity occurs when different sportsbooks offer
          odds that, when combined, guarantee a profit regardless of the
          outcome. This tool scans multiple bookmakers and identifies when the
          implied probabilities for all outcomes sum to less than 100%.
        </p>
        <p>
          <strong>Example:</strong> If Book A offers Team X at 2.10 and Book B
          offers Team Y at 2.10, the combined implied probability is 47.6% +
          47.6% = 95.2%, leaving a 4.8% guaranteed profit margin.
        </p>
      </div>
    </div>
  );
}

/**
 * Sample data simulating an Odds API response with an arbitrage opportunity.
 */
function getSampleData() {
  return [
    {
      sport_title: 'NCAAF',
      home_team: 'Alabama Crimson Tide',
      away_team: 'Georgia Bulldogs',
      commence_time: new Date(Date.now() + 86400000).toISOString(),
      bookmakers: [
        {
          title: 'DraftKings',
          markets: [
            {
              key: 'h2h',
              outcomes: [
                { name: 'Alabama Crimson Tide', price: 2.15 },
                { name: 'Georgia Bulldogs', price: 1.80 },
              ],
            },
          ],
        },
        {
          title: 'FanDuel',
          markets: [
            {
              key: 'h2h',
              outcomes: [
                { name: 'Alabama Crimson Tide', price: 1.90 },
                { name: 'Georgia Bulldogs', price: 2.05 },
              ],
            },
          ],
        },
        {
          title: 'BetMGM',
          markets: [
            {
              key: 'h2h',
              outcomes: [
                { name: 'Alabama Crimson Tide', price: 2.10 },
                { name: 'Georgia Bulldogs', price: 1.85 },
              ],
            },
          ],
        },
      ],
    },
    {
      sport_title: 'NCAAF',
      home_team: 'Ohio State Buckeyes',
      away_team: 'Michigan Wolverines',
      commence_time: new Date(Date.now() + 172800000).toISOString(),
      bookmakers: [
        {
          title: 'DraftKings',
          markets: [
            {
              key: 'h2h',
              outcomes: [
                { name: 'Ohio State Buckeyes', price: 1.65 },
                { name: 'Michigan Wolverines', price: 2.35 },
              ],
            },
          ],
        },
        {
          title: 'FanDuel',
          markets: [
            {
              key: 'h2h',
              outcomes: [
                { name: 'Ohio State Buckeyes', price: 1.70 },
                { name: 'Michigan Wolverines', price: 2.30 },
              ],
            },
          ],
        },
        {
          title: 'Caesars',
          markets: [
            {
              key: 'h2h',
              outcomes: [
                { name: 'Ohio State Buckeyes', price: 1.62 },
                { name: 'Michigan Wolverines', price: 2.50 },
              ],
            },
          ],
        },
      ],
    },
    {
      sport_title: 'NCAAF',
      home_team: 'Texas Longhorns',
      away_team: 'Oklahoma Sooners',
      commence_time: new Date(Date.now() + 259200000).toISOString(),
      bookmakers: [
        {
          title: 'BetMGM',
          markets: [
            {
              key: 'h2h',
              outcomes: [
                { name: 'Texas Longhorns', price: 1.55 },
                { name: 'Oklahoma Sooners', price: 2.60 },
              ],
            },
          ],
        },
        {
          title: 'DraftKings',
          markets: [
            {
              key: 'h2h',
              outcomes: [
                { name: 'Texas Longhorns', price: 1.50 },
                { name: 'Oklahoma Sooners', price: 2.70 },
              ],
            },
          ],
        },
      ],
    },
  ];
}
