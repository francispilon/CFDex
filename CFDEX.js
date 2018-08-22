//Modules
var express = require('express');
var ejs = require('ejs');
var cfdex = express();
cfdex.set('view engine', 'ejs');
cfdex.use('/Static', express.static('public'))
var fs = require("fs");

//files
var units = [];

//webpages
cfdex.get('/', function(req, res) {
    res.render('html/home');
});

cfdex.get('/unit', function(req, res){
    res.render('html/unitList', {units: units});
})

cfdex.get('/unit/:id', function(req, res){
    var unitResult = getUnitByID(req.params.id);

    if(unitResult.length == 0)//404
        res.render('html/unitList', {units: units});
    else
        res.render('html/unitDetails', {unit: unitResult[0]});
})

cfdex.get('/unit/searchUnit/:searchTerm/:searchCategory/', function(req, res){
    var units = [];
    var searchCategory = req.params.searchCategory;
    var searchTerm = req.params.searchTerm;

    if(searchCategory == 'id')
        units = getUnitByID(searchTerm);
    else if(searchCategory == 'name')
        units = getUnitByName(searchTerm);
    
    console.log(units);
    res.render('partials/unitListFactory', {units: units});
})

//API
cfdex.get('/api/unit', function(req, res){
    res.send(units);
});

cfdex.get('/api/unit/:id', function(req, res){
    var unitResult = getUnitByID(req.params.id);
    if(unitResult == [])//404
        res.status(404).send("Unit with ID ${req.params.ID} was not found");
    else
        res.send(unitResult);
});

cfdex.get('api/unit/:name', function(req, res){
    var unitResult = getUnitByName(req.params.name);
    if(unitResult == [])//404
        res.status(404).send("Unit with name ${req.params.name} was not found");
    else
        res.send(unitResult);
});

//Server
var server = cfdex.listen(80, "127.0.0.1", function(){
    var unitFile = fs.readFileSync("./Files/units.json");
    if(!unitFile)
        console.log("Unable to open unit file")
    else
        units = JSON.parse(unitFile);
    
    var host = server.address().address;
    var port = server.address().port;

    console.log("app listening at ", host, port);
})

//Functions
function getUnitByID(id){
    var unitResult = [];

    for (var i = 0; i < units.length; i++){
        if (units[i].ID.toString().includes(id)){
            unitResult.push(units[i]);
        }
    }

    return unitResult;
}

function getUnitByName(name){
    var unitResult = [];

    for (var i = 0; i < units.length; i++){
        if (units[i].name.toLowerCase().includes(name.toLowerCase())){
            unitResult.push(units[i]);
        }
    }

    return unitResult;
}