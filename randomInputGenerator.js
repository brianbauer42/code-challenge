var chance = new (require('chance'))

var generateInput = function() {
    var inputString = '';
    var enemies = [];
    var firingRange = chance.integer({min: 1, max: 300}) + 'm'
    var enemyCount = chance.integer({min: 1, max: 99});
    for (var i = 0; i < enemyCount; ++i) {
        var newEnemy = [
            "Enemy" + i.toString(),
            chance.integer({min: 1, max: 5000}).toString() + 'm',
            chance.integer({min: 1, max: 55 }).toString() + 'm'
        ].join(' ');
        enemies.push(newEnemy);
    }
    inputString = [firingRange, enemies.join('\n')].join('\n');
    return (inputString);
}

console.log(generateInput());

module.exports = generateInput;