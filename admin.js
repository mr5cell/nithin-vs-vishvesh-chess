// Admin panel functionality
const ADMIN_PIN = '15081947';
const AUTH_KEY = 'chessAdminAuth';
const AUTH_EXPIRY = 30 * 60 * 1000; // 30 minutes

class AdminPanel {
    constructor() {
        this.tracker = new ChessTracker();
        this.authenticated = false;
        this.checkAuthentication();
    }

    checkAuthentication() {
        const authData = sessionStorage.getItem(AUTH_KEY);
        if (authData) {
            const { timestamp } = JSON.parse(authData);
            if (Date.now() - timestamp < AUTH_EXPIRY) {
                this.authenticated = true;
                this.showAdminPanel();
            } else {
                sessionStorage.removeItem(AUTH_KEY);
                this.showPinScreen();
            }
        } else {
            this.showPinScreen();
        }
    }

    showPinScreen() {
        document.getElementById('pin-overlay').style.display = 'flex';
        document.getElementById('admin-container').style.display = 'none';
        
        document.getElementById('pin-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.validatePin();
        });
        
        // Focus on PIN input
        document.getElementById('pin-input').focus();
    }

    validatePin() {
        const pinInput = document.getElementById('pin-input');
        const pinError = document.getElementById('pin-error');
        
        if (pinInput.value === ADMIN_PIN) {
            // Store authentication
            sessionStorage.setItem(AUTH_KEY, JSON.stringify({
                timestamp: Date.now()
            }));
            this.authenticated = true;
            this.showAdminPanel();
        } else {
            pinError.textContent = 'Invalid PIN. Please try again.';
            pinInput.value = '';
            pinInput.focus();
            
            // Clear error after 3 seconds
            setTimeout(() => {
                pinError.textContent = '';
            }, 3000);
        }
    }

    showAdminPanel() {
        document.getElementById('pin-overlay').style.display = 'none';
        document.getElementById('admin-container').style.display = 'block';
        
        this.initializeEventListeners();
        this.updateAdminStats();
        this.displayAllGames();
    }

    initializeEventListeners() {
        if (!this.authenticated) return;
        // Form submission
        document.getElementById('game-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addGame();
        });

        // Export button
        document.getElementById('export-btn').addEventListener('click', () => {
            this.exportData();
        });

        // Clear button
        document.getElementById('clear-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete all game data? This action cannot be undone!')) {
                this.clearAllData();
            }
        });

        // Logout button
        document.getElementById('logout-btn').addEventListener('click', () => {
            sessionStorage.removeItem(AUTH_KEY);
            this.authenticated = false;
            this.showPinScreen();
        });

        // Set today's date as default
        document.getElementById('game-date').valueAsDate = new Date();
    }

    addGame() {
        const date = document.getElementById('game-date').value;
        const gameNumber = parseInt(document.getElementById('game-number').value);
        const winner = document.getElementById('winner').value;

        if (!date || !gameNumber || !winner) {
            this.showMessage('Please fill all fields', 'error');
            return;
        }

        const game = this.tracker.addGame(date, gameNumber, winner);
        
        // Reset form
        document.getElementById('game-form').reset();
        document.getElementById('game-date').valueAsDate = new Date();
        
        // Update UI
        this.updateAdminStats();
        this.displayAllGames();
        
        // Show success message
        const winnerName = winner === 'draw' ? 'Draw' : winner.charAt(0).toUpperCase() + winner.slice(1);
        this.showMessage(`Game added successfully! Winner: ${winnerName}`, 'success');
    }

    deleteGame(id) {
        if (confirm('Are you sure you want to delete this game?')) {
            this.tracker.deleteGame(id);
            this.updateAdminStats();
            this.displayAllGames();
            this.showMessage('Game deleted successfully', 'success');
        }
    }

    updateAdminStats() {
        const stats = this.tracker.getStats();
        document.getElementById('admin-total-games').textContent = stats.total;
        document.getElementById('admin-nithin-wins').textContent = stats.nithin;
        document.getElementById('admin-vishvesh-wins').textContent = stats.vishvesh;
        document.getElementById('admin-draws').textContent = stats.draws;
    }

    displayAllGames() {
        const gamesList = document.getElementById('admin-games-list');
        const games = this.tracker.games.sort((a, b) => 
            new Date(b.date) - new Date(a.date) || b.gameNumber - a.gameNumber
        );

        if (games.length === 0) {
            gamesList.innerHTML = '<div class="no-games">No games recorded yet.</div>';
            return;
        }

        gamesList.innerHTML = games.map(game => {
            const date = new Date(game.date).toLocaleDateString();
            const winnerName = game.winner === 'draw' ? 'Draw' : 
                              game.winner.charAt(0).toUpperCase() + game.winner.slice(1);
            const winnerClass = game.winner === 'draw' ? 'draw' : game.winner;
            
            return `
                <div class="admin-game-item ${winnerClass}">
                    <div class="game-info">
                        <span class="game-date">${date}</span>
                        <span class="game-number">Game #${game.gameNumber}</span>
                        <span class="game-winner">${winnerName}</span>
                    </div>
                    <button class="delete-btn" onclick="adminPanel.deleteGame(${game.id})">
                        DELETE
                    </button>
                </div>
            `;
        }).join('');
    }

    exportData() {
        const games = this.tracker.games;
        const stats = this.tracker.getStats();
        
        const exportData = {
            exportDate: new Date().toISOString(),
            statistics: stats,
            games: games
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `chess-games-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showMessage('Data exported successfully!', 'success');
    }

    clearAllData() {
        this.tracker.games = [];
        this.tracker.saveGames();
        this.updateAdminStats();
        this.displayAllGames();
        this.showMessage('All data has been cleared', 'success');
    }

    showMessage(text, type) {
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'message';
        }, 3000);
    }
}

// ChessTracker class (same as in app.js)
class ChessTracker {
    constructor() {
        this.storageKey = 'chessGames';
        this.games = this.loadGames();
    }

    loadGames() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    saveGames() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.games));
    }

    addGame(date, gameNumber, winner) {
        const game = {
            id: Date.now(),
            date: date,
            gameNumber: gameNumber,
            winner: winner,
            timestamp: new Date().toISOString()
        };
        this.games.push(game);
        this.saveGames();
        return game;
    }

    deleteGame(id) {
        this.games = this.games.filter(game => game.id !== id);
        this.saveGames();
    }

    getStats() {
        const stats = {
            total: this.games.length,
            nithin: 0,
            vishvesh: 0,
            draws: 0
        };

        this.games.forEach(game => {
            if (game.winner === 'nithin') stats.nithin++;
            else if (game.winner === 'vishvesh') stats.vishvesh++;
            else if (game.winner === 'draw') stats.draws++;
        });

        return stats;
    }
}

// Initialize admin panel
let adminPanel;
document.addEventListener('DOMContentLoaded', () => {
    adminPanel = new AdminPanel();
});