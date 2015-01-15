var express = require('express');
var app = express();

var pathToPhilosophy = require('./modules/pathToPhilosophy');

app.get('/philosophy', function(request, response){
    pathToPhilosophy(request.query.url, function(data){
        response.json(data);
        response.end;
    });
});

app.listen(3000);