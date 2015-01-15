var express = require('express');
var app = express();

var pathToPhilosophy = require('./modules/pathToPhilosophy');

app.get('/philosophy', function(request, response){

});

app.listen(3000);