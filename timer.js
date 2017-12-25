const discord = require('discord.js');
const fs = require('fs');
const commands = require('./commands');
const localtime = require('./timezone');

let data = [];

const CHECK_INTERVAL = 30 * 1000; //Check every 30 secs for timer

function settimer(message)
{
    if(localtime.getData(message.author.id == null) || localtime.getData(message.author.id == undefined))
        message.reply('Please set your timezone to use timer!');

    let contents = message.content.split(' ');

    switch(contents.length)
    {
        case 1:
            return displaytimeleft(message);
        case 2:
        {
            let minutes = parseInt(contents[1]);
            if(minutes==NaN || minutes<1){
                message.channel.send('Incorrect time, please type time in minutes!');
                return;
            }
            if(minutes>(10*60)) return message.reply('Sorry you can\'t set timer for more than 600 minutes');
            addtimer(message.author.id, minutes);
            return message.reply('Your timer for ' + minutes + ' minutes has been set!');
        }
        default:
            message.channel.send('Syntax Error! Please type `' + commands.getPrefix() + 'timer ` to see your time left OR\n`' +
                            commands.getPrefix() + 'timer "time-in-minutes` " to set timer');
    }
}

function displaytimeleft(message)
{
    let setTime = '';
    data.forEach(function(any){
        if(message.author.id == any.id)
            setTime = any.time;
    });
    //If time is not set return
    if(setTime=='') return message.reply('You don\'t have any timer set, please type `' + commands.getPrefix() + 'timer "time-in-minutes" ` to set timer');
    
    let userTime = localtime.getlocaltime(message.author.id).split(":");
    let timerTime = setTime.split(':');
    let minutesLeft = parseInt(timerTime[1]) - parseInt(userTime[1]);
    let userHr = parseInt(userTime[0]);
    let timerHr = parseInt(userTime[0]);

    while (userHr<timerHr) {
        minutesLeft+=60; timerHr--;
    }

    message.reply(minutesLeft + ' minutes left!');
}

function addtimer(id, minutes)
{
    let userTime = localtime.getlocaltime(id).split(':');
    var min = minutes + parseInt(userTime[1]);
    var hr = parseInt(userTime[0]);
    while (min>59) {
        min-=60; hr++;
    }
    data.push({
      "id": id,
      "time": hr + ":" + (min < 10 ? "0" : "") + min
    });
}

function chkTimer(bot)
{
    data.forEach(function(any) {
      //Get the user and their data
      user = bot.users.find("id", any.id);
      if (user == null || user == undefined) return console.log('Timer:: Can\'t find user!');
        
      //Get user local time
      userTime = localtime.getlocaltime(user.id);

      //Check if the time is up
      if (any.time == userTime) {
        user.send("```Your time is up! ```");
        remove(any.id);
        return;
      }
    });
}

function remove(id) {
  for (i in data) {
    var any = data[i];
    if (any.id == id) {
      data.splice(i, 1);
      return true;
    }
  }
  return false;
}

module.exports = {
    load: function(bot){
        commands.reg('timer', settimer, 2, 'Set timer');

        setInterval(chkTimer, CHECK_INTERVAL, bot);
    }
}