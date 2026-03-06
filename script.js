const translations = {
    es: {
        players: ["1 Jugador", "2 Jugadores", "3 Jugadores", "4 Jugadores"],
        playersTitle: "Jugadores", namePlaceholder: "Nombre", startBtn: "Empezar ➔",
        step: "PASO", trees: "🌳 Árboles (1, 3, 7)", mountains: "⛰️ Montañas Ady.", 
        fields: "🌾 Prados (5 pts)", buildings: "🏠 Edificios (5 pts)", river: "Río (A)", 
        islands: "Islas (B)", toAnimals: "🐾 Animales ➔", toFinal: "✨ Último Paso ➔",
        spiritManual: "✨ Puntos Espíritu (Manual)", spiritCompleted: "¿Cubo colocado?",
        tiebreaker: "Cubos de Animal (Desempate)", confirm: "Confirmar",
        results: "🏆 Balance Final", newGame: "Nueva Partida", soloLevel: "Nivel de Éxito Solitario"
    },
    en: {
        players: ["1 Player", "2 Players", "3 Players", "4 Players"],
        playersTitle: "Players", namePlaceholder: "Name", startBtn: "Start ➔",
        step: "STEP", trees: "🌳 Trees (1, 3, 7)", mountains: "⛰️ Adj. Mountains", 
        fields: "🌾 Fields (5 pts)", buildings: "🏠 Buildings (5 pts)", river: "River (A)", 
        islands: "Islands (B)", toAnimals: "🐾 Animals ➔", toFinal: "✨ Final Step ➔",
        spiritManual: "✨ Spirit Points (Manual)", spiritCompleted: "Cube placed?",
        tiebreaker: "Animal Cubes (Tie-breaker)", confirm: "Confirm",
        results: "🏆 Final Balance", newGame: "New Game", soloLevel: "Solo Success Level"
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
    const pBtns = document.getElementById('player-buttons');
    if (pBtns) {
        pBtns.innerHTML = "";
        for(let i=1; i<=4; i++) pBtns.innerHTML += `<button onclick="setPlayerCount(${i})" class="bg-white/10 py-4 rounded-2xl font-bold border border-white/20 hover:bg-white/30 transition-all">${t.players[i-1]}</button>`;
    }
    document.getElementById('txt-players-title').innerText = `👥 ${t.playersTitle}`;
    document.getElementById('btn-start-game').innerText = t.startBtn;
    document.getElementById('lbl-trees').innerText = t.trees;
    document.getElementById('lbl-mountains').innerText = t.mountains;
    document.getElementById('lbl-fields').innerText = t.fields;
    document.getElementById('lbl-buildings').innerText = t.buildings;
    document.getElementById('opt-river').innerText = t.river;
    document.getElementById('opt-islands').innerText = t.islands;
    document.getElementById('btn-to-animals').innerText = t.toAnimals;
    document.getElementById('btn-to-final').innerText = t.toFinal;
    document.getElementById('lbl-spirit-manual').innerText = t.spiritManual;
    document.getElementById('txt-spirit-completed').innerText = t.spiritCompleted;
    document.getElementById('lbl-tiebreaker').innerText = t.tiebreaker;

    const grid = document.getElementById('fauna-grid');
    grid.innerHTML = "";
    for(let i=1; i<=9; i++) {
        grid.innerHTML += `
            <div class="bg-white rounded-2xl p-2 text-center shadow-sm border border-slate-50">
                <img src="assets/FAUNA${i}.png" onerror="this.src='https://placehold.co/100?text=🐾';" class="w-full aspect-square rounded-xl object-cover mb-2">
                <input type="number" placeholder="Pts" class="fauna-input w-full p-1 text-center font-black bg-amber-50 rounded-lg outline-none">
            </div>`;
    }
}

function setPlayerCount(num) {
    totalPlayers = num;
    const container = document.getElementById('names-container');
    container.innerHTML = "";
    for(let i=1; i<=num; i++) container.innerHTML += `<input type="text" id="name-p${i}" placeholder="${translations[currentLang].namePlaceholder} ${i}" class="w-full p-4 rounded-2xl bg-slate-100 font-black border-none focus:ring-2 focus:ring-emerald-500">`;
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('step-names').classList.remove('hidden');
}

function initRecuento() {
    playerNames = [];
    for(let i=1; i<=totalPlayers; i++) playerNames.push(document.getElementById(`name-p${i}`).value || `P${i}`);
    document.getElementById('step-names').classList.add('hidden');
    document.getElementById('wizard-app').classList.remove('hidden');
    updateWizardUI();
}

function updateWizardUI() {
    const t = translations[currentLang];
    document.getElementById('player-indicator').innerText = `${playerNames[currentPlayer-1].toUpperCase()}`;
    document.getElementById('step-indicator').innerText = `${t.step} 1/3`;
    document.getElementById('save-btn').innerText = currentPlayer < totalPlayers ? `${t.confirm} ➔` : t.results;
}

function nextRecuentoStep(n) {
    document.querySelectorAll('.recuento-step').forEach(s => s.classList.add('hidden'));
    document.getElementById(`recuento${n}`).classList.remove('hidden');
    document.getElementById('step-indicator').innerText = `${translations[currentLang].step} ${n}/3`;
}

function calculateTotal() {
    const t1 = (Number(document.getElementById('t1').value)||0)*1, t2 = (Number(document.getElementById('t2').value)||0)*3, t3 = (Number(document.getElementById('t3').value)||0)*7;
    const m1 = (Number(document.getElementById('m1').value)||0)*1, m2 = (Number(document.getElementById('m2').value)||0)*3, m3 = (Number(document.getElementById('m3').value)||0)*7;
    const landscapeBase = (t1 + t2 + t3) + (m1 + m2 + m3) + (Number(document.getElementById('fld').value)||0)*5 + (Number(document.getElementById('bld').value)||0)*5;
    
    const wVal = Number(document.getElementById('w-val').value)||0;
    const water = document.getElementById('w-mode').value === 'A' 
        ? (wVal <= 2 ? 0 : wVal === 3 ? 5 : wVal === 4 ? 8 : wVal === 5 ? 11 : wVal === 6 ? 15 : 15 + (wVal-6)*4) : wVal * 5;

    let fauna = 0; document.querySelectorAll('.fauna-input').forEach(i => fauna += Number(i.value)||0);
    const spirit = Number(document.getElementById('spirit-manual-pts').value)||0;
    
    return landscapeBase + water + fauna + spirit;
}

function savePlayerData() {
    allScores.push({
        name: playerNames[currentPlayer-1],
        points: calculateTotal(),
        cubes: Number(document.getElementById('tie-cubes').value)||0,
        soloData: { sideA: document.getElementById('w-mode').value === 'A', spirit: document.getElementById('spirit-check').checked }
    });

    if(currentPlayer < totalPlayers) {
        currentPlayer++; resetInputs(); updateWizardUI(); nextRecuentoStep(1);
    } else { showFinalRanking(); }
}

function resetInputs() {
    document.querySelectorAll('input[type="number"], input[type="text"]').forEach(i => i.value = "");
    document.getElementById('spirit-check').checked = false;
}

function showFinalRanking() {
    allScores.sort((a,b) => b.points - a.points || b.cubes - a.cubes);
    const t = translations[currentLang];
    document.getElementById('wizard-app').innerHTML = `
        <div class="p-8 space-y-6 text-center">
            <h2 class="text-3xl font-black italic uppercase text-slate-800">${t.results}</h2>
            <div id="ranking-list" class="space-y-4 text-left"></div>
            <div id="solo-box" class="hidden p-6 bg-amber-400 rounded-3xl border-4 border-white shadow-xl">
                <p class="text-xs font-black uppercase italic">${t.soloLevel}</p><p id="soles" class="text-5xl mt-2"></p>
            </div>
            <button onclick="location.reload()" class="w-full bg-slate-800 text-white font-black py-5 rounded-2xl uppercase italic tracking-widest transition-transform active:scale-95">${t.newGame}</button>
        </div>`;

    allScores.forEach((s, i) => {
        document.getElementById('ranking-list').innerHTML += `
            <div class="flex justify-between items-center bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                <div><p class="text-[10px] font-bold text-slate-400 uppercase">Rank ${i+1}</p><p class="text-lg font-black italic text-slate-800">${i === 0 ? '🥇' : '👤'} ${s.name}</p></div>
                <div class="text-3xl font-black text-emerald-600">${s.points}<span class="text-xs ml-1">pts</span></div>
            </div>`;
    });

    if(totalPlayers === 1) {
        const p = allScores;
        const table = { 40:1, 70:2, 90:3, 110:4, 130:5, 140:6, 150:7, 160:8 };
        let count = 0;
        Object.keys(table).forEach(v => { if(p.points >= Number(v)) count = table[v]; });
        if(p.soloData.sideA) count++;
        if(p.soloData.spirit) count++;
        document.getElementById('solo-box').classList.remove('hidden');
        document.getElementById('soles').innerText = "☀️".repeat(Math.min(count, 8));
    }
}

window.onload = () => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(err => console.warn("SW Error:", err));
    updateUI();
};