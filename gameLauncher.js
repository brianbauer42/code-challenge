var fs = require('fs');
var readline = require('readline');
var path = require('path');
var Enemy = require('./Enemy.js');
var Game = require('./Game.js');

var checkInput = function() {
    if (process.argv.length >= 3 && fs.existsSync(path.resolve(process.argv[2]))) {
        return (path.resolve(process.argv[2]));
    } else if (process.argv.length >= 3) {
        console.log("File not found: " + process.argv[2]);   
        process.exit(1);        
    } else {
        return (path.resolve('./sample_input.txt'));        
    }
}

var inputSource = checkInput();
var rl = readline.createInterface({
    input: fs.createReadStream(inputSource)
});
var distanceFormat = new RegExp(/[0-9]+m/);

var readEnemy = function (line) {
    split = line.trim().split(' ');
    if (split.length === 3 && split[1].match(distanceFormat) && split[2].match(distanceFormat)) {
        return (new Enemy(split[0], parseInt(split[1]), parseInt(split[2])));        
    } else {
        console.log("a", split);
        exitFailure();
    }
};

var inputIsValid = function(firingRange, enemies) {
    if (firingRange < 1) {
        console.log("Firing range must be set to a number greater than 0");
        return (false);
    } else if (enemies.length === 0) {
        console.log("Can't play a game without enemies!");
        return (false);
    } else {
        return (true);
    }
};

var exitFailure = function() {
    console.log("Bad input! Exiting!");
    process.exit(1);
}

var readInput = function() {
    var firingRange = -1;
    var enemies = [];
    var linesRead = 0;

    rl.resume();
    rl.on('line', function (line) {
        ++linesRead;
        if (linesRead === 1 && line.match(distanceFormat)) {
            firingRange = parseInt(line);
            console.log(line);
        } else if (linesRead > 1) {
            enemies.push(readEnemy(line));
        } else {
            exitFailure();
        }
    }).on('close', function() {
        if (inputIsValid(firingRange, enemies)) {
            var game = new Game({
                firingRange: firingRange,
                enemies: enemies,
                recursion: true
            });
            game.start();
        } else {
            exitFailure();
        }
    });
}

readInput();

module.exports = {
    readInput: readInput,
    inputIsValid: inputIsValid,
    readEnemy: readEnemy,
    checkInput: checkInput
}