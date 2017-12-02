const Discord = require("discord.js");
const fs = require("fs");
const hackerEarth = require('hackerearth-node');


const commands = require("./commands");

var configH = JSON.parse(fs.readFileSync('config/compiler.json', 'utf-8'));

//Search configuration
const SECRET_KEY_H = configH.secret_key;

const runner = new hackerEarth(SECRET_KEY_H, 0);

const lan_supp = 
[
    'cpp', 'cpp11', 'c', 'conjure', 'cs', 'java', 'js', 'haskel', 'perl', 'py', 'php', 'ruby'
];

function runcode(message)
{
    content = message.content;
    var regex = /```((cpp)|(cpp11)|(c)|(conjure)|(cs)|(java)|(js)|(haskel)|(perl)|(py)|(php)|(ruby))/;
    var lan = content.match(regex);
    if(!lan)
    {
        message.channel.send('This language in not supported, type !languages to get list of all suported languages');
        return;
    }

    lan = lan[1];
    var code = content.match(/```([^]+)```/);
    if(!code)
    {
        message.channel.send('Syntax error, please use correct syntax');
        return;
    }
    code = code[1];
    code = code.replace(lan, '');

    data = {
        'time_limit':5,
        'memory_limit':323244,
        'source': code,
        'input' : '',
        'language': lan
    };

    runner.run(data, function(err, resp)
    {
        if(err){
            console.log('Error occured in Hacker :: ' + err);
            return;
        }
        /**Got Responce
          *Send Output/Errors
          */
        var compileObj = JSON.parse(resp);
        let embed = new Discord.RichEmbed();
        //
        //COMPILE ERROR OCCURED
        //
        if(compileObj.compile_status != 'OK'){
            embed.setTitle('COMPILATION ERROR::');
            var messageDis='';
            for(i in resp.errors)
                messageDis += compileObj.errors[i] +'\n';
            embed.setDescription(messageDis);
            embed.setColor([225, 0, 0]);

            if(embed)
                message.channel.send(embed);
            else
                console.log('HACKER : Embed empty after compilation error!');
            return;
        }

        //
        //RUNTIME ERROR OCCURED
        //
        var resultObj = compileObj.run_status;
        console.log(resultObj);
        if(resultObj.status != 'AC'){
            embed.setTitle('RUN TIME ERROR::');
            var messageDis;
            for(i in resp.errors)
                messageDis += compileObj.errors[i] +'\n';
            embed.setDescription(messageDis);
            embed.setColor([225, 0, 0]);

            if(embed)
                message.channel.send(embed);
            else
                console.log('HACKER : Embed empty after compilation error!');
            return;
        }

        //
        //SUCESSFULLY COMPILED AND RAN THE CODE
        //
        embed.setTitle('OUTPUT OF THE CODE');
        if(resultObj.output=='')
        {
            embed.setDescription('*No Output*');
        }
        else
        {
        embed.setFooter('Time taken : ' + resultObj.time_used +' and Memory used : ' + resultObj.memory_used);
        embed.setDescription(resultObj.output);
        }
        embed.setColor([0, 225, 0]);

        if(embed)
            message.channel.send(embed);
        else
            console.log('HACKER : Embed empty after compilation error!');
    });
}

function languages(message)
{
    var msgTitle = 'All Supported Languages';
    var msgDes='';
    for(var i in lan_supp)
        msgDes+= lan_supp[i] +'\n';
    
    let embed = new Discord.RichEmbed();
    embed.setTitle(msgTitle);
    embed.setDescription(msgDes);
    embed.setColor([023, 25, 55]);
    if(embed)
        message.channel.send(embed);
    else
        console.log('Hacker : Embed could empty');
}


module.exports = {

    load: function()
    {
        commands.reg('!runcode', runcode, 2, 'Compiler and run your code');
        commands.reg('!languages', languages, 2, 'Display all supported languages');
    }

}