var should = require('should');

var readInput = require('./../gameLauncher.js').readInput;
var inputIsValid = require('./../gameLauncher.js').inputIsValid;
var readEnemy = require('./../gameLauncher.js').readEnemy;
var checkInput = require('./../gameLauncher.js').checkInput;
var Enemy = require('./../Enemy.js');
var Game = require('./../Game.js');


describe('readInput', function(){
    describe('#readInput()', function(){
        it('should do something', function() {
            
        });
    })

    describe('#inputIsValid()', function(){
        it('Should return false when firingRange < 1', function(){
            inputIsValid(0, [new Enemy('dummy', 1, 1)]).should 
        });
        it('', function(){
            
        })
        it('', function(){
            
        })
    });

    describe('#readEnemy()', function(){
        
    });

    describe('#checkInput()', function(){
    
    });
});

describe('Enemy Creation', function(){
    describe('', function(){

    })

    describe('', function(){
        
    });

    describe('', function(){
        
    });

    describe('', function(){
    
    });
});

describe('Game Creation', function(){
    describe('', function(){

    })

    describe('', function(){
        
    });

    describe('', function(){
        
    });

    describe('', function(){
    
    });
});

describe('Game Simulation', function() {
    describe('', function(){

    });
    
    describe('', function(){
        
    });

    describe('', function(){
        
    });
});