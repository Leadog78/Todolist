/* ============================================================================
 * PERFECT SEASON — player & franchise data
 * ----------------------------------------------------------------------------
 * A bundled, offline dataset of basketball legends. This is a non-commercial
 * fan game; ratings are subjective approximations on a 60-99 "legend scale"
 * and are meant for fun, not as a real evaluation of any player.
 *
 * Many stars appear as multiple *era-specific* entries (e.g. 2000s Cavs LeBron
 * vs 2020s Lakers LeBron) with ratings tuned to that version. You can only
 * draft a given name once — drafting one version removes the others.
 *
 * Each player:
 *   n  name        t  franchise (era-appropriate)   d  decade
 *   p  natural positions (array)                     a  archetype label
 *   hi height in inches (display is generated)
 *   o offense  df defense  pm playmaking  rb rebounding  sh shooting/spacing
 * ==========================================================================*/

const POSITIONS = ["PG", "SG", "SF", "PF", "C"];

const POSITION_NAMES = {
  PG: "Point Guard",
  SG: "Shooting Guard",
  SF: "Small Forward",
  PF: "Power Forward",
  C: "Center",
};

// Render a height in inches as e.g. 78 -> 6'6"
function formatHeight(inches) {
  return Math.floor(inches / 12) + "'" + (inches % 12) + '"';
}

const PLAYERS = [
  // ============================= 1960s =============================
  { n: "Bill Russell",      t: "Celtics",  d: "1960s", p: ["C"],        a: "Rim Protector",  hi: 82, o: 70, df: 99, pm: 76, rb: 98, sh: 50 },
  { n: "Wilt Chamberlain",  t: "Warriors", d: "1960s", p: ["C"],        a: "Rim Protector",  hi: 85, o: 92, df: 95, pm: 74, rb: 99, sh: 52 },
  { n: "Jerry West",        t: "Lakers",   d: "1960s", p: ["PG","SG"],  a: "Scorer",         hi: 74, o: 91, df: 84, pm: 82, rb: 68, sh: 84 },
  { n: "Elgin Baylor",      t: "Lakers",   d: "1960s", p: ["SF"],       a: "Slasher",        hi: 77, o: 90, df: 74, pm: 74, rb: 84, sh: 72 },
  { n: "Oscar Robertson",   t: "Royals",   d: "1960s", p: ["PG"],       a: "Floor General",  hi: 77, o: 90, df: 80, pm: 96, rb: 80, sh: 78 },
  { n: "Bob Cousy",         t: "Celtics",  d: "1960s", p: ["PG"],       a: "Floor General",  hi: 73, o: 80, df: 72, pm: 94, rb: 60, sh: 70 },
  { n: "Bob Pettit",        t: "Hawks",    d: "1960s", p: ["PF","C"],   a: "Big-Man Scorer", hi: 81, o: 88, df: 80, pm: 66, rb: 90, sh: 64 },
  { n: "John Havlicek",     t: "Celtics",  d: "1960s", p: ["SF","SG"],  a: "Two-Way Wing",   hi: 77, o: 84, df: 84, pm: 78, rb: 74, sh: 76 },
  { n: "Sam Jones",         t: "Celtics",  d: "1960s", p: ["SG"],       a: "Scorer",         hi: 76, o: 84, df: 76, pm: 70, rb: 66, sh: 82 },
  { n: "Hal Greer",         t: "76ers",    d: "1960s", p: ["SG"],       a: "Scorer",         hi: 74, o: 84, df: 78, pm: 74, rb: 66, sh: 80 },
  { n: "Jerry Lucas",       t: "Royals",   d: "1960s", p: ["PF","C"],   a: "Glue Guy",       hi: 80, o: 80, df: 80, pm: 74, rb: 92, sh: 66 },
  { n: "Willis Reed",       t: "Knicks",   d: "1960s", p: ["C"],        a: "Two-Way Big",    hi: 81, o: 82, df: 88, pm: 64, rb: 86, sh: 62 },
  { n: "Nate Thurmond",     t: "Warriors", d: "1960s", p: ["C"],        a: "Rim Protector",  hi: 83, o: 74, df: 94, pm: 66, rb: 94, sh: 50 },
  { n: "Dave DeBusschere",  t: "Knicks",   d: "1960s", p: ["PF"],       a: "Glue Guy",       hi: 78, o: 74, df: 90, pm: 70, rb: 84, sh: 66 },
  { n: "Wes Unseld",        t: "Bullets",  d: "1960s", p: ["C"],        a: "Glue Guy",       hi: 79, o: 72, df: 88, pm: 80, rb: 94, sh: 58 },
  { n: "Earl Monroe",       t: "Bullets",  d: "1960s", p: ["PG","SG"],  a: "Scorer",         hi: 75, o: 86, df: 72, pm: 80, rb: 62, sh: 76 },
  { n: "Gail Goodrich",     t: "Lakers",   d: "1960s", p: ["PG","SG"],  a: "Scorer",         hi: 73, o: 84, df: 68, pm: 78, rb: 58, sh: 78 },
  { n: "Billy Cunningham",  t: "76ers",    d: "1960s", p: ["SF","PF"],  a: "Slasher",        hi: 78, o: 86, df: 76, pm: 78, rb: 82, sh: 68 },
  { n: "Dave Bing",         t: "Pistons",  d: "1960s", p: ["PG"],       a: "Floor General",  hi: 75, o: 84, df: 72, pm: 86, rb: 60, sh: 76 },

  // ============================= 1970s =============================
  { n: "Kareem Abdul-Jabbar", t: "Bucks",  d: "1970s", p: ["C"],        a: "Big-Man Scorer", hi: 86, o: 95, df: 90, pm: 74, rb: 92, sh: 68 },
  { n: "Julius Erving",     t: "Nets",     d: "1970s", p: ["SF"],       a: "Slasher",        hi: 79, o: 92, df: 82, pm: 80, rb: 82, sh: 72 },
  { n: "Walt Frazier",      t: "Knicks",   d: "1970s", p: ["PG","SG"],  a: "Two-Way Wing",   hi: 76, o: 84, df: 90, pm: 88, rb: 68, sh: 76 },
  { n: "Rick Barry",        t: "Warriors", d: "1970s", p: ["SF"],       a: "Scorer",         hi: 79, o: 89, df: 78, pm: 82, rb: 74, sh: 86 },
  { n: "Pete Maravich",     t: "Jazz",     d: "1970s", p: ["PG","SG"],  a: "Scorer",         hi: 77, o: 90, df: 66, pm: 88, rb: 60, sh: 80 },
  { n: "Bill Walton",       t: "Blazers",  d: "1970s", p: ["C"],        a: "Two-Way Big",    hi: 83, o: 82, df: 92, pm: 84, rb: 92, sh: 56 },
  { n: "George Gervin",     t: "Spurs",    d: "1970s", p: ["SG","SF"],  a: "Scorer",         hi: 79, o: 90, df: 70, pm: 72, rb: 64, sh: 82 },
  { n: "Elvin Hayes",       t: "Bullets",  d: "1970s", p: ["PF","C"],   a: "Big-Man Scorer", hi: 81, o: 86, df: 84, pm: 60, rb: 92, sh: 66 },
  { n: "Bob McAdoo",        t: "Braves",   d: "1970s", p: ["C","PF"],   a: "Big-Man Scorer", hi: 81, o: 90, df: 74, pm: 64, rb: 86, sh: 76 },
  { n: "Dave Cowens",       t: "Celtics",  d: "1970s", p: ["C"],        a: "Two-Way Big",    hi: 81, o: 82, df: 86, pm: 78, rb: 90, sh: 62 },
  { n: "Nate Archibald",    t: "Kings",    d: "1970s", p: ["PG"],       a: "Floor General",  hi: 73, o: 88, df: 66, pm: 92, rb: 56, sh: 76 },
  { n: "Artis Gilmore",     t: "Bulls",    d: "1970s", p: ["C"],        a: "Rim Protector",  hi: 86, o: 84, df: 90, pm: 60, rb: 92, sh: 54 },
  { n: "Bob Lanier",        t: "Pistons",  d: "1970s", p: ["C"],        a: "Big-Man Scorer", hi: 83, o: 86, df: 82, pm: 68, rb: 88, sh: 62 },
  { n: "Dan Issel",         t: "Nuggets",  d: "1970s", p: ["PF","C"],   a: "Big-Man Scorer", hi: 81, o: 86, df: 72, pm: 66, rb: 82, sh: 72 },
  { n: "Spencer Haywood",   t: "Sonics",   d: "1970s", p: ["PF"],       a: "Big-Man Scorer", hi: 80, o: 86, df: 76, pm: 64, rb: 86, sh: 70 },
  { n: "Calvin Murphy",     t: "Rockets",  d: "1970s", p: ["PG"],       a: "Scorer",         hi: 69, o: 84, df: 66, pm: 82, rb: 52, sh: 84 },
  { n: "JoJo White",        t: "Celtics",  d: "1970s", p: ["PG","SG"],  a: "Two-Way Wing",   hi: 75, o: 80, df: 80, pm: 84, rb: 60, sh: 76 },
  { n: "Paul Westphal",     t: "Suns",     d: "1970s", p: ["PG","SG"],  a: "Scorer",         hi: 76, o: 86, df: 72, pm: 82, rb: 60, sh: 78 },

  // ============================= 1980s =============================
  { n: "Magic Johnson",     t: "Lakers",   d: "1980s", p: ["PG","SF"],  a: "Floor General",  hi: 81, o: 88, df: 80, pm: 99, rb: 82, sh: 78 },
  { n: "Larry Bird",        t: "Celtics",  d: "1980s", p: ["SF","PF"],  a: "Two-Way Wing",   hi: 81, o: 93, df: 82, pm: 88, rb: 84, sh: 92 },
  { n: "Kareem Abdul-Jabbar", t: "Lakers", d: "1980s", p: ["C"],        a: "Big-Man Scorer", hi: 86, o: 90, df: 86, pm: 72, rb: 84, sh: 68 },
  { n: "Julius Erving",     t: "76ers",    d: "1980s", p: ["SF"],       a: "Slasher",        hi: 79, o: 88, df: 80, pm: 78, rb: 76, sh: 72 },
  { n: "Moses Malone",      t: "76ers",    d: "1980s", p: ["C","PF"],   a: "Big-Man Scorer", hi: 82, o: 86, df: 84, pm: 60, rb: 95, sh: 56 },
  { n: "Isiah Thomas",      t: "Pistons",  d: "1980s", p: ["PG"],       a: "Floor General",  hi: 73, o: 86, df: 78, pm: 92, rb: 62, sh: 76 },
  { n: "Kevin McHale",      t: "Celtics",  d: "1980s", p: ["PF","C"],   a: "Big-Man Scorer", hi: 82, o: 87, df: 84, pm: 64, rb: 82, sh: 66 },
  { n: "Robert Parish",     t: "Celtics",  d: "1980s", p: ["C"],        a: "Two-Way Big",    hi: 84, o: 80, df: 84, pm: 62, rb: 88, sh: 62 },
  { n: "James Worthy",      t: "Lakers",   d: "1980s", p: ["SF"],       a: "Slasher",        hi: 81, o: 86, df: 78, pm: 74, rb: 70, sh: 74 },
  { n: "Dominique Wilkins", t: "Hawks",    d: "1980s", p: ["SF","SG"],  a: "Slasher",        hi: 80, o: 90, df: 70, pm: 70, rb: 74, sh: 78 },
  { n: "Clyde Drexler",     t: "Blazers",  d: "1980s", p: ["SG","SF"],  a: "Slasher",        hi: 79, o: 86, df: 80, pm: 82, rb: 72, sh: 76 },
  { n: "Alex English",      t: "Nuggets",  d: "1980s", p: ["SF"],       a: "Scorer",         hi: 79, o: 88, df: 70, pm: 76, rb: 70, sh: 80 },
  { n: "Bernard King",      t: "Knicks",   d: "1980s", p: ["SF"],       a: "Scorer",         hi: 79, o: 90, df: 68, pm: 70, rb: 70, sh: 78 },
  { n: "Adrian Dantley",    t: "Jazz",     d: "1980s", p: ["SF"],       a: "Scorer",         hi: 77, o: 89, df: 68, pm: 72, rb: 70, sh: 74 },
  { n: "Sidney Moncrief",   t: "Bucks",    d: "1980s", p: ["SG"],       a: "Two-Way Wing",   hi: 76, o: 82, df: 90, pm: 78, rb: 70, sh: 76 },
  { n: "Bill Laimbeer",     t: "Pistons",  d: "1980s", p: ["C"],        a: "Stretch Big",    hi: 83, o: 74, df: 84, pm: 60, rb: 86, sh: 76 },
  { n: "Mark Aguirre",      t: "Mavericks",d: "1980s", p: ["SF"],       a: "Scorer",         hi: 78, o: 86, df: 66, pm: 74, rb: 68, sh: 76 },
  { n: "Dennis Johnson",    t: "Celtics",  d: "1980s", p: ["PG","SG"],  a: "Two-Way Wing",   hi: 76, o: 78, df: 88, pm: 80, rb: 62, sh: 72 },
  { n: "Tom Chambers",      t: "Suns",     d: "1980s", p: ["PF"],       a: "Big-Man Scorer", hi: 82, o: 86, df: 66, pm: 64, rb: 76, sh: 78 },

  // ============================= 1990s =============================
  { n: "Michael Jordan",    t: "Bulls",    d: "1990s", p: ["SG","SF"],  a: "Scorer",         hi: 78, o: 99, df: 92, pm: 84, rb: 76, sh: 84 },
  { n: "Scottie Pippen",    t: "Bulls",    d: "1990s", p: ["SF","PF"],  a: "Two-Way Wing",   hi: 80, o: 82, df: 94, pm: 86, rb: 80, sh: 74 },
  { n: "Hakeem Olajuwon",   t: "Rockets",  d: "1990s", p: ["C"],        a: "Two-Way Big",    hi: 84, o: 90, df: 96, pm: 72, rb: 92, sh: 58 },
  { n: "David Robinson",    t: "Spurs",    d: "1990s", p: ["C"],        a: "Rim Protector",  hi: 85, o: 88, df: 94, pm: 70, rb: 90, sh: 58 },
  { n: "Patrick Ewing",     t: "Knicks",   d: "1990s", p: ["C"],        a: "Two-Way Big",    hi: 84, o: 86, df: 90, pm: 64, rb: 88, sh: 68 },
  { n: "Karl Malone",       t: "Jazz",     d: "1990s", p: ["PF"],       a: "Big-Man Scorer", hi: 81, o: 91, df: 84, pm: 74, rb: 90, sh: 70 },
  { n: "John Stockton",     t: "Jazz",     d: "1990s", p: ["PG"],       a: "Floor General",  hi: 73, o: 78, df: 82, pm: 98, rb: 58, sh: 82 },
  { n: "Charles Barkley",   t: "Suns",     d: "1990s", p: ["PF"],       a: "Big-Man Scorer", hi: 78, o: 90, df: 80, pm: 80, rb: 92, sh: 72 },
  { n: "Shaquille O'Neal",  t: "Magic",    d: "1990s", p: ["C"],        a: "Big-Man Scorer", hi: 85, o: 92, df: 86, pm: 64, rb: 88, sh: 54 },
  { n: "Gary Payton",       t: "Sonics",   d: "1990s", p: ["PG"],       a: "Two-Way Wing",   hi: 76, o: 82, df: 94, pm: 88, rb: 66, sh: 74 },
  { n: "Reggie Miller",     t: "Pacers",   d: "1990s", p: ["SG"],       a: "Sharpshooter",   hi: 79, o: 84, df: 74, pm: 70, rb: 62, sh: 96 },
  { n: "Alonzo Mourning",   t: "Heat",     d: "1990s", p: ["C"],        a: "Rim Protector",  hi: 82, o: 82, df: 92, pm: 58, rb: 86, sh: 56 },
  { n: "Shawn Kemp",        t: "Sonics",   d: "1990s", p: ["PF","C"],   a: "Big-Man Scorer", hi: 82, o: 84, df: 82, pm: 62, rb: 84, sh: 58 },
  { n: "Dennis Rodman",     t: "Bulls",    d: "1990s", p: ["PF","C"],   a: "Glue Guy",       hi: 79, o: 52, df: 95, pm: 64, rb: 99, sh: 40 },
  { n: "Grant Hill",        t: "Pistons",  d: "1990s", p: ["SF","SG"],  a: "Two-Way Wing",   hi: 80, o: 86, df: 80, pm: 86, rb: 76, sh: 72 },
  { n: "Chris Webber",      t: "Kings",    d: "1990s", p: ["PF"],       a: "Big-Man Scorer", hi: 82, o: 86, df: 80, pm: 80, rb: 88, sh: 68 },
  { n: "Penny Hardaway",    t: "Magic",    d: "1990s", p: ["PG"],       a: "Floor General",  hi: 79, o: 86, df: 80, pm: 88, rb: 68, sh: 76 },
  { n: "Mitch Richmond",    t: "Kings",    d: "1990s", p: ["SG"],       a: "Scorer",         hi: 77, o: 86, df: 74, pm: 74, rb: 64, sh: 84 },
  { n: "Dikembe Mutombo",   t: "Nuggets",  d: "1990s", p: ["C"],        a: "Rim Protector",  hi: 86, o: 62, df: 96, pm: 54, rb: 94, sh: 42 },
  { n: "Tim Hardaway",      t: "Heat",     d: "1990s", p: ["PG"],       a: "Floor General",  hi: 72, o: 84, df: 72, pm: 90, rb: 56, sh: 82 },
  { n: "Glen Rice",         t: "Hornets",  d: "1990s", p: ["SF","SG"],  a: "Sharpshooter",   hi: 80, o: 84, df: 68, pm: 66, rb: 64, sh: 92 },

  // ============================= 2000s =============================
  { n: "Kobe Bryant",       t: "Lakers",   d: "2000s", p: ["SG","SF"],  a: "Scorer",         hi: 78, o: 96, df: 86, pm: 78, rb: 70, sh: 86 },
  { n: "Shaquille O'Neal",  t: "Lakers",   d: "2000s", p: ["C"],        a: "Big-Man Scorer", hi: 85, o: 94, df: 88, pm: 66, rb: 86, sh: 52 },
  { n: "Tim Duncan",        t: "Spurs",    d: "2000s", p: ["PF","C"],   a: "Two-Way Big",    hi: 83, o: 88, df: 95, pm: 76, rb: 92, sh: 64 },
  { n: "Kevin Garnett",     t: "Timberwolves", d: "2000s", p: ["PF","C"], a: "Two-Way Big",  hi: 83, o: 88, df: 92, pm: 82, rb: 90, sh: 70 },
  { n: "Dirk Nowitzki",     t: "Mavericks",d: "2000s", p: ["PF","C"],   a: "Stretch Big",    hi: 84, o: 92, df: 74, pm: 72, rb: 82, sh: 90 },
  { n: "Allen Iverson",     t: "76ers",    d: "2000s", p: ["PG","SG"],  a: "Scorer",         hi: 72, o: 90, df: 72, pm: 82, rb: 58, sh: 78 },
  { n: "Steve Nash",        t: "Suns",     d: "2000s", p: ["PG"],       a: "Floor General",  hi: 75, o: 84, df: 64, pm: 97, rb: 56, sh: 90 },
  { n: "Tracy McGrady",     t: "Rockets",  d: "2000s", p: ["SG","SF"],  a: "Scorer",         hi: 80, o: 91, df: 76, pm: 80, rb: 72, sh: 82 },
  { n: "Dwyane Wade",       t: "Heat",     d: "2000s", p: ["SG","PG"],  a: "Slasher",        hi: 76, o: 91, df: 84, pm: 84, rb: 70, sh: 74 },
  { n: "LeBron James",      t: "Cavaliers",d: "2000s", p: ["SF","PF"],  a: "Two-Way Wing",   hi: 81, o: 92, df: 84, pm: 92, rb: 82, sh: 74 },
  { n: "Carmelo Anthony",   t: "Nuggets",  d: "2000s", p: ["SF","PF"],  a: "Scorer",         hi: 79, o: 90, df: 70, pm: 72, rb: 72, sh: 82 },
  { n: "Paul Pierce",       t: "Celtics",  d: "2000s", p: ["SF"],       a: "Scorer",         hi: 79, o: 88, df: 78, pm: 78, rb: 68, sh: 82 },
  { n: "Ray Allen",         t: "Sonics",   d: "2000s", p: ["SG"],       a: "Sharpshooter",   hi: 77, o: 86, df: 76, pm: 72, rb: 64, sh: 94 },
  { n: "Vince Carter",      t: "Raptors",  d: "2000s", p: ["SG","SF"],  a: "Slasher",        hi: 78, o: 88, df: 74, pm: 76, rb: 68, sh: 82 },
  { n: "Chris Paul",        t: "Hornets",  d: "2000s", p: ["PG"],       a: "Floor General",  hi: 72, o: 86, df: 86, pm: 96, rb: 62, sh: 82 },
  { n: "Dwight Howard",     t: "Magic",    d: "2000s", p: ["C"],        a: "Rim Protector",  hi: 82, o: 80, df: 94, pm: 58, rb: 94, sh: 40 },
  { n: "Pau Gasol",         t: "Lakers",   d: "2000s", p: ["PF","C"],   a: "Two-Way Big",    hi: 84, o: 86, df: 82, pm: 78, rb: 86, sh: 66 },
  { n: "Tony Parker",       t: "Spurs",    d: "2000s", p: ["PG"],       a: "Slasher",        hi: 74, o: 83, df: 74, pm: 84, rb: 58, sh: 72 },
  { n: "Manu Ginobili",     t: "Spurs",    d: "2000s", p: ["SG"],       a: "Two-Way Wing",   hi: 78, o: 82, df: 80, pm: 82, rb: 64, sh: 80 },
  { n: "Chauncey Billups",  t: "Pistons",  d: "2000s", p: ["PG"],       a: "Floor General",  hi: 75, o: 82, df: 80, pm: 86, rb: 60, sh: 86 },
  { n: "Yao Ming",          t: "Rockets",  d: "2000s", p: ["C"],        a: "Big-Man Scorer", hi: 90, o: 84, df: 86, pm: 62, rb: 86, sh: 70 },
  { n: "Amar'e Stoudemire", t: "Suns",     d: "2000s", p: ["PF","C"],   a: "Big-Man Scorer", hi: 82, o: 86, df: 72, pm: 60, rb: 80, sh: 72 },
  { n: "Ben Wallace",       t: "Pistons",  d: "2000s", p: ["C","PF"],   a: "Rim Protector",  hi: 81, o: 52, df: 96, pm: 58, rb: 94, sh: 38 },
  { n: "Jason Kidd",        t: "Nets",     d: "2000s", p: ["PG"],       a: "Floor General",  hi: 76, o: 74, df: 84, pm: 96, rb: 76, sh: 72 },
  { n: "Gilbert Arenas",    t: "Wizards",  d: "2000s", p: ["PG","SG"],  a: "Scorer",         hi: 76, o: 88, df: 66, pm: 80, rb: 58, sh: 84 },

  // ============================= 2010s =============================
  { n: "LeBron James",      t: "Heat",     d: "2010s", p: ["SF","PF"],  a: "Two-Way Wing",   hi: 81, o: 96, df: 90, pm: 94, rb: 82, sh: 78 },
  { n: "Kevin Durant",      t: "Thunder",  d: "2010s", p: ["SF","PF"],  a: "Scorer",         hi: 83, o: 97, df: 82, pm: 80, rb: 76, sh: 92 },
  { n: "Stephen Curry",     t: "Warriors", d: "2010s", p: ["PG","SG"],  a: "Sharpshooter",   hi: 74, o: 95, df: 74, pm: 90, rb: 64, sh: 99 },
  { n: "Russell Westbrook", t: "Thunder",  d: "2010s", p: ["PG"],       a: "Slasher",        hi: 75, o: 86, df: 78, pm: 90, rb: 80, sh: 64 },
  { n: "James Harden",      t: "Rockets",  d: "2010s", p: ["SG","PG"],  a: "Scorer",         hi: 77, o: 94, df: 66, pm: 90, rb: 66, sh: 88 },
  { n: "Kawhi Leonard",     t: "Spurs",    d: "2010s", p: ["SF","SG"],  a: "Two-Way Wing",   hi: 79, o: 88, df: 96, pm: 74, rb: 74, sh: 84 },
  { n: "Chris Paul",        t: "Clippers", d: "2010s", p: ["PG"],       a: "Floor General",  hi: 72, o: 85, df: 84, pm: 95, rb: 60, sh: 84 },
  { n: "Klay Thompson",     t: "Warriors", d: "2010s", p: ["SG"],       a: "Sharpshooter",   hi: 78, o: 84, df: 82, pm: 64, rb: 62, sh: 96 },
  { n: "Draymond Green",    t: "Warriors", d: "2010s", p: ["PF","C"],   a: "Glue Guy",       hi: 78, o: 64, df: 94, pm: 86, rb: 84, sh: 66 },
  { n: "Kyrie Irving",      t: "Cavaliers",d: "2010s", p: ["PG","SG"],  a: "Slasher",        hi: 74, o: 90, df: 70, pm: 86, rb: 58, sh: 88 },
  { n: "Blake Griffin",     t: "Clippers", d: "2010s", p: ["PF"],       a: "Big-Man Scorer", hi: 81, o: 86, df: 74, pm: 78, rb: 84, sh: 68 },
  { n: "Anthony Davis",     t: "Pelicans", d: "2010s", p: ["PF","C"],   a: "Two-Way Big",    hi: 82, o: 88, df: 92, pm: 66, rb: 88, sh: 66 },
  { n: "Paul George",       t: "Pacers",   d: "2010s", p: ["SF","SG"],  a: "Two-Way Wing",   hi: 80, o: 86, df: 86, pm: 76, rb: 70, sh: 82 },
  { n: "Jimmy Butler",      t: "Bulls",    d: "2010s", p: ["SF","SG"],  a: "Two-Way Wing",   hi: 79, o: 84, df: 88, pm: 80, rb: 70, sh: 72 },
  { n: "Damian Lillard",    t: "Blazers",  d: "2010s", p: ["PG"],       a: "Sharpshooter",   hi: 74, o: 91, df: 66, pm: 86, rb: 60, sh: 94 },
  { n: "DeMar DeRozan",     t: "Raptors",  d: "2010s", p: ["SG","SF"],  a: "Scorer",         hi: 78, o: 86, df: 72, pm: 78, rb: 64, sh: 70 },
  { n: "John Wall",         t: "Wizards",  d: "2010s", p: ["PG"],       a: "Floor General",  hi: 76, o: 84, df: 78, pm: 90, rb: 60, sh: 70 },
  { n: "Kemba Walker",      t: "Hornets",  d: "2010s", p: ["PG"],       a: "Scorer",         hi: 72, o: 84, df: 66, pm: 84, rb: 58, sh: 82 },
  { n: "Marc Gasol",        t: "Grizzlies",d: "2010s", p: ["C"],        a: "Two-Way Big",    hi: 83, o: 80, df: 90, pm: 80, rb: 82, sh: 72 },
  { n: "Kyle Lowry",        t: "Raptors",  d: "2010s", p: ["PG"],       a: "Floor General",  hi: 72, o: 80, df: 84, pm: 86, rb: 64, sh: 82 },
  { n: "DeMarcus Cousins",  t: "Kings",    d: "2010s", p: ["C"],        a: "Big-Man Scorer", hi: 82, o: 88, df: 80, pm: 74, rb: 90, sh: 72 },

  // ============================= 2020s =============================
  { n: "Giannis Antetokounmpo", t: "Bucks", d: "2020s", p: ["PF","C"],  a: "Two-Way Big",    hi: 83, o: 93, df: 92, pm: 80, rb: 90, sh: 62 },
  { n: "Nikola Jokic",      t: "Nuggets",  d: "2020s", p: ["C"],        a: "Floor General",  hi: 83, o: 94, df: 80, pm: 97, rb: 92, sh: 80 },
  { n: "Joel Embiid",       t: "76ers",    d: "2020s", p: ["C"],        a: "Two-Way Big",    hi: 84, o: 94, df: 90, pm: 74, rb: 88, sh: 76 },
  { n: "Luka Doncic",       t: "Mavericks",d: "2020s", p: ["PG","SG"],  a: "Scorer",         hi: 79, o: 95, df: 72, pm: 95, rb: 82, sh: 84 },
  { n: "Stephen Curry",     t: "Warriors", d: "2020s", p: ["PG"],       a: "Sharpshooter",   hi: 74, o: 94, df: 72, pm: 88, rb: 62, sh: 99 },
  { n: "Kevin Durant",      t: "Suns",     d: "2020s", p: ["SF","PF"],  a: "Scorer",         hi: 83, o: 95, df: 80, pm: 82, rb: 74, sh: 92 },
  { n: "Jayson Tatum",      t: "Celtics",  d: "2020s", p: ["SF","PF"],  a: "Scorer",         hi: 80, o: 90, df: 84, pm: 78, rb: 78, sh: 84 },
  { n: "Devin Booker",      t: "Suns",     d: "2020s", p: ["SG","PG"],  a: "Scorer",         hi: 77, o: 90, df: 74, pm: 82, rb: 64, sh: 88 },
  { n: "Damian Lillard",    t: "Bucks",    d: "2020s", p: ["PG"],       a: "Sharpshooter",   hi: 74, o: 90, df: 64, pm: 84, rb: 60, sh: 94 },
  { n: "Ja Morant",         t: "Grizzlies",d: "2020s", p: ["PG"],       a: "Slasher",        hi: 74, o: 88, df: 68, pm: 88, rb: 62, sh: 72 },
  { n: "Trae Young",        t: "Hawks",    d: "2020s", p: ["PG"],       a: "Sharpshooter",   hi: 73, o: 88, df: 58, pm: 92, rb: 56, sh: 90 },
  { n: "Shai Gilgeous-Alexander", t: "Thunder", d: "2020s", p: ["PG","SG"], a: "Scorer",     hi: 78, o: 93, df: 84, pm: 86, rb: 68, sh: 82 },
  { n: "Anthony Edwards",   t: "Timberwolves", d: "2020s", p: ["SG"],   a: "Scorer",         hi: 76, o: 90, df: 80, pm: 78, rb: 70, sh: 84 },
  { n: "Zion Williamson",   t: "Pelicans", d: "2020s", p: ["PF"],       a: "Slasher",        hi: 78, o: 90, df: 74, pm: 78, rb: 84, sh: 62 },
  { n: "Kawhi Leonard",     t: "Clippers", d: "2020s", p: ["SF"],       a: "Two-Way Wing",   hi: 79, o: 90, df: 92, pm: 76, rb: 74, sh: 84 },
  { n: "LeBron James",      t: "Lakers",   d: "2020s", p: ["SF","PF"],  a: "Two-Way Wing",   hi: 81, o: 90, df: 80, pm: 90, rb: 78, sh: 78 },
  { n: "Anthony Davis",     t: "Lakers",   d: "2020s", p: ["PF","C"],   a: "Two-Way Big",    hi: 82, o: 88, df: 94, pm: 66, rb: 90, sh: 62 },
  { n: "Jaylen Brown",      t: "Celtics",  d: "2020s", p: ["SG","SF"],  a: "Two-Way Wing",   hi: 78, o: 86, df: 82, pm: 72, rb: 68, sh: 80 },
  { n: "Donovan Mitchell",  t: "Cavaliers",d: "2020s", p: ["SG"],       a: "Scorer",         hi: 73, o: 89, df: 76, pm: 80, rb: 64, sh: 84 },
  { n: "Bam Adebayo",       t: "Heat",     d: "2020s", p: ["C"],        a: "Two-Way Big",    hi: 81, o: 80, df: 90, pm: 78, rb: 84, sh: 58 },
  { n: "Domantas Sabonis",  t: "Kings",    d: "2020s", p: ["PF","C"],   a: "Floor General",  hi: 83, o: 84, df: 76, pm: 86, rb: 92, sh: 68 },
  { n: "Victor Wembanyama", t: "Spurs",    d: "2020s", p: ["C"],        a: "Two-Way Big",    hi: 88, o: 88, df: 96, pm: 74, rb: 90, sh: 78 },
  { n: "Tyrese Haliburton", t: "Pacers",   d: "2020s", p: ["PG"],       a: "Floor General",  hi: 77, o: 84, df: 74, pm: 94, rb: 62, sh: 86 },
  { n: "Jimmy Butler",      t: "Heat",     d: "2020s", p: ["SF","SG"],  a: "Two-Way Wing",   hi: 79, o: 86, df: 88, pm: 82, rb: 70, sh: 74 },
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

// Unique franchises and decades that actually have players.
const TEAMS = [...new Set(PLAYERS.map((p) => p.t))];
const DECADES = [...new Set(PLAYERS.map((p) => p.d))].sort();
