<?php

class LotterySimulator {
    private $totalTickets = 3343700;
    private $prizeStructure = [
        ['name' => 'Hauptgewinn', 'count' => 1, 'amount' => 1500000],
        ['name' => 'Gute Gewinne', 'count' => 2, 'amount' => 500000],
        ['name' => 'Mittlere Gewinne', 'count' => 3, 'amount' => 100000],
        ['name' => 'Niedrige Gewinne', 'count' => 4, 'amount' => 25000],
        ['name' => 'Sehr niedrige Gewinne', 'count' => 5, 'amount' => 1866]
    ];
    private $winners = [];
    private $companyProfit = 334370; // 10% of total

    public function __construct() {
        $this->simulate();
    }

    private function generateUUID() {
        return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }

    private function simulate() {
        $allWinningTickets = [];
        
        foreach ($this->prizeStructure as $prize) {
            for ($i = 0; $i < $prize['count']; $i++) {
                $uuid = $this->generateUUID();
                $allWinningTickets[] = $uuid;
                $this->winners[] = [
                    'ticket_id' => $uuid,
                    'prize' => $prize['name'],
                    'amount' => number_format($prize['amount'], 0, ',', '.') . ' €'
                ];
            }
        }
        
        // Verify we have exactly 15 winners
        if (count($allWinningTickets) !== 15) {
            throw new Exception('Invalid winner count generated');
        }
    }

    public function getResults() {
        $totalPayout = array_reduce($this->prizeStructure, function($carry, $item) {
            return $carry + ($item['amount'] * $item['count']);
        }, 0);
        
        return [
            'total_tickets' => number_format($this->totalTickets, 0, ',', '.'),
            'company_profit' => number_format($this->companyProfit, 0, ',', '.') . ' €',
            'total_payout' => number_format($totalPayout, 0, ',', '.') . ' €',
            'winners' => $this->winners,
            'winning_chance' => (15 / $this->totalTickets * 100) . ' %'
        ];
    }
}

// Run the simulation
$simulator = new LotterySimulator();
$results = $simulator->getResults();

// Display results
echo "<h1>Lottery Simulation Results</h1>";
echo "<p><strong>Total Tickets Sold:</strong> {$results['total_tickets']}</p>";
echo "<p><strong>Company Profit (10%):</strong> {$results['company_profit']}</p>";
echo "<p><strong>Total Prize Payout:</strong> {$results['total_payout']}</p>";
echo "<p><strong>Winning Chance:</strong> {$results['winning_chance']}</p>";

echo "<h2>Winning Tickets</h2>";
echo "<table border='1' cellpadding='8'>";
echo "<tr><th>Ticket UUID</th><th>Prize Category</th><th>Amount</th></tr>";
foreach ($results['winners'] as $winner) {
    echo "<tr>
            <td>{$winner['ticket_id']}</td>
            <td>{$winner['prize']}</td>
            <td style='text-align:right'>{$winner['amount']}</td>
          </tr>";
}
echo "</table>";
?>