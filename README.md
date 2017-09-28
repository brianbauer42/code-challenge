# Code Challenge!


# To launch:
```
git clone https://github.com/brianbauer42/interview-code-challenge.git
cd interview-code-challenge
npm install
npm start
  OR 
node gameLauncher [inputfile]
```
`npm start` generates random input, while `node gameLauncher [inputFile]` allows a user to specify an input file.

# Problem Statement:
We will simulate a game where the goal is to kill the enemies by using a tower.  You need to kill enemies as quickly as possible. 
At each turn, first you fire one time, then each enemy moves to the tower. 
If an enemy reaches the tower, you lose.

## Input:
The first line is firing range. 
Each next line represents an enemy. 
First column, it’s the enemy name. The second column is the initial distance. And the last column is the speed.

## Output:  
A each turn, you will info the killed enemy.  
At the end, you will inform if you win or lose and the count of played turn. 
In case of loss, calculate the minimal firing range to win the game agains same enemies.

## Sample:

#Sample Input 
50m 
BotA 100m 10m
BotB 50m 20m
BotC 30m 20m

# Sample Output
Firing range is 50m
Turn 1: Kill BotC at 30m
Turn 2: Kill BotB at 30m
Turn 6: Kill BotA at 50m
You win in 6 turns

## Tasks
- Write this game to be executed on NodeJs 0.12.14
- You can write unit tests
- NPM available libs are : lodash, winston, chance, should, mocha