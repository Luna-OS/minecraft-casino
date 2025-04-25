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
    let currentBet = 50;
    let isSpinning = false;
    let spinIntervals = [];

    // Bet Controls
    increaseBetBtn.addEventListener('click', () => {
        if (currentBet < 500) {
            currentBet += 50;
            updateBetDisplay();
        }
    });
    
    decreaseBetBtn.addEventListener('click', () => {
        if (currentBet > 50) {
            currentBet -= 50;
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
            resultDisplay.style.color = "#f44336";
            return;
        }
        
        balance -= currentBet;
        balanceDisplay.textContent = balance;
        isSpinning = true;
        resultDisplay.textContent = "";
        resultDisplay.style.color = "#ffcc00";
        
        // Clear any previous intervals
        spinIntervals.forEach(interval => clearInterval(interval));
        spinIntervals = [];
        
        // Start spinning animation for each reel
        reels.forEach((reel, index) => {
            const symbolsContainer = reel.querySelector('.symbols-container');
            const spinDuration = 2000 + (index * 300); // Staggered stopping
            
            // Create temporary symbols for animation
            symbolsContainer.innerHTML = '';
            for (let i = 0; i < 20; i++) {
                const symbol = document.createElement('div');
                symbol.className = 'symbol';
                symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                symbolsContainer.appendChild(symbol);
            }
            
            // Start animation
            let position = 0;
            const speed = 5;
            
            const interval = setInterval(() => {
                position += speed;
                symbolsContainer.style.transform = `translateY(-${position}px)`;
                
                // Add more symbols if we're running out
                if (position > symbolsContainer.children.length * 80 / 3) {
                    const symbol = document.createElement('div');
                    symbol.className = 'symbol';
                    symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                    symbolsContainer.appendChild(symbol);
                }
            }, 16);
            
            spinIntervals.push(interval);
            
            // Stop this reel after its duration
            setTimeout(() => {
                clearInterval(interval);
                stopReel(reel, index);
            }, spinDuration);
        });
        
        // Final check after all reels stop
        setTimeout(() => {
            isSpinning = false;
        }, 3000);
    });
    
    function stopReel(reel, reelIndex) {
        const symbolsContainer = reel.querySelector('.symbols-container');
        const result = symbols[Math.floor(Math.random() * symbols.length)];
        
        // Create final display with result symbol centered
        symbolsContainer.innerHTML = `
            <div class="symbol">${symbols[Math.floor(Math.random() * symbols.length)]}</div>
            <div class="symbol">${symbols[Math.floor(Math.random() * symbols.length)]}</div>
            <div class="symbol winning">${result}</div>
            <div class="symbol">${symbols[Math.floor(Math.random() * symbols.length)]}</div>
            <div class="symbol">${symbols[Math.floor(Math.random() * symbols.length)]}</div>
        `;
        
        symbolsContainer.style.transform = 'translateY(-160px)';
        
        // If this is the last reel, check for wins
        if (reelIndex === reels.length - 1) {
            setTimeout(() => {
                checkWin();
            }, 500);
        }
    }
    
    function checkWin() {
        const results = reels.map(reel => {
            return reel.querySelector('.winning').textContent;
        });
        
        const symbolCounts = {};
        results.forEach(symbol => {
            symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
        });
        
        let winAmount = 0;
        let winningSymbols = [];
        
        Object.entries(symbolCounts).forEach(([symbol, count]) => {
            if (count >= 3) {
                const multiplier = getMultiplier(symbol);
                winAmount += currentBet * multiplier * count;
                winningSymbols.push(symbol);
            }
        });
        
        if (winAmount > 0) {
            balance += winAmount;
            balanceDisplay.textContent = balance;
            resultDisplay.textContent = `GEWONNEN! +${winAmount}€`;
            resultDisplay.style.color = "#4CAF50";
            
            // Highlight winning symbols
            reels.forEach(reel => {
                const winningSymbol = reel.querySelector('.winning');
                if (winningSymbols.includes(winningSymbol.textContent)) {
                    winningSymbol.classList.add('winning-animation');
                    setTimeout(() => {
                        winningSymbol.classList.remove('winning-animation');
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
            '🍋': 2,
            '🍊': 3,
            '🍇': 5,
            '🍉': 8,
            '💰': 10,
            '7️⃣': 15,
            '⭐': 20
        };
        return multipliers[symbol] || 1;
    }
});