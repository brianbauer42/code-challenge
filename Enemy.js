module.exports = {
    Enemy: function(name, speed, distanceFromTower) {
        this.name = name;
        this.speed = speed;
        this.distanceFromTower = distanceFromTower;
        this.defeated = false;
        this.defeatedAtDistance = undefined;
    }
};