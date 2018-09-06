//Modules
var express = require('express');
var ejs = require('ejs');
var cfdex = express();
cfdex.set('view engine', 'ejs');
cfdex.use('/Static', express.static('Public'))
cfdex.use(express.static('Views'));
var fs = require("fs");
var appPort = 80;
var appIP = "172.0.0.1";
var favicon = require('serve-favicon');
var units = require('./Files/units.json');

//favicon
cfdex.use(favicon(__dirname + '/Public/Media/Other/favicon.ico'));

//files

//webpages
cfdex.get('/', function (req, res) {
    res.render('html/home');
});

cfdex.get('/unit', function (req, res) {
    res.render('html/unitList', {
        units: units
    });
})

cfdex.get('/unit/details/:id', function (req, res) {
    var unitResult = getUnitByID(req.params.id);
    if (unitResult.length == 0) //404
        res.render('html/unitList', {
            units: units
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
        unitResult = units
    else if (searchType == 'id')
        unitResult = getUnitByID(searchTerm);
    else if (searchType == 'name')
        unitResult = getUnitByName(searchTerm);

    
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
        unitResult = getUnitByName(req.params.query);
    } else if (req.params.type == "id") {
        unitResult = getUnitByID(req.params.query)[0];
    }

    res.send(unitResult);
});

//Server
var server = cfdex.listen(appPort, appIP, function () {
    var host = server.address().address;
    var port = server.address().port;
	
    console.log("app listening at ", host, port);
})

//Functions
function getUnitByID(id) {
    var unitResult = [];

    for (var i = 0; i < units.length; i++) {
        if (units[i].ID.toString().includes(id)) {
            unitResult.push(units[i]);
        }
    }

    return unitResult;
}

function getUnitByName(name) {
    var unitResult = [];

    for (var i = 0; i < units.length; i++) {
        if (units[i].name.toLowerCase().includes(name.toLowerCase())) {
            unitResult.push(units[i]);
        }
    }
    return unitResult;
}