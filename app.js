// Data management
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

    getRecentGames(limit = 10) {
        return this.games
            .sort((a, b) => new Date(b.date) - new Date(a.date) || b.gameNumber - a.gameNumber)
            .slice(0, limit);
    }

    getPerformanceOverTime() {
        const sortedGames = [...this.games].sort((a, b) => 
            new Date(a.date) - new Date(b.date) || a.gameNumber - b.gameNumber
        );

        let nithinWins = 0;
        let vishveshWins = 0;
        const data = {
            labels: [],
            nithin: [],
            vishvesh: []
        };

        sortedGames.forEach((game, index) => {
            if (game.winner === 'nithin') nithinWins++;
            else if (game.winner === 'vishvesh') vishveshWins++;

            data.labels.push(`Game ${index + 1}`);
            data.nithin.push(nithinWins);
            data.vishvesh.push(vishveshWins);
        });

        return data;
    }
}

// Initialize tracker
const tracker = new ChessTracker();

// Update UI
function updateDashboard() {
    const stats = tracker.getStats();
    
    // Update scores
    document.getElementById('nithin-score').textContent = stats.nithin;
    document.getElementById('vishvesh-score').textContent = stats.vishvesh;
    document.getElementById('total-games').textContent = stats.total;
    document.getElementById('draws').textContent = stats.draws;
    
    // Update win rates
    if (stats.total > 0) {
        const nithinRate = (stats.nithin / stats.total * 100).toFixed(1);
        const vishveshRate = (stats.vishvesh / stats.total * 100).toFixed(1);
        
        document.getElementById('nithin-rate').style.width = nithinRate + '%';
        document.getElementById('nithin-rate-text').textContent = nithinRate + '%';
        
        document.getElementById('vishvesh-rate').style.width = vishveshRate + '%';
        document.getElementById('vishvesh-rate-text').textContent = vishveshRate + '%';
    }
    
    // Update recent games
    updateRecentGames();
    
    // Update charts
    updateCharts();
}

function updateRecentGames() {
    const gamesList = document.getElementById('games-list');
    const recentGames = tracker.getRecentGames();
    
    if (recentGames.length === 0) {
        gamesList.innerHTML = '<div class="no-games">NO GAMES PLAYED YET</div>';
        return;
    }
    
    gamesList.innerHTML = recentGames.map(game => {
        const date = new Date(game.date).toLocaleDateString();
        const winnerName = game.winner === 'draw' ? 'DRAW' : 
                          game.winner.toUpperCase();
        const winnerClass = game.winner === 'draw' ? 'draw' : game.winner;
        
        return `
            <div class="game-item ${winnerClass}">
                <span class="game-date">${date} - GAME #${game.gameNumber}</span>
                <span class="game-winner">${winnerName}</span>
            </div>
        `;
    }).join('');
}

function updateCharts() {
    const stats = tracker.getStats();
    const performanceData = tracker.getPerformanceOverTime();
    
    // Performance over time chart
    const performanceCtx = document.getElementById('performanceChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.performanceChart) {
        window.performanceChart.destroy();
    }
    
    window.performanceChart = new Chart(performanceCtx, {
        type: 'line',
        data: {
            labels: performanceData.labels,
            datasets: [{
                label: 'NITHIN',
                data: performanceData.nithin,
                borderColor: '#000',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                tension: 0.1
            }, {
                label: 'VISHVESH',
                data: performanceData.vishvesh,
                borderColor: '#666',
                backgroundColor: 'rgba(102, 102, 102, 0.1)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
    
    // Pie chart
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.pieChart) {
        window.pieChart.destroy();
    }
    
    window.pieChart = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
            labels: ['NITHIN', 'VISHVESH', 'DRAWS'],
            datasets: [{
                data: [stats.nithin, stats.vishvesh, stats.draws],
                backgroundColor: [
                    '#000',
                    '#666',
                    '#ccc'
                ],
                borderColor: '#000',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                }
            }
        }
    });
}

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', updateDashboard);