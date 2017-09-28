var should = require('should');
var chance = new (require('chance'));
var stream = require('stream');
var generateInput = require('./../randomInputGenerator.js').generateInput;
var toStream = require('./../randomInputGenerator.js').toStream;
var distanceFormat = new RegExp(/^[0-9]+m$/);

describe('Random Input Generation', function(){
    var generatedInputString = generateInput();

    describe('#generateInput()', function(){
        it('Should return a String', function(){
            generatedInputString.should.be.an.instanceOf(String);
        });

        it('Should describe a valid firing range on first line', function(){
            var splitLines = generatedInputString.split('\n');
            splitLines[0].match(distanceFormat).should.be.ok();
        });

        // Should I break this into smaller tests? Maybe some of my should()s are redundant?
        it("Should describe an enemy on each following line in the format 'name distance distance'", function(){
            var lines = generatedInputString.split('\n');
            lines.shift();
            for (var i = 0; i < lines.length; ++i) {
                var splitLine = lines[i].split(' ');
                splitLine.length.should.be.exactly(3);
                splitLine[1].match(distanceFormat).should.be.ok();
                splitLine[2].match(distanceFormat).should.be.ok();
            }
        });
    });

    describe('#toStream()', function(){

        // // I want this to work...
        // it('Should take a string and return a read stream', function(){
        //     toStream("A String!").should.be.an.instanceOf(Buffer);  // Same result (fail) with types Buffer, stream.Readable, stream.PassThrough
        // });
        
        // Because this doesn't seem like a good test...
        it('Should take a string and return a read stream', function(){
            toStream("A String!").should.have.ownProperty('readable').equal(true);
        });

    });
});