describe("PathToPhilosophy", function () {
    var scraper;

    beforeEach(function () {
        pathToPhilosophy = require('../modules/pathToPhilosophy.js');
    });

    it("Should be able to find path from Philosophy of life", function () {
        var url = "http://en.wikipedia.org/wiki/Philosophy_of_life"
        var path = pathToPhilosophy.find(url,function(path){
            console.log("path",path);
            expect(path.length).toEqual(1);
        });
        
    });
});