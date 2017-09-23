module.exports = function(name, distanceFromTower, speed) {
    this.name = name;
    this.speed = speed;
    this.distanceFromTower = distanceFromTower;
    this.defeated = false;
    this.defeatedAtDistance = undefined;
}
