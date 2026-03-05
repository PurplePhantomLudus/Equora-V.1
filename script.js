cconst translations = {
    es: {
        players: ["1 Jugador", "2 Jugadores", "3 Jugadores", "4 Jugadores"],
        playersTitle: "Jugadores", namePlaceholder: "Nombre", startBtn: "Empezar ➔",
        step: "PASO", trees: "🌳 Árboles (1, 3, 7)", mountains: "⛰️ Montañas Ady.", 
        fields: "🌾 Prados (5 pts)", buildings: "🏠 Edificios (5 pts)", river: "Río (A)", 
        islands: "Islas (B)", toAnimals: "🐾 Animales ➔", toFinal: "✨ Último Paso ➔",
        spiritAchieved: "¿Espíritu logrado?", spiritSelect: "-- Seleccionar --",
        spiritTypes: ["Espíritu Montaña", "Espíritu Árbol", "Espíritu Agua", "Manual / Otro"],
        tiebreaker: "Cubos de Animal (Desempate)", confirm: "Confirmar",
        results: "🏆 Balance Final", newGame: "Nueva Partida", soloLevel: "Nivel de Éxito Solitario",
        animals: ["León", "Zorro", "Musaraña", "Cocodrilo", "Gacela", "Elefante", "Flamenco", "Panda", "Lobo"]
    },
    en: {
        players: ["1 Player", "2 Players", "3 Players", "4 Players"],
        playersTitle: "Players", namePlaceholder: "Name", startBtn: "Start ➔",
        step: "STEP", trees: "🌳 Trees (1, 3, 7)", mountains: "⛰️ Adj. Mountains", 
        fields: "🌾 Fields (5 pts)", buildings: "🏠 Buildings (5 pts)", river: "River (A)", 
        islands: "Islands (B)", toAnimals: "🐾 Animals ➔", toFinal: "✨ Final Step ➔",
        spiritAchieved: "Spirit achieved?", spiritSelect: "-- Select --",
        spiritTypes: ["Mountain Spirit", "Tree Spirit", "Water Spirit", "Manual / Other"],
        tiebreaker: "Animal Cubes (Tie-breaker)", confirm: "Confirm",
        results: "🏆 Final Balance", newGame: "New Game", soloLevel: "Solo Success Level",
        animals: ["Lion", "Fox", "Shrew", "Crocodile", "Gazelle", "Elephant", "Flamingo", "Panda", "Wolf"]
    }
};

let currentLang = localStorage.getItem('equora-lang') || 'es';
let totalPlayers = 0, currentPlayer = 1, playerNames = [], allScores = [];

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('equora-lang', lang);
    updateUI();
}

function updateUI() {
    const t = translations[currentLang];
    // Pantalla Bienvenida
    const pBtns = document.getElementById('player-buttons');
    pBtns.innerHTML = "";
    for(let i=1; i<=4; i++) {
        pBtns.innerHTML += `<button onclick="setPlayerCount(${i})" class="bg-white/10 py-4 rounded-2xl font-bold border border-white/20">${t.players[i-1]}</button>`;
    }
    // Paso Nombres
    document.getElementById('txt-players-title').innerText = `👥 ${t.playersTitle}`;
    document.getElementById('btn-start-game').innerText = t.startBtn;
    // Etiquetas de puntuación
    document.getElementById('lbl-trees').innerText = t.trees;
    document.getElementById('lbl-mountains').innerText = t.mountains;
    document.getElementById('lbl-fields').innerText = t.fields;
    document.getElementById('lbl-buildings').innerText = t.buildings;
    document.getElementById('opt-river').innerText = t.river;
    document.getElementById('opt-islands').innerText = t.islands;
    document.getElementById('btn-to-animals').innerText = t.toAnimals;
    document.getElementById('btn-to-final').innerText = t.toFinal;
    document.getElementById('txt-spirit-achieved').innerText = t.spiritAchieved;
    document.getElementById('lbl-tiebreaker').innerText = t.tiebreaker;
    // Select de Espíritus
    const sType = document.getElementById('spirit-type');
    sType.innerHTML = `<option value="none">${t.spiritSelect}</option>`;
    const valSpirit = ["mountains", "trees", "water", "other"];
    valSpirit.forEach((v, i) => sType.innerHTML += `<option value="${v}">${t.spiritTypes[i]}</option>`);
    
    // Grid de Fauna
    const grid = document.getElementById('fauna-grid');
    grid.innerHTML = "";
    for(let i=1; i<=9; i++) {
        grid.innerHTML += `
            <div class="bg-white rounded-2xl p-2 text-center shadow-sm border border-slate-50">
                <p class="text-[8px] font-black uppercase text-slate-400 mb-1">${t.animals[i-1]}</p>
                <img src="assets/FAUNA${i}.png" onerror="this.src='https://placehold.co/100?text=🐾';" class="w-full aspect-square rounded-xl object-cover mb-2">
                <input type="number" placeholder="Pts" class="fauna-input w-full p-1 text-center font-black bg-amber-50 rounded-lg outline-none">
            </div>`;
    }
}

// Lógica de Juego (se mantienen funciones previas ajustadas)
function setPlayerCount(num) {
    totalPlayers = num;
    const container = document.getElementById('names-container');
    container.innerHTML = "";
    for(let i=1; i<=num; i++) container.innerHTML += `<input type="text" id="name-p${i}" placeholder="${translations[currentLang].namePlaceholder} ${i}" class="w-full p-4 rounded-2xl bg-slate-100 font-black">`;
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('step-names').classList.remove('hidden');
}

function initRecuento() {
    for(let i=1; i<=totalPlayers; i++) playerNames.push(document.getElementById(`name-p${i}`).value || `P${i}`);
    document.getElementById('step-names').classList.add('hidden');
    document.getElementById('wizard-app').classList.remove('hidden');
    updateWizardUI();
}

function updateWizardUI() {
    const t = translations[currentLang];
    document.getElementById('player-indicator').innerText = `${t.results}: ${playerNames[currentPlayer-1].toUpperCase()}`;
    document.getElementById('step-indicator').innerText = `${t.step} 1/3`;
    document.getElementById('save-btn').innerText = currentPlayer < totalPlayers ? `${t.confirm} ➔` : t.results;
}

function nextRecuentoStep(n) {
    document.querySelectorAll('.recuento-step').forEach(s => s.classList.add('hidden'));
    document.getElementById(`recuento${n}`).classList.remove('hidden');
    document.getElementById('step-indicator').innerText = `${translations[currentLang].step} ${n}/3`;
}

function toggleSpiritUI() { document.getElementById('spirit-ui').classList.toggle('hidden', !document.getElementById('spirit-check').checked); }
function updateSpiritLogic() { document.getElementById('spirit-manual-pts').classList.toggle('hidden', document.getElementById('spirit-type').value !== 'other'); }

function calculateTotal() {
    const t1 = Number(document.getElementById('t1').value)||0, t2 = Number(document.getElementById('t2').value)||0, t3 = Number(document.getElementById('t3').value)||0;
    const m2 = Number(document.getElementById('m2').value)||0, m3 = Number(document.getElementById('m3').value)||0;
    const landscapeBase = (t1*1 + t2*3 + t3*7) + (m2*3 + m3*7) + (Number(document.getElementById('fld').value)||0)*5 + (Number(document.getElementById('bld').value)||0)*5;
    const wVal = Number(document.getElementById('w-val').value)||0;
    const water = document.getElementById('w-mode').value === 'A' ? (wVal <= 2 ? 0 : wVal === 3 ? 5 : wVal === 4 ? 8 : wVal === 5 ? 11 : wVal === 6 ? 15 : 15 + (wVal-6)*4) : wVal * 5;
    let fauna = 0; document.querySelectorAll('.fauna-input').forEach(i => fauna += Number(i.value)||0);
    let spirit = 0;
    if(document.getElementById('spirit-check').checked) {
        const type = document.getElementById('spirit-type').value;
        if(type === 'mountains') spirit = (m2 + m3) * 4;
        else if(type === 'trees') spirit = (t2 + t3) * 4;
        else if(type === 'water') spirit = wVal * 2;
        else if(type === 'other') spirit = Number(document.getElementById('spirit-manual-pts').value)||0;
    }
    return landscapeBase + water + fauna + spirit;
}

function savePlayerData() {
    allScores.push({ name: playerNames[currentPlayer-1], points: calculateTotal(), cubes: Number(document.getElementById('tie-cubes').value)||0 });
    if(currentPlayer < totalPlayers) {
        currentPlayer++; resetInputs(); updateWizardUI(); nextRecuentoStep(1);
    } else { showFinalRanking(); }
}

function resetInputs() { document.querySelectorAll('input').forEach(i => i.value = ""); document.getElementById('spirit-check').checked = false; toggleSpiritUI(); }

function showFinalRanking() {
    allScores.sort((a,b) => b.points - a.points || b.cubes - a.cubes);
    const t = translations[currentLang];
    document.getElementById('wizard-app').innerHTML = `<div class="p-8 space-y-6"><h2 class="text-3xl font-black italic uppercase text-center">${t.results}</h2><div id="ranking-list" class="space-y-4"></div><button onclick="location.reload()" class="w-full bg-slate-800 text-white font-black py-5 rounded-2xl uppercase italic">${t.newGame}</button></div>`;
    allScores.forEach((s, i) => {
        document.getElementById('ranking-list').innerHTML += `<div class="flex justify-between items-center bg-white p-5 rounded-3xl shadow-sm border border-slate-100"><div><p class="text-[10px] font-bold text-slate-400 uppercase">Rank ${i+1}</p><p class="text-lg font-black italic text-slate-800">${i===0?'🥇':'👤'} ${s.name}</p></div><div class="text-3xl font-black text-emerald-600">${s.points}<span class="text-xs ml-1">pts</span></div></div>`;
    });
}

window.onload = () => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js');
    updateUI();
};