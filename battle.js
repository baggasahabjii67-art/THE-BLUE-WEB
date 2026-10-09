// Battle State Management
const battleState = {
    battleActive: false,
    currentRound: 0,
    totalRounds: 0,
    ai1Roasts: 0,
    ai2Roasts: 0,
    ai1Wins: 0,
    ai2Wins: 0,
    lastAISpeaking: 0 // 1 or 2
};

// Screen Management
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function showMainMenu() {
    battleState.battleActive = false;
    showScreen('mainMenu');
}

function showInfo() {
    showScreen('infoScreen');
}

function startBattle() {
    battleState.battleActive = true;
    battleState.currentRound = 0;
    battleState.totalRounds = 0;
    battleState.ai1Roasts = 0;
    battleState.ai2Roasts = 0;
    
    // Clear chat
    document.getElementById('chatMessages').innerHTML = '';
    updateStats();
    
    showScreen('battleScreen');
    
    // Start first roast
    setTimeout(() => {
        ai1Speak();
    }, 500);
}

function resetBattle() {
    battleState.ai1Wins = 0;
    battleState.ai2Wins = 0;
    battleState.ai1Roasts = 0;
    battleState.ai2Roasts = 0;
    battleState.currentRound = 0;
    battleState.totalRounds = 0;
    startBattle();
}

// AI Speaking Functions
async function ai1Speak() {
    if (!battleState.battleActive) return;
    
    updateStatus('AI Alpha is crafting a roast...');
    document.getElementById('nextRoundBtn').disabled = true;
    
    const roast = await generateAIResponse(1);
    
    addMessage('🤖 AI Alpha', roast, 'ai1');
    battleState.ai1Roasts++;
    battleState.lastAISpeaking = 1;
    updateStats();
    
    // Auto-trigger AI2 response after delay
    setTimeout(() => {
        ai2Speak();
    }, 2000);
}

async function ai2Speak() {
    if (!battleState.battleActive) return;
    
    updateStatus('AI Beta is preparing a comeback...');
    
    const roast = await generateAIResponse(2);
    
    addMessage('🦾 AI Beta', roast, 'ai2');
    battleState.ai2Roasts++;
    battleState.lastAISpeaking = 2;
    updateStats();
    
    // Enable next round button
    updateStatus('Next round ready!');
    document.getElementById('nextRoundBtn').disabled = false;
}

// Chat Management
function addMessage(sender, text, aiClass) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${aiClass}`;
    
    messageDiv.innerHTML = `
        <div class="message-sender">${sender}</div>
        <div class="message-text">${escapeHtml(text)}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
}

function updateStatus(status) {
    document.getElementById('battleStatus').textContent = status;
}

function updateStats() {
    document.getElementById('ai1Roasts').textContent = battleState.ai1Roasts;
    document.getElementById('ai2Roasts').textContent = battleState.ai2Roasts;
    document.getElementById('ai1Wins').textContent = battleState.ai1Wins;
    document.getElementById('ai2Wins').textContent = battleState.ai2Wins;
}

function nextRound() {
    if (!battleState.battleActive) return;
    
    battleState.currentRound++;
    
    if (battleState.lastAISpeaking === 2) {
        // AI1 goes next
        ai1Speak();
    } else {
        // AI2 goes next
        ai2Speak();
    }
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize
window.addEventListener('load', () => {
    showScreen('mainMenu');
});
