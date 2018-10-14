var Promise = require('promise');
var units = require('./Files/units.json');

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

function reloadDocument(){
    units = require('./Files/units.json');
}


module.exports = {
            units: units,
            getUnitByID: getUnitByID,
            getUnitByName: getUnitByName,
            reload: reloadDocument
};