var Enemy = function(name, distanceFromTower, speed) {
    this.name = name;
    this.speed = speed;
    this.distanceFromTower = distanceFromTower;
    this.startingDistance = distanceFromTower;
    this.startingTurnsFromTower = Math.ceil(distanceFromTower / speed);
}

module.exports = Enemy;