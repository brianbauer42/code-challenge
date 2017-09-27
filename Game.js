var gameStatusEnum = Object.freeze({ ENDED: 0, ACTIVE: 1 });

var Game = function (input) {
    this.recursion = input.recursion;
    this.firingRange = input.firingRange;
    this.liveEnemies = JSON.parse(JSON.stringify(input.enemies));     // Ugly, but creates a deep copy of an array without methods.
    this.defeatedEnemies = [];
    this.turnCount = 0;
    this.gameStatus = gameStatusEnum.ACTIVE;
    this.enemyReachedTower = false;
    this.originalEnemiesCopy = JSON.parse(JSON.stringify(input.enemies));

    this.findBestTarget= function() {
        var bestTarget = this.liveEnemies[0];
        this.liveEnemies.map(function(enemy) {
            enemy.turnsFromTower = enemy.distanceFromTower / enemy.speed;
            if (enemy.turnsFromTower < bestTarget.turnsFromTower) {
                bestTarget = enemy;
            }
        });
        return (bestTarget);
    };

    this.reportKill = function (enemy) {
        console.log("Turn " + this.turnCount + ": Kill " + enemy.name + " at " + enemy.distanceFromTower + "m");
    };

    this.playerTurn = function() {
        var bestTarget = this.findBestTarget();
        if (bestTarget.distanceFromTower <= this.firingRange) {
            this.defeatedEnemies.push(bestTarget);                                
            var index = this.liveEnemies.indexOf(bestTarget);
            this.liveEnemies.splice(index, 1);
            this.reportKill(bestTarget);
        }
    };

    this.npcTurn = function() {
        for (var i = 0; i < this.liveEnemies.length; ++i) {
            this.liveEnemies[i].distanceFromTower -= this.liveEnemies[i].speed;
            if (this.liveEnemies[i].distanceFromTower <= 0) {
                this.enemyReachedTower = true;
                break ;
            }
        };
    };

    this.checkForWinner = function() {
        if (this.liveEnemies.length === 0) {
            this.gameStatus = gameStatusEnum.ENDED;
            this.playerWins();
        } else if (this.enemyReachedTower === true) {
            this.gameStatus = gameStatusEnum.ENDED;
            this.playerLoses();
        }
    };

    this.playerWins = function() {
        console.log("You win in " + this.turnCount + " turns");
        return (this.turnCount);
    };

    // Simulates the enemies advancing without a tire firing and for each simulated turn, updates the 
    // average number of enemies that must be destroyed each turn. If this average is above 1, the game
    // could not possibly have been won with this enemy set.
    this.isPossibleToWinGame = function() {
        var sortedEnemies = this.originalEnemiesCopy.sort(function (a, b) {
            return (a.startingTurnsFromTower - b.startingTurnsFromTower);
        });

        var avgEnemiesPerTurn = 0;
        var enemiesAtTower = 0;
        var simTurnCount = 0
        while (sortedEnemies.length > 0) {            
            while (sortedEnemies.length > 0 && sortedEnemies[0].startingTurnsFromTower === simTurnCount) {
                sortedEnemies.shift();
                ++enemiesAtTower;
            }
            avgEnemiesPerTurn = enemiesAtTower / simTurnCount;            
            if (avgEnemiesPerTurn > 1) {
                // Game is impossible to win, Would have to fire more than once per turn!
                return (false);
            }
            ++simTurnCount
        }
        // avgEnemiesPerTurn never rose above 1, meaning the game could be won with a long enough firing range.
        return (true);
    };

    this.playerLoses = function() {
        if (this.recursion === false) {
            return ;
        }
        console.log("Computer wins in " + this.turnCount + " turns");
        if (!this.isPossibleToWinGame()) {
            console.log("Player could not have won regardless of firing range");            
        } else {
            var suppressedConsoleLog = console.log;        
            console.log = function() {};                // Disable console.log

            var reqRange = input.firingRange;
            var turnsToWin = -1;
            while (turnsToWin === -1) {
                var newGameSim = new Game({
                    firingRange: ++reqRange, 
                    enemies: input.enemies,
                    recursion: false
                });
                turnsToWin = newGameSim.start();
            }

            console.log = suppressedConsoleLog;         // Enable console.log
            console.log("You could have won in " + turnsToWin + " turns with firing range of " + reqRange);
        }
    };

    this.gameLoop = function() {
        while (this.gameStatus === gameStatusEnum.ACTIVE) {
            ++this.turnCount;
            this.playerTurn();
            this.npcTurn();
            this.checkForWinner();
        }
    };

    // If player loses, return -1, else return number of turns taken to win.
    // This return value is important to playerLoses() when calculating the minimum range required to win.
    this.start = function() {
        console.log("Firing range is " + this.firingRange + "m");
        this.gameLoop();
        if (this.enemyReachedTower) {
            return (-1);
        } else {
            return (this.turnCount)            
        }
    };
}

module.exports = Game;