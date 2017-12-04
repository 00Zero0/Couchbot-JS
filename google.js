const discord = require("discord.js");
const fs = require("fs");
const commands = require("./commands");

const google = require('googleapis');
var customsearch = google.customsearch('v1');

var config = JSON.parse(fs.readFileSync('config/google.json', 'utf-8'));

//Search configuration
const CX = config.cx;
const API_KEY = config.api_key;

const START_SEARCH_INDEX = 1; //Use this if not specified by user, 1 because google API start index is 1
const LENGTH_SEARCH = 10; //Show max 10 results (0-9) by default
const MAX_IMAGE_NUMBER = 2;

//Memes search in google
const Memes = ['Best meme', 'Meme jokes', 'Top memes', 'Meme of the day', 'Memes'];

async function searchweb(message)
{
    content = message.content;
    //Get the search phrase written in between double qoutes
    var re = /"([^]+)"/;
    var searchPhrase = content.match(re)?content.match(re)[1]:"";
    if(searchPhrase.length<1)
    {
      message.channel.send('__Syntax Incorrect! Please type :__!search web "*your search* "');
      return;
    }

    let sentMsg = await message.channel.send('Searching web, please wait......');

    var startI = START_SEARCH_INDEX;
    startI = content.match(/-([0-9]?[0-9]?[0-9])/)?content.match(/-([0-9]?[0-9]?[0-9])/)[1]:START_SEARCH_INDEX; //Get the search starting index
    startI = parseInt(startI, 10);
    if(startI<1 || startI>100)
      startI = START_SEARCH_INDEX;

    customsearch.cse.list({ cx: CX, q: searchPhrase, 
                          auth: API_KEY, c2coff: 1,
                          filter: 1, googlehost: "google.com", 
                          safe: "high",
                          hl: "en", start: startI, num: LENGTH_SEARCH
                         }, function (err, resp) {
    if (err) {
      return console.log('An error occured in Google Search', err);
    }

    /**Got Response
      *Creating embed
      */
    sentMsg.delete(0);
    let messageTitle = '*Here\'s what I found (' + startI + ' to ' + (startI + LENGTH_SEARCH - 1) + ')*';
    let messageEmbed = "";
    let messageFooter = 'Total Results = ' + resp.searchInformation.formattedTotalResults;
    var length = LENGTH_SEARCH>resp.searchInformation.formattedTotalResults?resp.searchInformation.formattedTotalResults:LENGTH_SEARCH;
    if(length<0)
      {
        message.channel.send('No result');
        return;
      }
    for(var i = 0; i<length;i++)
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
    else
      console.log('Google Search : Embed could not be created.');
    });
 
}


async function searchimage(message)
{
  content = message.content;
  //Get the search phrase written in between double qoutes
  var re = /"([^]+)"/;
  var searchPhrase = content.match(re)?content.match(re)[1]:"";
  if(searchPhrase.length<1)
  {
    message.channel.send('__Syntax Incorrect! Please type :__ !search image "*your search* "');
    return;
  }

  let sentMsg = await message.channel.send('Searching images, please wait.......');

  var startI = START_SEARCH_INDEX;
  startI = content.match(/-([0-9]?[0-9]?[0-9])/)?content.match(/-([0-9]?[0-9]?[0-9])/)[1]:START_SEARCH_INDEX; //Get the search starting index
  startI = parseInt(startI, 10);
  if(startI<1 || startI>100)
    startI = START_SEARCH_INDEX;

  customsearch.cse.list({ cx: CX, q: searchPhrase, 
    auth: API_KEY, c2coff: 1, searchType: 'image',
    filter: 1, googlehost: "google.com", 
    safe: "high",
    hl: "en", start: startI, num: MAX_IMAGE_NUMBER
   }, function (err, resp) {
      if (err) {
        return console.log('An error occured in Google Search', err);
      }

      /**Got Response
      *Creating message
      */
      sentMsg.delete(0);
      var length = MAX_IMAGE_NUMBER>resp.searchInformation.formattedTotalResults?resp.searchInformation.formattedTotalResults:MAX_IMAGE_NUMBER;
      if(length<1)
      {
        message.channel.send('No result');
        return;
      }
      message.channel.send('Showing images of "*' + searchPhrase + '*"('+ length + ' of ' + resp.searchInformation.formattedTotalResults + ' images.)');
      for(var i = 0; i<length;i++)
      {
        var embed = new discord.RichEmbed();
        embed.setImage(resp.items[i].link);
        message.channel.send(embed);
      }
      });
}

async function gmeme(message)
{
  var indexUpto = 10;
  content = message.content;
  //Get the search phrase written in between double qoutes
  var re = /"([^]+)"/;
  var searchPhrase = content.match(re)?content.match(re)[1] + ' memes':'';
  if(searchPhrase == '')
    indexUpto = 100;
  if(searchPhrase.length<1)
    searchPhrase = Memes[Math.floor((Math.random() * Memes.length) + 1) % 2];
  
  let sentMsg = await message.channel.send('Generating meme, please wait.......');
  var randomMeme = Math.floor((Math.random() * 50) + 1);

  customsearch.cse.list({ cx: CX, q: searchPhrase, 
    auth: API_KEY, c2coff: 1, searchType: 'image',
    filter: 1, googlehost: "google.com", 
    safe: "medium",
    hl: "en", start: randomMeme, num: 1
   }, function (err, resp) {
      if (err) {
        return console.log('An error occured in Google Search', err);
      }

      /**Got Response
      *Creating message
      */
      sentMsg.delete(0);
      var embed = new discord.RichEmbed();
      embed.setImage(resp.items[0].link);
      message.channel.send(embed);
    });
}


module.exports = {

    load: function()
    {
      commands.reg('!search web', searchweb, 2, 'Google what you want, its ovious');
      commands.reg('!search image', searchimage, 2, 'Google image search');
      commands.reg('!gmeme', gmeme, 2, 'Generate a random meme');
    }
}
