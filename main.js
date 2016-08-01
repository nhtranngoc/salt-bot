'use strict';

var fs = require('fs');
var Discord = require('discord.js');
var auth = require('./config/auth.json');
// var config = require('./config/config.json');

var bot = new Discord.Client({ autoReconnect: true });

var users = ["Batnam", "PDuck", "Boba", "Mudda", "RC", "Drac"];

function playSound(thisbot, channel, soundPath) {
	thisbot.joinVoiceChannel(channel).then(function(connection, joinError){
			if(joinError){
				var joinErrorMessage = 'Error joining voice channel: ';
				console.log(joinErrorMessage, joinError);
				bot.sendMessage(message.channel, joinErrorMessage + joinError)
			} 
			connection.playFile(soundPath, {volume: 1}, function(error, streamIntent) {
				streamIntent.on("error", function(error) {
					// console.log("error " + error);
					bot.sendMessage(message.channel, 'Error ' + error);
				})
				streamIntent.on("end", function() {
					// console.log("end");
					connection.destroy();
				})
			})
		})
}

bot.on('message', function(message) {
	if (message.content === "What time is it?") {
		bot.replyTTS(message, "It's high noon");
	}
	if (message.content === "Who's the faggot?") {
		var tempMsg = users[Math.floor(Math.random()*users.length)];
		bot.reply(message, tempMsg);
	}
	if (message.content === "beepboop.mp3") {	
		playSound(bot, message.author.voiceChannel, "./sounds/beepboop.mp3");
	}
});

(function init() {
	bot.loginWithToken(auth.token);
})();