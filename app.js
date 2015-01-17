var express = require('express');
var app = express();

var di = {};
di.mongoose = require('mongoose');
di.mongoose.connect('PUT CONNECTION STRING HERE');

di.WikiPageLink = require('./models/WikiPageLink').inject(di);
di.WikiPath = require('./models/WikiPath').inject(di);


app.get('/pathToPhilosophy', function (request, response) {
    var pathToPhilosophy = require('./modules/pathToPhilosophy').inject(di);
    pathToPhilosophy.find(request.query.url, function (data) {
            response.json(data);
            response.end;
    });
});

app.get('/scrape', function (request, response) {
    var scraper = require('./modules/scraper').inject(di);
    scraper.getWikiPageLinks(request.query.url, function (data) {
            response.json(data);
            response.end;
    });
});

app.use(express.static('./public'));
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function () {
    console.log("Get to philosophy app is running at localhost:" + app.get('port'));
});