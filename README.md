# Couch bot
### Short description - A discord bot used for a discord server *obviously*.
### Current features:
* Level counting: you get a random xp value between 15 and 40, at an interval of 300 seconds, meaning if you spam in that interval it won't matter.
* Block/unblock command to remove verbose from specific channels.
* Block/unblock commands for the xp counting.
* Top and status commands for the level system
* Setting up time for users
* Google web and image search
* Meme generation
* Code compilation and running
# Setup
### Dependencies:
* Node.js
* [Discord js](https://github.com/hydrabolt/discord.js)
* [googleapis](https://github.com/google/google-api-nodejs-client/)
* [Hacker Earth node js](https://github.com/tarungarg546/HackerEarth-node)
* [Jimp](https://github.com/oliver-moran/jimp)
### Files needed:
First of all, you need to create a folder called **config**, and add to it the following files:
A file called "config.json" which contains the following:
```json
{ 
    "bot_token":"wzc02uaFw2SC9u1aMhaJ5RQP.DIqchQ.fir6VJJ4zO1cCNeLnvNMKwW9yCY"
}
```

Next, you'll need to set yourself permission to use the bot's commands like __!block__ or __!unblock__, to do that you simply create a file called "**rights.json**"(*still in the config folder*). Syntax:

```json
{
	"owners":["id1", "id2"],
	"admins":["id3", "id4"]
}
```

Next, you'll need to set the configurations for using google API. Create a file named "**google.json**" still inside the config folder and add following:

```json
{
	"api_key" : "YOUR_GOOGLE_API_KEY",
    "cx" : "YOUR_CX"
}
```

Next, you'll need to set the configuration for Hacker Earth API. Create a file name "**compiler.json**" still inside the config folder and add following:

```json
{
	"secret_key" : "HACKER_EARTH_SECRET_KEY"
}
```

 And at last, create a folder named **data** in the root folder
__Note__: Currently the ***admin*** is not *in use* meaning you should set yourself to be a owner so you'll have the higher permission.

Now, believe it or not, the setup is complete!
### Starting the bot
To start the bot, open a command terminal in the **directory of the main.js file** and simply write ```node main.js```.
