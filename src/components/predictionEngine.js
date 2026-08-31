/**
 * Season Prediction Engine
 *
 * Uses power ratings + adjustable weights to compute a composite team rating,
 * then simulates each game using a logistic win-probability model.
 *
 * The model is transparent: every calculation is explainable and
 * the user can see exactly how ratings translate to predicted outcomes.
 */

import { TEAMS, SCHEDULE_2025, DEFAULT_WEIGHTS } from './seasonData';

/**
 * Compute composite power rating for a team given weight configuration.
 * Returns a 0-100 value.
 */
export function computeRating(teamName, weights) {
  const team = TEAMS[teamName];
  if (!team) return 50; // fallback for unknown teams

  const w = weights || DEFAULT_WEIGHTS;
  const totalWeight =
    (w.talent || 0) +
    (w.returning || 0) +
    (w.momentum || 0) +
    (w.coaching || 0) +
    (w.sos || 0) || 1;

  return (
    (team.talent * (w.talent || 0) +
      team.returning * (w.returning || 0) +
      team.momentum * (w.momentum || 0) +
      team.coaching * (w.coaching || 0) +
      team.sos * (w.sos || 0)) /
    totalWeight
  );
}

/**
 * Logistic win probability model.
 * Given two ratings, returns P(teamA wins).
 *
 * homeAdvantage adds a bonus to the home team's effective rating.
 * scaleFactor controls how quickly probability changes with rating diff.
 */
export function winProbability(
  ratingA,
  ratingB,
  { homeAdvantage = 3, scaleFactor = 10 } = {}
) {
  const diff = ratingA - (ratingB + homeAdvantage);
  return 1 / (1 + Math.pow(10, -diff / scaleFactor));
}

/**
 * Predict a single game.
 * Returns { away, home, awayRating, homeRating, awayWinProb, homeWinProb, predictedWinner, margin }
 */
export function predictGame(game, weights, params = {}) {
  const awayRating = computeRating(game.away, weights);
  const homeRating = computeRating(game.home, weights);

  // Away team win prob (home team gets home advantage added to their rating)
  const awayWinProb = winProbability(awayRating, homeRating, params);
  const homeWinProb = 1 - awayWinProb;

  const predictedWinner = awayWinProb > 0.5 ? game.away : game.home;
  const winnerProb = Math.max(awayWinProb, homeWinProb);

  // Estimate margin: scale probability to approximate point spread
  // A 60% win prob ≈ 3-4 point favorite, 75% ≈ 10 points, etc.
  const probDiff = winnerProb - 0.5;
  const margin = Math.round(probDiff * 40); // rough scaling

  return {
    away: game.away,
    home: game.home,
    week: game.week,
    awayRating: Math.round(awayRating * 10) / 10,
    homeRating: Math.round(homeRating * 10) / 10,
    awayWinProb: Math.round(awayWinProb * 1000) / 10,
    homeWinProb: Math.round(homeWinProb * 1000) / 10,
    predictedWinner,
    predictedLoser: predictedWinner === game.away ? game.home : game.away,
    margin,
  };
}

/**
 * Simulate the entire season.
 * Returns: { predictions (by week), standings (win-loss records), rankings }
 */
export function simulateSeason(weights, params = {}) {
  const records = {}; // team -> { wins, losses, confWins, confLosses }

  // Initialise records for all teams in schedule
  for (const game of SCHEDULE_2025) {
    for (const t of [game.away, game.home]) {
      if (!records[t]) {
        records[t] = {
          wins: 0,
          losses: 0,
          confWins: 0,
          confLosses: 0,
          rating: computeRating(t, weights),
          conf: TEAMS[t]?.conf || 'Unknown',
          color: TEAMS[t]?.color || '#888',
        };
      }
    }
  }

  // Predict each game
  const predictionsByWeek = {};
  for (const game of SCHEDULE_2025) {
    const pred = predictGame(game, weights, params);
    if (!predictionsByWeek[game.week]) {
      predictionsByWeek[game.week] = [];
    }
    predictionsByWeek[game.week].push(pred);

    // Update records
    const winner = pred.predictedWinner;
    const loser = pred.predictedLoser;
    records[winner].wins++;
    records[loser].losses++;

    // Check if conference game
    const awayConf = TEAMS[game.away]?.conf;
    const homeConf = TEAMS[game.home]?.conf;
    if (awayConf && homeConf && awayConf === homeConf) {
      records[winner].confWins++;
      records[loser].confLosses++;
    }
  }

  // Build rankings sorted by: wins desc, then rating desc
  const rankings = Object.entries(records)
    .map(([name, rec]) => ({ name, ...rec }))
    .sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      return b.rating - a.rating;
    });

  return { predictionsByWeek, records, rankings };
}
