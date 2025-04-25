document.addEventListener('DOMContentLoaded', function() {
    // Modal Logic
    const modal = document.getElementById('slots-modal');
    const slotsTrigger = document.getElementById('slots-trigger');
    const closeModal = document.querySelector('.close-modal');
    
    // Modal öffnen
    slotsTrigger.addEventListener('click', () => {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    
    // Modal schließen
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Slots Game Logic
    const symbols = ['🍒', '🍋', '🍊', '🍇', '🍉', '💰', '7️⃣'];
    const reel1 = document.getElementById('reel1');
    const reel2 = document.getElementById('reel2');
    const reel3 = document.getElementById('reel3');
    const spinBtn = document.getElementById('spin-btn');
    const balanceDisplay = document.getElementById('balance');
    const resultDisplay = document.getElementById('slots-result');
    const betAmountDisplay = document.getElementById('bet-amount');
    const increaseBetBtn = document.getElementById('increase-bet');
    const decreaseBetBtn = document.getElementById('decrease-bet');
    
    let balance = 99999; // 99.999€ Startguthaben
    let currentBet = 10;
    let isSpinning = false;
    
    // Einsatzsteuerung
    increaseBetBtn.addEventListener('click', () => {
        if (currentBet < 1000) {
            currentBet += 1;
            updateBetDisplay();
        }
    });
    
    decreaseBetBtn.addEventListener('click', () => {
        if (currentBet > 1) {
            currentBet -= 1;
            updateBetDisplay();
        }
    });
    
    function updateBetDisplay() {
        betAmountDisplay.textContent = currentBet;
        spinBtn.textContent = `Spin (${currentBet}€)`;
    }
    
    spinBtn.addEventListener('click', function() {
        if (isSpinning) return;
        if (balance < currentBet) {
            resultDisplay.textContent = "Nicht genug Guthaben!";
            return;
        }
        
        balance -= currentBet;
        balanceDisplay.textContent = balance;
        isSpinning = true;
        resultDisplay.textContent = "";
        
        // Animation starten
        reel1.classList.add('spinning');
        reel2.classList.add('spinning');
        reel3.classList.add('spinning');
        
        // Ergebnisse nach der Animation
        setTimeout(() => {
            reel1.classList.remove('spinning');
            reel2.classList.remove('spinning');
            reel3.classList.remove('spinning');
            
            const result1 = symbols[Math.floor(Math.random() * symbols.length)];
            const result2 = symbols[Math.floor(Math.random() * symbols.length)];
            const result3 = symbols[Math.floor(Math.random() * symbols.length)];
            
            reel1.textContent = result1;
            reel2.textContent = result2;
            reel3.textContent = result3;
            
            checkWin(result1, result2, result3);
            isSpinning = false;
        }, 2000);
    });
    
    function checkWin(s1, s2, s3) {
        if (s1 === '7️⃣' && s2 === '7️⃣' && s3 === '7️⃣') {
            const winAmount = currentBet * 50;
            balance += winAmount;
            resultDisplay.textContent = `JACKPOT! +${winAmount}€`;
        } else if (s1 === s2 && s2 === s3) {
            const winAmount = currentBet * 10;
            balance += winAmount;
            resultDisplay.textContent = `GEWONNEN! +${winAmount}€`;
        } else if (s1 === s2 || s2 === s3 || s1 === s3) {
            const winAmount = currentBet * 2;
            balance += winAmount;
            resultDisplay.textContent = `Kleiner Gewinn! +${winAmount}€`;
        } else {
            resultDisplay.textContent = "Kein Gewinn. Versuch's nochmal!";
        }
        
        balanceDisplay.textContent = balance;
    }
    
    // Initialisierung
    balanceDisplay.textContent = balance;
    updateBetDisplay();
});