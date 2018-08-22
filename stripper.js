const fetch = require('node-fetch');
const cheerio = require('cheerio');
const url = 'https://cf-wiki.herokuapp.com/unit/'
const RANGEMIN = 1866
const RANGEMAX = 1876
var ajaxToGo = RANGEMAX - RANGEMIN;
var jsonResult = [];

function openURL(id) {
  return fetch(url + id).then(response => response.text()).catch(function() {});
}

for (var i = RANGEMIN; i <= RANGEMAX; ++i) {

  openURL(i).then(body => {
    --ajaxToGo
    const $ = cheerio.load(body);
    var unitText = "";

    $('.card').each(function(j, e) {
      const $e = $(e);

      if (!$e.text().includes('Login'))
        unitText += $e.text().replace(/\s+/g, ' ').trim() + "\n";
    });

    if (!unitText.includes("Level 0 Stats HP ATK REC")) {
    
      var name = unitText.substr(0, unitText.indexOf(" ⭐"));
      var color = ""
      var cost = ""
      var rarity = unitText.match(new RegExp("⭐", "g")).length
      var types = unitText.substr(unitText.lastIndexOf("⭐") + 2, unitText.indexOf("Type") + 2 - unitText.lastIndexOf("⭐"))
      var tribe = unitText.substr(unitText.indexOf("Type") + 5, unitText.search(/\n/) - unitText.indexOf("Type ") - 5)

      unitText = unitText.substr(unitText.search(/\n/) + 1, unitText.length);
      var minHP = unitText.substr(unitText.indexOf("HP") + 3, unitText.indexOf("ATK") - unitText.indexOf("HP") - 4)
      var minATK = unitText.substr(unitText.indexOf("ATK") + 4, unitText.indexOf("REC") - unitText.indexOf("ATK") - 5)
      var minREC = unitText.substr(unitText.indexOf("REC") + 4, unitText.search(/\n/) - unitText.indexOf("REC") - 4)

      unitText = unitText.substr(unitText.search(/\n/) + 1, unitText.length + 1);
      var maxLevel = unitText.substr(6, 2);
      var maxHP = unitText.substr(unitText.indexOf("HP") + 3, unitText.indexOf("ATK") - unitText.indexOf("HP") - 4)
      var maxATK = unitText.substr(unitText.indexOf("ATK") + 4, unitText.indexOf("REC") - unitText.indexOf("ATK") - 5)
      var maxREC = unitText.substr(unitText.indexOf("REC") + 4, unitText.search(/\n/) - unitText.indexOf("REC") - 4)

      unitText = unitText.substr(unitText.search(/\n/) + 1, unitText.length + 1);
      var skillDesc = unitText.substr(0, unitText.indexOf("Skill:") - 1);
      var skillName = unitText.substr(unitText.indexOf("Skill:") + 7, unitText.search(/\n/) - unitText.indexOf("Skill:") - 7);

      unitText = unitText.substr(unitText.search(/\n/) + 1, unitText.length + 1);
      var cskillDesc = unitText.substr(0, unitText.indexOf("Crash Skill:") - 1)
      var cskillName = unitText.substr(unitText.indexOf("Skill:") + 7, unitText.search(/\n/) - unitText.indexOf("Skill:") - 7)
      var abilityOneName = ""
      var abilityOneDesc = ""
      var abilityTwoName = ""
      var abilityTwoDesc = ""
      var abilityThreeName = ""
      var abilityThreeDesc = ""
      var abilityFourName = ""
      var abilityFourDesc = ""
      var abilityOneBugUnlock = ""
      var abilityTwoBugUnlock = ""
      var abilityThreeBugUnlock = ""
      var abilityFourBugUnlock = ""
            
      unitText = unitText.substr(unitText.search(/\n/) + 1, unitText.length + 1);
      if (unitText.includes("Ability 1")) {
        abilityOneName = unitText.substr(9, unitText.indexOf("Bug:") - 10)
        abilityOneBugUnlock = unitText.substr(unitText.indexOf("Bug:") + 4, unitText.indexOf(" ", unitText.indexOf("Bug:")) - unitText.indexOf("Bug:") - 4)
        abilityOneDesc = unitText.substr(unitText.indexOf(" ", unitText.indexOf("Bug:")) + 1, unitText.search(/\n/) - 1 - unitText.indexOf(" ", unitText.indexOf("Bug:")));

        unitText = unitText.substr(unitText.search(/\n/) + 1, unitText.length + 1);
      }

      if (unitText.includes("Ability 2")) {
        abilityTwoName = unitText.substr(9, unitText.indexOf("Bug:") - 10)
        abilityTwoBugUnlock = unitText.substr(unitText.indexOf("Bug:") + 4, unitText.indexOf(" ", unitText.indexOf("Bug:")) - unitText.indexOf("Bug:") - 4)
        abilityTwoDesc = unitText.substr(unitText.indexOf(" ", unitText.indexOf("Bug:")) + 1, unitText.search(/\n/) - 1 - unitText.indexOf(" ", unitText.indexOf("Bug:")));

        unitText = unitText.substr(unitText.search(/\n/) + 1, unitText.length + 1);
      }

      if (unitText.includes("Ability 3")) {
        abilityThreeName = unitText.substr(9, unitText.indexOf("Bug:") - 10)
        abilityThreeBugUnlock = unitText.substr(unitText.indexOf("Bug:") + 4, unitText.indexOf(" ", unitText.indexOf("Bug:")) - unitText.indexOf("Bug:") - 4)
        abilityThreeDesc = unitText.substr(unitText.indexOf(" ", unitText.indexOf("Bug:")) + 1, unitText.search(/\n/) - 1 - unitText.indexOf(" ", unitText.indexOf("Bug:")));

        unitText = unitText.substr(unitText.search(/\n/) + 1, unitText.length + 1);
      }

      if (unitText.includes("Ability 4")) {
        abilityFourName = unitText.substr(9, unitText.indexOf("Bug:") - 10)
        abilityFourBugUnlock = unitText.substr(unitText.indexOf("Bug:") + 4, unitText.indexOf(" ", unitText.indexOf("Bug:")) - unitText.indexOf("Bug:") - 4)
        abilityFourDesc = unitText.substr(unitText.indexOf(" ", unitText.indexOf("Bug:")) + 1, unitText.search(/\n/) - 1 - unitText.indexOf(" ", unitText.indexOf("Bug:")));
      }

      jsonResult.push({
        "ID": "",
        "name": name,
        "color": color,
        "cost": cost,
        "rarity": rarity,
        "type": types,
        "tribe": tribe,
        "howToObtain": "",
        "minHP": minHP,
        "minATK": minATK,
        "minREC": minREC,
        "maxHP": maxHP,
        "maxATK": maxATK,
        "maxREC": maxREC,
        "maxLevel": maxLevel,
        "skillName": skillName,
        "skillDesc": skillDesc,
        "cskillName": cskillName,
        "cskillDesc": cskillDesc,
        "abilityOneName": abilityOneName,
        "abilityOneDesc": abilityOneDesc,
        "abilityTwoName": abilityTwoName,
        "abilityTwoDesc": abilityTwoDesc,
        "abilityThreeName": abilityThreeName,
        "abilityThreeDesc": abilityThreeDesc,
        "abilityFourName": abilityFourName,
        "abilityFourDesc": abilityFourDesc,
        "abilityOneBugUnlock": abilityOneBugUnlock,
        "abilityTwoBugUnlock": abilityTwoBugUnlock,
        "abilityThreeBugUnlock": abilityThreeBugUnlock,
        "abilityFourBugUnlock": abilityFourBugUnlock
        });

    }
    if (ajaxToGo < 0) {
      finishAjax();
    }
  })
}

function finishAjax() {
  console.log(JSON.stringify(jsonResult));
}