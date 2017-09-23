var fs = require('fs');
var readline = require('readline');
var path = require('path');
var Enemy = require('./Enemy.js');
var Game = require('./Game.js');

var inputSource = process.argv.length >= 3 ? path.resolve(process.argv[2]) : path.resolve('./sample_input.txt');

var rl = readline.createInterface({
    input: fs.createReadStream(inputSource)
    // ,output: process.stdout
});

var distanceFormat = new RegExp(/[0-9]+m/);

// Returns the primitive value of a string that matches distanceFormat RegExp.
// A string '33m' becomes int 33.
var convertDistToNum = function (line) {
    return (line.substring(0, line.length - 1).valueOf());
};

var readEnemy = function (line) {
    split = line.trim().split(' ');
    if (split.length === 3 && split[1].match(distanceFormat) && split[2].match(distanceFormat)) {
        return (new Enemy(split[0], convertDistToNum(split[1]), convertDistToNum(split[2])));        
    } else {
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
    rl.close();
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
            firingRange = convertDistToNum(line);
        } else if (linesRead > 1) {
            enemies.push(readEnemy(line));
        } else {
            exitFailure();
        }
    }).on('close', function() {
        console.log(enemies);
        if (inputIsValid(firingRange, enemies)) {
            var game = new Game(firingRange, enemies);
            game.start();
        } else {
            exitFailure();
        }
    });
}

readInput();