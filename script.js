// Dynamic Clock Tracker
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const liveClockEl = document.getElementById("liveClock");
    if (liveClockEl) {
        liveClockEl.innerText = `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
    }
}
setInterval(updateClock, 1000);
updateClock();

let appData = {
    user: "",
    gameType: "", 
    selectedGame: "",
    currentQuestionIndex: 0,
    score: 0,
    timerInterval: null,
    timeLeft: 20, 
    userAnswers: [],
    sessionAvgTime: 0,
    totalTimeSaved: 0,
    quizStartTime: null,
    quizEndTime: null,
    attemptDurationSeconds: 0,
    resultsSaved: false,
    lastEarnedXP: 0,
    lastNewMedals: [],
    lastResultHtml: ""
};

const gameIcons = {
    "Chess": "♟️",
    "Table Tennis": "🏓",
    "Badminton": "🏸",
    "Carrom": "🎯",
    "Cricket": "🏏",
    "Football": "⚽",
    "Basketball": "🏀",
    "Tennis": "🎾"
};

function getGameIcon(gameName) {
    return gameIcons[gameName] || "🎮";
}

function formatDuration(totalSeconds) {
    let safeSeconds = Math.max(0, Math.round(Number(totalSeconds) || 0));
    let minutes = Math.floor(safeSeconds / 60);
    let seconds = safeSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function formatLeaderboardDuration(item) {
    return item.durationSeconds === undefined ? "N/A" : formatDuration(item.durationSeconds);
}

const LEADERBOARD_STORAGE_KEY = "global_game_leaderboard";
const LEADERBOARD_RESET_FLAG = "global_game_leaderboard_reset_2026_05_21";

function clearOldLeaderboardHistoryOnce() {
    if (!localStorage.getItem(LEADERBOARD_RESET_FLAG)) {
        localStorage.removeItem(LEADERBOARD_STORAGE_KEY);
        localStorage.setItem(LEADERBOARD_RESET_FLAG, "done");
    }
}

/* SYSTEM ARCHITECTURE ENGINE */
const gamesDatabase = {
    indoor: {
        "Chess": {
            overview: "Chess is an ancient strategy game originating from 6th-century India (Chaturanga). It simulates a military battlefield on an 8x8 structural grid containing 64 squares alternating dark and light. Each combatant controls 16 tactical pieces with distinct movement constraints and vector systems.",
            rules: "1. Objective: Deliver checkmate by placing the opposing King under an inescapable threat of capture.\n2. White always controls the first move.\n3. Turn-Based: A player cannot pass a turn or move twice consecutively.\n4. Special Maneuvers: En Passant (pawn capture rule), Castling (simultaneous King and Rook mobilization), and Pawn Promotion upon touching the furthest perimeter rank.\n5. Draws: Occur via Stalemate (no legal moves while not in check), Threefold Repetition, or Insufficient Material.",
            questions: [
                {q:"How many total squares are on a standard chess board?", opt:["48","64","72","81"], ans:1},
                {q:"Which piece can skip over other pieces on the board?", opt:["Rook","Bishop","Knight","Queen"], ans:2},
                {q:"What is the absolute objective of a chess match?", opt:["Capture all pawns","Checkmate the King","Stalemate","Capture the Queen"], ans:1},
                {q:"How many pawns does each player start with?", opt:["6","8","10","12"], ans:1},
                {q:"Which piece can move diagonally only?", opt:["Rook","Bishop","Knight","King"], ans:1},
                {q:"White always makes the opening move of a match.", opt:["True","False","Optional","Only in tournaments"], ans:0},
                {q:"What piece has the highest mobility and structural worth?", opt:["King","Rook","Queen","Bishop"], ans:2},
                {q:"What happens in a 'Stalemate' scenario?", opt:["White wins","Black wins","The game is a draw","Additional time is granted"], ans:2},
                {q:"A special move involving the king and a rook is called what?", opt:["En Passant","Promotion","Castling","Check"], ans:2},
                {q:"How many squares can a King safely move per turn under normal context?", opt:["1","2","3","Unlimited"], ans:0},
                {q:"What piece can undergo 'Promotion' if it crosses the board edge?", opt:["Knight","Pawn","Rook","King"], ans:1},
                {q:"What configuration does a Knight move in?", opt:["Straight lines","Diagonal vectors","An 'L' pattern","Circular layout"], ans:2},
                {q:"How many total pieces are on the board at the beginning of a game?", opt:["24","32","36","40"], ans:1},
                {q:"The word Checkmate originates from which linguistic phrase?", opt:["Shah Mat (Persian)","Check (French)","Mate (Latin)","None"], ans:0},
                {q:"Can a King capture an opposing piece checking it if it's unguarded?", opt:["No","Yes","Only during castling","Only with a queen nearby"], ans:1},
                {q:"A player has how many bishops at game initialization?", opt:["1","2","3","4"], ans:1},
                {q:"What is it called when a pawn captures an enemy pawn passing it?", opt:["En Passant","Fianchetto","Gambit","Intermezzo"], ans:0},
                {q:"The vertical columns on a chessboard are universally called what?", opt:["Ranks","Files","Grids","Lines"], ans:1},
                {q:"The horizontal rows on a chessboard are termed what?", opt:["Ranks","Files","Blocks","Sectors"], ans:0},
                {q:"Is it possible to win a game of chess in exactly two moves?", opt:["No","Yes (Fool's Mate)","Only if playing Black","Only in blitz"], ans:1}
            ]
        },
        "Table Tennis": {
            overview: "Table Tennis (Ping-Pong) is an ultra-fast, reaction-dominant Olympic sport. Played over a high-density hardboard table divided by a central 6-inch net, it employs high-grade laminated wooden paddles surfaced with Pimpled Rubber sheets to generate extreme topspin, backspin, and sidespin velocity profiles.",
            rules: "1. Match Structuring: Played in best-of-5 or best-of-7 games format. First player to score 11 points wins a game.\n2. Deuce rule: If the tally rests at 10-10, the game goes to extra score lines requiring a clear 2-point margin to win.\n3. Service Mechanics: The service must swap hands every 2 completed points. The ball must bounce once cleanly on the server's side, pass the net structure, and strike the receiver's quadrant.\n4. Free Hand Penalty: Players may not contact or shift the table with their free, non-racket hand during a rally.",
            questions: [
                {q:"How many points are required to win a standard modern game of Table Tennis?", opt:["11","15","21","25"], ans:0},
                {q:"How often do services alternate between players?", opt:["Every point","Every 2 points","Every 5 points","Every game"], ans:1},
                {q:"What is table tennis alternatively and informally known as?", opt:["Paddleball","Ping-Pong","Smash-ball","Whiff-Whaff"], ans:1},
                {q:"What is required to win a game if the score stands tied at 10-10?", opt:["Next point wins","A 2-point lead","Coin toss","Play a super-point"], ans:1},
                {q:"During a legal service loop, the ball must bounce where?", opt:["Only on opponent's side","Server's side first, then opponent's","Directly over without bouncing","On the floor"], ans:1},
                {q:"If a served ball touches the net but lands correctly on the other side, it's called?", opt:["Fault","Let","Ace","Point to receiver"], ans:1},
                {q:"How many players are involved in a standard individual singles match?", opt:["2","4","6","8"], ans:0},
                {q:"In standard doubles, teammates must hit the ball in what sequence?", opt:["Alternating turns","Any order","One plays offense, one defense","Varies"], ans:0},
                {q:"What piece of equipment is used to strike the ball?", opt:["Club","Racket / Paddle","Bat","Stick"], ans:1},
                {q:"What material is a premium regulation table tennis ball made of today?", opt:["Wood","Metal","Celluloid or Poly-plastic","Solid Rubber"], ans:2},
                {q:"What is the official height of the net above the table surface?", opt:["6 inches","8 inches","5 inches","12 inches"], ans:0},
                {q:"Are players allowed to touch the table surface with their free hand during a rally?", opt:["Yes","No","Only when diving","Only during a serve"], ans:1},
                {q:"In what country did table tennis trace its initial origins as an indoor game?", opt:["China","England","USA","Japan"], ans:1},
                {q:"When serving in a doubles match, the ball must travel in what trajectory?", opt:["Straight down the line","Diagonally from right-court to right-court","Anywhere","High arc"], ans:1},
                {q:"What is the maximum number of games usually scheduled in an Olympic singles match?", opt:["3","5","7","9"], ans:2},
                {q:"A powerful downward aggressive stroke is commonly known as a what?", opt:["Push","Chop","Smash","Block"], ans:2},
                {q:"An spin rotation applied where the top of the ball rotates forward is?", opt:["Backspin","Top-spin","Sidespin","No-spin"], ans:1},
                {q:"Is a ball that hits the edge or side corner of the table considered 'in'?", opt:["No, it's out","Yes, it's valid","Replay the point","Fault"], ans:1},
                {q:"When was Table Tennis formally instated as an official Olympic sport?", opt:["1960","1988","2000","2012"], ans:1},
                {q:"What is the color scheme configuration of modern standard competition paddles?", opt:["Blue/Green","Black/Red","Yellow/Black","White/Red"], ans:1}
            ]
        },
        "Badminton": {
            overview: "Badminton is the world's fastest racquet sport, demanding exceptional agility, explosive jump-smashes, and delicate net play. Instead of a ball, it uses a lightweight aerodynamic cone called a Shuttlecock, composed of 16 overlapping goose feathers embedded into a cork base.",
            rules: "1. Scoring System: Played to 21 points using a rally-point system (whoever wins the rally scores a point, regardless of who served).\n2. Win Margin: Must win by 2 clear points. If tied at 29-29, the first player to secure the 30th point wins.\n3. Service Protocols: Must strike the shuttle below the waistline level with the racquet shaft pointing downward.\n4. Bounds: The court boundaries differ between singles (long and narrow) and doubles (short and wide during serve, full court after).",
            questions: [
                {q:"How many points are required to win a standard regulation badminton game?", opt:["15","21","25","30"], ans:1},
                {q:"How many feathers must construct a standard regulation BWF shuttlecock?", opt:["12","14","16","18"], ans:2},
                {q:"If the score reaches 29-29, how is the winner determined?", opt:["Sudden death 30th point","Play up to 32","Coin flip","Replay game"], ans:0},
                {q:"When serving, the contact point with the shuttlecock must be below what body line?", opt:["Knee","Waist","Chest","Shoulder"], ans:1},
                {q:"What governing body oversees the rules of international badminton?", opt:["BWF","FIBA","ICC","FIFA"], ans:0},
                {q:"If a server's score is an EVEN number, from which side must they serve?", opt:["Left Court","Right Court","Center","Anywhere"], ans:1},
                {q:"If a server's score is an ODD number, from which side do they serve?", opt:["Left Court","Right Court","Backcourt","Frontcourt"], ans:0},
                {q:"Is a shuttlecock that lands exactly on the boundary line considered in or out?", opt:["Out","In","Fault","Replay point"], ans:1},
                {q:"What type of shot is hit high and deep to the back of the opponent's court?", opt:["Smash","Drop","Clear/Lob","Drive"], ans:2},
                {q:"What is a fast, flat, horizontal shot across the net called?", opt:["Drive","Smash","Net drop","Lift"], ans:0},
                {q:"What material is the base of a professional shuttlecock made of?", opt:["Rubber","Plastic","Cork","Wood"], ans:2},
                {q:"Are players permitted to touch the net with their body or racquet during active play?", opt:["Yes","No","Only on smashes","Only if accidental"], ans:1},
                {q:"When was badminton officially introduced into the Olympic Games?", opt:["1980","1992","2000","2008"], ans:1},
                {q:"What is the ultimate global team championship tournament for MEN called?", opt:["Uber Cup","Thomas Cup","Sudirman Cup","Davis Cup"], ans:1},
                {q:"What is the global team championship tournament for WOMEN called?", opt:["Uber Cup","Thomas Cup","Fed Cup","BWF Trophy"], ans:0},
                {q:"If a shuttle strikes the net during a rally but drops down into the opponent's court, what happens?", opt:["Fault","Let (Replay)","Play continues","Point to server"], ans:2},
                {q:"In standard doubles play, are teammates allowed to hit the shuttle twice in succession?", opt:["Yes","No","Only on defense","Only on saves"], ans:1},
                {q:"What is the maximum speed ever officially tracked for a badminton smash?", opt:["Under 200 km/h","Around 300 km/h","Over 400 km/h","Over 500 km/h"], ans:3},
                {q:"What is the height of the badminton net at the center of the court?", opt:["5 feet","4.5 feet","6 feet","5.5 feet"], ans:0},
                {q:"What kind of stroke involves hitting the shuttle softly over the net so it drops quickly?", opt:["Smash","Drop Shot","Drive","Clear"], ans:1}
            ]
        },
        "Carrom": {
            overview: "Carrom is a widely popular strike-and-pocket tabletop board game of Eastern origin. Played on a smooth, polished square wooden board with four corner pockets, players use a heavy acrylic piece called a Striker to flick smaller wooden disks called Carrom Men into the targets.",
            rules: "1. Pieces Breakdown: 9 White pieces, 9 Black pieces, and 1 central Red piece called the Queen.\n2. Scoring: White pieces yield 1 point, Black pieces yield 1 point, and the Queen yields 3 bonus points.\n3. The Queen Rule: A player must 'cover' the Queen by pocketing one of their own assigned pieces immediately on the subsequent strike. If they fail, the Queen is returned to the center.\n4. Striker Placement: When taking a shot, the striker must sit flat touching both base-lines of the player's quadrant without crossing diagonal boundaries.",
            questions: [
                {q:"How many total standard carrom men (excluding the striker) are placed at the center?", opt:["15","19","21","18"], ans:1},
                {q:"What is the central red coin on a carrom board universally called?", opt:["King","Jack","Queen","Ace"], ans:2},
                {q:"How many points is the Queen worth in a standard tournament framing?", opt:["1 Point","2 Points","3 Points","5 Points"], ans:2},
                {q:"What must a player do immediately after pocketing the Queen to validate it?", opt:["Win the game","Pocket a piece to 'cover' it","Pass the turn","Flick the striker backward"], ans:1},
                {q:"What happens if a player pockets the striker accidentally?", opt:["Loss of game","Turn passes and a penalty piece is returned to center","Extra turn","Nothing"], ans:1},
                {q:"What material is a modern regulation tournament striker usually made of?", opt:["Wood","Ivory","Acrylic/Plastic","Metal"], ans:2},
                {q:"How many total white pieces are arranged on the board initially?", opt:["6","9","10","12"], ans:1},
                {q:"How many corner pockets are built into a carrom board?", opt:["2","4","6","8"], ans:1},
                {q:"What powder is applied to the surface of the carrom board to minimize friction?", opt:["Boric/Talcum powder","Chalk powder","Flour","Sand"], ans:0},
                {q:"If a player pockets an opponent's piece, what is the penalty?", opt:["Loss of turn","Point deducted","Opponent gets the piece and turn passes","Nothing"], ans:0},
                {q:"Are players allowed to touch or cross the diagonal lines with their striker?", opt:["Yes","No","Only on thumb shots","Only with referees permission"], ans:1},
                {q:"What is it called when a player pockets all their pieces on the opening turn?", opt:["Grand Slam","White Slam","Strike Out","Perfect Board"], ans:1},
                {q:"How many baseline strips line each side of the carrom board layout?", opt:["1","2","3","4"], ans:1},
                {q:"What happens if a piece flies off the carrom board during a strike?", opt:["It stays out","Placed in center spot","Given to current player","Fault"], ans:1},
                {q:"Can a player use their thumb to flick the striker forward in standard play?", opt:["No","Yes (Thumb shot)","Only in doubles","Only on penalty shots"], ans:1},
                {q:"What is the maximum number of points a player can score in a single standard board frame?", opt:["12","14","25","29"], ans:1},
                {q:"If a player fails to pocket their 'cover' after sinking the Queen, where does the Queen go?", opt:["Stays in pocket","Returned to center spot","Given to opponent","Placed in a corner"], ans:1},
                {q:"What type of shot involves bouncing the striker off a side wall to hit a piece?", opt:["Direct shot","Cut shot","Rebound/Bank shot","Board shot"], ans:2},
                {q:"How many total players can actively play on a single board simultaneously?", opt:["2 or 4","Only 2","Up to 6","Only 4"], ans:0},
                {q:"What is the standard inner dimension size of a professional carrom board?", opt:["20x20 inches","29x29 inches","36x36 inches","40x40 inches"], ans:1}
            ]
        }
    },
    outdoor: {
        "Cricket": {
            overview: "Cricket is a strategic team field sport developed in 18th-century England. Played on a large oval grass ground centered around a 22-yard hard-packed rectangular strip called the pitch, it pits 11 batsmen against 11 fielders in a series of strategic individual duels.",
            rules: "1. Match Goal: Secure more total runs than the opponent before all batting allocations/wickets run out.\n2. Over Structure: An over consists of exactly 6 legitimate legal deliveries from a single bowler.\n3. Scoring: Runs are accumulated via running between wickets, or hitting the boundary (4 runs along the grass, 6 runs directly through the air).\n4. Dismissals: 10 distinct ways to get a batsman out, primarily Bowled, Caught, Leg Before Wicket (LBW), Run Out, and Stumped.",
            questions: [
                {q:"How many active players compose a standard on-field team?", opt:["9","10","11","12"], ans:2},
                {q:"How many fair deliveries constitute a complete single over?", opt:["4","6","8","5"], ans:1},
                {q:"What is the precise measure length of a regulation cricket pitch?", opt:["20 Yards","22 Yards","24 Yards","26 Yards"], ans:1},
                {q:"What does getting dismissed for a 'Duck' mean?", opt:["Out on first ball","Dismissed with 0 runs","Caught out","Run out"], ans:1},
                {q:"How many runs are awarded if the ball rolls across the boundary line after hit?", opt:["1","2","4","6"], ans:2},
                {q:"How many vertical stumps construct a single set of wickets?", opt:["2","3","4","5"], ans:1},
                {q:"What are the two loose small horizontal wood pieces sitting atop the stumps?", opt:["Sticks","Bails","Caps","Pegs"], ans:1},
                {q:"Which format represents the longest classic configuration of a cricket match?", opt:["T20","ODI","Test Cricket","T10"], ans:2},
                {q:"What does the acronym 'LBW' stand for?", opt:["Leg Before Wicket","Long Ball Wing","Line Body Weight","None"], ans:0},
                {q:"Who is universally referred to as the 'God of Cricket'?", opt:["Virat Kohli","Ricky Ponting","Sachin Tendulkar","Brian Lara"], ans:2},
                {q:"How many runs are earned if the ball is hit over the boundary line without bouncing?", opt:["3","4","5","6"], ans:3},
                {q:"What penalty is awarded to the batting side for an illegal high or wide delivery?", opt:["Extra Run","Free Out","Loss of Strike","None"], ans:0},
                {q:"How many fielders are legally allowed to be positioned inside a T20 Powerplay ring?", opt:["Maximum 2","Maximum 5","All players","Varies"], ans:0},
                {q:"What tool is utilized by third umpires to review close dismissals and edges?", opt:["Hawk-Eye/DRS","Stump Camera","Radar","Speed Gun"], ans:0},
                {q:"Which fielding posture is located directly behind the striker's stumps?", opt:["Slip","Gully","Wicket-keeper","Mid-on"], ans:2},
                {q:"What color ball is standard for daytime traditional Test matches?", opt:["White","Red","Pink","Orange"], ans:1},
                {q:"In what country did modern cricket originally develop?", opt:["Australia","India","England","South Africa"], ans:2},
                {q:"What event occurs when a bowler removes three batsmen with consecutive balls?", opt:["Hat-trick","Super Over","Century","Golden Duck"], ans:0},
                {q:"How many total fielders from the bowling team are present on the field?", opt:["11","10","9","12"], ans:0},
                {q:"What is the ultimate global governing body of cricket?", opt:["ICC","BCCI","FIFA","ACC"], ans:0}
            ]
        },
        "Football": {
            overview: "Football (Soccer) is the world's most popular sport, featuring an 11v11 field structure. Played on a vast rectangular turf field with large goal nets at both ends, the game relies entirely on tactical positioning, spatial awareness, and creative ball navigation using only the feet, chest, and head.",
            rules: "1. Match Length: 90 minutes of total regulation play time, split cleanly into two 45-minute halves.\n2. Goal Keepers: The only on-field players permitted to touch the ball with hands/arms, locked within their own 18-yard Penalty Box.\n3. The Offside Infraction: An attacker cannot stand closer to the opposing goal line than the second-to-last defender at the precise moment the ball is kicked forward to them.\n4. Sanctions: Cautions are handed down via a Yellow Card; dangerous play or accumulation of 2 yellow cards triggers a Red Card, forcing immediate ejection.",
            questions: [
                {q:"What is the total duration of standard regulation football match?", opt:["60 Mins","80 Mins","90 Mins","120 Mins"], ans:2},
                {q:"Which player is uniquely allowed to hold the ball with their hands during active play?", opt:["Captain","Goalkeeper","Striker","Defender"], ans:1},
                {q:"What card is displayed by the referee to signal immediate ejection from the field?", opt:["Green Card","Yellow Card","Red Card","Blue Card"], ans:2},
                {q:"How many total players are present on the field for one single team?", opt:["9","10","11","12"], ans:2},
                {q:"From what specific distance is a standard penalty kick executed?", opt:["10 Yards","12 Yards","15 Yards","18 Yards"], ans:1},
                {q:"What infraction is called when an attacker is closer to the goal line than the last defender before the pass?", opt:["Foul","Offside","Handball","Corner"], ans:1},
                {q:"How frequent is the prestigious FIFA Men's World Cup organized?", opt:["Every 2 years","Every 3 years","Every 4 years","Every year"], ans:2},
                {q:"A standard match is structurally divided into how many halves?", opt:["2","3","4","None"], ans:0},
                {q:"What size ball is standard for professional adult matches?", opt:["Size 3","Size 4","Size 5","Size 6"], ans:2},
                {q:"If a defender knocks the ball past their own goal line, what is awarded?", opt:["Goal Kick","Penalty","Corner Kick","Throw-in"], ans:2},
                {q:"How many yellow cards issued to a single player equals a red card?", opt:["1","2","3","4"], ans:1},
                {q:"What is the structural shape of a professional football goal?", opt:["Square","Rectangular","Circular","Hexagonal"], ans:1},
                {q:"An intentional handling infraction by a non-goalkeeper is ruled as what?", opt:["Offside","Handball","Dribble","Tackle"], ans:1},
                {q:"What event initiates the start of each half and resumes play after a goal?", opt:["Throw-in","Corner","Kick-off","Drop-ball"], ans:2},
                {q:"What is the nickname often used to describe the sport of football globally?", opt:["The Fast Game","The Beautiful Game","The Field Battle","The Foot Tournament"], ans:1},
                {q:"What body part is strictly banned from making contact with the ball for outfield players?", opt:["Head","Chest","Hands and Arms","Thighs"], ans:2},
                {q:"What length of time is allocated for the standard half-time rest break?", opt:["5 Mins","15 Mins","20 Mins","10 Mins"], ans:1},
                {q:"Who enforces rules and maintains discipline on the pitch during a match?", opt:["The Coach","The Referee","The Captain","The Line judge"], ans:1},
                {q:"If a match remains tied in a knockout tournament, what follow-up phase occurs first?", opt:["Penalty Shootout","Extra Time","Coin Toss","Golden Goal"], ans:1},
                {q:"What abbreviation describes the technological video assistant referee system?", opt:["DRS","VAR","TPI","VCR"], ans:1}
            ]
        },
        "Basketball": {
            overview: "Basketball is a high-octane, indoor/outdoor team sport played on a polished rectangular court. Two teams of five players compete to shoot an inflated ball through an elevated 10-foot metal hoop guarded by a transparent backboard, requiring extreme aerobic conditioning and precise manual handling.",
            rules: "1. Scoring Values: field goals inside the arc are worth 2 points; shots converted from behind the 22-foot line are worth 3 points; uncontested Free Throws are worth 1 point.\n2. Ball Handling constraints: Players must continuously bounce (dribble) the ball with one hand while moving. Running without dribbling constitutes a Traveling violation.\n3. Double Dribble: Stopping the active dribble and restarting it, or contacting the ball with two hands simultaneously while walking, is banned.\n4. Game Clocks: Regulated by a standard 24-second Shot Clock requiring the offensive side to execute a rim-touching shot attempt before expiring.",
            questions: [
                {q:"How many active players per team are allowed on a basketball court simultaneously?", opt:["4","5","6","7"], ans:1},
                {q:"What is the regulation height of a basketball hoop from the gym floor?", opt:["9 feet","10 feet","11 feet","12 feet"], ans:1},
                {q:"How many points is a standard free throw worth?", opt:["1 point","2 points","3 points","0 points"], ans:0},
                {q:"Walking or running with the ball without dribbling is called what?", opt:["Carrying","Traveling","Double Dribble","Foul"], ans:1},
                {q:"What is the length of the countdown on a standard professional NBA shot clock?", opt:["14 Seconds","24 Seconds","30 Seconds","35 Seconds"], ans:1},
                {q:"How many points are awarded for a shot successfully converted from outside the large arc?", opt:["2 points","3 points","4 points","5 points"], ans:1},
                {q:"What governing body regulates international basketball tournaments?", opt:["FIBA","NBA","NCAA","FIFA"], ans:0},
                {q:"How many total personal fouls causes a player to be disqualified from an NBA game?", opt:["4","5","6","7"], ans:2},
                {q:"What violation is called if a player bounces the ball with both hands at once?", opt:["Traveling","Double Dribble","Palming","Technical Foul"], ans:1},
                {q:"An international basketball match consists of how many distinct quarters?", opt:["2","3","4","5"], ans:2},
                {q:"What is the term for a defensive player blocking a shot after it begins its downward flight?", opt:["Clean Block","Goaltending","Steal","Airball"], ans:1},
                {q:"What event initiates every standard professional basketball game at center court?", opt:["Kickoff","Jump Ball/Tip-off","Throw-in","Coin flip"], ans:1},
                {q:"What is the maximum time an offensive player can remain inside the opponent's key/paint area?", opt:["3 Seconds","5 Seconds","8 Seconds","10 Seconds"], ans:0},
                {q:"How many seconds does a team have to advance the ball past the half-court line in an international match?", opt:["5 Seconds","8 Seconds","10 Seconds","12 Seconds"], ans:1},
                {q:"What type of foul is called for unsportsmanlike conduct without physical contact?", opt:["Personal Foul","Technical Foul","Charging Foul","Reach-in"], ans:1},
                {q:"What is it called when a player catches their teammate's missed shot out of the air?", opt:["Assist","Steal","Rebound","Block"], ans:2},
                {q:"Who invented the sport of basketball in the year 1891?", opt:["James Naismith","Michael Jordan","Abner Doubleday","Walter Camp"], ans:0},
                {q:"What is the circular painted area located directly beneath each hoop basket called?", opt:["The Circle","The Box","The Key or Paint","The Zone"], ans:2},
                {q:"A shot that bounces directly off the backboard into the basket without hitting the rim is a what?", opt:["Airball","Bank Shot","Slam Dunk","Layup"], ans:1},
                {q:"What pass involves bouncing the ball off the floor directly to a teammate?", opt:["Chest Pass","Overhead Pass","Bounce Pass","Lob Pass"], ans:2}
            ]
        },
        "Tennis": {
            overview: "Tennis is a prestige racket sport played individually (singles) or in pairs (doubles) across a rectangular flat court surface (Grass, Clay, or Hard Court). Players utilize carbon-fiber strung rackets to drive a hollow felt-covered neon-yellow rubber ball over a central 3-foot net.",
            rules: "1. Unusual Scoring Progression: Scores ladder from Love (0) -> 15 -> 30 -> 40. The next point wins the game unless tied.\n2. Deuce and Advantage: If scores sit locked at 40-40, it is called Deuce. Winning a point grants 'Advantage'; a player must then win the immediate next point to take the game, otherwise it falls back to Deuce.\n3. Match Win conditions: Consists of Sets. To claim a set, a player must secure 6 individual games with a margin of 2.\n4. Ball Bouncing: The ball must land within specified white boundary lines and is permitted a maximum of one bounce before it must be returned.",
            questions: [
                {q:"What term is used to describe a score of zero in tennis?", opt:["Nil","Zero","Love","Blank"], ans:2},
                {q:"Which historical tennis score represents a 40-40 tie in a game?", opt:["Tiebreak","Deuce","Advantage","All-In"], ans:1},
                {q:"What is the name of the prestigious grand slam tournament played exclusively on grass courts?", opt:["US Open","French Open","Australian Open","Wimbledon"], ans:3},
                {q:"How many bounces is the tennis ball legally permitted inside a player's court before they must return it?", opt:["1","2","3","Unlimited"], ans:0},
                {q:"What major grand slam tournament is famous for its bright red clay courts?", opt:["Wimbledon","Roland Garros (French Open)","US Open","Australian Open"], ans:1},
                {q:"A point scored directly from an unreturned service where the receiver never touches the ball is called what?", opt:["Fault","Ace","Let","Smash"], ans:1},
                {q:"If a server steps onto or over the baseline during their service strike, what is called?", opt:["Double Fault","Foot Fault","Net Violation","Out"], ans:1},
                {q:"How many total individual Grand Slam tournaments are organized every year?", opt:["2","3","4","5"], ans:2},
                {q:"If the game score within a set becomes locked at 6-6, how is the set decided?", opt:["Coin toss","Sudden death point","Tiebreak game","Replay set"], ans:2},
                {q:"What is it called when a player wins a game where the opponent was the one serving?", opt:["Hold","Break","Deuce","Ace"], ans:1},
                {q:"What is the baseline term for a player hitting the ball before it touches the court floor?", opt:["Slice","Lob","Volley","Drop"], ans:2},
                {q:"How many operational service attempts is a tennis player allowed per point?", opt:["1","2","3","Unlimited"], ans:1},
                {q:"If a serve hits the net cord but falls successfully into the correct service box, what happens?", opt:["Fault","Point to receiver","Let (Replay serve)","Loss of point"], ans:2},
                {q:"What high, deep arc shot is used to send the ball over an opponent close to the net?", opt:["Smash","Lob","Passing shot","Slice"], ans:1},
                {q:"The narrow additional side lanes added to a tennis court specifically for doubles are called?", opt:["Alleys","Wings","Extensions","Margins"], ans:0},
                {q:"What material constructs the court baseline at the US Open tournament?", opt:["Clay","Grass","Hard Court/Acrylic","Carpet"], ans:2},
                {q:"What happens if a player commits two consecutive service faults?", opt:["Warning","Turn passes","They lose the point","Opponent wins game"], ans:2},
                {q:"Who governs the rules and ranking structures of professional MEN'S tennis globally?", opt:["WTA","ATP","ITF","FIT"], ans:1},
                {q:"Who governs the rules and ranking structures of professional WOMEN'S tennis globally?", opt:["WTA","ATP","ITF","WBA"], ans:0},
                {q:"What color were standard tennis balls before neon-yellow was implemented for television visibility?", opt:["White","Red","Blue","Black"], ans:0}
            ]
        }
    }
};

function renderView(html) {
    document.getElementById("app-container").innerHTML = html;
}

/* GAMIFICATION: XP TRACKING & TIER LEVELS LOADING ENGINE */
function loadPlayerXP() {
    let xpData = JSON.parse(localStorage.getItem(`xp_${appData.user}`)) || { xp: 0, medals: [] };
    
    let level = Math.floor(xpData.xp / 100) + 1;
    let rankTier = "Rookie";
    if (level >= 3) rankTier = "Pro Athlete";
    if (level >= 6) rankTier = "Elite Champion";
    if (level >= 10) rankTier = "All-Star Veteran";
    if (level >= 15) rankTier = "Hall of Famer";

    let badge = document.getElementById("xpHeaderBadge");
    badge.style.display = "block";
    badge.innerHTML = `⭐ ${rankTier} (Lvl ${level}) &nbsp;|&nbsp; ${xpData.xp} XP`;
    return xpData;
}

/* REGISTRATION INTERFACE */
function initApp() {
    document.getElementById("xpHeaderBadge").style.display = "none";
    let html = `
        <h1>🎮 Multi-Sport Championship Arena</h1>
        <h2>Welcome Athlete! Enter your profile to start tracking your Career Levels and Medals.</h2>
        <input id="playerNameInput" type="text" placeholder="Enter Athlete Name..." autocomplete="off" maxlength="20">
        <button id="enterComplexBtn">Enter Training Complex</button>
    `;
    renderView(html);

    document.getElementById("enterComplexBtn").addEventListener("click", handleNameSubmission);
}

function handleNameSubmission() {
    let nameVal = document.getElementById("playerNameInput").value.trim();
    if(!nameVal) { alert("Please input a proper Athlete name profile!"); return; }
    appData.user = nameVal;
    chooseInterests();
}

/* CHOOSE FILTERING ARENA */
function chooseInterests() {
    loadPlayerXP();
    let html = `
        <h1>Welcome back, ${appData.user}!</h1>
        <h2>Select your arena category to browse official dossiers:</h2>
        <button id="indoorBtn">🏠 Indoor Sports Complex</button>
        <button id="outdoorBtn">🌳 Outdoor Stadium Arena</button>
        <button id="medalVaultBtn" style="background:linear-gradient(135deg, #ffd700, #ff8c00); color:#0f2027;">🏆 View My Medal Vault</button>
        <button id="switchProfileBtn" style="background:rgba(255,255,255,0.05); margin-top:15px;">⬅ Switch Profile</button>
    `;
    renderView(html);

    document.getElementById("indoorBtn").addEventListener("click", () => selectCategory('indoor'));
    document.getElementById("outdoorBtn").addEventListener("click", () => selectCategory('outdoor'));
    document.getElementById("medalVaultBtn").addEventListener("click", displayMedalShowcase);
    document.getElementById("switchProfileBtn").addEventListener("click", initApp);
}

function selectCategory(category) {
    appData.gameType = category;
    selectGameFromCategory();
}

function selectGameFromCategory() {
    let gamesAvailable = Object.keys(gamesDatabase[appData.gameType]);
    let html = `
        <h1>Select Your Game</h1>
        <h2>Active disciplines inside the <strong>${appData.gameType.toUpperCase()}</strong> complex:</h2>
    `;
    
    gamesAvailable.forEach((game, index) => {
        html += `<button class="game-choice-btn" data-game="${game}"><span class="game-icon">${getGameIcon(game)}</span>${game}</button>`;
    });
    
    html += `<button id="backToInterestsBtn" style="background:rgba(255,0,0,0.2); margin-top:15px;">⬅ Go Back</button>`;
    renderView(html);

    document.querySelectorAll(".game-choice-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            let selectedGame = e.currentTarget.getAttribute("data-game");
            confirmGameChoice(selectedGame);
        });
    });
    document.getElementById("backToInterestsBtn").addEventListener("click", chooseInterests);
}

function confirmGameChoice(gameName) {
    appData.selectedGame = gameName;
    viewGameOverview();
}

/* EXHAUSTIVE GAME DOSSIERS */
function viewGameOverview() {
    let gameInfo = gamesDatabase[appData.gameType][appData.selectedGame];
    let html = `
        <h1><span class="game-icon">${getGameIcon(appData.selectedGame)}</span>${appData.selectedGame} Dossier</h1>
        <h2>Study the official playbook parameters before entering the evaluation engine:</h2>
        <div class="scroll-container">
            <h3>📋 Comprehensive Overview</h3>
            <p>${gameInfo.overview}</p>
            <h3>⚠️ Official Rules & Regulations</h3>
            <ul>
                ${gameInfo.rules.split('\n').map(rule => `<li>${rule}</li>`).join('')}
            </ul>
        </div>
        <h3 style="text-align:center;color:#00ffcc;margin-bottom:15px; border:none;">🎯 Target Requirements: 75% Score to Pass</h3>
        <button id="launchQuizBtn">🔥 Launch Championship Match</button>
        <button id="changeGameBtn" style="background:rgba(255,255,255,0.05);">⬅ Change Game Selection</button>
    `;
    renderView(html);

    document.getElementById("launchQuizBtn").addEventListener("click", startChampionshipQuiz);
    document.getElementById("changeGameBtn").addEventListener("click", selectGameFromCategory);
}

/* EVALUATION ENGINE CODE */
function startChampionshipQuiz() {
    appData.currentQuestionIndex = 0;
    appData.score = 0;
    appData.userAnswers = [];
    appData.totalTimeSaved = 0;
    appData.quizStartTime = Date.now();
    appData.quizEndTime = null;
    appData.attemptDurationSeconds = 0;
    appData.resultsSaved = false;
    appData.lastEarnedXP = 0;
    appData.lastNewMedals = [];
    appData.lastResultHtml = "";
    loadQuizQuestion();
}

function loadQuizQuestion() {
    clearInterval(appData.timerInterval);
    appData.timeLeft = 20; 
    
    let targetGameList = gamesDatabase[appData.gameType][appData.selectedGame].questions;
    let questionObject = targetGameList[appData.currentQuestionIndex];
    let progression = (appData.currentQuestionIndex / targetGameList.length) * 100;

    let html = `
        <div class="quiz-header">
            <strong style="color:#00ffcc;">Match Point: ${appData.currentQuestionIndex + 1} / ${targetGameList.length}</strong>
            <div class="progress-container">
                <div class="progress-bar" style="width: ${progression}%;"></div>
            </div>
            <div class="timer-badge attempt-timer" id="attemptElapsedDisplay">${formatDuration((Date.now() - appData.quizStartTime) / 1000)}</div>
            <div class="timer-badge" id="timerDisplay">${appData.timeLeft}s</div>
        </div>
        <h2 style="text-align:left; color:#fff; min-height:60px; line-height:1.4;">${questionObject.q}</h2>
    `;

    questionObject.opt.forEach((option, index) => {
        html += `<button class="option-btn" id="opt-${index}" data-idx="${index}">${index + 1}. &nbsp; ${option}</button>`;
    });

    renderView(html);

    document.querySelectorAll(".option-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            let index = parseInt(e.currentTarget.getAttribute("data-idx"));
            registerAnswer(index);
        });
    });

    appData.timerInterval = setInterval(() => {
        appData.timeLeft--;
        let tDisplay = document.getElementById("timerDisplay");
        if(tDisplay) {
            tDisplay.innerText = appData.timeLeft + "s";
            if(appData.timeLeft <= 5) tDisplay.classList.add("timer-low");
        }
        let elapsedDisplay = document.getElementById("attemptElapsedDisplay");
        if (elapsedDisplay) {
            elapsedDisplay.innerText = formatDuration((Date.now() - appData.quizStartTime) / 1000);
        }
        if(appData.timeLeft <= 0) registerAnswer(null); 
    }, 1000);
}

function registerAnswer(selectedIndex) {
    clearInterval(appData.timerInterval);
    let targetGameList = gamesDatabase[appData.gameType][appData.selectedGame].questions;
    let currentQuestion = targetGameList[appData.currentQuestionIndex];

    appData.userAnswers.push(selectedIndex);
    appData.totalTimeSaved += appData.timeLeft; 

    if(selectedIndex !== null) {
        let activeBtn = document.getElementById(`opt-${selectedIndex}`);
        if(activeBtn) activeBtn.classList.add("selected");
        if(selectedIndex === currentQuestion.ans) appData.score++;
    }

    let optionButtons = document.querySelectorAll(".option-btn");
    optionButtons.forEach(btn => btn.disabled = true);

    setTimeout(() => {
        appData.currentQuestionIndex++;
        if(appData.currentQuestionIndex < targetGameList.length) {
            loadQuizQuestion();
        } else {
            appData.quizEndTime = Date.now();
            appData.attemptDurationSeconds = (appData.quizEndTime - appData.quizStartTime) / 1000;
            processResults();
        }
    }, 400);
}

/* RESULTS PROCESSOR WITH PROGRESSIVE REWARDS CALCULATIONS */
function processResults() {
    let targetGameList = gamesDatabase[appData.gameType][appData.selectedGame].questions;
    let finalPercentage = (appData.score / targetGameList.length) * 100;
    let isPassed = finalPercentage >= 75; 
    let badgeMarkup = isPassed ? `<span class="badge badge-pass">PASSED EVALUATION</span>` : `<span class="badge badge-fail">FAILED EVALUATION</span>`;
    
    if (appData.resultsSaved && appData.lastResultHtml) {
        renderView(appData.lastResultHtml);
        attachResultListeners();
        return;
    }
    let attemptDuration = appData.attemptDurationSeconds || ((targetGameList.length * 20) - appData.totalTimeSaved);

    let baseXP = appData.score * 5; 
    let bonusXP = isPassed ? 25 : 0;
    let totalGainedXP = baseXP + bonusXP;

    let playerProfile = JSON.parse(localStorage.getItem(`xp_${appData.user}`)) || { xp: 0, medals: [] };
    playerProfile.xp += totalGainedXP;

    let newMedals = [];
    if (finalPercentage === 100 && !playerProfile.medals.includes("🥇 Centurion Match Perfect")) {
        newMedals.push("🥇 Centurion Match Perfect");
    }
    if (appData.totalTimeSaved >= 250 && isPassed && !playerProfile.medals.includes("⚡ Lightning Reflex Blitz")) {
        newMedals.push("⚡ Lightning Reflex Blitz");
    }
    if (isPassed && !playerProfile.medals.includes(`🏆 Master of ${appData.selectedGame}`)) {
        newMedals.push(`🏆 Master of ${appData.selectedGame}`);
    }

    playerProfile.medals = [...new Set([...playerProfile.medals, ...newMedals])];
    localStorage.setItem(`xp_${appData.user}`, JSON.stringify(playerProfile));
    
    saveRecordToLeaderboard(appData.user, appData.selectedGame, finalPercentage, appData.score, targetGameList.length, attemptDuration);
    loadPlayerXP(); 

    let html = `
        <h1>Championship Verdict</h1>
        <h2>Athlete Profile: <strong>${appData.user}</strong></h2>
        <div style="margin:15px 0;">${badgeMarkup}</div>
        <h2 style="font-size:1.8rem; margin-bottom:5px;">Final Score: ${appData.score} / ${targetGameList.length}</h2>
        <div class="attempt-duration">Attempt Time: ${formatDuration(attemptDuration)}</div>
        <h3 style="text-align:center; margin-bottom:15px; border:none; color:#ffd700;">✨ Earned +${totalGainedXP} XP Points</h3>

        ${newMedals.length > 0 ? `
            <div style="background:rgba(255,215,0,0.1); border:1px solid #ffd700; padding:15px; border-radius:12px; margin-bottom:20px;">
                <h4 style="color:#ffd700; margin-bottom:8px;">🎖️ NEW ACHIEVEMENT UNLOCKED!</h4>
                <div class="medal-container">
                    ${newMedals.map(m => `<div class="medal-token medal-earned">${m}</div>`).join('')}
                </div>
            </div>
        ` : ''}

        <button id="viewScorecardBtn">📊 Detailed Performance Scorecard</button>
        <button id="viewLeaderboardBtn">🏆 View Leaderboard</button>
        <button id="pickSportBtn" style="background:linear-gradient(135deg, #00ffcc, #0099ff); color:#0f2027;">🔄 Pick a Different Sport</button>
        <button id="exitComplexBtn" style="background:rgba(255,255,255,0.05);">Exit Stadium Complex</button>
    `;
    appData.resultsSaved = true;
    appData.lastResultHtml = html;
    renderView(html);
    attachResultListeners();
}

function attachResultListeners() {
    document.getElementById("viewScorecardBtn").addEventListener("click", displayDetailedReview);
    document.getElementById("viewLeaderboardBtn").addEventListener("click", displayLeaderboardScreen);
    document.getElementById("pickSportBtn").addEventListener("click", chooseInterests);
    document.getElementById("exitComplexBtn").addEventListener("click", initApp);
}

/* MEDAL SHOWCASE SCREEN */
function displayMedalShowcase() {
    let profile = JSON.parse(localStorage.getItem(`xp_${appData.user}`)) || { xp: 0, medals: [] };
    let html = `
        <h1>🎖️ Athlete Medal Vault</h1>
        <h2>Profile Record Sheet: <strong>${appData.user}</strong></h2>
        
        <div class="scroll-container" style="max-height: 300px; padding: 10px;">
            <h3>Unlocked Accomplishments (${profile.medals.length})</h3>
            ${profile.medals.length === 0 ? `<p style="text-align:center; opacity:0.5; margin-top:20px;">No trophies unlocked yet. Clear your field qualifications to build your showcase!</p>` : `
                <div class="medal-container">
                    ${profile.medals.map(m => `<div class="medal-token medal-earned" style="font-size:1rem; padding:12px 20px;">${m}</div>`).join('')}
                </div>
            `}
        </div>

        <button id="vaultBackBtn">⬅ Back to Core Complex</button>
    `;
    renderView(html);
    document.getElementById("vaultBackBtn").addEventListener("click", chooseInterests);
}

function displayDetailedReview() {
    let targetGameList = gamesDatabase[appData.gameType][appData.selectedGame].questions;
    let html = `
        <h1>Innings Scorecard</h1>
        <h2>Detailed verification metrics tracking down fields:</h2>
        <div class="scroll-container" style="max-height:400px;">
    `;

    targetGameList.forEach((question, idx) => {
        let userPickIndex = appData.userAnswers[idx];
        let isCorrect = userPickIndex === question.ans;
        let reviewClass = isCorrect ? "review-card correct-line" : "review-card";
        
        let userSelectionText = (userPickIndex !== null && userPickIndex !== undefined) ? question.opt[userPickIndex] : "No Response (Timed Out)";
        let accurateText = question.opt[question.ans];

        html += `
            <div class="${reviewClass}">
                <p style="font-weight:600; margin-bottom:5px; color:#fff;">Q${idx+1}: ${question.q}</p>
                <p style="margin:0; font-size:0.88rem;">
                    Your Response: <span class="${isCorrect ? 'txt-good':'txt-bad'}">${userSelectionText}</span><br>
                    ${!isCorrect ? `Correct Key: <span class="txt-good">${accurateText}</span>` : ''}
                </p>
            </div>
        `;
    });

    html += `
        </div>
        <button id="returnToVerdictBtn">Return to Verdict</button>
    `;
    renderView(html);
    document.getElementById("returnToVerdictBtn").addEventListener("click", processResults);
}

/* CORE LEADERBOARD PERSISTENCE LAYER */
function saveRecordToLeaderboard(name, game, percentage, correctAnswers, totalQuestions, durationSeconds) {
    try {
        let lb = JSON.parse(localStorage.getItem(LEADERBOARD_STORAGE_KEY)) || [];
        if (!Array.isArray(lb)) lb = [];
        lb.push({
            name: name,
            game: game,
            finalMark: parseFloat(percentage.toFixed(1)),
            correctAnswers: correctAnswers,
            totalQuestions: totalQuestions,
            durationSeconds: Math.max(0, Math.round(durationSeconds || 0)),
            timestamp: Date.now()
        });
        localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(lb));
    } catch(e) {
        console.error("Leaderboard error:", e);
    }
}

function displayLeaderboardScreen() {
    let html = `
        <h1>🏆 Leaderboard</h1>
        <h2>Rankings are sorted by highest score. If scores tie, the faster quiz attempt ranks higher.</h2>
        <div id="lb-placeholder"></div>
        <button id="lbBackToVerdictBtn" style="background:linear-gradient(135deg, #00ffcc, #0099ff); color:#0f2027;">Back to Verdict</button>
        <button id="lbPickSportBtn" style="background:rgba(255,255,255,0.05);">Pick a Different Sport</button>
    `;
    renderView(html);
    displayLeaderboard(true);

    document.getElementById("lbBackToVerdictBtn").addEventListener("click", processResults);
    document.getElementById("lbPickSportBtn").addEventListener("click", chooseInterests);
}

function displayLeaderboard(showAll = false) {
    try {
        let lb = JSON.parse(localStorage.getItem(LEADERBOARD_STORAGE_KEY)) || [];
        let placeholder = document.getElementById("lb-placeholder");
        if(!placeholder) return;
        if(!Array.isArray(lb) || lb.length === 0) {
            placeholder.innerHTML = `<div class="leaderboard-box"><p style="text-align:center; opacity:0.65; margin:0;">No leaderboard attempts yet.</p></div>`;
            return;
        }

        lb.sort((a, b) => {
            if (b.finalMark !== a.finalMark) return b.finalMark - a.finalMark;
            let timeA = Number.isFinite(Number(a.durationSeconds)) ? Number(a.durationSeconds) : Number.MAX_SAFE_INTEGER;
            let timeB = Number.isFinite(Number(b.durationSeconds)) ? Number(b.durationSeconds) : Number.MAX_SAFE_INTEGER;
            return timeA - timeB;
        });

        let html = `
            <div class="leaderboard-box">
                <h3 style="text-align:center; font-size:1rem; margin-top:5px; margin-bottom:12px; border:none;">🏆 Leaderboard (Global Standings)</h3>
        `;
        
        let visibleRecords = showAll ? lb : lb.slice(0, 5);
        visibleRecords.forEach((item, index) => {
            let rankClass = index === 0 ? "rank-gold" : "";
            html += `
                <div class="leaderboard-row ${rankClass}">
                    <span class="leaderboard-player">
                        <span class="rank-badge">${index + 1}</span>
                        <span>${item.name} <small style="opacity:0.7;">(${getGameIcon(item.game)} ${item.game})</small>
                            <span class="leaderboard-meta">Time: ${formatLeaderboardDuration(item)}${item.correctAnswers !== undefined ? ` | Score: ${item.correctAnswers}/${item.totalQuestions}` : ''}</span>
                        </span>
                    </span>
                    <strong class="leaderboard-score">${item.finalMark}%</strong>
                </div>
            `;
        });

        html += `</div>`;
        placeholder.innerHTML = html;
    } catch(e) {
        console.error("Error drawing leaderboard details:", e);
    }
}

// Initial System Boot Sequence
clearOldLeaderboardHistoryOnce();
initApp();