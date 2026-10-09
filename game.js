// Game State
const gameState = {
    gameCode: null,
    players: [],
    currentPlayer: null,
    gameStarted: false,
    isHost: false,
    gamePhase: 'lobby', // lobby, playing, voting, ended
    impostors: [],
    deadPlayers: [],
    tasks: [],
    gameConfig: {
        playerCount: 8,
        impostorCount: 2,
        duration: 10
    },
    gameTimer: null,
    timeRemaining: null,
    votes: {}
};

const TASKS = [
    'Fix Wiring in Electrical',
    'Clear Asteroids',
    'Empty Garbage',
    'Refuel Engines',
    'Divert Power',
    'Scan Specimen',
    'Align Engine Output',
    'Clean O2 Filter',
    'Fix Comms',
    'Stabilize Steering'
];

// Screen Management
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    document.getElementById(screenId).classList.remove('hidden');
}

function showMainMenu() {
    stopGameTimer();
    gameState.gameStarted = false;
    gameState.gamePhase = 'lobby';
    showScreen('mainMenu');
}

function showCreateGame() {
    showScreen('createGameScreen');
}

function showJoinGame() {
    showScreen('joinGameScreen');
}

function showSettings() {
    showScreen('settingsScreen');
}

// Game Creation
function createGame(event) {
    if (event) event.preventDefault();
    
    const playerName = document.getElementById('playerName').value;
    const playerCount = parseInt(document.getElementById('playerCount').value);
    const impostorCount = parseInt(document.getElementById('impostorCount').value);
    const gameDuration = parseInt(document.getElementById('gameDuration').value);
    
    if (impostorCount >= playerCount) {
        alert('Number of impostors must be less than players!');
        return;
    }
    
    gameState.gameCode = generateGameCode();
    gameState.isHost = true;
    gameState.gameConfig = { playerCount, impostorCount, duration: gameDuration };
    gameState.currentPlayer = {
        id: generatePlayerId(),
        name: playerName,
        role: 'crewmate',
        alive: true,
        tasks: []
    };
    gameState.players = [gameState.currentPlayer];
    
    showWaitingScreen();
}

function joinGame(event) {
    event.preventDefault();
    
    const playerName = document.getElementById('joinPlayerName').value;
    const gameCode = document.getElementById('gameCode').value.toUpperCase();
    
    // Simulate finding the game
    gameState.gameCode = gameCode;
    gameState.isHost = false;
    gameState.currentPlayer = {
        id: generatePlayerId(),
        name: playerName,
        role: 'crewmate',
        alive: true,
        tasks: []
    };
    gameState.players = [gameState.currentPlayer];
    
    showWaitingScreen();
}

// Waiting Screen
function showWaitingScreen() {
    showScreen('waitingScreen');
    updateWaitingScreen();
    // Simulate other players joining
    simulatePlayers();
}

function updateWaitingScreen() {
    document.getElementById('displayGameCode').textContent = gameState.gameCode;
    document.getElementById('playerCountDisplay').textContent = gameState.players.length;
    document.getElementById('maxPlayerDisplay').textContent = gameState.gameConfig.playerCount;
    
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = '';
    gameState.players.forEach(player => {
        const li = document.createElement('li');
        li.textContent = `${player.name} ${player === gameState.currentPlayer ? '(You)' : ''}`;
        playersList.appendChild(li);
    });
    
    document.getElementById('startGameBtn').disabled = gameState.players.length < 4 || !gameState.isHost;
}

function simulatePlayers() {
    if (!gameState.isHost) return;
    
    const interval = setInterval(() => {
        if (gameState.players.length < gameState.gameConfig.playerCount && gameState.gamePhase === 'lobby') {
            gameState.players.push({
                id: generatePlayerId(),
                name: `Player${gameState.players.length}`,
                role: 'crewmate',
                alive: true,
                tasks: []
            });
            updateWaitingScreen();
        } else {
            clearInterval(interval);
        }
    }, 1000);
}

function startGame() {
    if (!gameState.isHost || gameState.players.length < 4) return;
    
    gameState.gameStarted = true;
    gameState.gamePhase = 'playing';
    gameState.timeRemaining = gameState.gameConfig.duration * 60;
    gameState.votes = {};
    gameState.deadPlayers = [];
    
    // Assign roles
    assignRoles();
    
    // Generate tasks
    generateTasks();
    
    showGameScreen();
    startGameTimer();
}

function assignRoles() {
    gameState.players.forEach(player => {
        player.role = 'crewmate';
        player.alive = true;
    });
    
    gameState.impostors = [];
    for (let i = 0; i < gameState.gameConfig.impostorCount; i++) {
        const randomIdx = Math.floor(Math.random() * gameState.players.length);
        gameState.players[randomIdx].role = 'impostor';
        gameState.impostors.push(gameState.players[randomIdx]);
    }
}

function generateTasks() {
    gameState.tasks = [];
    const taskCount = 8 + gameState.gameConfig.impostorCount;
    
    for (let i = 0; i < taskCount; i++) {
        gameState.tasks.push({
            id: i,
            name: TASKS[Math.floor(Math.random() * TASKS.length)],
            completed: false
        });
    }
}

// Game Screen
function showGameScreen() {
    showScreen('gameScreen');
    updateGameDisplay();
}

function updateGameDisplay() {
    // Update HUD
    document.getElementById('timeDisplay').textContent = formatTime(gameState.timeRemaining);
    document.getElementById('roleDisplay').textContent = gameState.currentPlayer.role === 'impostor' ? '🔴 IMPOSTOR' : '🔵 CREWMATE';
    document.getElementById('roleDisplay').className = 'role-badge ' + gameState.currentPlayer.role;
    document.getElementById('aliveCountDisplay').textContent = gameState.players.filter(p => p.alive).length;
    
    // Update tasks
    const tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = '';
    gameState.tasks.forEach(task => {
        const div = document.createElement('div');
        div.className = 'task-item' + (task.completed ? ' completed' : '');
        div.innerHTML = `<strong>${task.name}</strong>`;
        div.style.cursor = 'pointer';
        div.onclick = () => completeTask(task.id);
        tasksList.appendChild(div);
    });
    
    // Update players list
    const playersList = document.getElementById('gamePlayersList');
    playersList.innerHTML = '';
    gameState.players.forEach(player => {
        const div = document.createElement('div');
        div.className = 'player-item' + (player.dead || !player.alive ? ' dead' : '');
        const status = player === gameState.currentPlayer ? ' (You)' : '';
        const deadStatus = !player.alive ? ' ☠️' : '';
        div.innerHTML = `${player.name}${status}${deadStatus}`;
        if (gameState.currentPlayer.role === 'impostor' && player !== gameState.currentPlayer && player.alive) {
            div.onclick = () => selectPlayerToKill(player);
        }
        playersList.appendChild(div);
    });
    
    // Show kill button only for impostors
    const killBtn = document.getElementById('killBtn');
    if (gameState.currentPlayer.role === 'impostor') {
        killBtn.classList.remove('hidden');
    } else {
        killBtn.classList.add('hidden');
    }
}

function completeTask(taskId) {
    if (gameState.currentPlayer.role === 'impostor') return;
    
    const task = gameState.tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
        task.completed = true;
        updateGameDisplay();
        
        // Check if all tasks completed
        if (gameState.tasks.every(t => t.completed)) {
            endGame('crewmates');
        }
    }
}

let selectedKillTarget = null;

function selectPlayerToKill(player) {
    selectedKillTarget = player;
}

function killPlayer() {
    if (!selectedKillTarget || !gameState.currentPlayer.role === 'impostor') return;
    
    selectedKillTarget.alive = false;
    gameState.deadPlayers.push(selectedKillTarget);
    selectedKillTarget = null;
    updateGameDisplay();
    
    // Check win conditions
    const aliveCrewmates = gameState.players.filter(p => p.alive && p.role === 'crewmate').length;
    const aliveImpostors = gameState.players.filter(p => p.alive && p.role === 'impostor').length;
    
    if (aliveImpostors >= aliveCrewmates) {
        endGame('impostors');
    }
}

function emergencyMeeting() {
    gameState.gamePhase = 'voting';
    showVotingScreen();
}

// Voting Screen
function showVotingScreen() {
    showScreen('votingScreen');
    
    const votingOptions = document.getElementById('votingOptions');
    votingOptions.innerHTML = '';
    
    gameState.players.filter(p => p.alive).forEach(player => {
        const div = document.createElement('div');
        div.className = 'vote-option';
        div.textContent = player.name;
        div.onclick = () => voteForPlayer(player);
        votingOptions.appendChild(div);
    });
}

function voteForPlayer(player) {
    gameState.votes[gameState.currentPlayer.id] = player.id;
    
    // Get vote results
    const voteCounts = {};
    Object.values(gameState.votes).forEach(votedId => {
        voteCounts[votedId] = (voteCounts[votedId] || 0) + 1;
    });
    
    // Find player with most votes
    let maxVotes = 0;
    let votedOutPlayer = null;
    for (const [playerId, count] of Object.entries(voteCounts)) {
        if (count > maxVotes) {
            maxVotes = count;
            votedOutPlayer = gameState.players.find(p => p.id === playerId);
        }
    }
    
    if (votedOutPlayer) {
        votedOutPlayer.alive = false;
        gameState.deadPlayers.push(votedOutPlayer);
        
        // Check win conditions
        const aliveCrewmates = gameState.players.filter(p => p.alive && p.role === 'crewmate').length;
        const aliveImpostors = gameState.players.filter(p => p.alive && p.role === 'impostor').length;
        
        if (aliveImpostors === 0) {
            endGame('crewmates');
        } else if (aliveImpostors >= aliveCrewmates) {
            endGame('impostors');
        } else {
            gameState.gamePhase = 'playing';
            gameState.votes = {};
            showGameScreen();
        }
    }
}

function skipVote() {
    gameState.gamePhase = 'playing';
    gameState.votes = {};
    showGameScreen();
}

// Game Timer
function startGameTimer() {
    gameState.gameTimer = setInterval(() => {
        gameState.timeRemaining--;
        updateGameDisplay();
        
        if (gameState.timeRemaining <= 0) {
            endGame('impostors');
        }
    }, 1000);
}

function stopGameTimer() {
    if (gameState.gameTimer) {
        clearInterval(gameState.gameTimer);
        gameState.gameTimer = null;
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Game Over
function endGame(winner) {
    stopGameTimer();
    gameState.gamePhase = 'ended';
    gameState.gameStarted = false;
    
    showGameOverScreen(winner);
}

function showGameOverScreen(winner) {
    showScreen('gameOverScreen');
    
    const title = document.getElementById('gameOverTitle');
    const message = document.getElementById('gameOverMessage');
    const statsList = document.getElementById('gameStatsList');
    
    if (winner === 'crewmates') {
        title.textContent = '✅ CREWMATES WIN!';
        title.style.color = '#00cc88';
        message.textContent = 'All tasks completed!';
    } else {
        title.textContent = '❌ IMPOSTORS WIN!';
        title.style.color = '#ff3333';
        message.textContent = 'Impostors have taken over!';
    }
    
    statsList.innerHTML = '';
    gameState.players.forEach(player => {
        const div = document.createElement('div');
        div.innerHTML = `<strong>${player.name}</strong> - ${player.role === 'impostor' ? '🔴 IMPOSTOR' : '🔵 CREWMATE'} ${player.alive ? '(Alive)' : '(Dead)'}` + 
                       (player.role === 'impostor' && winner === 'impostors' ? ' ⭐' : '') +
                       (player.role === 'crewmate' && winner === 'crewmates' ? ' ⭐' : '');
        statsList.appendChild(div);
    });
}

function leaveGame() {
    gameState.gameStarted = false;
    gameState.gameCode = null;
    gameState.players = [];
    gameState.currentPlayer = null;
    stopGameTimer();
    showMainMenu();
}

// Utilities
function generateGameCode() {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
}

function generatePlayerId() {
    return 'player_' + Math.random().toString(36).substr(2, 9);
}

// Initialize
window.addEventListener('load', () => {
    showScreen('mainMenu');
});