const discord = require("discord.js");
const Jimp = require("jimp");
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
            var header = 'Type : ` ' + commands.getPrefix() + 'meme meme-name mention-user` to use memes\nHere are the list of all memes you can use:\n';
            message.channel.send(header + all_memes);
        }
        return;
    }

    var users = message.mentions.users //Check if they have mentioned users
    if(users.first()==undefined || users.first()==null)
    {
        message.channel.send('User not mentioned, please type: ` ' + commands.getPrefix() + 'meme meme-name mention-user[s]`');
        return;
    }

    //
    //If meme name is present and user has mentioned user do the processing
    //
    for (i in Memes) {
        let meme = Memes[i];
        if(content==meme.name)
        {
            sendMeme(meme, users, message);
            return;
        }
    }
    message.channel.send('This meme is not present, type: ` ' + commands.getPrefix() + 'meme` to get list of all memes');
}

async function sendMeme(meme, users, message)
{
    //Send the message to user to tell the meme is processing
    let sentMsg = await message.channel.send('Generating meme please wait...');
    var userMemed = users.first();
    //Set the user's profile picture above the meme image
    Jimp.read(meme_img_loc + meme.name + '.png', function(err, imgBase){
        Jimp.read(userMemed.displayAvatarURL, function(err, profile1){
            if(err) console.log('User Image ::' + err);
            profile1.resize(
                meme.bottom_right[0] - meme.top_left[0],
                meme.bottom_right[1] - meme.top_left[1]);
            imgBase.composite(profile1.getBuffer(Jimp.MIME_PNG, function(err, data){
                if(err) throw err;
                return data;
            }), meme.top_left[0], meme.top_left[1]);
        
        //If position for second user is specified, add second user to the base image and send meme
        if(meme.sec_tl && meme.sec_br)
        {
            //If second user is not mentioned then add the author as second user
            var userSec = users.last();
            if(userSec == userMemed)
                userSec = message.author;

            //Place second user's profile above the base meme image
            Jimp.read(userSec.displayAvatarURL, function(err, profile2){
                if(err) console.log('User Image ::' + err);
                profile2.resize(
                    meme.sec_br[0] - meme.sec_tl[0],
                    meme.sec_br[1] - meme.sec_tl[1]);
                imgBase.composite(profile2.getBuffer(Jimp.MIME_PNG, function(err, data){
                    if(err) throw err;
                    return data;
                }), meme.sec_tl[0], meme.sec_tl[1]);

            //Send the buffer data back
            imgBase.getBuffer(Jimp.MIME_PNG, function(err, data){
                if(err) throw err;
                var attachment = new discord.Attachment();
                attachment.setAttachment(data);
                message.channel.send(attachment);
            });
            });
        }
        else
        {
            //Send buffer data back without adding second user
            imgBase.getBuffer(Jimp.MIME_PNG, function(err, data){
                if(err) throw err;
                var attachment = new discord.Attachment();
                attachment.setAttachment(data);
                message.channel.send(attachment);
            });
        }
        });
    });
    sentMsg.delete(15 * 1000);   //Delete after 15 secs
}

function addMeme(mName, mTop_left, mBottom_right, mSec_tl, mSec_br)
{
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
        bottom_right: mBottom_right,
        sec_tl : mSec_tl,
        sec_br : mSec_br
    });
    console.log("\tMeme added :'%s'", mName);
    
    return true;
}


module.exports = {

    load: function()
    {
        //The register the command
        commands.reg('meme', meme, 2, 'Generates memes and places profile of user mentioned');

        //Add all memes here
        addMeme('hitler', [46, 33], [242, 250] );
        addMeme('cops-calin', [110, 43], [356, 346] );
        addMeme('ben10', [107, 6], [325, 287] );
        addMeme('banhammer', [200, 10], [384, 146] );
        addMeme('kick', [208, 51],  [237, 79], [66, 10], [98, 51] ); 
        addMeme('slap', [237, 105],  [339, 243], [78, 51], [181, 148] );
        addMeme('no-comment-code', [526, 348], [828, 660]);
        addMeme('starter-programmer', [138, 162], [168, 202]);
        addMeme('first-code-works', [183, 129], [329, 309]);
        addMeme('glutton', [333, 147], [409, 232]);
        addMeme('no-questions', [422, 21], [578, 298], [171, 9], [237, 104]);
        addMeme('watchin-anime-sub', [131, 154], [252, 273]);
        addMeme('prison', [374, 9], [502, 227]);
        addMeme('drunk-birthday', [181, 165], [343, 318]);
        addMeme('titan', [311, 18], [340, 70]);
        addMeme('important', [145, 90], [256, 235]);
        addMeme('smart', [121, 175], [216, 295]);
        addMeme('dance', [195, 76], [276, 161]);
        addMeme('eaten-alive', [36, 59], [105, 115]);
        addMeme('rhino-chase', [302, 12], [345, 68], [126, 103], [186, 166]);
        addMeme('chase', [258, 74], [293, 111]);
        addMeme('programming-sprank', [384, 162], [456, 225]);
        addMeme('first-code-works-noob', [135, 91], [166, 152], [138, 292], [175, 343]);
        addMeme('programmer-lan', [598, 148], [704, 304], [256, 256], [357, 368]);
        addMeme('password-problem', [113, 94], [251, 292]);
        addMeme('shadow-programmer', [379, 110], [472, 278]);
    }

}