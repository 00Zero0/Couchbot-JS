const discord = require("discord.js");
const img_manupulater = require("jimp");
const commands = require("./commands");

var Memes = [];

const meme_img_loc = './meme/def/';

function meme(message)
{
    var content = message.content.split(' ');
    content = content[1];
    //
    //If no meme name is given, display list of all possible meme names
    //
    if(content == null || content == undefined)
    {
        var all_memes ='';
        for(i in Memes) {        
            let meme = Memes[i];
            all_memes += '`' + meme.name + '` ';
        }
        if(all_memes == '')
            message.channel.send('No memes available');
        else
        {
            var header = 'Type : `!meme meme-name mention-user` to use memes\nHere are the list of all memes you can use:\n';
            message.channel.send(header + all_memes);
        }
        return;
    }

    var user = message.mentions.users.first(); //Check if they have mentioned users
    if(user==undefined || user==null)
    {
        message.channel.send('User not mentioned, please type: `!meme meme-name mention-user`');
        return;
    }

    //If user is a bot
    if(user.bot)
        return message.channel.send(user + ', is not to be memed, like seriously :joy:');

    var user_img_loc = user.avatarURL;
    //If the user has not set his profile picture, tell me to
    if(user_img_loc==null)
        return message.channel.send(user + ', please set your profile picture to have fun :joy:');

    //
    //If meme name is present and user has mentioned user do the processing
    //
    for (i in Memes) {
        let meme = Memes[i];
        if(content==meme.name)
        {
            sendMeme(meme, user_img_loc, message.channel);
            return;
        }
    }
    message.channel.send('This meme is not present, type: `!meme` to get list of all memes');
}

async function sendMeme(meme, user_img_loc, channel)
{
    let sentMsg = await channel.send('Generating meme please wait...');
    //Set the user's profile picture above the meme image and send the buffer data
    img_manupulater.read(meme_img_loc + meme.name + '.png', function(err, imgB){
        img_manupulater.read(user_img_loc, function(err, imgT){
            if(err) console.log('User Image ::' + err);
            imgT.resize(
                meme.bottom_right[0] - meme.top_left[0],
                meme.bottom_right[1] - meme.top_left[1]);
            imgB.composite(imgT.getBuffer(img_manupulater.MIME_PNG, function(err, data){
                if(err) throw err;
                return data;
            }), meme.top_left[0], meme.top_left[1]);

            imgB.getBuffer(img_manupulater.MIME_PNG, function(err, data){
                if(err) throw err;
                var attachment = new discord.Attachment();
                attachment.setAttachment(data);
                sentMsg.delete(5 * 1000);   //Delete after 5 secs
                channel.send(attachment);
            });
        });
    });
}

function addMeme(mName, mTop_left, mBottom_right)
{
    console.log("\tList of memes that are added::");
    //Check if the name of meme is already present
    Memes.forEach(function(meme) {
        if(meme.name == mName) {
            console.error("\tMeme with name '" + mName + "' already exists");
            return false;
        }
    });

    Memes.push({
        name: mName,
        top_left: mTop_left,
        bottom_right: mBottom_right
    });
    console.log("\tMeme added :'%s'", mName);
    return true;
}


module.exports = {

    load: function()
    {
        //The register the command
        commands.reg('!meme', meme, 2, 'Generates memes and places profile of user mentioned');

        //Add all memes here
        addMeme('hitler', [46, 33], [242, 250], [], []);
        addMeme('cops-calin', [110, 43], [356, 346], [], []);
        addMeme('ben10', [107, 6], [325, 287], [], []);
        addMeme('banhammer', [200, 10], [384, 146], [], []);
        addMeme('kick', [205, 52], [246, 77], [], []);
        addMeme('slap', [244, 102], [333, 249], [], []);
    }

}