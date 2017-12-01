const discord = require("discord.js");
const fs = require("fs");
const commands = require("./commands");

const google = require('googleapis');
var customsearch = google.customsearch('v1');


var config = JSON.parse(fs.readFileSync('config/google.json', 'utf-8'));

//Search configuration
const CX = config.cx;
const API_KEY = config.api_key;

const START_SEARCH_INDEX = 0; //Use this if not specified by user
const LENGTH_SEARCH = 10; //Show max 10 results (0-9) by default

function search(message)
{
    content = message.content;
    //Get the search phrase written in between double qoutes
    var re = /"([^']+)"/;
    var searchPhrase = content.match(re)[1];
    var start = START_SEARCH_INDEX;
    var length = LENGTH_SEARCH;
    //TO DO :: Get the number of results wanted (start index, length)
    /*var start = content.match(/<([^']+)-/)[1] - 1;
    var length = content.match(/-([^']+)>/)[1];
    console.log('Start = ' + start);
    console.log('Length = ' + length);*/
    customsearch.cse.list({ cx: CX, q: searchPhrase, auth: API_KEY }, function (err, resp) {
    if (err) {
      return console.log('An error occured in Google Search', err);
    }
    /**
     * Got the response from custom search
     */
    //If invalid points are given reset them
    if(start<0 || !start)
      start = START_SEARCH_INDEX;
    if(!length || length==0)
      length = LENGTH_SEARCH>resp.searchInformation.formattedTotalResults?resp.searchInformation.formattedTotalResults:LENGTH_SEARCH;

    //Creating embed
    let messageTitle = '*Search Results from ' + start + ' to ' + (start + length) + '*';
    let messageEmbed = "";
    let messageFooter = '* Total Results = ' + resp.searchInformation.formattedTotalResults + ' *';
    for(var i = start; i<length;i++)
      {
        messageEmbed +=  '**' + resp.items[i].title + '** :: ' + resp.items[i].link + '\n';
      }
    let embed = new discord.RichEmbed();
    embed.setAuthor('Google', 'https://developers.google.com/identity/images/g-logo.png');
    embed.setColor([128, 0, 128]);
    embed.setTitle(messageTitle);
    embed.setDescription(messageEmbed);
    embed.setFooter(messageFooter);

    if(embed)
      message.channel.send(embed);
    });
}


module.exports = {

    load: function()
    {
      commands.reg('!google', search, 2, 'Google what you want, its ovious');
    }
}
