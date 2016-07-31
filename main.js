var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./config/auth.json');

var bot = new Discord.Client({
	token: auth.token,
	autorun: true
});

bot.on("ready", function (event) {
	console.log("Logged in as %s -$s\n", bot.username, bot.id);
});

bot.on('message', function(user, userID, channelID, message, event) {
    if (message === "What time is it") {
        bot.sendMessage({
            to: channelID,
            message: "Its High Noon"
        });
    }
});