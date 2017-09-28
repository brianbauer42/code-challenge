var fs = require('fs');
var readline = require('readline');
var path = require('path');
var winston = require('winston');
var Enemy = require('./Enemy.js');
var Game = require('./Game.js');
var generateInput = require('./randomInputGenerator.js').generateInput;
var toStream = require('./randomInputGenerator.js').toStream;
var distanceFormat = new RegExp(/^[0-9]+m$/);
var logger;

if (process.env.NODE_ENV !== 'test') {
    logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({
                formatter: function(options) {
                    return (options.message ? options.message : '');
                }
            })
        ]
    })
} else {
    // Silence logger when running unit tests
    logger = new (winston.Logger)({
        transports: []
    });
}

// If a 3rd argument is included, this function will attempt to open it and return a read stream.
// If the file cannot be opened or doesn't exist, the process reports error and exits.
// If no 3rd argument is specified, input will be randomly generated and a read stream returned.
var getInputStream = function() {
    if (process.argv.length >= 3 && fs.existsSync(path.resolve(process.argv[2]))) {
        return (fs.createReadStream(path.resolve(process.argv[2])));
    } else if (process.argv.length >= 3) {
        logger.info("File not found: " + path.resolve(process.argv[2]));   
        process.exit(0);
    } else {
        return (toStream(generateInput()));        
    }
}

var inputStream = getInputStream();
var rl = readline.createInterface({
    input: inputStream
});

var readEnemy = function (line) {
    split = line.trim().split(' ');
    if (split.length === 3 && split[1].match(distanceFormat) && split[2].match(distanceFormat)) {
        return (new Enemy(split[0], parseInt(split[1]), parseInt(split[2])));        
    } else {
        exitFailure();
    }
};

var inputIsValid = function(firingRange, enemies) {
    if (firingRange === -1) {
        logger.info("Input file appears to be empty");
        return (false);
    } else if (enemies.length === 0 || !(enemies[0] instanceof(Enemy))) {
        logger.info("Can't play a game without enemies!");
        return (false);
    } else {
        return (true);
    }
};

var exitFailure = function() {
    logger.info("Bad input! Exiting.");
    logger.info("Check for negative numbers or improper formatting.");
    logger.info("Good formatting example: \n\n11m\nBotA 10m 9m\nBotB 34m 10m");
    process.exit(0);
}

var readInput = function() {
    var firingRange = -1;
    var enemies = [];
    var linesRead = 0;

    rl.on('line', function (line) {
        ++linesRead;
        if (linesRead === 1 && line.match(distanceFormat)) {
            firingRange = parseInt(line);
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
            }, logger);
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
    getInputStream: getInputStream
}