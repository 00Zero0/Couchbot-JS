const discord = require('discord.js');
const fs = require('fs');
const commands = require("./commands")

var Message = discord.Message;

var FILE = "data/timezone.json";

var userData = [];

var SAVE_INTERVAL = 30 * 60 * 1000;

function saveTimezone() {
    let array = [];
    for(data in userData) {
        array.push({"id": data, "timezone": userData[data]});
    }
    fs.writeFileSync(FILE, JSON.stringify(array));
}

 /**
 * @param {Message} msg
 */
function set(msg) {
    //Check if given time is valid
    var timezone = msg.content.match(/\s(-?)(((0?)([0-9]))|(10|11)):[0-5][0-9]/g);
    if(timezone == null){
        msg.channel.send("Timezone is not valid. Please type `!timezone set hh:mm`");
        return;
    }
    var userID = msg.author.id;

    userData[userID] = timezone;
    msg.channel.send("Timezone set to UTC " + timezone);
}

function get(msg) {
    var words = msg.content.split(" ");
    if (msg.mentions.members.array().length > 0) {
        var user = msg.mentions.members.array()[0];
        var userID = user.id;
        var timezone = userData[userID];
        if(timezone == undefined)
        {
            msg.channel.send("That user did not set his timezone");
            return;
        }
        msg.channel.send("Timezone set to UTC " + timezone);
        return;
    }
    if(words.length < 3) {
        msg.channel.send("Please specify user. Type: `!timezone get mention_user/user_name`");
        return;
    }
    var username = words[2];
    for(let i = 3; i < words.length; i++){
        username += " " + words[i];
    }
    var user = msg.guild.members.find("displayName", username);
    if(!user) {
        user = msg.guild.members.find("nickname", username);
        if(!user) {
            msg.channel.send("That user does not exists!");
            return;
        }
    }
    var userID = user.id;
    var timezone = userData[userID];
    if(!timezone)
    {
        msg.channel.send("The user did not set his timezone");    
    }
    msg.channel.send("Timezone set to UTC " + timezone);
}

function servertime(msg) {
    let date = new Date();
    msg.channel.send(user.displayName + "'s local time is " + date.getHours() + ":" + (date.getMinutes() < 10 ? "0": "") + minutes);
}

module.exports = {

    getData: function(id) {
        return userData[id];
    },

    load: function() {
        // Register commands
        commands.reg("!timezone set", set, 2, "Sets your timezone location (UTC)");
        commands.reg("!timezone get", get, 2, "Gets the timezone of the user, if user has specified it");
        commands.reg("!servertime", servertime, 2, "Gets the current time of day for the specified user");

        if(fs.existsSync(FILE)) {
            let array = JSON.parse(fs.readFileSync(FILE));
            for(let arrayElement in array) {
                let user = array[arrayElement]["id"];
                let timezone = array[arrayElement]["timezone"];
                userData[user] = timezone;
            }
        }
        setInterval(saveTimezone, SAVE_INTERVAL);
    },

    save: function() {
        saveTimezone();
    }
}