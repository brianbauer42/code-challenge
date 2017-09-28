var should = require('should');
var chance = new (require('chance'))
var winston = require('winston');

var generateInput = require('./../randomInputGenerator.js').generateInput;
var Enemy = require('./../Enemy.js');
var Game = require('./../Game.js');

describe('Game Creation', function(){
    var input = {};
    input.enemies = [];
    input.firingRange = chance.integer({ min: 1, max: 300 });
    input.recursion = true;
    for (var i = 0; i < 5; ++i) {
        input.enemies.push(new Enemy(i.toString(), chance.integer({ min: 1, max: 3000 }), chance.integer({ min: 1, max: 55 })));
    }
    var game = new Game(input);
    
    it('Should be able to construct a Game object', function() {
        game.should.be.an.instanceOf(Game);
    });

    it('Should have a firingRange property and it should be set to: ' + input.firingRange, function(){
        game.should.have.property('firingRange', input.firingRange);
    });

    it('Should have a liveEnemies property', function(){
        game.should.have.ownProperty('liveEnemies');
    });

    it('liveEnemies should be a copy of input.enemies', function(){
        game.liveEnemies.should.containDeep(input.enemies);
    });

    it('Should have an originalEnemiesCopy property', function(){
        game.should.have.ownProperty('originalEnemiesCopy');
    });

    it('originalEnemiesCopy should be a copy of input.enemies', function(){
        game.originalEnemiesCopy.should.containDeep(input.enemies);
    });

    it('Should have a gameStatus property initialized to 1 (ACTIVE enum)', function() {
        game.should.have.ownProperty('gameStatus');
        game.gameStatus.should.equal(1);
    });

    it('Should have a recursion flag initialized to true', function() {
        game.recursion.should.equal(true);
    });

    it('Should have an enemyReachedTower flag initialized to false', function() {
        game.enemyReachedTower.should.equal(false);
    });
});

describe('Game Simulation', function() {
    var logger = new (winston.Logger)({
        transports: []
    });
    var input = {};
    input.enemies = [new Enemy("bot", 100, 101)];
    input.recursion = true;


    it('Should return -1 if an enemy reaches the tower (player loses)', function() {
        input.firingRange = 1;
        var game = new Game(input, logger);
        game.start().should.equal(-1);
    });
    
    it('Should return a positive integer if the player wins (number of turns required to win)', function() {
        input.firingRange = 101;
        var game = new Game(input, logger);
        game.start().should.be.greaterThan(0);
    });
});

describe('Game.js', function() {
    var logger = new (winston.Logger)({
        transports: []
    });
    var input = {};
    input.firingRange = 11;
    input.enemies = [new Enemy("bot1", 8, 1), new Enemy("bot2", 9, 1), new Enemy("bot3", 10, 1)]; // Bot1 will arrive first
    input.recursion = true;

    var input2 = {};
    input2.firingRange = 11;
    input2.enemies = [new Enemy("bot1", 8, 1), new Enemy("bot2", 9, 1), new Enemy("bot3", 10, 2)]; // Bot 3 is moving fastest
    input2.recursion = false;

    var input3 = {};
    input3.firingRange = 11;
    input3.enemies = [new Enemy("bot1", 1, 1), new Enemy("bot2", 1, 1), new Enemy("bot3", 2, 2)]; // All bots reach tower after 1 turn
    input3.recursion = true;
    
    var input4 = {};
    input4.firingRange = 2;
    input4.enemies = [new Enemy("bot1", 1, 1), new Enemy("bot2", 6, 2), new Enemy("bot3", 6, 2)]; // All bots could be stopped with firing range of 4
    input4.recursion = true;

    describe('#findBestTarget()', function() {
        it('Should return the enemy object nearest (by number of turns) to the tower', function() {
            var game = new Game(input, logger);
            game.findBestTarget().name.should.equal('bot1');

            var game2 = new Game(input2, logger);
            game2.findBestTarget().name.should.equal('bot3');
        });
    });

    describe('#checkForWinner()', function() {
        it('Should return 1 when the player wins', function() {
            var input5 = {
                firingRange: 11,
                enemies: [],
                recursion: true
            }
            var game = new Game(input5, logger);
            should(game.checkForWinner()).equal(1);
        });

        it('Should return -1 when the computer wins', function() {
            var game = new Game(input3, logger);
            game.enemyReachedTower = true;
            should(game.checkForWinner()).equal(-1);
        });

        it('Should return 0 when there is not a winner yet', function() {
            var game = new Game(input, logger);
            should(game.checkForWinner()).equal(0);
        });
    });

    describe('#npcTurn()', function() {
        it("Should advance each Enemy toward the tower by the amount of it's speed", function() {
            var logger = new (winston.Logger)({
                transports: []
            });
            var input = {};
            input.firingRange = 11;
            input.enemies = [new Enemy("bot1", 8, 1), new Enemy("bot2", 9, 1), new Enemy("bot3", 10, 1)]; // Bot1 will arrive first
            input.recursion = true;
            var game = new Game(input, logger);

            var movedEnemies = input.enemies.map(function(enemy) {
                enemy.distanceFromTower = enemy.startingDistance - enemy.speed;
                return (enemy);
            })
            
            game.npcTurn();            
            game.liveEnemies.should.containDeep(movedEnemies);
        })
    });

    describe('#playerLoses()', function() {
        it('Should not do anything when (input.recursion === false)', function() {
            // input2.recursion === false;
            var game = new Game(input2, logger);
            should.not.exist(game.playerLoses());
        });

        it('Should return -1 if the game is impossible to win regardless of firing range', function() {
            var game = new Game(input3, logger);
            should(game.playerLoses()).equal(-1);
        });

        it('In case of loss, should return a positive integer representing the number of turns that the game could be won in if firing range were increased', function() {
            var game = new Game(input4, logger);
            should(game.playerLoses()).equal(3);
        });
    });

    describe('#isPossibleToWinGame()', function() {
        it('Should return true when the came could be won with a long enough firing range', function() {
            var game = new Game(input, logger);
            game.isPossibleToWinGame().should.equal(true);
            var game2 = new Game(input2, logger);
            game2.isPossibleToWinGame().should.equal(true);
            var game4 = new Game(input4, logger);
            game4.isPossibleToWinGame().should.equal(true);
        });

        it('Should return false when the enemies arive too quickly to win even with a longer firing range', function() {
            var game3 = new Game(input3, logger);
            game3.isPossibleToWinGame().should.equal(false);
        });
    });
});