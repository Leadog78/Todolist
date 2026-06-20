/* ============================================================================
 * PERFECT SEASON — player & franchise data
 * ----------------------------------------------------------------------------
 * A bundled, offline dataset of basketball legends and their supporting casts,
 * organized into real team-eras so every slot-machine roll deals a believable
 * roster to pick from. Non-commercial fan game; ratings are subjective
 * approximations on a 60-99 scale, meant for fun.
 *
 * Many stars appear as multiple era-specific entries (e.g. 2000s vs 2010s vs
 * 2020s LeBron). A name can only be drafted once.
 *
 *   n name  t franchise(era)  d decade  p positions[]  a archetype
 *   hi height in inches        o off  df def  pm playmaking  rb reb  sh shooting
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
  // =======================================================================
  // 1960s
  // =======================================================================
  // -- Celtics (dynasty) --
  { n: "Bill Russell",      t: "Celtics",  d: "1960s", p: ["C"],       a: "Rim Protector",  hi: 82, o: 70, df: 99, pm: 76, rb: 98, sh: 50 },
  { n: "Bob Cousy",         t: "Celtics",  d: "1960s", p: ["PG"],      a: "Floor General",  hi: 73, o: 80, df: 72, pm: 94, rb: 60, sh: 70 },
  { n: "John Havlicek",     t: "Celtics",  d: "1960s", p: ["SF","SG"], a: "Two-Way Wing",   hi: 77, o: 84, df: 84, pm: 78, rb: 74, sh: 76 },
  { n: "Sam Jones",         t: "Celtics",  d: "1960s", p: ["SG"],      a: "Scorer",         hi: 76, o: 84, df: 76, pm: 70, rb: 66, sh: 82 },
  { n: "Tom Heinsohn",      t: "Celtics",  d: "1960s", p: ["PF"],      a: "Big-Man Scorer", hi: 79, o: 82, df: 72, pm: 64, rb: 80, sh: 70 },
  { n: "K.C. Jones",        t: "Celtics",  d: "1960s", p: ["PG"],      a: "Glue Guy",       hi: 73, o: 64, df: 88, pm: 80, rb: 58, sh: 58 },
  // -- Lakers --
  { n: "Jerry West",        t: "Lakers",   d: "1960s", p: ["PG","SG"], a: "Scorer",         hi: 74, o: 91, df: 84, pm: 82, rb: 68, sh: 84 },
  { n: "Elgin Baylor",      t: "Lakers",   d: "1960s", p: ["SF"],      a: "Slasher",        hi: 77, o: 90, df: 74, pm: 74, rb: 84, sh: 72 },
  { n: "Gail Goodrich",     t: "Lakers",   d: "1960s", p: ["PG","SG"], a: "Scorer",         hi: 73, o: 84, df: 68, pm: 78, rb: 58, sh: 78 },
  { n: "Rudy LaRusso",      t: "Lakers",   d: "1960s", p: ["PF"],      a: "Glue Guy",       hi: 79, o: 76, df: 80, pm: 64, rb: 80, sh: 66 },
  { n: "Tom Hawkins",       t: "Lakers",   d: "1960s", p: ["SF"],      a: "Role Player",    hi: 77, o: 68, df: 76, pm: 60, rb: 74, sh: 58 },
  // -- Warriors --
  { n: "Wilt Chamberlain",  t: "Warriors", d: "1960s", p: ["C"],       a: "Rim Protector",  hi: 85, o: 92, df: 95, pm: 74, rb: 99, sh: 52 },
  { n: "Nate Thurmond",     t: "Warriors", d: "1960s", p: ["C","PF"],  a: "Rim Protector",  hi: 83, o: 74, df: 94, pm: 66, rb: 94, sh: 50 },
  { n: "Paul Arizin",       t: "Warriors", d: "1960s", p: ["SF","SG"], a: "Scorer",         hi: 76, o: 86, df: 70, pm: 68, rb: 72, sh: 78 },
  { n: "Guy Rodgers",       t: "Warriors", d: "1960s", p: ["PG"],      a: "Floor General",  hi: 72, o: 72, df: 72, pm: 92, rb: 58, sh: 64 },
  { n: "Al Attles",         t: "Warriors", d: "1960s", p: ["PG","SG"], a: "Glue Guy",       hi: 72, o: 70, df: 84, pm: 76, rb: 60, sh: 62 },
  // -- 76ers --
  { n: "Hal Greer",         t: "76ers",    d: "1960s", p: ["SG"],      a: "Scorer",         hi: 74, o: 84, df: 78, pm: 74, rb: 66, sh: 80 },
  { n: "Billy Cunningham",  t: "76ers",    d: "1960s", p: ["SF","PF"], a: "Slasher",        hi: 78, o: 86, df: 76, pm: 78, rb: 82, sh: 68 },
  { n: "Chet Walker",       t: "76ers",    d: "1960s", p: ["SF"],      a: "Scorer",         hi: 78, o: 84, df: 72, pm: 68, rb: 72, sh: 74 },
  { n: "Wali Jones",        t: "76ers",    d: "1960s", p: ["PG"],      a: "Role Player",    hi: 74, o: 76, df: 74, pm: 80, rb: 56, sh: 72 },
  { n: "Luke Jackson",      t: "76ers",    d: "1960s", p: ["PF","C"],  a: "Glue Guy",       hi: 81, o: 70, df: 82, pm: 66, rb: 86, sh: 56 },
  // -- Royals --
  { n: "Oscar Robertson",   t: "Royals",   d: "1960s", p: ["PG"],      a: "Floor General",  hi: 77, o: 90, df: 80, pm: 96, rb: 80, sh: 78 },
  { n: "Jerry Lucas",       t: "Royals",   d: "1960s", p: ["PF","C"],  a: "Glue Guy",       hi: 80, o: 80, df: 80, pm: 74, rb: 92, sh: 66 },
  { n: "Jack Twyman",       t: "Royals",   d: "1960s", p: ["SF"],      a: "Scorer",         hi: 78, o: 84, df: 70, pm: 66, rb: 74, sh: 76 },
  { n: "Wayne Embry",       t: "Royals",   d: "1960s", p: ["C"],       a: "Glue Guy",       hi: 80, o: 74, df: 80, pm: 60, rb: 84, sh: 54 },
  // -- Knicks --
  { n: "Willis Reed",       t: "Knicks",   d: "1960s", p: ["C"],       a: "Two-Way Big",    hi: 81, o: 82, df: 88, pm: 64, rb: 86, sh: 62 },
  { n: "Dave DeBusschere",  t: "Knicks",   d: "1960s", p: ["PF"],      a: "Glue Guy",       hi: 78, o: 74, df: 90, pm: 70, rb: 84, sh: 66 },
  { n: "Dick Barnett",      t: "Knicks",   d: "1960s", p: ["SG"],      a: "Scorer",         hi: 76, o: 82, df: 76, pm: 70, rb: 60, sh: 76 },
  { n: "Bill Bradley",      t: "Knicks",   d: "1960s", p: ["SF"],      a: "Role Player",    hi: 77, o: 78, df: 76, pm: 78, rb: 64, sh: 78 },
  // -- Hawks --
  { n: "Bob Pettit",        t: "Hawks",    d: "1960s", p: ["PF","C"],  a: "Big-Man Scorer", hi: 81, o: 88, df: 80, pm: 66, rb: 90, sh: 64 },
  { n: "Lenny Wilkens",     t: "Hawks",    d: "1960s", p: ["PG"],      a: "Floor General",  hi: 73, o: 80, df: 78, pm: 90, rb: 60, sh: 70 },
  { n: "Lou Hudson",        t: "Hawks",    d: "1960s", p: ["SG","SF"], a: "Scorer",         hi: 77, o: 86, df: 70, pm: 68, rb: 66, sh: 80 },
  { n: "Bill Bridges",      t: "Hawks",    d: "1960s", p: ["PF"],      a: "Glue Guy",       hi: 78, o: 70, df: 84, pm: 66, rb: 88, sh: 58 },
  { n: "Zelmo Beaty",       t: "Hawks",    d: "1960s", p: ["C"],       a: "Two-Way Big",    hi: 81, o: 80, df: 82, pm: 60, rb: 84, sh: 60 },
  // -- Bullets --
  { n: "Wes Unseld",        t: "Bullets",  d: "1960s", p: ["C"],       a: "Glue Guy",       hi: 79, o: 72, df: 88, pm: 80, rb: 94, sh: 58 },
  { n: "Earl Monroe",       t: "Bullets",  d: "1960s", p: ["PG","SG"], a: "Scorer",         hi: 75, o: 86, df: 72, pm: 80, rb: 62, sh: 76 },
  { n: "Gus Johnson",       t: "Bullets",  d: "1960s", p: ["PF"],      a: "Slasher",        hi: 78, o: 80, df: 84, pm: 66, rb: 86, sh: 62 },
  { n: "Kevin Loughery",    t: "Bullets",  d: "1960s", p: ["SG"],      a: "Scorer",         hi: 75, o: 80, df: 72, pm: 72, rb: 58, sh: 76 },

  // =======================================================================
  // 1970s
  // =======================================================================
  // -- Knicks (champs) --
  { n: "Walt Frazier",      t: "Knicks",   d: "1970s", p: ["PG","SG"], a: "Two-Way Wing",   hi: 76, o: 84, df: 90, pm: 88, rb: 68, sh: 76 },
  { n: "Willis Reed",       t: "Knicks",   d: "1970s", p: ["C"],       a: "Two-Way Big",    hi: 81, o: 82, df: 88, pm: 64, rb: 84, sh: 62 },
  { n: "Earl Monroe",       t: "Knicks",   d: "1970s", p: ["PG","SG"], a: "Scorer",         hi: 75, o: 86, df: 72, pm: 80, rb: 60, sh: 76 },
  { n: "Bill Bradley",      t: "Knicks",   d: "1970s", p: ["SF"],      a: "Role Player",    hi: 77, o: 78, df: 76, pm: 78, rb: 64, sh: 78 },
  { n: "Dave DeBusschere",  t: "Knicks",   d: "1970s", p: ["PF"],      a: "Glue Guy",       hi: 78, o: 74, df: 90, pm: 70, rb: 84, sh: 66 },
  // -- Bucks --
  { n: "Kareem Abdul-Jabbar", t: "Bucks",  d: "1970s", p: ["C"],       a: "Big-Man Scorer", hi: 86, o: 95, df: 90, pm: 74, rb: 92, sh: 68 },
  { n: "Oscar Robertson",   t: "Bucks",    d: "1970s", p: ["PG"],      a: "Floor General",  hi: 77, o: 84, df: 78, pm: 92, rb: 72, sh: 76 },
  { n: "Bob Dandridge",     t: "Bucks",    d: "1970s", p: ["SF"],      a: "Two-Way Wing",   hi: 78, o: 84, df: 82, pm: 70, rb: 72, sh: 76 },
  { n: "Jon McGlocklin",    t: "Bucks",    d: "1970s", p: ["SG"],      a: "Sharpshooter",   hi: 77, o: 78, df: 68, pm: 72, rb: 56, sh: 84 },
  // -- Blazers (1977 champs — the roster you noticed) --
  { n: "Bill Walton",       t: "Blazers",  d: "1970s", p: ["C"],       a: "Two-Way Big",    hi: 83, o: 82, df: 92, pm: 84, rb: 92, sh: 56 },
  { n: "Maurice Lucas",     t: "Blazers",  d: "1970s", p: ["PF"],      a: "Big-Man Scorer", hi: 81, o: 84, df: 84, pm: 70, rb: 86, sh: 64 },
  { n: "Lionel Hollins",    t: "Blazers",  d: "1970s", p: ["PG"],      a: "Two-Way Wing",   hi: 75, o: 80, df: 84, pm: 82, rb: 58, sh: 72 },
  { n: "Bob Gross",         t: "Blazers",  d: "1970s", p: ["SF"],      a: "Glue Guy",       hi: 78, o: 74, df: 82, pm: 76, rb: 70, sh: 70 },
  { n: "Dave Twardzik",     t: "Blazers",  d: "1970s", p: ["PG"],      a: "Role Player",    hi: 73, o: 76, df: 76, pm: 80, rb: 52, sh: 70 },
  { n: "Lloyd Neal",        t: "Blazers",  d: "1970s", p: ["PF","C"],  a: "Glue Guy",       hi: 79, o: 70, df: 80, pm: 60, rb: 82, sh: 58 },
  // -- Celtics --
  { n: "John Havlicek",     t: "Celtics",  d: "1970s", p: ["SF","SG"], a: "Two-Way Wing",   hi: 77, o: 86, df: 84, pm: 80, rb: 74, sh: 78 },
  { n: "Dave Cowens",       t: "Celtics",  d: "1970s", p: ["C"],       a: "Two-Way Big",    hi: 81, o: 82, df: 86, pm: 78, rb: 90, sh: 62 },
  { n: "JoJo White",        t: "Celtics",  d: "1970s", p: ["PG","SG"], a: "Two-Way Wing",   hi: 75, o: 80, df: 80, pm: 84, rb: 60, sh: 76 },
  { n: "Paul Silas",        t: "Celtics",  d: "1970s", p: ["PF"],      a: "Glue Guy",       hi: 79, o: 66, df: 86, pm: 70, rb: 90, sh: 54 },
  { n: "Charlie Scott",     t: "Celtics",  d: "1970s", p: ["SG"],      a: "Scorer",         hi: 77, o: 84, df: 74, pm: 78, rb: 60, sh: 76 },
  // -- Warriors (1975 champs) --
  { n: "Rick Barry",        t: "Warriors", d: "1970s", p: ["SF"],      a: "Scorer",         hi: 79, o: 89, df: 78, pm: 82, rb: 74, sh: 86 },
  { n: "Jamaal Wilkes",     t: "Warriors", d: "1970s", p: ["SF","PF"], a: "Two-Way Wing",   hi: 78, o: 82, df: 80, pm: 70, rb: 72, sh: 76 },
  { n: "Phil Smith",        t: "Warriors", d: "1970s", p: ["SG"],      a: "Scorer",         hi: 76, o: 82, df: 76, pm: 76, rb: 58, sh: 76 },
  { n: "Clifford Ray",      t: "Warriors", d: "1970s", p: ["C"],       a: "Rim Protector",  hi: 81, o: 60, df: 86, pm: 64, rb: 84, sh: 48 },
  // -- 76ers --
  { n: "Julius Erving",     t: "76ers",    d: "1970s", p: ["SF"],      a: "Slasher",        hi: 79, o: 90, df: 82, pm: 80, rb: 80, sh: 72 },
  { n: "George McGinnis",   t: "76ers",    d: "1970s", p: ["PF"],      a: "Big-Man Scorer", hi: 80, o: 86, df: 76, pm: 74, rb: 84, sh: 62 },
  { n: "Doug Collins",      t: "76ers",    d: "1970s", p: ["SG"],      a: "Scorer",         hi: 78, o: 84, df: 74, pm: 74, rb: 60, sh: 78 },
  { n: "Darryl Dawkins",    t: "76ers",    d: "1970s", p: ["C"],       a: "Big-Man Scorer", hi: 83, o: 78, df: 80, pm: 56, rb: 80, sh: 58 },
  { n: "World B. Free",     t: "76ers",    d: "1970s", p: ["SG"],      a: "Scorer",         hi: 74, o: 86, df: 64, pm: 72, rb: 54, sh: 78 },
  // -- Lakers --
  { n: "Gail Goodrich",     t: "Lakers",   d: "1970s", p: ["PG","SG"], a: "Scorer",         hi: 73, o: 86, df: 68, pm: 80, rb: 58, sh: 80 },
  { n: "Jim McMillian",     t: "Lakers",   d: "1970s", p: ["SF"],      a: "Scorer",         hi: 77, o: 82, df: 74, pm: 70, rb: 70, sh: 76 },
  { n: "Happy Hairston",    t: "Lakers",   d: "1970s", p: ["PF"],      a: "Glue Guy",       hi: 79, o: 74, df: 80, pm: 64, rb: 86, sh: 60 },
  // -- Spurs (ABA/NBA) --
  { n: "George Gervin",     t: "Spurs",    d: "1970s", p: ["SG","SF"], a: "Scorer",         hi: 79, o: 90, df: 70, pm: 72, rb: 64, sh: 82 },
  { n: "Larry Kenon",       t: "Spurs",    d: "1970s", p: ["PF","SF"], a: "Big-Man Scorer", hi: 81, o: 82, df: 74, pm: 66, rb: 82, sh: 64 },
  { n: "James Silas",       t: "Spurs",    d: "1970s", p: ["PG"],      a: "Floor General",  hi: 73, o: 82, df: 72, pm: 84, rb: 56, sh: 76 },
  { n: "Billy Paultz",      t: "Spurs",    d: "1970s", p: ["C"],       a: "Glue Guy",       hi: 83, o: 72, df: 82, pm: 62, rb: 82, sh: 56 },
  // -- Nuggets (ABA/NBA) --
  { n: "David Thompson",    t: "Nuggets",  d: "1970s", p: ["SG","SF"], a: "Slasher",        hi: 76, o: 90, df: 74, pm: 74, rb: 66, sh: 80 },
  { n: "Dan Issel",         t: "Nuggets",  d: "1970s", p: ["PF","C"],  a: "Big-Man Scorer", hi: 81, o: 86, df: 72, pm: 66, rb: 82, sh: 72 },
  { n: "Bobby Jones",       t: "Nuggets",  d: "1970s", p: ["SF","PF"], a: "Glue Guy",       hi: 81, o: 76, df: 90, pm: 72, rb: 78, sh: 64 },
  { n: "Ralph Simpson",     t: "Nuggets",  d: "1970s", p: ["SG"],      a: "Scorer",         hi: 77, o: 82, df: 72, pm: 74, rb: 62, sh: 74 },
  // -- Bullets (1978 champs) --
  { n: "Elvin Hayes",       t: "Bullets",  d: "1970s", p: ["PF","C"],  a: "Big-Man Scorer", hi: 81, o: 86, df: 84, pm: 60, rb: 92, sh: 66 },
  { n: "Wes Unseld",        t: "Bullets",  d: "1970s", p: ["C"],       a: "Glue Guy",       hi: 79, o: 70, df: 88, pm: 80, rb: 92, sh: 56 },
  { n: "Phil Chenier",      t: "Bullets",  d: "1970s", p: ["SG"],      a: "Scorer",         hi: 75, o: 82, df: 78, pm: 72, rb: 60, sh: 76 },
  { n: "Bob Dandridge",     t: "Bullets",  d: "1970s", p: ["SF"],      a: "Two-Way Wing",   hi: 78, o: 84, df: 82, pm: 70, rb: 72, sh: 76 },
  // -- Suns --
  { n: "Paul Westphal",     t: "Suns",     d: "1970s", p: ["PG","SG"], a: "Scorer",         hi: 76, o: 86, df: 72, pm: 82, rb: 60, sh: 78 },
  { n: "Alvan Adams",       t: "Suns",     d: "1970s", p: ["C"],       a: "Floor General",  hi: 81, o: 82, df: 80, pm: 82, rb: 80, sh: 64 },
  { n: "Walter Davis",      t: "Suns",     d: "1970s", p: ["SG","SF"], a: "Scorer",         hi: 78, o: 86, df: 72, pm: 76, rb: 62, sh: 82 },
  { n: "Dick Van Arsdale",  t: "Suns",     d: "1970s", p: ["SG","SF"], a: "Glue Guy",       hi: 77, o: 78, df: 80, pm: 72, rb: 66, sh: 72 },
  // -- Rockets --
  { n: "Calvin Murphy",     t: "Rockets",  d: "1970s", p: ["PG"],      a: "Scorer",         hi: 69, o: 84, df: 66, pm: 82, rb: 52, sh: 84 },
  { n: "Rudy Tomjanovich",  t: "Rockets",  d: "1970s", p: ["SF","PF"], a: "Scorer",         hi: 80, o: 84, df: 72, pm: 68, rb: 78, sh: 78 },
  { n: "Moses Malone",      t: "Rockets",  d: "1970s", p: ["C"],       a: "Big-Man Scorer", hi: 82, o: 84, df: 82, pm: 58, rb: 94, sh: 54 },
  { n: "Mike Newlin",       t: "Rockets",  d: "1970s", p: ["PG","SG"], a: "Role Player",    hi: 76, o: 78, df: 70, pm: 76, rb: 56, sh: 76 },
  // -- Jazz (New Orleans) --
  { n: "Pete Maravich",     t: "Jazz",     d: "1970s", p: ["PG","SG"], a: "Scorer",         hi: 77, o: 90, df: 66, pm: 88, rb: 60, sh: 80 },
  { n: "Truck Robinson",    t: "Jazz",     d: "1970s", p: ["PF"],      a: "Big-Man Scorer", hi: 79, o: 82, df: 76, pm: 60, rb: 88, sh: 58 },
  { n: "Aaron James",       t: "Jazz",     d: "1970s", p: ["SF"],      a: "Role Player",    hi: 79, o: 76, df: 70, pm: 64, rb: 68, sh: 70 },

  // =======================================================================
  // 1980s
  // =======================================================================
  // -- Lakers (Showtime) --
  { n: "Magic Johnson",     t: "Lakers",   d: "1980s", p: ["PG","SF"], a: "Floor General",  hi: 81, o: 88, df: 80, pm: 99, rb: 82, sh: 78 },
  { n: "Kareem Abdul-Jabbar", t: "Lakers", d: "1980s", p: ["C"],       a: "Big-Man Scorer", hi: 86, o: 90, df: 86, pm: 72, rb: 84, sh: 68 },
  { n: "James Worthy",      t: "Lakers",   d: "1980s", p: ["SF"],      a: "Slasher",        hi: 81, o: 86, df: 78, pm: 74, rb: 70, sh: 74 },
  { n: "Byron Scott",       t: "Lakers",   d: "1980s", p: ["SG"],      a: "Sharpshooter",   hi: 76, o: 82, df: 76, pm: 70, rb: 60, sh: 86 },
  { n: "Michael Cooper",    t: "Lakers",   d: "1980s", p: ["SG","SF"], a: "3&D Wing",       hi: 77, o: 70, df: 92, pm: 78, rb: 64, sh: 80 },
  { n: "Jamaal Wilkes",     t: "Lakers",   d: "1980s", p: ["SF"],      a: "Two-Way Wing",   hi: 78, o: 82, df: 78, pm: 68, rb: 70, sh: 76 },
  { n: "A.C. Green",        t: "Lakers",   d: "1980s", p: ["PF"],      a: "Glue Guy",       hi: 81, o: 72, df: 82, pm: 62, rb: 84, sh: 64 },
  // -- Celtics (Big Three) --
  { n: "Larry Bird",        t: "Celtics",  d: "1980s", p: ["SF","PF"], a: "Two-Way Wing",   hi: 81, o: 93, df: 82, pm: 88, rb: 84, sh: 92 },
  { n: "Kevin McHale",      t: "Celtics",  d: "1980s", p: ["PF","C"],  a: "Big-Man Scorer", hi: 82, o: 87, df: 84, pm: 64, rb: 82, sh: 66 },
  { n: "Robert Parish",     t: "Celtics",  d: "1980s", p: ["C"],       a: "Two-Way Big",    hi: 84, o: 80, df: 84, pm: 62, rb: 88, sh: 62 },
  { n: "Dennis Johnson",    t: "Celtics",  d: "1980s", p: ["PG","SG"], a: "Two-Way Wing",   hi: 76, o: 78, df: 88, pm: 80, rb: 62, sh: 72 },
  { n: "Danny Ainge",       t: "Celtics",  d: "1980s", p: ["SG","PG"], a: "Sharpshooter",   hi: 77, o: 78, df: 78, pm: 78, rb: 58, sh: 84 },
  { n: "Cedric Maxwell",    t: "Celtics",  d: "1980s", p: ["PF"],      a: "Glue Guy",       hi: 80, o: 78, df: 78, pm: 72, rb: 78, sh: 62 },
  // -- 76ers (1983 champs) --
  { n: "Julius Erving",     t: "76ers",    d: "1980s", p: ["SF"],      a: "Slasher",        hi: 79, o: 88, df: 80, pm: 78, rb: 76, sh: 72 },
  { n: "Moses Malone",      t: "76ers",    d: "1980s", p: ["C","PF"],  a: "Big-Man Scorer", hi: 82, o: 86, df: 84, pm: 60, rb: 95, sh: 56 },
  { n: "Maurice Cheeks",    t: "76ers",    d: "1980s", p: ["PG"],      a: "Floor General",  hi: 73, o: 78, df: 88, pm: 88, rb: 58, sh: 74 },
  { n: "Andrew Toney",      t: "76ers",    d: "1980s", p: ["SG"],      a: "Scorer",         hi: 75, o: 86, df: 74, pm: 76, rb: 56, sh: 80 },
  { n: "Bobby Jones",       t: "76ers",    d: "1980s", p: ["PF","SF"], a: "Glue Guy",       hi: 81, o: 74, df: 90, pm: 70, rb: 76, sh: 62 },
  // -- Pistons (Bad Boys) --
  { n: "Isiah Thomas",      t: "Pistons",  d: "1980s", p: ["PG"],      a: "Floor General",  hi: 73, o: 86, df: 78, pm: 92, rb: 62, sh: 76 },
  { n: "Joe Dumars",        t: "Pistons",  d: "1980s", p: ["SG"],      a: "Two-Way Wing",   hi: 75, o: 82, df: 86, pm: 78, rb: 56, sh: 80 },
  { n: "Bill Laimbeer",     t: "Pistons",  d: "1980s", p: ["C"],       a: "Stretch Big",    hi: 83, o: 74, df: 84, pm: 60, rb: 86, sh: 76 },
  { n: "Dennis Rodman",     t: "Pistons",  d: "1980s", p: ["PF","SF"], a: "Glue Guy",       hi: 79, o: 58, df: 92, pm: 62, rb: 90, sh: 44 },
  { n: "Vinnie Johnson",    t: "Pistons",  d: "1980s", p: ["SG"],      a: "Sixth Man",      hi: 74, o: 84, df: 72, pm: 76, rb: 62, sh: 76 },
  { n: "Adrian Dantley",    t: "Pistons",  d: "1980s", p: ["SF"],      a: "Scorer",         hi: 77, o: 88, df: 68, pm: 72, rb: 70, sh: 74 },
  // -- Hawks --
  { n: "Dominique Wilkins", t: "Hawks",    d: "1980s", p: ["SF","SG"], a: "Slasher",        hi: 80, o: 90, df: 70, pm: 70, rb: 74, sh: 78 },
  { n: "Doc Rivers",        t: "Hawks",    d: "1980s", p: ["PG"],      a: "Two-Way Wing",   hi: 76, o: 78, df: 84, pm: 84, rb: 60, sh: 72 },
  { n: "Kevin Willis",      t: "Hawks",    d: "1980s", p: ["PF","C"],  a: "Big-Man Scorer", hi: 84, o: 78, df: 78, pm: 56, rb: 86, sh: 60 },
  { n: "Spud Webb",         t: "Hawks",    d: "1980s", p: ["PG"],      a: "Role Player",    hi: 67, o: 76, df: 70, pm: 84, rb: 50, sh: 72 },
  { n: "Tree Rollins",      t: "Hawks",    d: "1980s", p: ["C"],       a: "Rim Protector",  hi: 85, o: 56, df: 90, pm: 54, rb: 84, sh: 46 },
  // -- Nuggets --
  { n: "Alex English",      t: "Nuggets",  d: "1980s", p: ["SF"],      a: "Scorer",         hi: 79, o: 88, df: 70, pm: 76, rb: 70, sh: 80 },
  { n: "Dan Issel",         t: "Nuggets",  d: "1980s", p: ["C","PF"],  a: "Big-Man Scorer", hi: 81, o: 84, df: 70, pm: 66, rb: 78, sh: 72 },
  { n: "Fat Lever",         t: "Nuggets",  d: "1980s", p: ["PG","SG"], a: "Floor General",  hi: 75, o: 80, df: 84, pm: 86, rb: 78, sh: 72 },
  { n: "Kiki Vandeweghe",   t: "Nuggets",  d: "1980s", p: ["SF","PF"], a: "Scorer",         hi: 80, o: 86, df: 62, pm: 68, rb: 66, sh: 84 },
  // -- Suns --
  { n: "Tom Chambers",      t: "Suns",     d: "1980s", p: ["PF"],      a: "Big-Man Scorer", hi: 82, o: 86, df: 66, pm: 64, rb: 76, sh: 78 },
  { n: "Kevin Johnson",     t: "Suns",     d: "1980s", p: ["PG"],      a: "Slasher",        hi: 73, o: 84, df: 70, pm: 88, rb: 58, sh: 74 },
  { n: "Larry Nance",       t: "Suns",     d: "1980s", p: ["PF","C"],  a: "Two-Way Big",    hi: 82, o: 82, df: 86, pm: 64, rb: 82, sh: 64 },
  { n: "Jeff Hornacek",     t: "Suns",     d: "1980s", p: ["SG","PG"], a: "Sharpshooter",   hi: 76, o: 80, df: 76, pm: 82, rb: 60, sh: 88 },
  // -- Mavericks --
  { n: "Mark Aguirre",      t: "Mavericks",d: "1980s", p: ["SF"],      a: "Scorer",         hi: 78, o: 86, df: 66, pm: 74, rb: 68, sh: 76 },
  { n: "Rolando Blackman",  t: "Mavericks",d: "1980s", p: ["SG"],      a: "Scorer",         hi: 78, o: 84, df: 78, pm: 72, rb: 62, sh: 80 },
  { n: "Derek Harper",      t: "Mavericks",d: "1980s", p: ["PG"],      a: "Two-Way Wing",   hi: 76, o: 78, df: 84, pm: 84, rb: 58, sh: 76 },
  { n: "Sam Perkins",       t: "Mavericks",d: "1980s", p: ["PF","C"],  a: "Stretch Big",    hi: 81, o: 78, df: 78, pm: 64, rb: 80, sh: 78 },
  // -- Blazers --
  { n: "Clyde Drexler",     t: "Blazers",  d: "1980s", p: ["SG","SF"], a: "Slasher",        hi: 79, o: 86, df: 80, pm: 82, rb: 72, sh: 76 },
  { n: "Jim Paxson",        t: "Blazers",  d: "1980s", p: ["SG"],      a: "Scorer",         hi: 78, o: 82, df: 74, pm: 72, rb: 58, sh: 78 },
  { n: "Mychal Thompson",   t: "Blazers",  d: "1980s", p: ["C","PF"],  a: "Two-Way Big",    hi: 82, o: 80, df: 80, pm: 64, rb: 80, sh: 60 },
  { n: "Terry Porter",      t: "Blazers",  d: "1980s", p: ["PG"],      a: "Floor General",  hi: 75, o: 80, df: 78, pm: 86, rb: 60, sh: 82 },
  // -- Rockets (Twin Towers) --
  { n: "Hakeem Olajuwon",   t: "Rockets",  d: "1980s", p: ["C"],       a: "Two-Way Big",    hi: 84, o: 86, df: 92, pm: 66, rb: 90, sh: 56 },
  { n: "Ralph Sampson",     t: "Rockets",  d: "1980s", p: ["C","PF"],  a: "Two-Way Big",    hi: 88, o: 82, df: 84, pm: 70, rb: 84, sh: 64 },
  { n: "Robert Reid",       t: "Rockets",  d: "1980s", p: ["SF"],      a: "Glue Guy",       hi: 80, o: 76, df: 82, pm: 72, rb: 70, sh: 68 },
  { n: "Rodney McCray",     t: "Rockets",  d: "1980s", p: ["SF","PF"], a: "Glue Guy",       hi: 80, o: 76, df: 82, pm: 76, rb: 76, sh: 64 },
  // -- Jazz --
  { n: "Karl Malone",       t: "Jazz",     d: "1980s", p: ["PF"],      a: "Big-Man Scorer", hi: 81, o: 88, df: 82, pm: 70, rb: 88, sh: 66 },
  { n: "John Stockton",     t: "Jazz",     d: "1980s", p: ["PG"],      a: "Floor General",  hi: 73, o: 76, df: 82, pm: 94, rb: 56, sh: 80 },
  { n: "Mark Eaton",        t: "Jazz",     d: "1980s", p: ["C"],       a: "Rim Protector",  hi: 88, o: 52, df: 94, pm: 50, rb: 84, sh: 38 },
  { n: "Thurl Bailey",      t: "Jazz",     d: "1980s", p: ["PF"],      a: "Sixth Man",      hi: 83, o: 80, df: 74, pm: 60, rb: 74, sh: 70 },
  // -- Bucks --
  { n: "Sidney Moncrief",   t: "Bucks",    d: "1980s", p: ["SG"],      a: "Two-Way Wing",   hi: 76, o: 82, df: 90, pm: 78, rb: 70, sh: 76 },
  { n: "Terry Cummings",    t: "Bucks",    d: "1980s", p: ["PF"],      a: "Big-Man Scorer", hi: 81, o: 84, df: 76, pm: 64, rb: 82, sh: 64 },
  { n: "Marques Johnson",   t: "Bucks",    d: "1980s", p: ["SF"],      a: "Slasher",        hi: 79, o: 86, df: 76, pm: 78, rb: 74, sh: 70 },
  { n: "Paul Pressey",      t: "Bucks",    d: "1980s", p: ["SF","PG"], a: "Glue Guy",       hi: 77, o: 74, df: 86, pm: 84, rb: 66, sh: 64 },

  // =======================================================================
  // 1990s
  // =======================================================================
  // -- Bulls (dynasty) --
  { n: "Michael Jordan",    t: "Bulls",    d: "1990s", p: ["SG","SF"], a: "Scorer",         hi: 78, o: 99, df: 92, pm: 84, rb: 76, sh: 84 },
  { n: "Scottie Pippen",    t: "Bulls",    d: "1990s", p: ["SF","PF"], a: "Two-Way Wing",   hi: 80, o: 82, df: 94, pm: 86, rb: 80, sh: 74 },
  { n: "Dennis Rodman",     t: "Bulls",    d: "1990s", p: ["PF","C"],  a: "Glue Guy",       hi: 79, o: 52, df: 95, pm: 64, rb: 99, sh: 40 },
  { n: "Toni Kukoc",        t: "Bulls",    d: "1990s", p: ["SF","PF"], a: "Sixth Man",      hi: 83, o: 82, df: 72, pm: 84, rb: 70, sh: 80 },
  { n: "Horace Grant",      t: "Bulls",    d: "1990s", p: ["PF"],      a: "Glue Guy",       hi: 82, o: 74, df: 84, pm: 68, rb: 84, sh: 66 },
  { n: "B.J. Armstrong",    t: "Bulls",    d: "1990s", p: ["PG"],      a: "Sharpshooter",   hi: 74, o: 76, df: 70, pm: 80, rb: 52, sh: 84 },
  { n: "Steve Kerr",        t: "Bulls",    d: "1990s", p: ["PG","SG"], a: "Sharpshooter",   hi: 75, o: 72, df: 66, pm: 78, rb: 50, sh: 92 },
  { n: "Ron Harper",        t: "Bulls",    d: "1990s", p: ["SG","PG"], a: "3&D Wing",       hi: 78, o: 74, df: 84, pm: 78, rb: 64, sh: 70 },
  // -- Rockets (champs) --
  { n: "Hakeem Olajuwon",   t: "Rockets",  d: "1990s", p: ["C"],       a: "Two-Way Big",    hi: 84, o: 90, df: 96, pm: 72, rb: 92, sh: 58 },
  { n: "Clyde Drexler",     t: "Rockets",  d: "1990s", p: ["SG","SF"], a: "Slasher",        hi: 79, o: 84, df: 80, pm: 80, rb: 72, sh: 76 },
  { n: "Otis Thorpe",       t: "Rockets",  d: "1990s", p: ["PF"],      a: "Glue Guy",       hi: 82, o: 78, df: 78, pm: 64, rb: 84, sh: 58 },
  { n: "Kenny Smith",       t: "Rockets",  d: "1990s", p: ["PG"],      a: "Sharpshooter",   hi: 75, o: 78, df: 70, pm: 82, rb: 52, sh: 84 },
  { n: "Robert Horry",      t: "Rockets",  d: "1990s", p: ["PF","SF"], a: "3&D Wing",       hi: 82, o: 72, df: 82, pm: 72, rb: 74, sh: 78 },
  { n: "Sam Cassell",       t: "Rockets",  d: "1990s", p: ["PG"],      a: "Scorer",         hi: 75, o: 82, df: 70, pm: 84, rb: 58, sh: 78 },
  // -- Jazz --
  { n: "Karl Malone",       t: "Jazz",     d: "1990s", p: ["PF"],      a: "Big-Man Scorer", hi: 81, o: 91, df: 84, pm: 74, rb: 90, sh: 70 },
  { n: "John Stockton",     t: "Jazz",     d: "1990s", p: ["PG"],      a: "Floor General",  hi: 73, o: 78, df: 82, pm: 98, rb: 58, sh: 82 },
  { n: "Jeff Hornacek",     t: "Jazz",     d: "1990s", p: ["SG"],      a: "Sharpshooter",   hi: 76, o: 80, df: 76, pm: 80, rb: 58, sh: 90 },
  { n: "Bryon Russell",     t: "Jazz",     d: "1990s", p: ["SF"],      a: "3&D Wing",       hi: 79, o: 74, df: 82, pm: 66, rb: 66, sh: 78 },
  // -- Knicks --
  { n: "Patrick Ewing",     t: "Knicks",   d: "1990s", p: ["C"],       a: "Two-Way Big",    hi: 84, o: 86, df: 90, pm: 64, rb: 88, sh: 68 },
  { n: "John Starks",       t: "Knicks",   d: "1990s", p: ["SG"],      a: "Scorer",         hi: 77, o: 80, df: 80, pm: 74, rb: 56, sh: 82 },
  { n: "Charles Oakley",    t: "Knicks",   d: "1990s", p: ["PF"],      a: "Glue Guy",       hi: 81, o: 70, df: 86, pm: 70, rb: 88, sh: 60 },
  { n: "Allan Houston",     t: "Knicks",   d: "1990s", p: ["SG"],      a: "Sharpshooter",   hi: 78, o: 84, df: 70, pm: 70, rb: 56, sh: 88 },
  { n: "Larry Johnson",     t: "Knicks",   d: "1990s", p: ["PF","SF"], a: "Big-Man Scorer", hi: 78, o: 82, df: 78, pm: 72, rb: 80, sh: 72 },
  // -- Suns --
  { n: "Charles Barkley",   t: "Suns",     d: "1990s", p: ["PF"],      a: "Big-Man Scorer", hi: 78, o: 90, df: 80, pm: 80, rb: 92, sh: 72 },
  { n: "Kevin Johnson",     t: "Suns",     d: "1990s", p: ["PG"],      a: "Slasher",        hi: 73, o: 86, df: 70, pm: 90, rb: 58, sh: 76 },
  { n: "Dan Majerle",       t: "Suns",     d: "1990s", p: ["SG","SF"], a: "3&D Wing",       hi: 78, o: 78, df: 84, pm: 74, rb: 66, sh: 84 },
  { n: "Tom Chambers",      t: "Suns",     d: "1990s", p: ["PF"],      a: "Big-Man Scorer", hi: 82, o: 82, df: 64, pm: 62, rb: 72, sh: 78 },
  // -- Spurs --
  { n: "David Robinson",    t: "Spurs",    d: "1990s", p: ["C"],       a: "Rim Protector",  hi: 85, o: 88, df: 94, pm: 70, rb: 90, sh: 58 },
  { n: "Sean Elliott",      t: "Spurs",    d: "1990s", p: ["SF"],      a: "3&D Wing",       hi: 80, o: 80, df: 76, pm: 74, rb: 68, sh: 82 },
  { n: "Avery Johnson",     t: "Spurs",    d: "1990s", p: ["PG"],      a: "Floor General",  hi: 71, o: 72, df: 80, pm: 88, rb: 52, sh: 66 },
  { n: "Vinny Del Negro",   t: "Spurs",    d: "1990s", p: ["SG","PG"], a: "Role Player",    hi: 76, o: 76, df: 72, pm: 76, rb: 56, sh: 78 },
  // -- Magic --
  { n: "Shaquille O'Neal",  t: "Magic",    d: "1990s", p: ["C"],       a: "Big-Man Scorer", hi: 85, o: 92, df: 86, pm: 64, rb: 88, sh: 54 },
  { n: "Penny Hardaway",    t: "Magic",    d: "1990s", p: ["PG"],      a: "Floor General",  hi: 79, o: 86, df: 80, pm: 88, rb: 68, sh: 76 },
  { n: "Nick Anderson",     t: "Magic",    d: "1990s", p: ["SG","SF"], a: "3&D Wing",       hi: 78, o: 80, df: 80, pm: 72, rb: 70, sh: 80 },
  { n: "Dennis Scott",      t: "Magic",    d: "1990s", p: ["SF"],      a: "Sharpshooter",   hi: 80, o: 78, df: 64, pm: 68, rb: 60, sh: 88 },
  // -- SuperSonics --
  { n: "Gary Payton",       t: "Sonics",   d: "1990s", p: ["PG"],      a: "Two-Way Wing",   hi: 76, o: 82, df: 94, pm: 88, rb: 66, sh: 74 },
  { n: "Shawn Kemp",        t: "Sonics",   d: "1990s", p: ["PF","C"],  a: "Big-Man Scorer", hi: 82, o: 84, df: 82, pm: 62, rb: 84, sh: 58 },
  { n: "Detlef Schrempf",   t: "Sonics",   d: "1990s", p: ["SF","PF"], a: "Two-Way Wing",   hi: 82, o: 82, df: 76, pm: 80, rb: 74, sh: 80 },
  { n: "Hersey Hawkins",    t: "Sonics",   d: "1990s", p: ["SG"],      a: "3&D Wing",       hi: 75, o: 78, df: 82, pm: 72, rb: 58, sh: 84 },
  // -- Pacers --
  { n: "Reggie Miller",     t: "Pacers",   d: "1990s", p: ["SG"],      a: "Sharpshooter",   hi: 79, o: 84, df: 74, pm: 70, rb: 62, sh: 96 },
  { n: "Rik Smits",         t: "Pacers",   d: "1990s", p: ["C"],       a: "Big-Man Scorer", hi: 88, o: 82, df: 78, pm: 60, rb: 78, sh: 70 },
  { n: "Mark Jackson",      t: "Pacers",   d: "1990s", p: ["PG"],      a: "Floor General",  hi: 75, o: 74, df: 74, pm: 90, rb: 66, sh: 70 },
  { n: "Dale Davis",        t: "Pacers",   d: "1990s", p: ["PF","C"],  a: "Glue Guy",       hi: 83, o: 66, df: 84, pm: 56, rb: 84, sh: 50 },
  // -- Hornets --
  { n: "Alonzo Mourning",   t: "Hornets",  d: "1990s", p: ["C"],       a: "Rim Protector",  hi: 82, o: 82, df: 92, pm: 58, rb: 86, sh: 56 },
  { n: "Glen Rice",         t: "Hornets",  d: "1990s", p: ["SF","SG"], a: "Sharpshooter",   hi: 80, o: 84, df: 68, pm: 66, rb: 64, sh: 92 },
  { n: "Muggsy Bogues",     t: "Hornets",  d: "1990s", p: ["PG"],      a: "Floor General",  hi: 63, o: 68, df: 76, pm: 88, rb: 50, sh: 66 },
  { n: "Dell Curry",        t: "Hornets",  d: "1990s", p: ["SG"],      a: "Sharpshooter",   hi: 76, o: 78, df: 66, pm: 68, rb: 54, sh: 88 },
  // -- Heat --
  { n: "Tim Hardaway",      t: "Heat",     d: "1990s", p: ["PG"],      a: "Floor General",  hi: 72, o: 84, df: 72, pm: 90, rb: 56, sh: 82 },
  { n: "Jamal Mashburn",    t: "Heat",     d: "1990s", p: ["SF"],      a: "Scorer",         hi: 80, o: 84, df: 70, pm: 76, rb: 68, sh: 78 },
  { n: "Voshon Lenard",     t: "Heat",     d: "1990s", p: ["SG"],      a: "Sharpshooter",   hi: 76, o: 76, df: 70, pm: 66, rb: 56, sh: 82 },
  // -- Kings/Warriors run-and-gun --
  { n: "Mitch Richmond",    t: "Kings",    d: "1990s", p: ["SG"],      a: "Scorer",         hi: 77, o: 86, df: 74, pm: 74, rb: 64, sh: 84 },
  { n: "Chris Webber",      t: "Warriors", d: "1990s", p: ["PF"],      a: "Big-Man Scorer", hi: 82, o: 84, df: 80, pm: 80, rb: 88, sh: 64 },
  { n: "Chris Mullin",      t: "Warriors", d: "1990s", p: ["SF","SG"], a: "Sharpshooter",   hi: 79, o: 84, df: 70, pm: 78, rb: 62, sh: 90 },
  { n: "Latrell Sprewell",  t: "Warriors", d: "1990s", p: ["SG","SF"], a: "Slasher",        hi: 77, o: 84, df: 78, pm: 76, rb: 62, sh: 76 },
  // -- Cavaliers --
  { n: "Mark Price",        t: "Cavaliers",d: "1990s", p: ["PG"],      a: "Sharpshooter",   hi: 72, o: 80, df: 66, pm: 90, rb: 52, sh: 90 },
  { n: "Brad Daugherty",    t: "Cavaliers",d: "1990s", p: ["C"],       a: "Two-Way Big",    hi: 84, o: 82, df: 78, pm: 78, rb: 82, sh: 62 },
  { n: "Larry Nance",       t: "Cavaliers",d: "1990s", p: ["PF","C"],  a: "Two-Way Big",    hi: 82, o: 78, df: 86, pm: 64, rb: 80, sh: 64 },

  // =======================================================================
  // 2000s
  // =======================================================================
  // -- Lakers (three-peat + 2009-10) --
  { n: "Kobe Bryant",       t: "Lakers",   d: "2000s", p: ["SG","SF"], a: "Scorer",         hi: 78, o: 96, df: 86, pm: 78, rb: 70, sh: 86 },
  { n: "Shaquille O'Neal",  t: "Lakers",   d: "2000s", p: ["C"],       a: "Big-Man Scorer", hi: 85, o: 94, df: 88, pm: 66, rb: 86, sh: 52 },
  { n: "Pau Gasol",         t: "Lakers",   d: "2000s", p: ["PF","C"],  a: "Two-Way Big",    hi: 84, o: 86, df: 82, pm: 78, rb: 86, sh: 66 },
  { n: "Derek Fisher",      t: "Lakers",   d: "2000s", p: ["PG"],      a: "3&D Wing",       hi: 73, o: 72, df: 78, pm: 76, rb: 54, sh: 80 },
  { n: "Lamar Odom",        t: "Lakers",   d: "2000s", p: ["PF","SF"], a: "Glue Guy",       hi: 82, o: 80, df: 80, pm: 82, rb: 80, sh: 70 },
  { n: "Metta World Peace", t: "Lakers",   d: "2000s", p: ["SF"],      a: "3&D Wing",       hi: 79, o: 76, df: 90, pm: 72, rb: 68, sh: 74 },
  // -- Spurs --
  { n: "Tim Duncan",        t: "Spurs",    d: "2000s", p: ["PF","C"],  a: "Two-Way Big",    hi: 83, o: 88, df: 95, pm: 76, rb: 92, sh: 64 },
  { n: "Tony Parker",       t: "Spurs",    d: "2000s", p: ["PG"],      a: "Slasher",        hi: 74, o: 83, df: 74, pm: 84, rb: 58, sh: 72 },
  { n: "Manu Ginobili",     t: "Spurs",    d: "2000s", p: ["SG"],      a: "Two-Way Wing",   hi: 78, o: 82, df: 80, pm: 82, rb: 64, sh: 80 },
  { n: "Bruce Bowen",       t: "Spurs",    d: "2000s", p: ["SF"],      a: "3&D Wing",       hi: 79, o: 62, df: 92, pm: 64, rb: 60, sh: 80 },
  { n: "David Robinson",    t: "Spurs",    d: "2000s", p: ["C"],       a: "Rim Protector",  hi: 85, o: 80, df: 90, pm: 66, rb: 84, sh: 56 },
  // -- Pistons (champs) --
  { n: "Chauncey Billups",  t: "Pistons",  d: "2000s", p: ["PG"],      a: "Floor General",  hi: 75, o: 82, df: 80, pm: 86, rb: 60, sh: 86 },
  { n: "Richard Hamilton",  t: "Pistons",  d: "2000s", p: ["SG"],      a: "Scorer",         hi: 79, o: 84, df: 78, pm: 74, rb: 60, sh: 84 },
  { n: "Ben Wallace",       t: "Pistons",  d: "2000s", p: ["C","PF"],  a: "Rim Protector",  hi: 81, o: 52, df: 96, pm: 58, rb: 94, sh: 38 },
  { n: "Rasheed Wallace",   t: "Pistons",  d: "2000s", p: ["PF","C"],  a: "Stretch Big",    hi: 83, o: 80, df: 88, pm: 70, rb: 80, sh: 78 },
  { n: "Tayshaun Prince",   t: "Pistons",  d: "2000s", p: ["SF"],      a: "3&D Wing",       hi: 81, o: 76, df: 86, pm: 72, rb: 66, sh: 76 },
  // -- Celtics (2008 champs) --
  { n: "Paul Pierce",       t: "Celtics",  d: "2000s", p: ["SF"],      a: "Scorer",         hi: 79, o: 88, df: 78, pm: 78, rb: 68, sh: 82 },
  { n: "Kevin Garnett",     t: "Celtics",  d: "2000s", p: ["PF","C"],  a: "Two-Way Big",    hi: 83, o: 86, df: 94, pm: 80, rb: 88, sh: 70 },
  { n: "Ray Allen",         t: "Celtics",  d: "2000s", p: ["SG"],      a: "Sharpshooter",   hi: 77, o: 84, df: 76, pm: 72, rb: 64, sh: 94 },
  { n: "Rajon Rondo",       t: "Celtics",  d: "2000s", p: ["PG"],      a: "Floor General",  hi: 73, o: 74, df: 86, pm: 92, rb: 66, sh: 58 },
  { n: "Kendrick Perkins",  t: "Celtics",  d: "2000s", p: ["C"],       a: "Rim Protector",  hi: 82, o: 60, df: 86, pm: 56, rb: 78, sh: 42 },
  // -- Suns (7 seconds or less) --
  { n: "Steve Nash",        t: "Suns",     d: "2000s", p: ["PG"],      a: "Floor General",  hi: 75, o: 84, df: 64, pm: 97, rb: 56, sh: 90 },
  { n: "Amar'e Stoudemire", t: "Suns",     d: "2000s", p: ["PF","C"],  a: "Big-Man Scorer", hi: 82, o: 86, df: 72, pm: 60, rb: 80, sh: 72 },
  { n: "Shawn Marion",      t: "Suns",     d: "2000s", p: ["SF","PF"], a: "Glue Guy",       hi: 79, o: 80, df: 86, pm: 70, rb: 84, sh: 74 },
  { n: "Joe Johnson",       t: "Suns",     d: "2000s", p: ["SG","SF"], a: "Scorer",         hi: 79, o: 84, df: 74, pm: 78, rb: 66, sh: 82 },
  { n: "Raja Bell",         t: "Suns",     d: "2000s", p: ["SG"],      a: "3&D Wing",       hi: 77, o: 72, df: 84, pm: 66, rb: 58, sh: 82 },
  // -- Mavericks --
  { n: "Dirk Nowitzki",     t: "Mavericks",d: "2000s", p: ["PF","C"],  a: "Stretch Big",    hi: 84, o: 92, df: 74, pm: 72, rb: 82, sh: 90 },
  { n: "Jason Terry",       t: "Mavericks",d: "2000s", p: ["SG","PG"], a: "Sixth Man",      hi: 74, o: 82, df: 70, pm: 80, rb: 54, sh: 84 },
  { n: "Josh Howard",       t: "Mavericks",d: "2000s", p: ["SF"],      a: "Two-Way Wing",   hi: 79, o: 80, df: 80, pm: 70, rb: 72, sh: 76 },
  { n: "Michael Finley",    t: "Mavericks",d: "2000s", p: ["SG","SF"], a: "Scorer",         hi: 79, o: 82, df: 74, pm: 74, rb: 66, sh: 80 },
  // -- Cavaliers --
  { n: "LeBron James",      t: "Cavaliers",d: "2000s", p: ["SF","PF"], a: "Two-Way Wing",   hi: 81, o: 92, df: 84, pm: 92, rb: 82, sh: 74 },
  { n: "Zydrunas Ilgauskas",t: "Cavaliers",d: "2000s", p: ["C"],       a: "Big-Man Scorer", hi: 87, o: 78, df: 80, pm: 56, rb: 82, sh: 64 },
  { n: "Mo Williams",       t: "Cavaliers",d: "2000s", p: ["PG"],      a: "Scorer",         hi: 73, o: 80, df: 66, pm: 80, rb: 54, sh: 82 },
  { n: "Anderson Varejao",  t: "Cavaliers",d: "2000s", p: ["C","PF"],  a: "Glue Guy",       hi: 83, o: 64, df: 82, pm: 62, rb: 82, sh: 50 },
  // -- Heat --
  { n: "Dwyane Wade",       t: "Heat",     d: "2000s", p: ["SG","PG"], a: "Slasher",        hi: 76, o: 91, df: 84, pm: 84, rb: 70, sh: 74 },
  { n: "Udonis Haslem",     t: "Heat",     d: "2000s", p: ["PF"],      a: "Glue Guy",       hi: 80, o: 70, df: 80, pm: 62, rb: 80, sh: 66 },
  { n: "Jason Williams",    t: "Heat",     d: "2000s", p: ["PG"],      a: "Floor General",  hi: 73, o: 74, df: 66, pm: 86, rb: 52, sh: 76 },
  { n: "Antoine Walker",    t: "Heat",     d: "2000s", p: ["PF","SF"], a: "Stretch Big",    hi: 80, o: 78, df: 70, pm: 76, rb: 78, sh: 70 },
  // -- Nuggets --
  { n: "Carmelo Anthony",   t: "Nuggets",  d: "2000s", p: ["SF","PF"], a: "Scorer",         hi: 79, o: 90, df: 70, pm: 72, rb: 72, sh: 82 },
  { n: "Allen Iverson",     t: "Nuggets",  d: "2000s", p: ["PG","SG"], a: "Scorer",         hi: 72, o: 88, df: 70, pm: 84, rb: 56, sh: 78 },
  { n: "Marcus Camby",      t: "Nuggets",  d: "2000s", p: ["C"],       a: "Rim Protector",  hi: 83, o: 64, df: 90, pm: 66, rb: 88, sh: 50 },
  { n: "Kenyon Martin",     t: "Nuggets",  d: "2000s", p: ["PF"],      a: "Glue Guy",       hi: 81, o: 72, df: 84, pm: 62, rb: 80, sh: 58 },
  // -- Magic --
  { n: "Dwight Howard",     t: "Magic",    d: "2000s", p: ["C"],       a: "Rim Protector",  hi: 82, o: 80, df: 94, pm: 58, rb: 94, sh: 40 },
  { n: "Hedo Turkoglu",     t: "Magic",    d: "2000s", p: ["SF"],      a: "Floor General",  hi: 82, o: 80, df: 70, pm: 82, rb: 68, sh: 80 },
  { n: "Rashard Lewis",     t: "Magic",    d: "2000s", p: ["SF","PF"], a: "Sharpshooter",   hi: 82, o: 82, df: 70, pm: 70, rb: 72, sh: 86 },
  { n: "Jameer Nelson",     t: "Magic",    d: "2000s", p: ["PG"],      a: "Floor General",  hi: 72, o: 78, df: 70, pm: 82, rb: 54, sh: 80 },
  // -- Rockets --
  { n: "Tracy McGrady",     t: "Rockets",  d: "2000s", p: ["SG","SF"], a: "Scorer",         hi: 80, o: 91, df: 76, pm: 80, rb: 72, sh: 82 },
  { n: "Yao Ming",          t: "Rockets",  d: "2000s", p: ["C"],       a: "Big-Man Scorer", hi: 90, o: 84, df: 86, pm: 62, rb: 86, sh: 70 },
  { n: "Shane Battier",     t: "Rockets",  d: "2000s", p: ["SF"],      a: "3&D Wing",       hi: 80, o: 68, df: 88, pm: 70, rb: 66, sh: 80 },
  { n: "Steve Francis",     t: "Rockets",  d: "2000s", p: ["PG"],      a: "Slasher",        hi: 75, o: 84, df: 70, pm: 84, rb: 66, sh: 74 },
  // -- 76ers / Nets / Hornets --
  { n: "Allen Iverson",     t: "76ers",    d: "2000s", p: ["PG","SG"], a: "Scorer",         hi: 72, o: 90, df: 72, pm: 82, rb: 58, sh: 78 },
  { n: "Andre Iguodala",    t: "76ers",    d: "2000s", p: ["SF","SG"], a: "Two-Way Wing",   hi: 78, o: 78, df: 88, pm: 80, rb: 70, sh: 70 },
  { n: "Jason Kidd",        t: "Nets",     d: "2000s", p: ["PG"],      a: "Floor General",  hi: 76, o: 74, df: 84, pm: 96, rb: 76, sh: 72 },
  { n: "Vince Carter",      t: "Nets",     d: "2000s", p: ["SG","SF"], a: "Slasher",        hi: 78, o: 88, df: 74, pm: 76, rb: 68, sh: 82 },
  { n: "Richard Jefferson", t: "Nets",     d: "2000s", p: ["SF"],      a: "Slasher",        hi: 79, o: 80, df: 76, pm: 72, rb: 66, sh: 76 },
  { n: "Chris Paul",        t: "Hornets",  d: "2000s", p: ["PG"],      a: "Floor General",  hi: 72, o: 86, df: 86, pm: 96, rb: 62, sh: 82 },
  { n: "David West",        t: "Hornets",  d: "2000s", p: ["PF"],      a: "Big-Man Scorer", hi: 81, o: 84, df: 78, pm: 72, rb: 80, sh: 76 },
  { n: "Tyson Chandler",    t: "Hornets",  d: "2000s", p: ["C"],       a: "Rim Protector",  hi: 85, o: 64, df: 88, pm: 58, rb: 86, sh: 44 },
  // -- Timberwolves --
  { n: "Kevin Garnett",     t: "Timberwolves", d: "2000s", p: ["PF","C"], a: "Two-Way Big", hi: 83, o: 88, df: 92, pm: 82, rb: 90, sh: 70 },
  { n: "Sam Cassell",       t: "Timberwolves", d: "2000s", p: ["PG"],  a: "Scorer",         hi: 75, o: 84, df: 70, pm: 86, rb: 58, sh: 80 },
  { n: "Latrell Sprewell",  t: "Timberwolves", d: "2000s", p: ["SG","SF"], a: "Scorer",     hi: 77, o: 82, df: 76, pm: 74, rb: 60, sh: 76 },

  // =======================================================================
  // 2010s
  // =======================================================================
  // -- Warriors (dynasty) --
  { n: "Stephen Curry",     t: "Warriors", d: "2010s", p: ["PG","SG"], a: "Sharpshooter",   hi: 74, o: 95, df: 74, pm: 90, rb: 64, sh: 99 },
  { n: "Kevin Durant",      t: "Warriors", d: "2010s", p: ["SF","PF"], a: "Scorer",         hi: 83, o: 97, df: 82, pm: 80, rb: 76, sh: 92 },
  { n: "Klay Thompson",     t: "Warriors", d: "2010s", p: ["SG"],      a: "Sharpshooter",   hi: 78, o: 84, df: 82, pm: 64, rb: 62, sh: 96 },
  { n: "Draymond Green",    t: "Warriors", d: "2010s", p: ["PF","C"],  a: "Glue Guy",       hi: 78, o: 64, df: 94, pm: 86, rb: 84, sh: 66 },
  { n: "Andre Iguodala",    t: "Warriors", d: "2010s", p: ["SF"],      a: "3&D Wing",       hi: 78, o: 72, df: 88, pm: 80, rb: 66, sh: 72 },
  // -- Heat (Big Three) --
  { n: "LeBron James",      t: "Heat",     d: "2010s", p: ["SF","PF"], a: "Two-Way Wing",   hi: 81, o: 96, df: 90, pm: 94, rb: 82, sh: 78 },
  { n: "Dwyane Wade",       t: "Heat",     d: "2010s", p: ["SG"],      a: "Slasher",        hi: 76, o: 88, df: 80, pm: 82, rb: 66, sh: 70 },
  { n: "Chris Bosh",        t: "Heat",     d: "2010s", p: ["PF","C"],  a: "Stretch Big",    hi: 83, o: 84, df: 80, pm: 66, rb: 80, sh: 82 },
  { n: "Ray Allen",         t: "Heat",     d: "2010s", p: ["SG"],      a: "Sharpshooter",   hi: 77, o: 78, df: 70, pm: 66, rb: 56, sh: 92 },
  { n: "Mario Chalmers",    t: "Heat",     d: "2010s", p: ["PG"],      a: "3&D Wing",       hi: 74, o: 72, df: 78, pm: 76, rb: 54, sh: 78 },
  // -- Thunder --
  { n: "Kevin Durant",      t: "Thunder",  d: "2010s", p: ["SF","PF"], a: "Scorer",         hi: 83, o: 95, df: 80, pm: 78, rb: 74, sh: 90 },
  { n: "Russell Westbrook", t: "Thunder",  d: "2010s", p: ["PG"],      a: "Slasher",        hi: 75, o: 86, df: 78, pm: 90, rb: 80, sh: 64 },
  { n: "James Harden",      t: "Thunder",  d: "2010s", p: ["SG"],      a: "Sixth Man",      hi: 77, o: 84, df: 70, pm: 82, rb: 60, sh: 84 },
  { n: "Serge Ibaka",       t: "Thunder",  d: "2010s", p: ["PF","C"],  a: "Rim Protector",  hi: 82, o: 74, df: 90, pm: 58, rb: 78, sh: 72 },
  { n: "Steven Adams",      t: "Thunder",  d: "2010s", p: ["C"],       a: "Rim Protector",  hi: 84, o: 70, df: 84, pm: 62, rb: 84, sh: 44 },
  // -- Spurs (2014 champs) --
  { n: "Kawhi Leonard",     t: "Spurs",    d: "2010s", p: ["SF","SG"], a: "Two-Way Wing",   hi: 79, o: 88, df: 96, pm: 74, rb: 74, sh: 84 },
  { n: "Tony Parker",       t: "Spurs",    d: "2010s", p: ["PG"],      a: "Slasher",        hi: 74, o: 82, df: 70, pm: 84, rb: 56, sh: 74 },
  { n: "Tim Duncan",        t: "Spurs",    d: "2010s", p: ["PF","C"],  a: "Two-Way Big",    hi: 83, o: 80, df: 92, pm: 74, rb: 86, sh: 62 },
  { n: "LaMarcus Aldridge", t: "Spurs",    d: "2010s", p: ["PF","C"],  a: "Big-Man Scorer", hi: 83, o: 86, df: 80, pm: 64, rb: 82, sh: 76 },
  { n: "Danny Green",       t: "Spurs",    d: "2010s", p: ["SG","SF"], a: "3&D Wing",       hi: 78, o: 72, df: 84, pm: 64, rb: 60, sh: 84 },
  // -- Cavaliers (2016 champs) --
  { n: "LeBron James",      t: "Cavaliers",d: "2010s", p: ["SF","PF"], a: "Two-Way Wing",   hi: 81, o: 95, df: 86, pm: 94, rb: 82, sh: 78 },
  { n: "Kyrie Irving",      t: "Cavaliers",d: "2010s", p: ["PG","SG"], a: "Slasher",        hi: 74, o: 90, df: 70, pm: 86, rb: 58, sh: 88 },
  { n: "Kevin Love",        t: "Cavaliers",d: "2010s", p: ["PF","C"],  a: "Stretch Big",    hi: 80, o: 84, df: 72, pm: 74, rb: 88, sh: 82 },
  { n: "Tristan Thompson",  t: "Cavaliers",d: "2010s", p: ["C","PF"],  a: "Glue Guy",       hi: 81, o: 62, df: 80, pm: 56, rb: 84, sh: 44 },
  { n: "J.R. Smith",        t: "Cavaliers",d: "2010s", p: ["SG"],      a: "Sharpshooter",   hi: 78, o: 76, df: 70, pm: 66, rb: 58, sh: 84 },
  // -- Rockets --
  { n: "James Harden",      t: "Rockets",  d: "2010s", p: ["SG","PG"], a: "Scorer",         hi: 77, o: 94, df: 66, pm: 90, rb: 66, sh: 88 },
  { n: "Chris Paul",        t: "Rockets",  d: "2010s", p: ["PG"],      a: "Floor General",  hi: 72, o: 85, df: 84, pm: 95, rb: 60, sh: 84 },
  { n: "Dwight Howard",     t: "Rockets",  d: "2010s", p: ["C"],       a: "Rim Protector",  hi: 82, o: 74, df: 88, pm: 56, rb: 90, sh: 40 },
  { n: "Clint Capela",      t: "Rockets",  d: "2010s", p: ["C"],       a: "Rim Protector",  hi: 82, o: 70, df: 84, pm: 56, rb: 86, sh: 42 },
  { n: "Eric Gordon",       t: "Rockets",  d: "2010s", p: ["SG"],      a: "Sharpshooter",   hi: 75, o: 80, df: 72, pm: 70, rb: 56, sh: 84 },
  // -- Clippers (Lob City) --
  { n: "Chris Paul",        t: "Clippers", d: "2010s", p: ["PG"],      a: "Floor General",  hi: 72, o: 86, df: 86, pm: 96, rb: 60, sh: 84 },
  { n: "Blake Griffin",     t: "Clippers", d: "2010s", p: ["PF"],      a: "Big-Man Scorer", hi: 81, o: 86, df: 74, pm: 78, rb: 84, sh: 68 },
  { n: "DeAndre Jordan",    t: "Clippers", d: "2010s", p: ["C"],       a: "Rim Protector",  hi: 83, o: 64, df: 88, pm: 54, rb: 90, sh: 38 },
  { n: "J.J. Redick",       t: "Clippers", d: "2010s", p: ["SG"],      a: "Sharpshooter",   hi: 76, o: 80, df: 68, pm: 70, rb: 52, sh: 92 },
  // -- Raptors (2019 champs) --
  { n: "Kawhi Leonard",     t: "Raptors",  d: "2010s", p: ["SF"],      a: "Two-Way Wing",   hi: 79, o: 92, df: 94, pm: 78, rb: 76, sh: 84 },
  { n: "Kyle Lowry",        t: "Raptors",  d: "2010s", p: ["PG"],      a: "Floor General",  hi: 72, o: 80, df: 84, pm: 86, rb: 64, sh: 82 },
  { n: "DeMar DeRozan",     t: "Raptors",  d: "2010s", p: ["SG","SF"], a: "Scorer",         hi: 78, o: 86, df: 72, pm: 78, rb: 64, sh: 70 },
  { n: "Pascal Siakam",     t: "Raptors",  d: "2010s", p: ["PF","SF"], a: "Two-Way Wing",   hi: 81, o: 82, df: 82, pm: 72, rb: 78, sh: 72 },
  { n: "Fred VanVleet",     t: "Raptors",  d: "2010s", p: ["PG"],      a: "3&D Wing",       hi: 73, o: 78, df: 82, pm: 80, rb: 54, sh: 82 },
  // -- Bulls --
  { n: "Derrick Rose",      t: "Bulls",    d: "2010s", p: ["PG"],      a: "Slasher",        hi: 74, o: 87, df: 72, pm: 84, rb: 60, sh: 76 },
  { n: "Jimmy Butler",      t: "Bulls",    d: "2010s", p: ["SF","SG"], a: "Two-Way Wing",   hi: 79, o: 84, df: 88, pm: 80, rb: 70, sh: 72 },
  { n: "Joakim Noah",       t: "Bulls",    d: "2010s", p: ["C"],       a: "Glue Guy",       hi: 83, o: 70, df: 90, pm: 80, rb: 86, sh: 50 },
  { n: "Luol Deng",         t: "Bulls",    d: "2010s", p: ["SF"],      a: "3&D Wing",       hi: 81, o: 78, df: 82, pm: 72, rb: 70, sh: 76 },
  { n: "Pau Gasol",         t: "Bulls",    d: "2010s", p: ["C","PF"],  a: "Two-Way Big",    hi: 84, o: 82, df: 76, pm: 76, rb: 84, sh: 70 },
  // -- Grizzlies (Grit and Grind) --
  { n: "Marc Gasol",        t: "Grizzlies",d: "2010s", p: ["C"],       a: "Two-Way Big",    hi: 83, o: 80, df: 90, pm: 80, rb: 82, sh: 72 },
  { n: "Mike Conley",       t: "Grizzlies",d: "2010s", p: ["PG"],      a: "Floor General",  hi: 73, o: 80, df: 82, pm: 86, rb: 56, sh: 82 },
  { n: "Zach Randolph",     t: "Grizzlies",d: "2010s", p: ["PF"],      a: "Big-Man Scorer", hi: 81, o: 84, df: 70, pm: 68, rb: 88, sh: 66 },
  { n: "Tony Allen",        t: "Grizzlies",d: "2010s", p: ["SG","SF"], a: "3&D Wing",       hi: 76, o: 64, df: 94, pm: 66, rb: 64, sh: 60 },
  // -- Pacers --
  { n: "Paul George",       t: "Pacers",   d: "2010s", p: ["SF","SG"], a: "Two-Way Wing",   hi: 80, o: 86, df: 86, pm: 76, rb: 70, sh: 82 },
  { n: "Roy Hibbert",       t: "Pacers",   d: "2010s", p: ["C"],       a: "Rim Protector",  hi: 86, o: 70, df: 90, pm: 56, rb: 78, sh: 50 },
  { n: "George Hill",       t: "Pacers",   d: "2010s", p: ["PG"],      a: "3&D Wing",       hi: 75, o: 76, df: 80, pm: 76, rb: 58, sh: 80 },
  { n: "Lance Stephenson",  t: "Pacers",   d: "2010s", p: ["SG","SF"], a: "Glue Guy",       hi: 77, o: 78, df: 80, pm: 80, rb: 70, sh: 66 },
  // -- Trail Blazers --
  { n: "Damian Lillard",    t: "Blazers",  d: "2010s", p: ["PG"],      a: "Sharpshooter",   hi: 74, o: 91, df: 66, pm: 86, rb: 60, sh: 94 },
  { n: "CJ McCollum",       t: "Blazers",  d: "2010s", p: ["SG"],      a: "Scorer",         hi: 75, o: 84, df: 68, pm: 76, rb: 58, sh: 84 },
  { n: "LaMarcus Aldridge", t: "Blazers",  d: "2010s", p: ["PF","C"],  a: "Big-Man Scorer", hi: 83, o: 86, df: 78, pm: 62, rb: 82, sh: 74 },
  { n: "Nicolas Batum",     t: "Blazers",  d: "2010s", p: ["SF"],      a: "3&D Wing",       hi: 80, o: 74, df: 82, pm: 76, rb: 66, sh: 78 },
  // -- Pelicans / Wizards / Celtics 2010s --
  { n: "Anthony Davis",     t: "Pelicans", d: "2010s", p: ["PF","C"],  a: "Two-Way Big",    hi: 82, o: 88, df: 92, pm: 66, rb: 88, sh: 66 },
  { n: "Jrue Holiday",      t: "Pelicans", d: "2010s", p: ["PG","SG"], a: "Two-Way Wing",   hi: 75, o: 80, df: 90, pm: 82, rb: 62, sh: 76 },
  { n: "John Wall",         t: "Wizards",  d: "2010s", p: ["PG"],      a: "Floor General",  hi: 76, o: 84, df: 78, pm: 90, rb: 60, sh: 70 },
  { n: "Bradley Beal",      t: "Wizards",  d: "2010s", p: ["SG"],      a: "Scorer",         hi: 76, o: 86, df: 72, pm: 78, rb: 62, sh: 84 },
  { n: "Marcin Gortat",     t: "Wizards",  d: "2010s", p: ["C"],       a: "Glue Guy",       hi: 83, o: 74, df: 78, pm: 60, rb: 82, sh: 56 },
  { n: "Al Horford",        t: "Celtics",  d: "2010s", p: ["C","PF"],  a: "Two-Way Big",    hi: 81, o: 78, df: 86, pm: 78, rb: 80, sh: 76 },
  { n: "Isaiah Thomas",     t: "Celtics",  d: "2010s", p: ["PG"],      a: "Scorer",         hi: 69, o: 88, df: 60, pm: 84, rb: 52, sh: 84 },
  { n: "Gordon Hayward",    t: "Celtics",  d: "2010s", p: ["SF"],      a: "Two-Way Wing",   hi: 80, o: 82, df: 78, pm: 78, rb: 68, sh: 80 },

  // =======================================================================
  // 2020s
  // =======================================================================
  // -- Nuggets (2023 champs) --
  { n: "Nikola Jokic",      t: "Nuggets",  d: "2020s", p: ["C"],       a: "Floor General",  hi: 83, o: 94, df: 80, pm: 97, rb: 92, sh: 80 },
  { n: "Jamal Murray",      t: "Nuggets",  d: "2020s", p: ["PG"],      a: "Scorer",         hi: 76, o: 86, df: 74, pm: 84, rb: 60, sh: 84 },
  { n: "Aaron Gordon",      t: "Nuggets",  d: "2020s", p: ["PF"],      a: "Glue Guy",       hi: 80, o: 78, df: 86, pm: 70, rb: 78, sh: 68 },
  { n: "Michael Porter Jr.",t: "Nuggets",  d: "2020s", p: ["SF"],      a: "Sharpshooter",   hi: 82, o: 82, df: 74, pm: 64, rb: 76, sh: 86 },
  { n: "Kentavious Caldwell-Pope", t: "Nuggets", d: "2020s", p: ["SG"], a: "3&D Wing",      hi: 77, o: 74, df: 84, pm: 66, rb: 56, sh: 82 },
  // -- Warriors (2022 champs) --
  { n: "Stephen Curry",     t: "Warriors", d: "2020s", p: ["PG"],      a: "Sharpshooter",   hi: 74, o: 94, df: 72, pm: 88, rb: 62, sh: 99 },
  { n: "Klay Thompson",     t: "Warriors", d: "2020s", p: ["SG"],      a: "Sharpshooter",   hi: 78, o: 82, df: 76, pm: 62, rb: 60, sh: 92 },
  { n: "Draymond Green",    t: "Warriors", d: "2020s", p: ["PF","C"],  a: "Glue Guy",       hi: 78, o: 62, df: 92, pm: 86, rb: 82, sh: 62 },
  { n: "Andrew Wiggins",    t: "Warriors", d: "2020s", p: ["SF"],      a: "3&D Wing",       hi: 79, o: 80, df: 82, pm: 68, rb: 68, sh: 78 },
  { n: "Jordan Poole",      t: "Warriors", d: "2020s", p: ["SG"],      a: "Scorer",         hi: 76, o: 82, df: 64, pm: 76, rb: 54, sh: 82 },
  // -- Bucks (2021 champs) --
  { n: "Giannis Antetokounmpo", t: "Bucks", d: "2020s", p: ["PF","C"], a: "Two-Way Big",    hi: 83, o: 93, df: 92, pm: 80, rb: 90, sh: 62 },
  { n: "Khris Middleton",   t: "Bucks",    d: "2020s", p: ["SF","SG"], a: "Two-Way Wing",   hi: 79, o: 84, df: 78, pm: 78, rb: 66, sh: 84 },
  { n: "Jrue Holiday",      t: "Bucks",    d: "2020s", p: ["PG","SG"], a: "Two-Way Wing",   hi: 75, o: 80, df: 90, pm: 82, rb: 62, sh: 78 },
  { n: "Brook Lopez",       t: "Bucks",    d: "2020s", p: ["C"],       a: "Rim Protector",  hi: 84, o: 78, df: 88, pm: 58, rb: 74, sh: 78 },
  { n: "Damian Lillard",    t: "Bucks",    d: "2020s", p: ["PG"],      a: "Sharpshooter",   hi: 74, o: 90, df: 64, pm: 84, rb: 60, sh: 94 },
  // -- Celtics (2024 champs) --
  { n: "Jayson Tatum",      t: "Celtics",  d: "2020s", p: ["SF","PF"], a: "Scorer",         hi: 80, o: 90, df: 84, pm: 78, rb: 78, sh: 84 },
  { n: "Jaylen Brown",      t: "Celtics",  d: "2020s", p: ["SG","SF"], a: "Two-Way Wing",   hi: 78, o: 86, df: 82, pm: 72, rb: 68, sh: 80 },
  { n: "Jrue Holiday",      t: "Celtics",  d: "2020s", p: ["PG"],      a: "3&D Wing",       hi: 75, o: 78, df: 88, pm: 80, rb: 62, sh: 78 },
  { n: "Derrick White",     t: "Celtics",  d: "2020s", p: ["PG","SG"], a: "3&D Wing",       hi: 76, o: 78, df: 86, pm: 78, rb: 60, sh: 82 },
  { n: "Kristaps Porzingis", t: "Celtics", d: "2020s", p: ["C","PF"],  a: "Stretch Big",    hi: 87, o: 84, df: 86, pm: 60, rb: 78, sh: 82 },
  // -- Suns --
  { n: "Devin Booker",      t: "Suns",     d: "2020s", p: ["SG","PG"], a: "Scorer",         hi: 77, o: 90, df: 74, pm: 82, rb: 64, sh: 88 },
  { n: "Kevin Durant",      t: "Suns",     d: "2020s", p: ["SF","PF"], a: "Scorer",         hi: 83, o: 95, df: 80, pm: 82, rb: 74, sh: 92 },
  { n: "Bradley Beal",      t: "Suns",     d: "2020s", p: ["SG"],      a: "Scorer",         hi: 76, o: 84, df: 70, pm: 78, rb: 60, sh: 82 },
  { n: "Deandre Ayton",     t: "Suns",     d: "2020s", p: ["C"],       a: "Big-Man Scorer", hi: 84, o: 80, df: 80, pm: 60, rb: 86, sh: 62 },
  { n: "Chris Paul",        t: "Suns",     d: "2020s", p: ["PG"],      a: "Floor General",  hi: 72, o: 80, df: 80, pm: 92, rb: 58, sh: 82 },
  // -- Lakers (2020 champs) --
  { n: "LeBron James",      t: "Lakers",   d: "2020s", p: ["SF","PF"], a: "Two-Way Wing",   hi: 81, o: 90, df: 80, pm: 90, rb: 78, sh: 78 },
  { n: "Anthony Davis",     t: "Lakers",   d: "2020s", p: ["PF","C"],  a: "Two-Way Big",    hi: 82, o: 88, df: 94, pm: 66, rb: 90, sh: 62 },
  { n: "Russell Westbrook", t: "Lakers",   d: "2020s", p: ["PG"],      a: "Slasher",        hi: 75, o: 80, df: 72, pm: 84, rb: 74, sh: 60 },
  { n: "Austin Reaves",     t: "Lakers",   d: "2020s", p: ["SG","PG"], a: "3&D Wing",       hi: 77, o: 78, df: 74, pm: 78, rb: 58, sh: 80 },
  { n: "D'Angelo Russell",  t: "Lakers",   d: "2020s", p: ["PG"],      a: "Scorer",         hi: 76, o: 82, df: 62, pm: 80, rb: 56, sh: 82 },
  // -- 76ers --
  { n: "Joel Embiid",       t: "76ers",    d: "2020s", p: ["C"],       a: "Two-Way Big",    hi: 84, o: 94, df: 90, pm: 74, rb: 88, sh: 76 },
  { n: "James Harden",      t: "76ers",    d: "2020s", p: ["PG","SG"], a: "Floor General",  hi: 77, o: 86, df: 64, pm: 92, rb: 64, sh: 84 },
  { n: "Tyrese Maxey",      t: "76ers",    d: "2020s", p: ["PG","SG"], a: "Scorer",         hi: 74, o: 86, df: 72, pm: 82, rb: 56, sh: 84 },
  { n: "Tobias Harris",     t: "76ers",    d: "2020s", p: ["PF","SF"], a: "Two-Way Wing",   hi: 80, o: 80, df: 76, pm: 70, rb: 72, sh: 78 },
  // -- Mavericks --
  { n: "Luka Doncic",       t: "Mavericks",d: "2020s", p: ["PG","SG"], a: "Scorer",         hi: 79, o: 95, df: 72, pm: 95, rb: 82, sh: 84 },
  { n: "Kyrie Irving",      t: "Mavericks",d: "2020s", p: ["PG","SG"], a: "Slasher",        hi: 74, o: 90, df: 72, pm: 86, rb: 56, sh: 88 },
  { n: "Tim Hardaway Jr.",  t: "Mavericks",d: "2020s", p: ["SG","SF"], a: "Sharpshooter",   hi: 77, o: 78, df: 66, pm: 66, rb: 56, sh: 84 },
  { n: "Dereck Lively II",  t: "Mavericks",d: "2020s", p: ["C"],       a: "Rim Protector",  hi: 85, o: 66, df: 84, pm: 60, rb: 82, sh: 44 },
  // -- Grizzlies --
  { n: "Ja Morant",         t: "Grizzlies",d: "2020s", p: ["PG"],      a: "Slasher",        hi: 74, o: 88, df: 68, pm: 88, rb: 62, sh: 72 },
  { n: "Jaren Jackson Jr.", t: "Grizzlies",d: "2020s", p: ["PF","C"],  a: "Rim Protector",  hi: 82, o: 80, df: 92, pm: 60, rb: 74, sh: 76 },
  { n: "Desmond Bane",      t: "Grizzlies",d: "2020s", p: ["SG"],      a: "Sharpshooter",   hi: 76, o: 84, df: 76, pm: 76, rb: 62, sh: 86 },
  // -- Heat --
  { n: "Jimmy Butler",      t: "Heat",     d: "2020s", p: ["SF","SG"], a: "Two-Way Wing",   hi: 79, o: 86, df: 88, pm: 82, rb: 70, sh: 74 },
  { n: "Bam Adebayo",       t: "Heat",     d: "2020s", p: ["C"],       a: "Two-Way Big",    hi: 81, o: 80, df: 90, pm: 78, rb: 84, sh: 58 },
  { n: "Tyler Herro",       t: "Heat",     d: "2020s", p: ["SG"],      a: "Scorer",         hi: 77, o: 84, df: 66, pm: 78, rb: 62, sh: 86 },
  { n: "Kyle Lowry",        t: "Heat",     d: "2020s", p: ["PG"],      a: "Floor General",  hi: 72, o: 74, df: 80, pm: 82, rb: 58, sh: 78 },
  // -- Timberwolves --
  { n: "Anthony Edwards",   t: "Timberwolves", d: "2020s", p: ["SG"],  a: "Scorer",         hi: 76, o: 90, df: 80, pm: 78, rb: 70, sh: 84 },
  { n: "Karl-Anthony Towns",t: "Timberwolves", d: "2020s", p: ["C","PF"], a: "Stretch Big", hi: 83, o: 88, df: 76, pm: 70, rb: 86, sh: 84 },
  { n: "Rudy Gobert",       t: "Timberwolves", d: "2020s", p: ["C"],   a: "Rim Protector",  hi: 85, o: 68, df: 96, pm: 54, rb: 92, sh: 40 },
  { n: "Mike Conley",       t: "Timberwolves", d: "2020s", p: ["PG"],  a: "Floor General",  hi: 73, o: 76, df: 80, pm: 86, rb: 54, sh: 82 },
  // -- Thunder --
  { n: "Shai Gilgeous-Alexander", t: "Thunder", d: "2020s", p: ["PG","SG"], a: "Scorer",    hi: 78, o: 93, df: 84, pm: 86, rb: 68, sh: 82 },
  { n: "Chet Holmgren",     t: "Thunder",  d: "2020s", p: ["C","PF"],  a: "Rim Protector",  hi: 85, o: 80, df: 90, pm: 64, rb: 78, sh: 80 },
  { n: "Jalen Williams",    t: "Thunder",  d: "2020s", p: ["SF","SG"], a: "Two-Way Wing",   hi: 78, o: 82, df: 84, pm: 76, rb: 66, sh: 78 },
  // -- Cavaliers / Kings / Pelicans / Hawks / Pacers / Spurs --
  { n: "Donovan Mitchell",  t: "Cavaliers",d: "2020s", p: ["SG"],      a: "Scorer",         hi: 73, o: 89, df: 76, pm: 80, rb: 64, sh: 84 },
  { n: "Darius Garland",    t: "Cavaliers",d: "2020s", p: ["PG"],      a: "Floor General",  hi: 73, o: 82, df: 66, pm: 88, rb: 54, sh: 82 },
  { n: "Evan Mobley",       t: "Cavaliers",d: "2020s", p: ["PF","C"],  a: "Rim Protector",  hi: 83, o: 76, df: 90, pm: 66, rb: 80, sh: 60 },
  { n: "Jarrett Allen",     t: "Cavaliers",d: "2020s", p: ["C"],       a: "Rim Protector",  hi: 83, o: 74, df: 84, pm: 58, rb: 84, sh: 48 },
  { n: "De'Aaron Fox",      t: "Kings",    d: "2020s", p: ["PG"],      a: "Slasher",        hi: 75, o: 88, df: 76, pm: 86, rb: 60, sh: 76 },
  { n: "Domantas Sabonis",  t: "Kings",    d: "2020s", p: ["PF","C"],  a: "Floor General",  hi: 83, o: 84, df: 76, pm: 86, rb: 92, sh: 68 },
  { n: "Zion Williamson",   t: "Pelicans", d: "2020s", p: ["PF"],      a: "Slasher",        hi: 78, o: 90, df: 74, pm: 78, rb: 84, sh: 62 },
  { n: "Brandon Ingram",    t: "Pelicans", d: "2020s", p: ["SF"],      a: "Scorer",         hi: 80, o: 86, df: 72, pm: 78, rb: 64, sh: 80 },
  { n: "CJ McCollum",       t: "Pelicans", d: "2020s", p: ["SG"],      a: "Scorer",         hi: 75, o: 82, df: 66, pm: 76, rb: 56, sh: 84 },
  { n: "Trae Young",        t: "Hawks",    d: "2020s", p: ["PG"],      a: "Sharpshooter",   hi: 73, o: 88, df: 58, pm: 92, rb: 56, sh: 90 },
  { n: "Dejounte Murray",   t: "Hawks",    d: "2020s", p: ["PG","SG"], a: "Two-Way Wing",   hi: 76, o: 82, df: 82, pm: 82, rb: 70, sh: 76 },
  { n: "Clint Capela",      t: "Hawks",    d: "2020s", p: ["C"],       a: "Rim Protector",  hi: 82, o: 70, df: 84, pm: 56, rb: 86, sh: 42 },
  { n: "Tyrese Haliburton", t: "Pacers",   d: "2020s", p: ["PG"],      a: "Floor General",  hi: 77, o: 84, df: 74, pm: 94, rb: 62, sh: 86 },
  { n: "Pascal Siakam",     t: "Pacers",   d: "2020s", p: ["PF","SF"], a: "Two-Way Wing",   hi: 81, o: 84, df: 80, pm: 74, rb: 78, sh: 74 },
  { n: "Myles Turner",      t: "Pacers",   d: "2020s", p: ["C"],       a: "Rim Protector",  hi: 83, o: 76, df: 88, pm: 58, rb: 76, sh: 78 },
  { n: "Victor Wembanyama", t: "Spurs",    d: "2020s", p: ["C","PF"],  a: "Two-Way Big",    hi: 88, o: 88, df: 96, pm: 74, rb: 90, sh: 78 },
  { n: "Devin Vassell",     t: "Spurs",    d: "2020s", p: ["SG","SF"], a: "3&D Wing",       hi: 77, o: 80, df: 80, pm: 70, rb: 62, sh: 82 },
  { n: "Keldon Johnson",    t: "Spurs",    d: "2020s", p: ["SF","PF"], a: "Slasher",        hi: 78, o: 80, df: 72, pm: 68, rb: 72, sh: 74 },
];

// Decade offensive "pace inflation". Era-adjusts raw offense so a big scoring
// number in a slow-paced era isn't worth the same as in a fast one.
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
