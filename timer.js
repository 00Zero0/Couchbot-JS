const discord = require('discord.js');
const fs = require('fs');
const commands = require('./commands');

let data = [];

function settimer(message)
{
    let contents = message.content.split(' ');

    switch(contents.length())
    {
        case 1:
            return displaytimeleft(message);
        case 3:
        {
            if(contents[1]=='set')
            {
                let minutes = parseInt(contents[2]);
                if(minutes==NaN || minutes<1){
                    message.channel.send('Incorrect time, please type time in minutes!');
                    return;
                }
                addtimer(message.author.id, minutes);
                return message.reply('Your timer for ' + minutes + ' has been set!');
            }
        }
        default:
            message.channel.send('Syntax Error! Please type `' + commands.getPrefix() + 'timer ` to see your time left OR\n`' +
                            commands.getPrefix() + 'timer "time-in-minutes` " to set timer');
    }
}

function displaytimeleft(message)
{

}

function addtimer(id, minutes)
{
    
}

module.exports = {
    load: function(){
        commands.reg('timer', settimer, 2, 'Set timer');
    }
}