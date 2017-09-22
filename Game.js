var active = 1;
var ended = 0;

module.exports = {
    Game: function (firingRange, enemies) {
        this.firingRange = firingRange;
        this.liveEnemies = enemies;
        this.defeatedEnemies = [];  // This is totally pointless but why not memorialize them here?
        this.turnCount = 0;
        this.gameStatus = active;
        this.enemyReachedTower = false;

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

        this.reportKill= function (enemy) {
            console.log("Turn " + this.turnCount + ": Kill " + enemy.name + "at " + enemy.distanceFromTower + "m");
        };

        this.playerTurn = function() {
            var bestTarget = this.findBestTarget();
            this.defeatedEnemies.push(bestTarget);                                
            var index = this.liveEnemies.indexOf(bestTarget);
            this.liveEnemies.splice(index, 1);
            this.reportKill(bestTarget);
        };

        this.npcTurn = function() {
            for (var i = 0; i < liveEnemies.length; ++i) {
                liveEnemies[i].distanceFromTower -= liveEnemies[i].speed;
                if (liveEnemies[i].distanceFromTower <= 0) {
                    this.enemyReachedTower = true;
                    break ;
                }
            };
        };

        this.checkForWinner = function() {
            if (this.liveEnemies.length === 0) {
                this.gameStatus = ended;
                this.playerWins();
            } else if (this.enemyReachedTower === true) {
                this.gameStatus = ended;
                this.playerLoses();
            }
        };

        this.playerWins = function() {
            console.log("You win in " + this.turnCount + " turns");
        };

        this.playerLoses = function() {
            console.log("Computer wins in " + this.turnCount + " turns");            
        };

        this.gameLoop = function() {
            while (this.gameStatus === active) {
                ++this.turnCount;                
                this.playerTurn();
                this.npcTurn();
                this.checkForWinner();
            }
            process.exit(0);
        };

        this.start = function() {
            console.log("Firing range is " + firingRange + "m");
            this.gameLoop();
        };
    }
}