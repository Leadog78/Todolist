/* ============================================================================
 * PERFECT SEASON — player & franchise data
 * ----------------------------------------------------------------------------
 * A bundled, offline dataset of basketball legends. This is a non-commercial
 * fan game; ratings are subjective approximations on a 60-99 "legend scale"
 * and are meant for fun, not as a real evaluation of any player.
 *
 * Each player:
 *   n  name          t  franchise         d  signature decade
 *   p  natural positions (array)           a  archetype label
 *   o  offense   df defense   pm playmaking   rb rebounding   sh shooting/spacing
 * ==========================================================================*/

const POSITIONS = ["PG", "SG", "SF", "PF", "C"];

const POSITION_NAMES = {
  PG: "Point Guard",
  SG: "Shooting Guard",
  SF: "Small Forward",
  PF: "Power Forward",
  C: "Center",
};

const PLAYERS = [
  // ---- Lakers ----
  { n: "Magic Johnson",    t: "Lakers",   d: "1980s", p: ["PG","SF"], a: "Floor General", o: 88, df: 80, pm: 99, rb: 82, sh: 78 },
  { n: "Kareem Abdul-Jabbar", t: "Lakers", d: "1980s", p: ["C"],     a: "Big-Man Scorer", o: 95, df: 88, pm: 72, rb: 90, sh: 70 },
  { n: "Kobe Bryant",      t: "Lakers",   d: "2000s", p: ["SG","SF"], a: "Scorer",        o: 96, df: 86, pm: 78, rb: 70, sh: 86 },
  { n: "Jerry West",       t: "Lakers",   d: "1960s", p: ["PG","SG"], a: "Scorer",        o: 91, df: 84, pm: 82, rb: 68, sh: 84 },
  { n: "Elgin Baylor",     t: "Lakers",   d: "1960s", p: ["SF"],      a: "Slasher",       o: 90, df: 74, pm: 74, rb: 84, sh: 72 },

  // ---- Celtics ----
  { n: "Bill Russell",     t: "Celtics",  d: "1960s", p: ["C"],       a: "Rim Protector", o: 70, df: 99, pm: 76, rb: 98, sh: 50 },
  { n: "Larry Bird",       t: "Celtics",  d: "1980s", p: ["SF","PF"], a: "Two-Way Wing",  o: 93, df: 82, pm: 88, rb: 84, sh: 92 },
  { n: "Bob Cousy",        t: "Celtics",  d: "1960s", p: ["PG"],      a: "Floor General", o: 80, df: 72, pm: 94, rb: 60, sh: 70 },
  { n: "John Havlicek",    t: "Celtics",  d: "1970s", p: ["SF","SG"], a: "Two-Way Wing",  o: 86, df: 86, pm: 80, rb: 74, sh: 78 },
  { n: "Kevin McHale",     t: "Celtics",  d: "1980s", p: ["PF","C"],  a: "Big-Man Scorer",o: 87, df: 84, pm: 64, rb: 82, sh: 66 },

  // ---- Bulls ----
  { n: "Michael Jordan",   t: "Bulls",    d: "1990s", p: ["SG","SF"], a: "Scorer",        o: 99, df: 92, pm: 84, rb: 76, sh: 84 },
  { n: "Scottie Pippen",   t: "Bulls",    d: "1990s", p: ["SF","PF"], a: "Two-Way Wing",  o: 82, df: 94, pm: 86, rb: 80, sh: 74 },
  { n: "Dennis Rodman",    t: "Bulls",    d: "1990s", p: ["PF","C"],  a: "Glue Guy",      o: 52, df: 95, pm: 64, rb: 99, sh: 40 },
  { n: "Derrick Rose",     t: "Bulls",    d: "2010s", p: ["PG"],      a: "Slasher",       o: 87, df: 72, pm: 84, rb: 60, sh: 76 },

  // ---- Warriors ----
  { n: "Stephen Curry",    t: "Warriors", d: "2010s", p: ["PG","SG"], a: "Sharpshooter",  o: 95, df: 74, pm: 90, rb: 64, sh: 99 },
  { n: "Klay Thompson",    t: "Warriors", d: "2010s", p: ["SG"],      a: "Sharpshooter",  o: 84, df: 82, pm: 64, rb: 62, sh: 96 },
  { n: "Draymond Green",   t: "Warriors", d: "2010s", p: ["PF","C"],  a: "Glue Guy",      o: 64, df: 94, pm: 86, rb: 84, sh: 66 },
  { n: "Wilt Chamberlain", t: "Warriors", d: "1960s", p: ["C"],       a: "Rim Protector", o: 92, df: 95, pm: 74, rb: 99, sh: 52 },
  { n: "Rick Barry",       t: "Warriors", d: "1970s", p: ["SF"],      a: "Scorer",        o: 89, df: 78, pm: 82, rb: 74, sh: 86 },

  // ---- Spurs ----
  { n: "Tim Duncan",       t: "Spurs",    d: "2000s", p: ["PF","C"],  a: "Two-Way Big",   o: 88, df: 95, pm: 76, rb: 92, sh: 64 },
  { n: "David Robinson",   t: "Spurs",    d: "1990s", p: ["C"],       a: "Rim Protector", o: 88, df: 94, pm: 70, rb: 90, sh: 58 },
  { n: "Tony Parker",      t: "Spurs",    d: "2000s", p: ["PG"],      a: "Slasher",       o: 83, df: 74, pm: 84, rb: 58, sh: 72 },
  { n: "Manu Ginobili",    t: "Spurs",    d: "2000s", p: ["SG"],      a: "Two-Way Wing",  o: 82, df: 80, pm: 82, rb: 64, sh: 80 },
  { n: "Kawhi Leonard",    t: "Spurs",    d: "2010s", p: ["SF","SG"], a: "Two-Way Wing",  o: 90, df: 96, pm: 76, rb: 74, sh: 84 },
  { n: "George Gervin",    t: "Spurs",    d: "1980s", p: ["SG","SF"], a: "Scorer",        o: 91, df: 70, pm: 72, rb: 64, sh: 82 },

  // ---- Rockets ----
  { n: "Hakeem Olajuwon",  t: "Rockets",  d: "1990s", p: ["C"],       a: "Two-Way Big",   o: 90, df: 96, pm: 72, rb: 92, sh: 58 },
  { n: "James Harden",     t: "Rockets",  d: "2010s", p: ["SG","PG"], a: "Scorer",        o: 94, df: 66, pm: 90, rb: 66, sh: 88 },
  { n: "Tracy McGrady",    t: "Rockets",  d: "2000s", p: ["SG","SF"], a: "Scorer",        o: 91, df: 76, pm: 80, rb: 72, sh: 82 },
  { n: "Moses Malone",     t: "Rockets",  d: "1980s", p: ["C","PF"],  a: "Big-Man Scorer",o: 86, df: 84, pm: 60, rb: 95, sh: 56 },
  { n: "Yao Ming",         t: "Rockets",  d: "2000s", p: ["C"],       a: "Big-Man Scorer",o: 84, df: 86, pm: 62, rb: 86, sh: 70 },

  // ---- Heat ----
  { n: "Dwyane Wade",      t: "Heat",     d: "2000s", p: ["SG","PG"], a: "Slasher",       o: 91, df: 84, pm: 84, rb: 70, sh: 74 },
  { n: "Alonzo Mourning",  t: "Heat",     d: "1990s", p: ["C"],       a: "Rim Protector", o: 82, df: 92, pm: 58, rb: 86, sh: 56 },
  { n: "Chris Bosh",       t: "Heat",     d: "2010s", p: ["PF","C"],  a: "Stretch Big",   o: 82, df: 80, pm: 66, rb: 82, sh: 82 },

  // ---- 76ers ----
  { n: "Allen Iverson",    t: "76ers",    d: "2000s", p: ["PG","SG"], a: "Scorer",        o: 90, df: 72, pm: 82, rb: 58, sh: 78 },
  { n: "Julius Erving",    t: "76ers",    d: "1980s", p: ["SF"],      a: "Slasher",       o: 90, df: 82, pm: 80, rb: 80, sh: 72 },
  { n: "Charles Barkley",  t: "76ers",    d: "1990s", p: ["PF"],      a: "Big-Man Scorer",o: 90, df: 80, pm: 80, rb: 92, sh: 72 },
  { n: "Joel Embiid",      t: "76ers",    d: "2020s", p: ["C"],       a: "Two-Way Big",   o: 92, df: 90, pm: 72, rb: 88, sh: 76 },

  // ---- Pistons ----
  { n: "Isiah Thomas",     t: "Pistons",  d: "1980s", p: ["PG"],      a: "Floor General", o: 86, df: 78, pm: 92, rb: 62, sh: 76 },
  { n: "Ben Wallace",      t: "Pistons",  d: "2000s", p: ["C","PF"],  a: "Rim Protector", o: 52, df: 96, pm: 58, rb: 94, sh: 38 },
  { n: "Grant Hill",       t: "Pistons",  d: "1990s", p: ["SF","SG"], a: "Two-Way Wing",  o: 86, df: 80, pm: 86, rb: 76, sh: 72 },
  { n: "Chauncey Billups", t: "Pistons",  d: "2000s", p: ["PG"],      a: "Floor General", o: 82, df: 80, pm: 86, rb: 60, sh: 86 },

  // ---- Suns ----
  { n: "Steve Nash",       t: "Suns",     d: "2000s", p: ["PG"],      a: "Floor General", o: 84, df: 64, pm: 97, rb: 56, sh: 90 },
  { n: "Devin Booker",     t: "Suns",     d: "2020s", p: ["SG","PG"], a: "Scorer",        o: 90, df: 74, pm: 82, rb: 64, sh: 88 },
  { n: "Amar'e Stoudemire",t: "Suns",     d: "2000s", p: ["PF","C"],  a: "Big-Man Scorer",o: 86, df: 72, pm: 60, rb: 80, sh: 72 },

  // ---- Mavericks ----
  { n: "Dirk Nowitzki",    t: "Mavericks",d: "2000s", p: ["PF","C"],  a: "Stretch Big",   o: 92, df: 74, pm: 72, rb: 82, sh: 90 },
  { n: "Luka Doncic",      t: "Mavericks",d: "2020s", p: ["PG","SG"], a: "Scorer",        o: 94, df: 72, pm: 94, rb: 80, sh: 84 },
  { n: "Jason Kidd",       t: "Mavericks",d: "2000s", p: ["PG"],      a: "Floor General", o: 74, df: 84, pm: 96, rb: 76, sh: 72 },

  // ---- Bucks ----
  { n: "Giannis Antetokounmpo", t: "Bucks", d: "2020s", p: ["PF","C"], a: "Two-Way Big",  o: 93, df: 92, pm: 80, rb: 90, sh: 62 },
  { n: "Oscar Robertson",  t: "Bucks",    d: "1960s", p: ["PG"],      a: "Floor General", o: 90, df: 80, pm: 96, rb: 80, sh: 78 },
  { n: "Ray Allen",        t: "Bucks",    d: "2000s", p: ["SG"],      a: "Sharpshooter",  o: 84, df: 76, pm: 70, rb: 62, sh: 94 },

  // ---- SuperSonics / Thunder ----
  { n: "Gary Payton",      t: "Sonics",   d: "1990s", p: ["PG"],      a: "Two-Way Wing",  o: 82, df: 94, pm: 88, rb: 66, sh: 74 },
  { n: "Shawn Kemp",       t: "Sonics",   d: "1990s", p: ["PF","C"],  a: "Big-Man Scorer",o: 84, df: 82, pm: 62, rb: 84, sh: 58 },
  { n: "Kevin Durant",     t: "Thunder",  d: "2010s", p: ["SF","PF"], a: "Scorer",        o: 97, df: 82, pm: 80, rb: 76, sh: 92 },
  { n: "Russell Westbrook",t: "Thunder",  d: "2010s", p: ["PG"],      a: "Slasher",       o: 86, df: 78, pm: 90, rb: 80, sh: 64 },

  // ---- Nuggets ----
  { n: "Nikola Jokic",     t: "Nuggets",  d: "2020s", p: ["C"],       a: "Floor General", o: 92, df: 80, pm: 96, rb: 92, sh: 80 },
  { n: "Carmelo Anthony",  t: "Nuggets",  d: "2000s", p: ["SF","PF"], a: "Scorer",        o: 90, df: 70, pm: 72, rb: 72, sh: 82 },
  { n: "Alex English",     t: "Nuggets",  d: "1980s", p: ["SF"],      a: "Scorer",        o: 88, df: 70, pm: 76, rb: 70, sh: 80 },

  // ---- Cavaliers ----
  { n: "LeBron James",     t: "Cavaliers",d: "2010s", p: ["SF","PF"], a: "Two-Way Wing",  o: 96, df: 88, pm: 96, rb: 84, sh: 80 },
  { n: "Kyrie Irving",     t: "Cavaliers",d: "2010s", p: ["PG","SG"], a: "Slasher",       o: 90, df: 70, pm: 86, rb: 58, sh: 88 },

  // ---- Knicks ----
  { n: "Patrick Ewing",    t: "Knicks",   d: "1990s", p: ["C"],       a: "Two-Way Big",   o: 86, df: 90, pm: 64, rb: 88, sh: 68 },
  { n: "Walt Frazier",     t: "Knicks",   d: "1970s", p: ["PG","SG"], a: "Two-Way Wing",  o: 84, df: 90, pm: 88, rb: 68, sh: 76 },
  { n: "Bernard King",     t: "Knicks",   d: "1980s", p: ["SF"],      a: "Scorer",        o: 90, df: 68, pm: 70, rb: 70, sh: 78 },

  // ---- Jazz ----
  { n: "Karl Malone",      t: "Jazz",     d: "1990s", p: ["PF"],      a: "Big-Man Scorer",o: 91, df: 84, pm: 74, rb: 90, sh: 70 },
  { n: "John Stockton",    t: "Jazz",     d: "1990s", p: ["PG"],      a: "Floor General", o: 78, df: 82, pm: 98, rb: 58, sh: 82 },
  { n: "Pete Maravich",    t: "Jazz",     d: "1970s", p: ["PG","SG"], a: "Scorer",        o: 90, df: 66, pm: 88, rb: 60, sh: 80 },

  // ---- Trail Blazers ----
  { n: "Clyde Drexler",    t: "Blazers",  d: "1990s", p: ["SG","SF"], a: "Slasher",       o: 88, df: 82, pm: 84, rb: 74, sh: 78 },
  { n: "Bill Walton",      t: "Blazers",  d: "1970s", p: ["C"],       a: "Two-Way Big",   o: 82, df: 92, pm: 84, rb: 92, sh: 56 },
  { n: "Damian Lillard",   t: "Blazers",  d: "2020s", p: ["PG"],      a: "Sharpshooter",  o: 91, df: 66, pm: 86, rb: 60, sh: 94 },

  // ---- Hawks ----
  { n: "Dominique Wilkins",t: "Hawks",    d: "1980s", p: ["SF","SG"], a: "Slasher",       o: 90, df: 70, pm: 70, rb: 74, sh: 78 },
  { n: "Bob Pettit",       t: "Hawks",    d: "1960s", p: ["PF","C"],  a: "Big-Man Scorer",o: 88, df: 80, pm: 66, rb: 90, sh: 64 },
  { n: "Trae Young",       t: "Hawks",    d: "2020s", p: ["PG"],      a: "Sharpshooter",  o: 88, df: 58, pm: 92, rb: 56, sh: 90 },
];

// Decade offensive "pace inflation". Used to era-adjust raw offense so that a
// big scoring number in a slow-paced era isn't worth the same as in a fast one.
const ERA_PACE = {
  "1960s": 1.10,
  "1970s": 1.06,
  "1980s": 1.04,
  "1990s": 0.98,
  "2000s": 0.97,
  "2010s": 1.00,
  "2020s": 1.02,
};

// Unique list of franchises that actually have players.
const TEAMS = [...new Set(PLAYERS.map((p) => p.t))];
