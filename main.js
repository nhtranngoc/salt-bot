'use strict';

var fs = require('fs');
var Discord = require('discord.js');
var auth = require('./config/auth.json');
var bot = new Discord.Client({ autoReconnect: true });

var users = ["Batnam", "PDuck", "Boba", "Mudda", "RC", "Drac"];
var soundbites = [];

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

//Check for messages. Be careful not to bog this down
bot.on('message', function(message) {
	if (message.author.username !== bot.user.username) {
		if (message.content === "What time is it?") {
			bot.replyTTS(message, "It's high noon");
		}
		if (message.content === "Who's the faggot?") {
			var tempMsg = users[Math.floor(Math.random()*users.length)];
			bot.reply(message, tempMsg);
		}
		if (message.content === "soundls") {
			bot.sendMessage(message.channel, soundbites);
		}
		if (message.content.endsWith(".mp3")){
			if(soundbites.indexOf(message.content)==-1) {
				bot.sendMessage(message.channel, "No sound files found. Type soundls for a list of available sound files");
			} else {
				playSound(bot, message.author.voiceChannel, "./sounds/" + message.content);
			}
		}
	}
});

(function init() {
	//Create a sounddb before initializing
	fs.readdir('./sounds/', function(err, items){
		if(err) throw err;
		soundbites = items;
	});
	bot.loginWithToken(auth.token);

})();