//Modules
var express = require('express');
var ejs = require('ejs');
var cfdex = express();
var fs = require("fs");
var favicon = require('serve-favicon');
var CFDEXSearch = require("./CFDEXSearch");

//Favicon
cfdex.use(favicon(__dirname + '/Public/Media/Other/favicon.ico'));

//Options
var appPort = 80;
var appIP = "127.0.0.1";
cfdex.set('view engine', 'ejs');
cfdex.use('/Static', express.static('Public'));
cfdex.use(express.static('Views'));

//Routing
cfdex.get('/', function (req, res) {
    res.render('html/home');
});

cfdex.get('/unit', function (req, res) {
    console.log(CFDEXSearch.units)
    res.render('html/unitList', {
        units: CFDEXSearch.units
    });
})

cfdex.get('/unit/details/:id', function (req, res) {
    var unitResult = CFDEXSearch.getUnitByID(req.params.id);
    if (unitResult.length == 0) //404
        res.render('html/unitList', {
            units: CFDEXSearch.units
        });
    else
        res.render('html/unitDetails', {
            unit: unitResult[0]
        });
})

cfdex.get('/unit/searchUnit', function (req, res) {
    var unitResult = [];
    var searchType = req.query.searchType;
    var searchTerm = req.query.searchTerm;
    console.log(searchType + searchTerm)
    if(searchType === "" || searchTerm === "" )
        unitResult = CFDEXSearch.units
    else if (searchType == 'id')
        unitResult = CFDEXSearch.getUnitByID(searchTerm);
    else if (searchType == 'name')
        unitResult = CFDEXSearch.getUnitByName(searchTerm);

    
    res.render('partials/unitListFactory', {
        units: unitResult
    });
})

//API
cfdex.get('/api/unit', function (req, res) {
    res.send(units);
});

cfdex.get('/api/unit/:type/:query', function (req, res) {
    var unitResult = [];
    if (req.params.type == "name") {
        unitResult = CFDEXSearch.getUnitByName(req.params.query);
    } else if (req.params.type == "id") {
        unitResult = CFDEXSearch.getUnitByID(req.params.query)[0];
    }

    res.send(unitResult);
});

//Server
var server = cfdex.listen(appPort, appIP, function () {
    var host = server.address().address;
    var port = server.address().port;
	
    console.log("app listening at ", host, port);
})
