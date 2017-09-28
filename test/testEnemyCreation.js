process.env.NODE_ENV = 'test';

var should = require('should');
var chance = new (require('chance'))

var Enemy = require('./../Enemy.js');

describe('Enemy Creation', function(){
    var name = 'dummy';
    var distance = chance.integer({ min: 1, max: 3000 });
    var speed = chance.integer({ min: 1, max: 55 });
    var startingTurnsFromTower = Math.ceil(distance / speed);
    var enemy = new Enemy(name, distance, speed);
        
    it('Should be able to construct an Enemy object', function() {
        enemy.should.be.an.instanceOf(Enemy);
    });
    
    it('Should have a name property', function(){
        enemy.should.have.ownProperty('name');
    });

    it('Should have name: ' +  name, function() {
        enemy.name.should.be.exactly(name);
    });
    
    it('Should have a speed property', function(){
        enemy.should.have.ownProperty('speed');
    });
    
    it('Should have speed: ' +  speed, function() {
        enemy.speed.should.be.exactly(speed);
    });
    
    it('Should have a distanceFromTower property', function(){
        enemy.should.have.ownProperty('distanceFromTower');        
    });
    
    it('Should have distanceFromTower: ' +  distance, function() {
        enemy.distanceFromTower.should.be.exactly(distance);
    });
    
    it('Should have a startingDistance property', function(){
        enemy.should.have.ownProperty('startingDistance');        
    });
    
    it('Should have startingDistance: ' +  distance, function() {
        enemy.startingDistance.should.be.exactly(distance);
    });

    it('Should have a startingTurnsFromTower property', function(){
        enemy.should.have.ownProperty('startingTurnsFromTower');        
    });

    it('Should have startingTurnsFromTower: ' + startingTurnsFromTower, function() {
        enemy.startingTurnsFromTower.should.be.exactly(startingTurnsFromTower);
    });
});