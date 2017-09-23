var ACTIVE = 1;
var ENDED = 0;

module.exports =  function (firingRange, enemies) {
    this.firingRange = firingRange;
    this.liveEnemies = enemies;
    this.defeatedEnemies = [];  // This is totally pointless but why not memorialize them here?
    this.turnCount = 0;
    this.gameStatus = ACTIVE;
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
            this.gameStatus = ENDED;
            this.playerWins();
        } else if (this.enemyReachedTower === true) {
            this.gameStatus = ENDED;
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
        while (this.gameStatus === ACTIVE) {
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
