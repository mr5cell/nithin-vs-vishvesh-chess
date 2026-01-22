# Nithin vs Vishvesh Chess Tracker

## Project Overview
A minimalist black & white chess-themed website to track chess games between Nithin and Vishvesh. Features a clean interface with real-time statistics and a secure admin panel for game entry.

**Live Site:** https://mr5cell.github.io/nithin-vs-vishvesh-chess/  
**Repository:** https://github.com/mr5cell/nithin-vs-vishvesh-chess

## Features

### Public Dashboard
- **Score Display:** Real-time win counts for both players
- **Statistics:** 
  - Total games played
  - Draw count
  - Win rate percentage bars
  - Performance over time chart
  - Win distribution pie chart
- **Recent Games:** List of latest 10 games with dates and winners
- **Player Photos:** Grayscale images of Nithin and Vishvesh
- **Design:** Minimal B&W chess-themed aesthetic with subtle chessboard pattern

### Admin Panel
- **PIN Protection:** Secured with PIN code `15081947`
- **Session Management:** 30-minute authentication sessions
- **Game Entry:** Simple form with date, game number, and winner selection
- **Data Management:**
  - View all games
  - Delete individual games
  - Export data as JSON
  - Clear all data option
- **Statistics Overview:** Live count of total games and wins

## Technical Stack

### Frontend Only (No Backend)
- **HTML5** - Structure
- **CSS3** - Styling with gradients and shadows
- **Vanilla JavaScript** - Functionality
- **LocalStorage** - Data persistence
- **SessionStorage** - Admin authentication
- **Chart.js** - Data visualization
- **GitHub Pages** - Hosting

## File Structure

```
nithin-vs-vishvesh-chess/
├── index.html          # Main dashboard
├── admin.html          # Admin panel
├── styles.css          # Main styles
├── admin.css           # Admin-specific styles
├── app.js              # Dashboard functionality
├── admin.js            # Admin panel logic
├── favicon.svg         # Chess-themed favicon
├── nithin.jpg          # Nithin's photo
└── vishvesh.jpg        # Vishvesh's photo
```

## Design Decisions

### Visual Design
- **Color Scheme:** Pure black & white with gray shades
- **Typography:** Courier New monospace font for chess notation feel
- **Background:** Dark gradient (#2a2a2a to #0a0a0a) with subtle chess pattern
- **Cards:** Gradient backgrounds with shadow effects for depth
- **Interactions:** Hover effects and smooth transitions

### Data Model
```javascript
// Game object structure
{
  id: timestamp,
  date: "YYYY-MM-DD",
  gameNumber: 1,
  winner: "nithin" | "vishvesh" | "draw",
  timestamp: ISO string
}
```

### Security
- PIN-based authentication (not for high security, just basic access control)
- Session expires after 30 minutes
- No sensitive data stored
- Client-side only implementation

## Key Functions

### ChessTracker Class
- `loadGames()` - Retrieve games from localStorage
- `saveGames()` - Persist games to localStorage
- `addGame()` - Add new game result
- `deleteGame()` - Remove specific game
- `getStats()` - Calculate win statistics
- `getRecentGames()` - Get latest N games
- `getPerformanceOverTime()` - Generate chart data

### AdminPanel Class
- `checkAuthentication()` - Verify PIN session
- `validatePin()` - Check entered PIN
- `showAdminPanel()` - Display admin interface
- `updateAdminStats()` - Refresh statistics
- `exportData()` - Download games as JSON

## Admin PIN
**PIN Code:** `15081947`

## Usage Instructions

### Adding a Game Result
1. Navigate to admin panel (/admin.html)
2. Enter PIN: 15081947
3. Fill in:
   - Game date
   - Game number (for multiple games on same day)
   - Winner (Nithin/Vishvesh/Draw)
4. Click "ADD GAME RESULT"

### Managing Data
- **Export:** Click "EXPORT DATA" to download JSON backup
- **Delete Game:** Click "DELETE" next to any game
- **Clear All:** Click "CLEAR ALL DATA" (requires confirmation)
- **Logout:** Click "LOGOUT" to end session

## Browser Compatibility
- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile responsive

## Future Enhancement Ideas (Not Implemented)
- PGN file upload for detailed game analysis
- ELO rating calculation
- Head-to-head statistics by date range
- Tournament mode for multiple players
- Game notation storage

## Development Notes
- All data stored locally in browser
- No server or database required
- Fully static site deployment
- Images should be replaced with actual photos of players

## Maintenance
To update player photos:
1. Replace `nithin.jpg` and `vishvesh.jpg` with new images
2. Images will automatically be converted to grayscale by CSS

## Credits
Created for tracking chess games between Nithin and Vishvesh.
Designed with a minimalist black & white chess aesthetic.