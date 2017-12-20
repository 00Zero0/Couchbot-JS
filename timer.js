const discord = require('discord.js');
const fs = require('fs');
const commands = require('./commands');

let data = [];




module.exports = {
    load: function(){
        commands.reg('timer', settimer, 2, 'Set timer');
    }
}