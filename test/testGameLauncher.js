process.env.NODE_ENV = 'test';

var should = require('should');
var chance = new (require('chance'));
var Enemy = require('./../Enemy.js');

var readInput = require('./../gameLauncher.js').readInput;
var inputIsValid = require('./../gameLauncher.js').inputIsValid;
var readEnemy = require('./../gameLauncher.js').readEnemy;
var getInputStream = require('./../gameLauncher.js').getInputStream;

describe('gameLauncher.js', function() {
    describe('#getInputStream()', function() {
        var inputs = [ null, './sample_input.txt', './nonexistant.js' ];

        it('Should return a ReadStream when no file is provided', function(){
            getInputStream().should.have.ownProperty('readable').equal(true);            
        });

        // Can't find a way within my skill level to stub process.argv except requiring a special purpose library. May have to rewrite the function.

        // // process.argv[2] = './sample_input.txt';            
        // it('Should return a ReadStream when argv >= 3 and argv[2] contains the path to a file', function() {
        //     getInputStream().should.have.ownProperty('readable').equal(true);
        // });

        // // process.argv[2] = './nonexistant.js';
        // it('Should error and exit when an invalid file is provided', function(){
        //     should.not.exist(getInputStream());
        // })
    })

    // readInput() effectively tests the entire game. I need to figure out mocks and stubs and whats-its!
    describe('#readInput()', function(){
        it('Should not accept negative numbers as input in any distance field(Thanks RegEx!)', function() {
            var lineA = "50m\nBotA -100m 10m";
            var lineB = "50m\nBotB 100m -10m";
            var lineC = "-50m\nBotC 100m 10m";
            should.not.exist(readInput(lineA));
            should.not.exist(readInput(lineB));
            should.not.exist(readInput(lineC));            
        });
    })

    describe('#inputIsValid()', function() {
        it('Should return false when no input was read (firingRange === -1)', function() {
            inputIsValid(-1, [new Enemy('dummy', 1, 1)]).should.be.false();
        });

        it('Should return false if no enemies have been parsed', function() {
            inputIsValid(25, []).should.be.false();
        });

        it('Should return false if passed an array of something that is not enemies', function() {
            inputIsValid(25, [1, 2, 3]).should.be.false();
        });
        
        it('Should return true if passed valid input', function() {
            inputIsValid(25, [new Enemy('dummy', 1, 1)]).should.be.true();
        })
    });

    describe('#readEnemy()', function() {
        it('Should return an Enemy object when called with a properly formated line', function() {
            var name = 'BotA';
            var distance = chance.integer({ min: 1, max: 3000 });
            var speed = chance.integer({ min: 1, max: 55 });

            var lineA = name + " " + distance + "m " + speed + "m";
            var lineB = "BotB 100m 10m";
            
            readEnemy(lineA).should.be.an.instanceOf(Enemy);
            readEnemy(lineB).should.be.an.instanceOf(Enemy);
        });

        // This function allows output to be displayed with tests: Why? process.exit()?
        it('Should not accept negative numbers as input in any distance field - Returns nothing', function() {
            var lineA = "BotA -100m 10m";
            var lineB = "BotB 100m -10m";
            should.not.exist(readEnemy(lineA)); // process.exit();
            should.not.exist(readEnemy(lineB)); // process.exit();
        });
    });
});