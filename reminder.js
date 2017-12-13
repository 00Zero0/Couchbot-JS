const discord = require('discord.js');
const cmd = require('./commands');
const localtime = require('./timezone');
const fs = require('fs');

const FILE = './data/reminder.json';
const SAVE_INTERVAL = 1 * 60 * 1000;
const CHECK_INTERVAL = 1 * 60 * 1000; //There is not minute offset, so checking every sec/less has no meaning
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
            data = data.splice(i, 1);
            return;
        }
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
    if(content.length() < 3){
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
        if(date == null)
        {
            let dateData = new Date();
            date = dateData.getMonth() + '-' + dateData.getDate();
        }
        else
            date = date[1];
        
        //Check for time
        var time = message.content.match(/\s((((0?)([0-9]))|(10|11)):[0-5][0-9])/g);
        if(time == null) { errMsg(message.channel); return; }
        time = time[1];

        //Get title and message
        var title = message.content.match(/\s\[([^]+),/g);
        if(title == null) { errMsg(message.channel); return; }
        title = title[1];
        //If the title is longer than MAX_TITLE_LEN letters, return
        if(title.length() > MAX_TITLE_LEN) {
            message.channel.send('Title too long, type ' + MAX_TITLE_LEN + ' letters or less');
            return;
        }
        var reminder = message.content.match(/,([^]+)\]/g);
        if(reminder == null) { errMsg(message.channel); return; } 
        reminder = reminder[1];
        //If the description is longer than MAX_DESC_LEN letter, return
        if(reminder.length() > MAX_DESC_LEN){
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
        message.reply('Your reminder for ' + date + ', ' + time + 'with title : "' + title + '" has been set')
        } break;

        case 'del':
        {
            var title = message.content.match(/\s\[([^,]+)\]/g);
            if(title == null) { errMsg(message.channel); return; }
            title = title[1];
            //If the title is longer than MAX_TITLE_LEN letters, return
            if(title.length() > MAX_TITLE_LEN) {
            message.channel.send('Title too long, type ' + MAX_TITLE_LEN + ' letters or less');
            return;
            }

            del(userId, title);
            message.reply('Your reminder with title : "' + title + '" has been deleted');
        }

        default: errMsg(message.channel); return;
    }
}

function chkReminder()
{
    let dateData = new Date();
    //Today's date
    let today_date = dateData.getMonth() + '-' + dateData.getDate();
    //Today's time
    let minutes  = dateData.getMinutes();
    let hours = dateData.getHours();
    let today_time = hours + ":" + (minutes<10? '0': '') + minutes;

    data.forEach(function(any){
       if(any.date == today_date && any.time == today_time){
           let user = discord.users.find('id', any.id);
           user.send('`REMINDER::`'+
                    '``` Title : ' + any.title + '\n' + 
                    'Description : ' + any.msg + ' ```');
            del(any.id, any.title);
            return;
       }
    });
}

function errMsg(channel)
{
    channel.send('Syntax Error.' + 
    'To add reminder please type \n ```!reminder add mm-dd hh:mm [title, description]```' + 
    ', you can omit the `mm-dd` to set reminder for this day' +
    '\n To remove reminder please type \n ```!reminder del [title]``` ');
}

module.exports = {

    load: function()
    {
        cmd.reg('!reminder', parseCmd, 2, 'Add or Delete reminder');

        if(fs.existsSync(FILE))
        {
            let array = JSON.parse(fs.readFileSync(FILE));
            for(i in array)
                data.push(array[i]);
        }
        setInterval(saveReminder, SAVE_INTERVAL);
        setInterval(chkReminder, CHECK_INTERVAL);
    },

    save: function()
    {
        saveReminder();
    }
}