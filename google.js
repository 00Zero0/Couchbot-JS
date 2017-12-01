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

function searchweb(message)
{
    content = message.content;
    //Get the search phrase written in between double qoutes
    var re = /"([^])+"/;
    var searchPhrase = content.match(re)?content.match(re)[1]:"";
    if(searchPhrase.length<1)
    {
      message.channel.send('Syntax Incorrect!');
      return;
    }

    var startI = START_SEARCH_INDEX;
    startI = content.match(/-([0-9]?[0-9]?[0-9])/)?content.match(/-([0-9]?[0-9]?[0-9])/)[1]:START_SEARCH_INDEX; //Get the search starting index
    startI = parseInt(startI, 10);
    if(startI<1 || startI>100)
      startI = START_SEARCH_INDEX;

    customsearch.cse.list({ cx: CX, q: searchPhrase, 
                          auth: API_KEY, c2coff: 1,
                          filter: 1, googlehost: "google.com", 
                          hl: "en", start: startI, num: LENGTH_SEARCH
                         }, function (err, resp) {
    if (err) {
      return console.log('An error occured in Google Search', err);
    }

    /**Got Response
      *Creating embed
      */
    let messageTitle = '*Search Results from ' + startI + ' to ' + (startI + LENGTH_SEARCH - 1) + '*';
    let messageEmbed = "";
    let messageFooter = 'Total Results = ' + resp.searchInformation.formattedTotalResults;
    for(var i = 0; i<LENGTH_SEARCH;i++)
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


function searchimage(message)
{
  content = message.content;
  //Get the search phrase written in between double qoutes
  var re = /"([^])+"/;
  var searchPhrase = content.match(re)?content.match(re)[1]:"";
  if(searchPhrase.length<1)
  {
    message.channel.send('Syntax Incorrect!');
    return;
  }

  var startI = START_SEARCH_INDEX;
  startI = content.match(/-([0-9]?[0-9]?[0-9])/)?content.match(/-([0-9]?[0-9]?[0-9])/)[1]:START_SEARCH_INDEX; //Get the search starting index
  startI = parseInt(startI, 10);
  if(startI<1 || startI>100)
    startI = START_SEARCH_INDEX;

  customsearch.cse.list({ cx: CX, q: searchPhrase, 
    auth: API_KEY, c2coff: 1, searchType: 'image',
    filter: 1, googlehost: "google.com", 
    hl: "en", start: startI, num: MAX_IMAGE_NUMBER
   }, function (err, resp) {
      if (err) {
        return console.log('An error occured in Google Search', err);
      }

      /**Got Response
      *Creating message
      */
      let messageDis = "";
      let messageFooter = 'Showing '+ MAX_IMAGE_NUMBER+ ' of ' + resp.searchInformation.formattedTotalResults + ' images.';
      for(var i = 0; i<MAX_IMAGE_NUMBER;i++)
      {
        messageDis +=  resp.items[i].link + '\n';
      }
      s_message = messageDis + messageFooter;
      message.channel.send(s_message);

      });
}


module.exports = {

    load: function()
    {
      commands.reg('!search web', searchweb, 2, 'Google what you want, its ovious');
      commands.reg('!search image', searchimage, 2, 'Google image search');
    }
}
