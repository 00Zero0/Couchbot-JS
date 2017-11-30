const discord = require("discord.js");
const fs = require("fs");
const google = require('googleapis');
var customsearch = google.customsearch('v1');

var config = JSON.parse(fs.readFileSync('config/google.json', 'utf-8'));

//Search cnfiguration
const CX = config.cx;
const API_KEY = config.api_key;


module.exports = {

    process: function(message)
    {
        content = message.content;
        //Return if the command is not for search
        //if(content[0].toLowerCase() != '!google') return;

        //Get the search phrase written in between double qoutes
        var re = /"([^']+)"/;
        var searchPhrase = content.match(re);
        customsearch.cse.list({ cx: CX, q: searchPhrase, auth: API_KEY }, function (err, resp) {
        if (err) {
          return console.log('An error occured in Google Search', err);
        }
        // Got the response from custom search
        console.log('Result: ' + resp.searchInformation.formattedTotalResults);
        if (resp.items && resp.items.length > 0) {
          console.log('First result name is ' + resp.items[0].title);
        }
      });
    }
}
