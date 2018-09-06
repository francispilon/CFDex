const Discordie = require('discordie')
const http = require("http");
const https = require("https");
const prefix = "p!"

const Events = Discordie.Events;

var client = new Discordie({
  autoReconnect: true
});

client.connect({
  token: 'NDgxODk5NDk0NzQxMzc3MDI0.Dl9DiQ.lhcKIcJhrr4FP2nnHDiWBq8LMi0'
});

client.Dispatcher.on("GATEWAY_READY", e => {
  console.log("Connected as: " + client.User.username);
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
  try {
    var message = e.message.content;
    if (message.includes("[[") && message.includes("]]")) {
      var ID = message.substr(message.indexOf("[[") + 2, message.indexOf("]]") - message.indexOf("[[") - 2);
      searchByID(e, ID);
    } else if (message.includes("{{") && message.includes("}}")) {
      var name = message.substr(message.indexOf("{{") + 2, message.indexOf("}}") - message.indexOf("{{") - 2);
      searchByName(e, name);
    } else
    if (message.startsWith(prefix + "roll")) {
      var rollTries = 10;
      if (message != prefix + "roll")
        rollTries = message.replace(prefix + "roll ", "");

      console.log(rollTries)
      if (isNaN(rollTries)) {
        e.message.channel.sendMessage("Please type p!roll [#] to use this command.")
      } else if (rollTries > 10 || rollTries < 1) {
        e.message.channel.sendMessage("I can only roll 1 to 10 times at a time.")
      } else {

        var rollResult = ""
        for (var i = 0; i < rollTries; ++i) {
          var randomEgg = Math.random() * 100 + 1

          if (randomEgg > 83)
            rollResult += "<:rainbowegg:333960173431291906>"
          else
            rollResult += "<:goldenegg:333960172676579339>"

          if (i == 4)
            rollResult += "\n"
        }

        e.message.channel.sendMessage(rollResult)
      }
    }
  } catch (e) {
    console.log(e);
  }
});


function searchByID(e, ID) {
  //TODO: Search for unit with ID
  requestUnit(e, 'http://www.cfdex.xyz/api/unit/id/', ID, "id", sendUnitReply)
}

function searchByName(e, name) {
  //TODO: Search for units with names
  requestUnit(e, 'http://www.cfdex.xyz/api/unit/name/', name, "name", sendUnitListReply);
}

function requestUnit(e, url, query, searchType, callback) {
  http.get(url + query, (res) => {
    const {
      statusCode
    } = res;
    const contentType = res.headers['content-type'];

    let error;
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
        `Status Code: ${statusCode}`);
	    sendErrorReply(e, statusCode, "Could not find unit with " + searchType + " like \'" + query + "\'");
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error('Invalid content-type.\n' +
        `Expected application/json but received ${contentType}`);
    }
    if (error) {
      console.error(error.message);
      // consume response data to free up memory
      res.resume();
      return;
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => {
      rawData += chunk;
    });
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        callback(e, parsedData, query, searchType);
      } catch (e) {
        console.error(e.message);
        return;
      }
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
    return;
  });
}



function sendUnitReply(e, unit) {
  var stars = "";
  for (var i = 0; i < unit.rarity; ++i) {
    stars += ':star:';
  }

  var color = 0x000000;
  switch (unit.color.toLowerCase()) {
    case "blue":
      color = 0x0000FF;
      break;
    case "red":
      color = 0xFF0000;
      break;
    case "green":
      color = 0x00FF00;
      break;
    case "yellow":
      color = 0xFFFF00;
      break;
  }
  var fields = [{
    "name": "Level 1 stats",
    "value": "HP: " + unit.minHP + "\n" +
      "ATK: " + unit.minATK + "\n" +
      "REC: " + unit.minREC + "\n",
    "inline": true
  }, {
    "name": "Level " + unit.maxLevel + " stats",
    "value": "HP: " + unit.maxHP + "\n" +
      "ATK: " + unit.maxATK + "\n" +
      "REC: " + unit.maxREC + "\n",
    "inline": true
  }, {
    "name": "Skill: " + unit.skillName,
    "value": unit.skillDesc
  }, {
    "name": "CSkill: " + unit.cskillName,
    "value": unit.cskillDesc
  }];

  if (unit.abilityOneName !== "") {
    var bugAbilityUnlock = unit.abilityOneBugUnlock !== "" ? unit.abilityOneBugUnlock : 1
    fields.push({
      "name": "Ability 1: " + unit.abilityOneName + " - Bug: " + bugAbilityUnlock,
      "value": unit.abilityOneDesc
    });
  }

  if (unit.abilityTwoName !== "") {
    var bugAbilityUnlock = unit.abilityTwoBugUnlock !== "" ? unit.abilityTwoBugUnlock : 1
    fields.push({
      "name": "Ability 2: " + unit.abilityTwoName + " - Bug: " + bugAbilityUnlock,
      "value": unit.abilityTwoDesc
    });
  }

  if (unit.abilityThreeName !== "") {
    var bugAbilityUnlock = unit.abilityThreeBugUnlock !== "" ? unit.abilityThreeBugUnlock : 1
    fields.push({
      "name": "Ability 3: " + unit.abilityThreeName + " - Bug: " + bugAbilityUnlock,
      "value": unit.abilityThreeDesc
    });
  }

  if (unit.abilityFourName !== "") {
    var bugAbilityUnlock = unit.abilityFourBugUnlock !== "" ? unit.abilityFourBugUnlock : 1
    fields.push({
      "name": "Ability 4: " + unit.abilityFourName + " - Bug: " + bugAbilityUnlock,
      "value": unit.abilityFourDesc
    });
  }

  e.message.channel.sendMessage("", false, {
    "color": color,
    "author": {
      name: "Unit ID: " + unit.ID,
      icon_url: "http://cfdex.xyz/Static/Media/Units/UnitThumb" + unit.ID + ".png"
    },
    "title": unit.name,
    "timestamp": new Date(),
    "description": stars,
    "url": "http://cfdex.xyz/unit/" + unit.ID,
    "image": {
      "url": "http://cfdex.xyz/Static/Media/Units/Unit" + unit.ID + ".png"
    },
    "fields": fields,
    "footer": {
      icon_url: client.User.avatarURL,
      text: "The database isn't complete. Sorry if I got it wrong."
    }
  });
}

function sendUnitListReply(e, units, query, searchType) {
  if (units.length == 1) {
    sendUnitReply(e, units[0])
  } else if (units.length > 1) {
    var unitListing = ""
    for (var i = 0; i < 8 && i < units.length; ++i) {
      unitListing += "`[" + units[i].ID + "]` " + units[i].name + "\n";
    }
    if (units.length > 8) {
      unitListing += "and " + (units.length - 8) + " more units were found."
    }
    e.message.channel.sendMessage(unitListing)
  } else {
    sendErrorReply(e, 404, "Could not find unit with " + searchType + " like \'" + query + "\'");
  }
}

function sendErrorReply(e, err, message) {
  e.message.channel.sendMessage(err + ": " + message);
}