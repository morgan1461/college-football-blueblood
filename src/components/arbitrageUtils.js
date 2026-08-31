/**
 * Utility functions for detecting arbitrage opportunities in sports betting odds.
 *
 * An arbitrage opportunity exists when the combined implied probabilities
 * across different bookmakers for all outcomes of an event sum to less than 1.
 * This means a bettor can guarantee profit by placing bets at different books.
 */

/**
 * Convert American odds to implied probability.
 * Positive odds (e.g. +150): probability = 100 / (odds + 100)
 * Negative odds (e.g. -150): probability = |odds| / (|odds| + 100)
 */
export function americanToImpliedProbability(odds) {
  if (odds > 0) {
    return 100 / (odds + 100);
  }
  return Math.abs(odds) / (Math.abs(odds) + 100);
}

/**
 * Convert decimal odds to implied probability.
 * probability = 1 / decimalOdds
 */
export function decimalToImpliedProbability(odds) {
  return 1 / odds;
}

/**
 * Given an array of best odds (one per outcome) in decimal format,
 * calculate the total implied probability.
 * If < 1, an arbitrage opportunity exists.
 */
export function calculateArbitrageMargin(bestOddsByOutcome) {
  return bestOddsByOutcome.reduce(
    (sum, odds) => sum + decimalToImpliedProbability(odds),
    0
  );
}

/**
 * Calculate the stake distribution for a guaranteed profit.
 * @param {number} totalStake - Total amount to bet
 * @param {number[]} bestOdds - Best decimal odds for each outcome
 * @returns {{ stakes: number[], guaranteedProfit: number, roi: number }}
 */
export function calculateStakes(totalStake, bestOdds) {
  const margin = calculateArbitrageMargin(bestOdds);
  const stakes = bestOdds.map(
    (odds) => totalStake * decimalToImpliedProbability(odds) / margin
  );
  const guaranteedPayout = Math.min(
    ...bestOdds.map((odds, i) => stakes[i] * odds)
  );
  const guaranteedProfit = guaranteedPayout - totalStake;
  const roi = (guaranteedProfit / totalStake) * 100;

  return { stakes, guaranteedProfit, roi };
}

/**
 * Find arbitrage opportunities from Odds API response data.
 * The API returns events with bookmaker odds for h2h (moneyline) markets.
 *
 * @param {Object[]} events - Array of event objects from The Odds API
 * @returns {Object[]} Array of arbitrage opportunities
 */
export function findArbitrageOpportunities(events) {
  const opportunities = [];

  for (const event of events) {
    if (!event.bookmakers || event.bookmakers.length < 2) continue;

    // For h2h markets, collect best odds per outcome across bookmakers
    const bestOdds = {}; // outcome name -> { odds, bookmaker }

    for (const bookmaker of event.bookmakers) {
      for (const market of bookmaker.markets) {
        if (market.key !== 'h2h') continue;

        for (const outcome of market.outcomes) {
          const current = bestOdds[outcome.name];
          if (!current || outcome.price > current.odds) {
            bestOdds[outcome.name] = {
              odds: outcome.price,
              bookmaker: bookmaker.title,
            };
          }
        }
      }
    }

    const outcomes = Object.keys(bestOdds);
    if (outcomes.length < 2) continue;

    const oddsValues = outcomes.map((o) => bestOdds[o].odds);
    const margin = calculateArbitrageMargin(oddsValues);

    if (margin < 1) {
      const totalStake = 100;
      const { stakes, guaranteedProfit, roi } = calculateStakes(
        totalStake,
        oddsValues
      );

      opportunities.push({
        event: `${event.away_team} @ ${event.home_team}`,
        sport: event.sport_title,
        commenceTime: event.commence_time,
        margin: ((1 - margin) * 100).toFixed(2),
        roi: roi.toFixed(2),
        guaranteedProfit: guaranteedProfit.toFixed(2),
        outcomes: outcomes.map((name, i) => ({
          name,
          odds: bestOdds[name].odds,
          bookmaker: bestOdds[name].bookmaker,
          stake: stakes[i].toFixed(2),
        })),
      });
    }
  }

  // Sort by ROI descending
  opportunities.sort((a, b) => parseFloat(b.roi) - parseFloat(a.roi));
  return opportunities;
}
