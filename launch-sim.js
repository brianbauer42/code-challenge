var game = require('./Game.js').game;
var readInput = require('./readInput.js').readInput;

var input = readInput();

game = new Game(input.firingRange, input.enemies);
game.start();