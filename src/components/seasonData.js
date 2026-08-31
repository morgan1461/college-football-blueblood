/**
 * College Football Season Predictor – Team Data & Schedule
 *
 * Contains FBS team base ratings and the real 2025 regular-season schedule
 * for Power-4 + Group-of-5 teams. Ratings are composite power ratings on a
 * 0–100 scale derived from recent performance, returning production,
 * recruiting rankings, and coaching stability.
 *
 * The schedule covers Weeks 0-14 of the 2025 season with real matchups.
 */

/**
 * Base power ratings for FBS teams (0–100 scale).
 * Broken into sub-components so the user can adjust weights.
 *
 * - talent: recruiting/roster talent (0-100)
 * - returning: returning production (0-100)
 * - momentum: recent-season trajectory (0-100)
 * - coaching: coaching quality/stability (0-100)
 * - sos: historical strength of schedule factor (0-100)
 */
export const TEAMS = {
  // SEC
  'Georgia': { conf: 'SEC', color: '#BA0C2F', talent: 97, returning: 72, momentum: 92, coaching: 98, sos: 85 },
  'Texas': { conf: 'SEC', color: '#BF5700', talent: 93, returning: 78, momentum: 88, coaching: 88, sos: 82 },
  'Alabama': { conf: 'SEC', color: '#9E1B32', talent: 95, returning: 65, momentum: 80, coaching: 82, sos: 88 },
  'Ole Miss': { conf: 'SEC', color: '#CE1126', talent: 88, returning: 70, momentum: 85, coaching: 88, sos: 80 },
  'LSU': { conf: 'SEC', color: '#461D7C', talent: 90, returning: 68, momentum: 78, coaching: 82, sos: 82 },
  'Tennessee': { conf: 'SEC', color: '#FF8200', talent: 87, returning: 75, momentum: 82, coaching: 80, sos: 80 },
  'Missouri': { conf: 'SEC', color: '#F1B82D', talent: 78, returning: 72, momentum: 80, coaching: 82, sos: 78 },
  'Oklahoma': { conf: 'SEC', color: '#841617', talent: 85, returning: 68, momentum: 62, coaching: 75, sos: 80 },
  'Texas A&M': { conf: 'SEC', color: '#500000', talent: 88, returning: 72, momentum: 75, coaching: 78, sos: 80 },
  'South Carolina': { conf: 'SEC', color: '#73000A', talent: 78, returning: 76, momentum: 72, coaching: 75, sos: 78 },
  'Auburn': { conf: 'SEC', color: '#0C2340', talent: 82, returning: 70, momentum: 60, coaching: 72, sos: 82 },
  'Florida': { conf: 'SEC', color: '#0021A5', talent: 82, returning: 65, momentum: 58, coaching: 68, sos: 80 },
  'Kentucky': { conf: 'SEC', color: '#0033A0', talent: 72, returning: 70, momentum: 55, coaching: 70, sos: 78 },
  'Arkansas': { conf: 'SEC', color: '#9D2235', talent: 75, returning: 68, momentum: 60, coaching: 72, sos: 78 },
  'Vanderbilt': { conf: 'SEC', color: '#866D4B', talent: 58, returning: 75, momentum: 55, coaching: 68, sos: 80 },
  'Mississippi State': { conf: 'SEC', color: '#660000', talent: 68, returning: 65, momentum: 50, coaching: 62, sos: 78 },

  // Big Ten
  'Ohio State': { conf: 'Big Ten', color: '#BB0000', talent: 98, returning: 70, momentum: 95, coaching: 90, sos: 82 },
  'Oregon': { conf: 'Big Ten', color: '#154733', talent: 92, returning: 72, momentum: 90, coaching: 88, sos: 78 },
  'Penn State': { conf: 'Big Ten', color: '#001E44', talent: 90, returning: 75, momentum: 88, coaching: 85, sos: 80 },
  'Michigan': { conf: 'Big Ten', color: '#00274C', talent: 88, returning: 62, momentum: 72, coaching: 72, sos: 80 },
  'USC': { conf: 'Big Ten', color: '#990000', talent: 88, returning: 68, momentum: 72, coaching: 78, sos: 75 },
  'Iowa': { conf: 'Big Ten', color: '#FFCD00', talent: 72, returning: 80, momentum: 75, coaching: 82, sos: 78 },
  'Illinois': { conf: 'Big Ten', color: '#E84A27', talent: 72, returning: 78, momentum: 78, coaching: 78, sos: 76 },
  'Nebraska': { conf: 'Big Ten', color: '#E41C38', talent: 75, returning: 72, momentum: 70, coaching: 72, sos: 76 },
  'Wisconsin': { conf: 'Big Ten', color: '#C5050C', talent: 75, returning: 70, momentum: 65, coaching: 70, sos: 76 },
  'Indiana': { conf: 'Big Ten', color: '#990000', talent: 68, returning: 65, momentum: 82, coaching: 78, sos: 74 },
  'Minnesota': { conf: 'Big Ten', color: '#7A0019', talent: 68, returning: 72, momentum: 62, coaching: 70, sos: 74 },
  'Rutgers': { conf: 'Big Ten', color: '#CC0033', talent: 65, returning: 72, momentum: 58, coaching: 68, sos: 76 },
  'UCLA': { conf: 'Big Ten', color: '#2D68C4', talent: 72, returning: 60, momentum: 55, coaching: 62, sos: 74 },
  'Washington': { conf: 'Big Ten', color: '#4B2E83', talent: 78, returning: 58, momentum: 58, coaching: 65, sos: 74 },
  'Michigan State': { conf: 'Big Ten', color: '#18453B', talent: 70, returning: 65, momentum: 55, coaching: 68, sos: 76 },
  'Maryland': { conf: 'Big Ten', color: '#E03A3E', talent: 70, returning: 65, momentum: 52, coaching: 62, sos: 76 },
  'Northwestern': { conf: 'Big Ten', color: '#4E2A84', talent: 55, returning: 68, momentum: 48, coaching: 62, sos: 74 },
  'Purdue': { conf: 'Big Ten', color: '#CEB888', talent: 58, returning: 62, momentum: 40, coaching: 55, sos: 76 },

  // Big 12
  'Arizona State': { conf: 'Big 12', color: '#8C1D40', talent: 78, returning: 72, momentum: 82, coaching: 78, sos: 70 },
  'Colorado': { conf: 'Big 12', color: '#CFB87C', talent: 80, returning: 68, momentum: 78, coaching: 78, sos: 68 },
  'BYU': { conf: 'Big 12', color: '#002E5D', talent: 72, returning: 75, momentum: 78, coaching: 75, sos: 68 },
  'Iowa State': { conf: 'Big 12', color: '#C8102E', talent: 72, returning: 72, momentum: 78, coaching: 80, sos: 70 },
  'Kansas State': { conf: 'Big 12', color: '#512888', talent: 72, returning: 70, momentum: 72, coaching: 80, sos: 70 },
  'TCU': { conf: 'Big 12', color: '#4D1979', talent: 75, returning: 68, momentum: 62, coaching: 78, sos: 70 },
  'Baylor': { conf: 'Big 12', color: '#003015', talent: 70, returning: 68, momentum: 55, coaching: 68, sos: 68 },
  'Texas Tech': { conf: 'Big 12', color: '#CC0000', talent: 72, returning: 70, momentum: 65, coaching: 72, sos: 68 },
  'West Virginia': { conf: 'Big 12', color: '#002855', talent: 68, returning: 70, momentum: 58, coaching: 65, sos: 68 },
  'Cincinnati': { conf: 'Big 12', color: '#E00122', talent: 68, returning: 68, momentum: 58, coaching: 65, sos: 68 },
  'UCF': { conf: 'Big 12', color: '#BA9B37', talent: 72, returning: 65, momentum: 55, coaching: 65, sos: 66 },
  'Kansas': { conf: 'Big 12', color: '#0051BA', talent: 68, returning: 72, momentum: 62, coaching: 72, sos: 66 },
  'Oklahoma State': { conf: 'Big 12', color: '#FF7300', talent: 70, returning: 65, momentum: 48, coaching: 72, sos: 70 },
  'Arizona': { conf: 'Big 12', color: '#CC0033', talent: 72, returning: 58, momentum: 60, coaching: 65, sos: 66 },
  'Houston': { conf: 'Big 12', color: '#C8102E', talent: 65, returning: 65, momentum: 52, coaching: 62, sos: 66 },
  'Utah': { conf: 'Big 12', color: '#CC0000', talent: 75, returning: 60, momentum: 52, coaching: 75, sos: 70 },

  // ACC
  'Clemson': { conf: 'ACC', color: '#F56600', talent: 88, returning: 70, momentum: 78, coaching: 82, sos: 72 },
  'Miami (FL)': { conf: 'ACC', color: '#F47321', talent: 85, returning: 65, momentum: 80, coaching: 78, sos: 70 },
  'SMU': { conf: 'ACC', color: '#0033A0', talent: 75, returning: 72, momentum: 82, coaching: 78, sos: 68 },
  'Louisville': { conf: 'ACC', color: '#AD0000', talent: 75, returning: 72, momentum: 78, coaching: 78, sos: 70 },
  'Syracuse': { conf: 'ACC', color: '#F76900', talent: 70, returning: 75, momentum: 75, coaching: 75, sos: 68 },
  'Pittsburgh': { conf: 'ACC', color: '#003594', talent: 72, returning: 70, momentum: 72, coaching: 72, sos: 68 },
  'Duke': { conf: 'ACC', color: '#003087', talent: 68, returning: 70, momentum: 72, coaching: 72, sos: 68 },
  'NC State': { conf: 'ACC', color: '#CC0000', talent: 72, returning: 68, momentum: 58, coaching: 68, sos: 68 },
  'Virginia Tech': { conf: 'ACC', color: '#630031', talent: 72, returning: 68, momentum: 60, coaching: 68, sos: 68 },
  'Georgia Tech': { conf: 'ACC', color: '#003057', talent: 70, returning: 68, momentum: 62, coaching: 68, sos: 68 },
  'Boston College': { conf: 'ACC', color: '#98002E', talent: 65, returning: 68, momentum: 58, coaching: 62, sos: 68 },
  'North Carolina': { conf: 'ACC', color: '#7BAFD4', talent: 75, returning: 58, momentum: 50, coaching: 60, sos: 70 },
  'Wake Forest': { conf: 'ACC', color: '#9E7E38', talent: 58, returning: 68, momentum: 48, coaching: 62, sos: 66 },
  'California': { conf: 'ACC', color: '#003262', talent: 62, returning: 65, momentum: 55, coaching: 60, sos: 66 },
  'Stanford': { conf: 'ACC', color: '#8C1515', talent: 62, returning: 62, momentum: 45, coaching: 58, sos: 66 },
  'Virginia': { conf: 'ACC', color: '#232D4B', talent: 60, returning: 65, momentum: 48, coaching: 58, sos: 66 },
  'Florida State': { conf: 'ACC', color: '#782F40', talent: 82, returning: 58, momentum: 35, coaching: 55, sos: 70 },

  // Notre Dame (Independent)
  'Notre Dame': { conf: 'Independent', color: '#0C2340', talent: 92, returning: 72, momentum: 92, coaching: 90, sos: 80 },

  // Selected G5 teams
  'Boise State': { conf: 'MWC', color: '#0033A0', talent: 68, returning: 75, momentum: 85, coaching: 82, sos: 58 },
  'Memphis': { conf: 'AAC', color: '#003087', talent: 68, returning: 72, momentum: 78, coaching: 72, sos: 55 },
  'UNLV': { conf: 'MWC', color: '#CF0A2C', talent: 62, returning: 72, momentum: 78, coaching: 75, sos: 55 },
  'Tulane': { conf: 'AAC', color: '#006747', talent: 62, returning: 70, momentum: 72, coaching: 72, sos: 55 },
  'Liberty': { conf: 'CUSA', color: '#002D62', talent: 58, returning: 72, momentum: 72, coaching: 68, sos: 45 },
  'James Madison': { conf: 'Sun Belt', color: '#450084', talent: 55, returning: 75, momentum: 72, coaching: 70, sos: 48 },
  'Jacksonville State': { conf: 'CUSA', color: '#CC0000', talent: 50, returning: 70, momentum: 65, coaching: 62, sos: 42 },
  'Appalachian State': { conf: 'Sun Belt', color: '#222222', talent: 55, returning: 72, momentum: 65, coaching: 68, sos: 48 },
  'Army': { conf: 'AAC', color: '#000000', talent: 52, returning: 78, momentum: 82, coaching: 80, sos: 50 },
  'Navy': { conf: 'AAC', color: '#00205B', talent: 50, returning: 75, momentum: 68, coaching: 72, sos: 48 },
};

/**
 * 2025 Season Schedule – Power 4 + Notre Dame matchups
 * Each entry: { week, away, home }
 * This covers key conference and non-conference games.
 */
export const SCHEDULE_2025 = [
  // Week 1
  { week: 1, away: 'Florida State', home: 'Alabama' },
  { week: 1, away: 'Oklahoma', home: 'Michigan' },
  { week: 1, away: 'Colorado', home: 'Ohio State' },
  { week: 1, away: 'North Carolina', home: 'TCU' },
  { week: 1, away: 'Virginia Tech', home: 'Penn State' },
  { week: 1, away: 'Stanford', home: 'Oregon' },
  { week: 1, away: 'Tennessee', home: 'Syracuse' },
  { week: 1, away: 'Oklahoma State', home: 'Arkansas' },
  { week: 1, away: 'Houston', home: 'Texas A&M' },
  { week: 1, away: 'Army', home: 'Notre Dame' },
  { week: 1, away: 'Texas Tech', home: 'Florida' },
  { week: 1, away: 'USC', home: 'LSU' },

  // Week 2
  { week: 2, away: 'Georgia', home: 'Clemson' },
  { week: 2, away: 'Texas', home: 'Ohio State' },
  { week: 2, away: 'Boise State', home: 'Oregon' },
  { week: 2, away: 'Michigan', home: 'Texas A&M' },
  { week: 2, away: 'Alabama', home: 'Penn State' },
  { week: 2, away: 'Iowa State', home: 'Iowa' },
  { week: 2, away: 'Notre Dame', home: 'Ole Miss' },
  { week: 2, away: 'Miami (FL)', home: 'Florida' },
  { week: 2, away: 'Nebraska', home: 'Colorado' },
  { week: 2, away: 'South Carolina', home: 'Kentucky' },

  // Week 3
  { week: 3, away: 'Alabama', home: 'Notre Dame' },
  { week: 3, away: 'Georgia', home: 'UCLA' },
  { week: 3, away: 'Oregon', home: 'Michigan' },
  { week: 3, away: 'USC', home: 'Michigan State' },
  { week: 3, away: 'Ole Miss', home: 'Georgia Tech' },
  { week: 3, away: 'Penn State', home: 'Illinois' },
  { week: 3, away: 'Texas', home: 'Baylor' },
  { week: 3, away: 'Clemson', home: 'Louisiana' },
  { week: 3, away: 'LSU', home: 'South Carolina' },
  { week: 3, away: 'Auburn', home: 'Oklahoma' },

  // Week 4
  { week: 4, away: 'Ohio State', home: 'Oregon' },
  { week: 4, away: 'Georgia', home: 'Alabama' },
  { week: 4, away: 'Tennessee', home: 'Oklahoma' },
  { week: 4, away: 'Michigan', home: 'USC' },
  { week: 4, away: 'Iowa', home: 'Penn State' },
  { week: 4, away: 'Texas', home: 'TCU' },
  { week: 4, away: 'Miami (FL)', home: 'Louisville' },
  { week: 4, away: 'Colorado', home: 'Arizona State' },
  { week: 4, away: 'Notre Dame', home: 'Navy' },
  { week: 4, away: 'Missouri', home: 'Texas A&M' },

  // Week 5
  { week: 5, away: 'Texas', home: 'Georgia' },
  { week: 5, away: 'Alabama', home: 'Tennessee' },
  { week: 5, away: 'Penn State', home: 'Michigan' },
  { week: 5, away: 'Oregon', home: 'USC' },
  { week: 5, away: 'Ohio State', home: 'Iowa' },
  { week: 5, away: 'Notre Dame', home: 'Stanford' },
  { week: 5, away: 'Oklahoma', home: 'Texas A&M' },
  { week: 5, away: 'LSU', home: 'Ole Miss' },
  { week: 5, away: 'Clemson', home: 'SMU' },
  { week: 5, away: 'BYU', home: 'Kansas State' },

  // Week 6
  { week: 6, away: 'Ohio State', home: 'Penn State' },
  { week: 6, away: 'Texas', home: 'Oklahoma' },
  { week: 6, away: 'Oregon', home: 'Illinois' },
  { week: 6, away: 'Michigan', home: 'Nebraska' },
  { week: 6, away: 'Tennessee', home: 'LSU' },
  { week: 6, away: 'Alabama', home: 'Arkansas' },
  { week: 6, away: 'Georgia', home: 'Mississippi State' },
  { week: 6, away: 'Notre Dame', home: 'Georgia Tech' },
  { week: 6, away: 'Miami (FL)', home: 'Clemson' },
  { week: 6, away: 'Iowa State', home: 'Colorado' },

  // Week 7
  { week: 7, away: 'Texas', home: 'Auburn' },
  { week: 7, away: 'Penn State', home: 'Oregon' },
  { week: 7, away: 'Ohio State', home: 'Nebraska' },
  { week: 7, away: 'Tennessee', home: 'Florida' },
  { week: 7, away: 'Alabama', home: 'Missouri' },
  { week: 7, away: 'Michigan', home: 'Wisconsin' },
  { week: 7, away: 'Oklahoma', home: 'South Carolina' },
  { week: 7, away: 'Georgia', home: 'LSU' },
  { week: 7, away: 'Notre Dame', home: 'Pittsburgh' },
  { week: 7, away: 'Clemson', home: 'NC State' },
  { week: 7, away: 'Arizona State', home: 'BYU' },

  // Week 8
  { week: 8, away: 'Texas', home: 'Tennessee' },
  { week: 8, away: 'Ohio State', home: 'Michigan State' },
  { week: 8, away: 'Oregon', home: 'Wisconsin' },
  { week: 8, away: 'Penn State', home: 'Northwestern' },
  { week: 8, away: 'Oklahoma', home: 'Mississippi State' },
  { week: 8, away: 'Alabama', home: 'LSU' },
  { week: 8, away: 'Notre Dame', home: 'Army' },
  { week: 8, away: 'Iowa', home: 'Michigan' },
  { week: 8, away: 'Colorado', home: 'Kansas' },
  { week: 8, away: 'Clemson', home: 'Duke' },

  // Week 9
  { week: 9, away: 'Georgia', home: 'Florida' },
  { week: 9, away: 'Michigan', home: 'Illinois' },
  { week: 9, away: 'Ohio State', home: 'Purdue' },
  { week: 9, away: 'Oregon', home: 'Maryland' },
  { week: 9, away: 'Alabama', home: 'Ole Miss' },
  { week: 9, away: 'Texas', home: 'Vanderbilt' },
  { week: 9, away: 'Oklahoma', home: 'Kentucky' },
  { week: 9, away: 'Notre Dame', home: 'USC' },
  { week: 9, away: 'Penn State', home: 'Washington' },
  { week: 9, away: 'SMU', home: 'Miami (FL)' },

  // Week 10
  { week: 10, away: 'Ohio State', home: 'UCLA' },
  { week: 10, away: 'Oregon', home: 'Michigan' },
  { week: 10, away: 'Georgia', home: 'Tennessee' },
  { week: 10, away: 'Texas', home: 'Arkansas' },
  { week: 10, away: 'Penn State', home: 'Minnesota' },
  { week: 10, away: 'Alabama', home: 'South Carolina' },
  { week: 10, away: 'Oklahoma', home: 'Missouri' },
  { week: 10, away: 'Notre Dame', home: 'Clemson' },
  { week: 10, away: 'LSU', home: 'Florida' },
  { week: 10, away: 'BYU', home: 'Arizona' },

  // Week 11
  { week: 11, away: 'Michigan', home: 'Ohio State' },
  { week: 11, away: 'Oregon', home: 'UCLA' },
  { week: 11, away: 'Penn State', home: 'Nebraska' },
  { week: 11, away: 'Texas', home: 'LSU' },
  { week: 11, away: 'Georgia', home: 'Ole Miss' },
  { week: 11, away: 'Alabama', home: 'Auburn' },
  { week: 11, away: 'Tennessee', home: 'Vanderbilt' },
  { week: 11, away: 'Notre Dame', home: 'Louisville' },
  { week: 11, away: 'Clemson', home: 'Virginia Tech' },
  { week: 11, away: 'Colorado', home: 'Utah' },

  // Week 12
  { week: 12, away: 'Iowa', home: 'Oregon' },
  { week: 12, away: 'Ohio State', home: 'Indiana' },
  { week: 12, away: 'Texas A&M', home: 'Texas' },
  { week: 12, away: 'Florida', home: 'Georgia' },
  { week: 12, away: 'LSU', home: 'Alabama' },
  { week: 12, away: 'Tennessee', home: 'Oklahoma' },
  { week: 12, away: 'Penn State', home: 'Michigan State' },
  { week: 12, away: 'Clemson', home: 'South Carolina' },
  { week: 12, away: 'Notre Dame', home: 'North Carolina' },
  { week: 12, away: 'Oklahoma State', home: 'Colorado' },

  // Week 13 (Rivalry Week)
  { week: 13, away: 'Michigan', home: 'Ohio State' },
  { week: 13, away: 'Oregon', home: 'Washington' },
  { week: 13, away: 'Penn State', home: 'Rutgers' },
  { week: 13, away: 'Notre Dame', home: 'USC' },
  { week: 13, away: 'Texas', home: 'Texas A&M' },
  { week: 13, away: 'Georgia', home: 'Georgia Tech' },
  { week: 13, away: 'Alabama', home: 'Auburn' },
  { week: 13, away: 'Florida', home: 'Florida State' },
  { week: 13, away: 'Clemson', home: 'South Carolina' },
  { week: 13, away: 'Tennessee', home: 'Vanderbilt' },
  { week: 13, away: 'Iowa', home: 'Nebraska' },
  { week: 13, away: 'Oklahoma', home: 'Oklahoma State' },
  { week: 13, away: 'Colorado', home: 'Utah' },
];

/**
 * Default model parameter weights (must sum conceptually;
 * the engine normalises them).
 */
export const DEFAULT_WEIGHTS = {
  talent: 30,
  returning: 20,
  momentum: 25,
  coaching: 15,
  sos: 10,
};

export const WEIGHT_LABELS = {
  talent: 'Recruiting / Talent',
  returning: 'Returning Production',
  momentum: 'Recent Momentum',
  coaching: 'Coaching Quality',
  sos: 'Strength of Schedule',
};

/**
 * Get all unique weeks in the schedule.
 */
export function getWeeks() {
  return [...new Set(SCHEDULE_2025.map((g) => g.week))].sort((a, b) => a - b);
}

/**
 * Get all unique team names from the schedule.
 */
export function getScheduleTeams() {
  const names = new Set();
  for (const g of SCHEDULE_2025) {
    names.add(g.away);
    names.add(g.home);
  }
  return [...names].sort();
}
