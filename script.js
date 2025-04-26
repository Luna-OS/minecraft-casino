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
    
    let balance = 100;
    let isSpinning = false;
    
    spinBtn.addEventListener('click', function() {
        if (isSpinning) return;
        if (balance < 10) {
            resultDisplay.textContent = "Nicht genug Guthaben!";
            return;
        }
        
        balance -= 10;
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
            balance += 500;
            resultDisplay.textContent = "JACKPOT! +500€";
        } else if (s1 === s2 && s2 === s3) {
            balance += 100;
            resultDisplay.textContent = "GEWONNEN! +100€";
        } else if (s1 === s2 || s2 === s3 || s1 === s3) {
            balance += 20;
            resultDisplay.textContent = "Kleiner Gewinn! +20€";
        } else {
            resultDisplay.textContent = "Kein Gewinn. Versuch's nochmal!";
        }
        
        balanceDisplay.textContent = balance;
    }
});