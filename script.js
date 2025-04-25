document.addEventListener('DOMContentLoaded', function() {
    // Modal Logic
    const modal = document.getElementById('slots-modal');
    const slotsTrigger = document.getElementById('slots-trigger');
    const closeModal = document.querySelector('.close-modal');
    
    // Slots Game Logic
    const symbols = ['🍒', '🍋', '🍊', '🍇', '🍉', '💰', '7️⃣', '⭐'];
    const reels = [
        document.getElementById('reel1'),
        document.getElementById('reel2'),
        document.getElementById('reel3'),
        document.getElementById('reel4'),
        document.getElementById('reel5'),
        document.getElementById('reel6')
    ];
    const spinBtn = document.getElementById('spin-btn');
    const balanceDisplay = document.getElementById('balance');
    const resultDisplay = document.getElementById('slots-result');
    const betAmountDisplay = document.getElementById('bet-amount');
    const increaseBetBtn = document.getElementById('increase-bet');
    const decreaseBetBtn = document.getElementById('decrease-bet');
    
    let balance = 1000;
    let currentBet = 10;
    let isSpinning = false;
    
    // Bet Controls
    increaseBetBtn.addEventListener('click', () => {
        if (currentBet < 100) {
            currentBet += 5;
            updateBetDisplay();
        }
    });
    
    decreaseBetBtn.addEventListener('click', () => {
        if (currentBet > 5) {
            currentBet -= 5;
            updateBetDisplay();
        }
    });
    
    function updateBetDisplay() {
        betAmountDisplay.textContent = currentBet;
    }
    
    // Spin Functionality
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
        
        // Spin animation
        const spinDuration = 2000 + Math.random() * 1000;
        const results = [];
        
        reels.forEach((reel, index) => {
            results.push(symbols[Math.floor(Math.random() * symbols.length)]);
            
            // Animation
            let spinInterval = setInterval(() => {
                reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            }, 100);
            
            // Stop animation
            setTimeout(() => {
                clearInterval(spinInterval);
                reel.textContent = results[index];
                
                // Last reel - check win
                if (index === reels.length - 1) {
                    checkWin(results);
                    isSpinning = false;
                }
            }, spinDuration - (index * 200));
        });
    });
    
    // Win Calculation
    function checkWin(results) {
        const symbolCounts = {};
        
        // Count matching symbols
        results.forEach(symbol => {
            symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
        });
        
        let winAmount = 0;
        
        // Check for wins
        Object.entries(symbolCounts).forEach(([symbol, count]) => {
            if (count >= 3) {
                const multiplier = getMultiplier(symbol);
                winAmount += currentBet * multiplier * count;
            }
        });
        
        if (winAmount > 0) {
            balance += winAmount;
            balanceDisplay.textContent = balance;
            resultDisplay.textContent = `Gewonnen: ${winAmount}€!`;
            resultDisplay.style.color = "#4CAF50";
            
            // Highlight winning symbols
            reels.forEach(reel => {
                if (symbolCounts[reel.textContent] >= 3) {
                    reel.classList.add('winning-symbol');
                    setTimeout(() => {
                        reel.classList.remove('winning-symbol');
                    }, 2000);
                }
            });
        } else {
            resultDisplay.textContent = "Kein Gewinn. Versuch's nochmal!";
            resultDisplay.style.color = "#f44336";
        }
    }
    
    function getMultiplier(symbol) {
        const multipliers = {
            '🍒': 1,
            '🍋': 1.5,
            '🍊': 2,
            '🍇': 3,
            '🍉': 4,
            '💰': 5,
            '7️⃣': 10,
            '⭐': 15
        };
        return multipliers[symbol] || 1;
    }
    
    // Modal handling
    slotsTrigger.addEventListener('click', () => {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
});