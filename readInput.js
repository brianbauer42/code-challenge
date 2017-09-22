var readline = require('readline');
var fs = require('fs');
var Enemy = require('./Enemy.js').Enemy;

var distanceFormat = new RegExp(/[0-9]+m/);

// Returns the primitive value of a string that matches distanceFormat RegExp.
// A string '33m' becomes int 33.
var convertDistToNum = function (line) {
    return (line.substring(0, str.length - 1).valueOf());
};

var readEnemy = function (line) {
    split = line.trim.split(' ');
    if (split.length === 3 && split[1].match(distanceFormat) && split[2].match(distanceFormat)) {
        return (new Enemy(split[0], convertDistToNum(split[1]), convertDistToNum(split[2])));        
    } else {
        this.errorAndExit();
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

module.exports = {
    readInput: function() {
        var firingRange = -1;
        var enemies = [];
        var linesRead = 0;

        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        var errorAndExit = function() {
            rl.close();
            console.log("Bad input! Exiting!");
            process.exit(1);
        }

        rl.on('line', function (line) {
            if (linesRead === 0 && line.match(distanceFormat)) {
                firingRange = convertDistToNum(line);
            } else if (linesRead > 0 && lineDescribesEnemy(line)) {
                enemies.push(readEnemy(line));
            } else {
                errorAndExit();
            }
        });

        rl.close();

        if (inputIsValid(firingRange, enemies)) {
            return ({
                firingRange: firingRange,
                enemies: enemies
            });
        } else {
            errorAndExit();
        }
    }
};