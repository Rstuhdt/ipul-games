// Game State Management
const gameState = {
    currentMission: 1,
    isSandboxMode: false,
    missionCompleted: new Set(),
};

// Mission Messages in Indonesian (Gen Z style)
const MISSION_MESSAGES = {
    welcome: "Hai Cipaa! Aku Ipul~ Ayo belajar coding bareng-bareng! 🐹✨",
    mission1: {
        task: "Misi pertama nih! Buatin aku rumah dong~",
        hint: "Psst! Ketik code ini ya:\n<div id='ipul-house'></div>",
        success: "Wihh keren! Rumahnya udah jadi nih! 🏠✨"
    },
    mission2: {
        task: "Nah sekarang, rumahnya masih polos nih. Kasih warna pink dong! Pake style tag ya~",
        hint: "Coba tambah style tag, terus kasih background-color: pink ke #ipul-house",
        success: "Uwuu~ rumahnya jadi pink! Cantik banget! 🎀"
    },
    mission3: {
        task: "Eh eh, bikin sudutnya lebih lembut dong~ Pake border-radius ya!",
        hint: "Tambahin border-radius ke #ipul-house, angkanya bebas~",
        success: "Nah gitu dong! Jadi imut kan rumahnya~ 🏠💕"
    },
    mission4: {
        task: "Sekarang bikin tombol ajaib yuk! Ketik:\n<button id='magic-button'>✨</button>",
        hint: "Bikin button tag dengan id 'magic-button' ya~",
        success: "Yeay! Tombolnya udah jadi! ⭐"
    },
    mission5: {
        task: "Last mission nih! Bikin tombolnya bisa ganti warna rumah ya~\nPake addEventListener click!",
        hint: "Tambah script tag, terus pake addEventListener('click') ke #magic-button",
        success: "KEREN BANGET! Kamu udah jadi programmer cilik! 🎉"
    },
    sandbox: "Selamat! Kamu udah master nih~ Sekarang bebas mau coding apa aja! 🌈✨"
};

// DOM Elements
const dialogBox = document.getElementById('dialog-box');
const codeEditor = document.getElementById('code-editor');
const ipulSprite = document.getElementById('ipul-sprite');
const cipaaWorld = document.getElementById('cipaa-world');
const modal = document.getElementById('mission-modal');
const closeModalBtn = document.getElementById('close-modal');
const missionList = document.getElementById('mission-list');

// Initialize Game
function initGame() {
    updateDialog(MISSION_MESSAGES.welcome);
    setTimeout(() => {
        updateDialog(MISSION_MESSAGES.mission1.task);
    }, 3000);
}

// Update Dialog Box
function updateDialog(message, isSuccess = false) {
    dialogBox.innerHTML = `<p>${message}</p>`;
    if (isSuccess) {
        dialogBox.classList.add('success');
        setTimeout(() => {
            dialogBox.classList.remove('success');
        }, 3000);
    }
}

// Validate Missions
function validateMission(code) {
    switch(gameState.currentMission) {
        case 1:
            // More flexible regex for div with id="ipul-house" or id='ipul-house'
            if (/<div[^>]*id\s*=\s*["']ipul-house["'][^>]*>[\s\S]*?<\/div>/i.test(code)) {
                completeMission(1);
            }
            break;
        case 2:
            // Check for style tag with background-color containing pink
            if (/<style[\s\S]*?<\/style>/i.test(code) && 
                /#ipul-house[\s\S]*?{[\s\S]*?background-color[\s\S]*?pink/i.test(code)) {
                completeMission(2);
            }
            break;
        case 3:
            // Check for border-radius in the CSS
            if (/<style[\s\S]*?<\/style>/i.test(code) && 
                /#ipul-house[\s\S]*?{[\s\S]*?border-radius[\s\S]*?:/i.test(code)) {
                completeMission(3);
            }
            break;
        case 4:
            // Check for button with id="magic-button" or id='magic-button'
            if (/<button[^>]*id\s*=\s*["']magic-button["'][^>]*>/i.test(code)) {
                completeMission(4);
            }
            break;
        case 5:
            // Check for script tag with addEventListener and click
            if (/<script[\s\S]*?<\/script>/i.test(code) && 
                /addEventListener[\s\S]*?click/i.test(code)) {
                completeMission(5);
            }
            break;
    }
}

// Complete Mission
function completeMission(missionNumber) {
    if (gameState.missionCompleted.has(missionNumber)) return;
    
    gameState.missionCompleted.add(missionNumber);
    celebrateMission(missionNumber);
    
    // Add success animation to the house
    const house = document.getElementById('ipul-house');
    if (house) {
        house.classList.add('success-animation');
        setTimeout(() => {
            house.classList.remove('success-animation');
        }, 1000);
    }
    
    if (missionNumber < 5) {
        gameState.currentMission = missionNumber + 1;
        setTimeout(() => {
            updateDialog(MISSION_MESSAGES[`mission${gameState.currentMission}`].task);
        }, 3000);
    } else {
        gameState.isSandboxMode = true;
        setTimeout(() => {
            updateDialog(MISSION_MESSAGES.sandbox, true);
        }, 3000);
    }
    
    updateMissionList();
}

// Celebrate Mission Completion
function celebrateMission(missionNumber) {
    updateDialog(MISSION_MESSAGES[`mission${missionNumber}`].success, true);
    
    // Animate Ipul
    ipulSprite.style.animation = 'none';
    ipulSprite.offsetHeight; // Trigger reflow
    ipulSprite.style.animation = 'bounce 0.5s 3';
    
    // Add confetti effect
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    cipaaWorld.appendChild(confetti);
    setTimeout(() => {
        confetti.remove();
    }, 2000);
}

// Update Mission List
function updateMissionList() {
    const missions = missionList.getElementsByTagName('li');
    for (let i = 0; i < missions.length; i++) {
        if (gameState.missionCompleted.has(i + 1)) {
            missions[i].style.color = 'var(--pink-primary)';
            missions[i].innerHTML += ' ✅';
        }
    }
}

// Execute User Code
function executeCode(code) {
    try {
        cipaaWorld.innerHTML = code;
        
        // Trigger house animation if it exists
        const house = document.getElementById('ipul-house');
        if (house) {
            house.classList.add('success-animation');
            setTimeout(() => {
                house.classList.remove('success-animation');
            }, 500);
        }
        
        validateMission(code);
    } catch (error) {
        console.error('Code execution error:', error);
        updateDialog('Ups! Ada yang salah nih. Coba cek lagi ya~', false);
    }
}

// Event Listeners
let previousCode = '';
codeEditor.addEventListener('input', debounce((e) => {
    const code = e.target.value.trim();
    if (code !== '' && code !== previousCode) {
        previousCode = code;
        executeCode(code);
    }
}, 300)); // Even faster response time

document.getElementById('hint-button').addEventListener('click', () => {
    if (!gameState.isSandboxMode) {
        updateDialog(MISSION_MESSAGES[`mission${gameState.currentMission}`].hint);
    }
});

document.getElementById('missions-button').addEventListener('click', () => {
    modal.style.display = 'block';
});

closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Start the game
document.addEventListener('DOMContentLoaded', initGame);
