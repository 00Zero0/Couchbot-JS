const discord = require('discord.js');
const cmd = require('./commands');
const rights = require("./utils/rights");
const localtime = require('./timezone');
const fs = require('fs');

const FILE = './data/reminder.json';
const SAVE_INTERVAL = 1 * 60 * 1000;
const CHECK_INTERVAL = 30 * 1000; //Check every 30 secs for reminding
const MAX_TITLE_LEN = 15;
const MAX_DESC_LEN = 100;

var data = [];

function saveReminder()
{
    fs.writeFileSync(FILE, JSON.stringify(data));
}

function add(id, title, reminder, date, time)
{
    data.push({
        "id" : id,
        "title" : title,
        "msg" : reminder,
        "date" : date,
        "time" : time
    });
}

function del(id, title)
{
    for(i in data)
    {
        var any = data[i];
        if(any.id == id && any.title == title){
            data.splice(i, 1);
            return true;
        }
    }
    return false;
}

function showAll(id, message, isChannel)
{
    let msg = '';

    data.forEach(function (any){
        if(any.id == id)
            msg += '\n ' + any.title + ' for ' + any.date + ' ' + any.time;
    });

    if(isChannel)
    {
        (msg=='')?(msg='There are no reminders set'):(msg+='\nThese are all the channel reminders');
        message.channel.send(msg);
    }
    else
    {
        (msg=='')?(msg='You have no reminders set'):(msg+='\nThese are all your reminders');
        message.reply(msg);
    }
}

function parseCmd(message)
{
    //If the user does not have timezone set return immediately
    let userTime = localtime.getData(message.author.id);
    if(userTime == null || userTime == undefined){
        message.reply('Please set your timezone to set reminders');
        return;
    }

    content = message.content.split(' ');
    
    //If incorrect form, give user the syntax
    if(content.length < 2){
        errMsg(message.channel);
        return;
    }

    let userId = message.author.id;

    switch(content[1])
    {
        case 'add':
        {
        //Check for date
        var date = message.content.match(/\s(((10|11|12)|([1-9]))-([0-3][0-9]))/g);
        let dateData = new Date();
        if(date == null)
        {
            date = (dateData.getMonth()+1) + '-' + dateData.getDate();
        }
        else
        {
            date = date[0];
            date = date.trim();
        }

        //If the date is from past
        var mths_int = parseInt(date.slice(0, 2));
        if(mths_int < (dateData.getMonth() + 1))
        {
            message.reply('You live in the past? :joy: ');
            return;
        }
        
        //Check for time
        var time = message.content.match(/\s((((0?)([0-9]))|(1[0-9])|(2[0-3])):[0-5][0-9])/g);
        if(time == null) { errMsg(message.channel); return; }
        time = time[0];
        time = time.trim();

        //Get title and message
        var title = message.content.match(/\s\[[^]+,/g);
        if(title == null) { errMsg(message.channel); return; }
        title = title[0];
        title = title.replace(' [', '');
        title = title.replace(',', '');
        //If the title is longer than MAX_TITLE_LEN letters, return
        if(title.length > MAX_TITLE_LEN) {
            message.channel.send('Title too long, type ' + MAX_TITLE_LEN + ' letters or less');
            return;
        }
        var reminder = message.content.match(/,[^]+\]/g);
        if(reminder == null) { errMsg(message.channel); return; } 
        reminder = reminder[0];
        reminder = reminder.replace(',', '');
        reminder = reminder.replace(']', '');
        reminder = reminder.trim();
        //If the description is longer than MAX_DESC_LEN letter, return
        if(reminder.length > MAX_DESC_LEN){
            message.channel.send('Discription too long, type ' + MAX_DESC_LEN + ' letters or less');
            return;
        }

        //If the reminder have save title by same user, return
        data.forEach(function (any){
            if(any.id == userId && any.title == title){
                channel.reply('The reminder with same title has already been set, please use different title');
                return;
            }
        });

        add(userId, title, reminder, date, time);
        message.reply('Your reminder for ' + date + ', ' + time + ' with title : "' + title + '" has been set');
        } break;

        case 'channel':
        {
        //Check for date
        var date = message.content.match(/\s(((10|11|12)|([1-9]))-([0-3][0-9]))/g);
        let dateData = new Date();
        if(date == null)
        {
            date = (dateData.getMonth()+1) + '-' + dateData.getDate();
        }
        else
        {
            date = date[0];
            date = date.trim();
        }

        //If the date is from past
        var mths_int = parseInt(date.slice(0, 2));
        if(mths_int < (dateData.getMonth() + 1))
        {
            message.reply('You live in the past? :joy: ');
            return;
        }
        
        //Check for time
        var time = message.content.match(/\s((((0?)([0-9]))|(1[0-9])|(2[0-3])):[0-5][0-9])/g);
        if(time == null) { errMsg(message.channel); return; }
        time = time[0];
        time = time.trim();

        //Get title and message
        var title = message.content.match(/\s\[[^]+,/g);
        if(title == null) { errMsg(message.channel); return; }
        title = title[0];
        title = title.replace(' [', '');
        title = title.replace(',', '');
        //If the title is longer than MAX_TITLE_LEN letters, return
        if(title.length > MAX_TITLE_LEN) {
            message.channel.send('Title too long, type ' + MAX_TITLE_LEN + ' letters or less');
            return;
        }
        var reminder = message.content.match(/,[^]+\]/g);
        if(reminder == null) { errMsg(message.channel); return; } 
        reminder = reminder[0];
        reminder = reminder.replace(',', '');
        reminder = reminder.replace(']', '');
        reminder = reminder.trim();
        //If the description is longer than MAX_DESC_LEN letter, return
        if(reminder.length > MAX_DESC_LEN){
            message.channel.send('Discription too long, type ' + MAX_DESC_LEN + ' letters or less');
            return;
        }

        //If the reminder have save title by in same channel, return
        data.forEach(function (any){
            if(any.id == message.channel && any.title == title){
                channel.reply('The reminder with same title has already been set, please use different title');
                return;
            }
        });

        add(message.channel, title, reminder, date, time);
        message.channel.send('Your reminder for ' + date + ', ' + time + ' with title : "' + title + '" has been set');
        } break;

        case 'del':
        {
            var title = message.content.match(/\s\[[^,]+\]/g);
            if(title == null) { errMsg(message.channel); return; }
            title = title[0];
            title = title.replace(' [', '');
            title = title.replace(']', '');
            //If the title is longer than MAX_TITLE_LEN letters, return
            if(title.length > MAX_TITLE_LEN) {
            message.channel.send('Title too long, type ' + MAX_TITLE_LEN + ' letters or less');
            return;
            }

            if(del(userId, title))
                message.reply('Your reminder with title : "' + title + '" has been deleted');
            else if(rights.hasRights(message.author)<2)
            {
                if(del(message.channel, title))
                    message.channel.send('The reminder with title : "' + title + '" has been deleted');
                else
                    message.reply('Your reminder with title : "' + title + '" has not been added yet :joy: ');    
            }
            else
                message.reply('Your reminder with title : "' + title + '" has not been added yet :joy: ');
        } break;

        case 'all':
        {
            showAll(message.author.id, message, false);
        } break;

        case 'all-channel':
        {
            showAll(message.channel, message, true);
        } break;

        default: errMsg(message.channel); return;
    }
}

function chkReminder(bot)
{
    let dateData = new Date();
    var today_date, today_time;
    var userTime, hours, minutes;
    let isChannel = false;
    
    data.forEach(function(any){
        //Get the user and their data
        var user = bot.users.find('id', any.id);
        if(user==null || user==undefined)
        {
            user = bot.channels.find('id', any.id);
            //Today's date
            today_date = (dateData.getMonth()+1) + '-' + dateData.getDate();
            //Today's time
            minutes  = dateData.getMinutes();
            hours = dateData.getHours();
            today_time = hours + ":" + (minutes<10? '0': '') + minutes;
            isChannel = true;
        }
        else{
            userTime = localtime.getData(user.id);
            //Today's date
            today_date = (dateData.getMonth()+1) + '-' + dateData.getDate();
            //Today's time for the user
            userTime = (userTime.toString()).split(':');
            date = new Date;
            hours = parseInt(userTime[0], 10);
            minutes = date.getUTCMinutes() + parseInt(userTime[1], 10);
            while(minutes >= 60) {
                hours += 1;
                minutes -= 60;
            }
            hours = date.getUTCHours() + hours;
            while(hours >= 24) {
                hours -= 24;
            }
            today_time = hours + ":" + (minutes<10? '0': '') + minutes;
            isChannel = false;
        }
    
       //Check if the time is up
       if(any.date == today_date && any.time == today_time){
           let mentionE = '';
           if(isChannel) mentionE = '@everyone';
           user.send(mentionE + '```REMINDER::\n'+
                    'Title : ' + any.title + '\n' + 
                    'Description : ' + any.msg + ' ```');
            del(any.id, any.title);
            return;
       }
    });
}

function errMsg(channel)
{
    channel.send('Syntax Error.' + 
    'To add reminder for you please type \n ```!reminder add [m]m-dd hh:mm [title, description]```' +
    'To add reminder for channel please type \n ```!reminder channel [m]m-dd hh:mm [title, description]```' + 
    'you can omit the `[m]m-dd` to set reminder for this day' +
    '\n To remove reminder please type \n ```!reminder del [title]``` ' + 
    '\n To see all your reminders, type \n ```!reminder all\nOR\n!reminder all-channel``` ');
}

module.exports = {

    load: function(bot)
    {
        cmd.reg('!reminder', parseCmd, 2, 'Add or Delete reminder');

        if(fs.existsSync(FILE))
        {
            let array = JSON.parse(fs.readFileSync(FILE));
            for(i in array)
                data.push(array[i]);
        }
        setInterval(saveReminder, SAVE_INTERVAL);
        setInterval(chkReminder, CHECK_INTERVAL, bot);
    },

    save: function()
    {
        saveReminder();
    }
}