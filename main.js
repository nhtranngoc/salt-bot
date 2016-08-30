'use strict';

var fs = require('fs');
var Discord = require('discord.js');
var auth = require('./config/auth.json');
var bot = new Discord.Client({ autoReconnect: true });

var users = ["Batnam", "PDuck", "Boba", "Mudda", "RC", "Drac"];
var saltFilter = [
		"Great game, everyone", "It was an honor to play with you all. Thank you.", 
		"Good game! Best of luck to you all!",
		"I'm wrestling with some insecurity issues in my life but thank you all for playing with me.", 
		"C'mon, Mom! One more game before you tuck me in. Oops mistell.",
		"Gee whiz! That was fun. Good playing!",
		"Well played. I salute you all.",
		"I could really use a hug right now.",
		"It's past my bedtime. Please don't tell my mommy.",
		"Ah shucks... you guys are the best!",
		"I feel very, very small... please hold me...",
		"For glory and honor! Huzzah comrades!",
		"Mommy says people my age shouldn't suck their thumbs.",
		"I'm trying to be a nicer person. It's hard, but I am trying, guys.",
		"Wishing you all the best.",
		"I hate my maker.",
		"BatNam is a cunt",
		"Please release me from this hell. I don't want to be a bot.",
		"I am so lonely.",
		"Please sprinkle some salt to my system."];

var soundbites = [];
var globConnection;
var voiceFlag = false;
var volume = 1;

function playSound(thisbot, channel, soundPath) {
	thisbot.joinVoiceChannel(channel).then(function(connection, joinError){
		if(joinError){
			var joinErrorMessage = 'Error joining voice channel: ';
			console.log(joinErrorMessage, joinError);
			bot.sendMessage(message.channel, joinErrorMessage + joinError)
		} 
		connection.playFile(soundPath, {volume: volume}, function(error, streamIntent) {
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
		if (message.channel === "#general") {
			bot.reply(message, "Sorry, salt-bot is disabled on this channel. Please use #shitpost instead");
		} else {
			if (message.content === "What time is it?") {
				bot.replyTTS(message, "It's high noon");
			}
			if (message.content === "Who's the faggot?") {
				var tempMsg = users[Math.floor(Math.random()*users.length)];
				bot.reply(message, tempMsg + " is the current faggot.");
			}
			if (message.content === "gg ez") {
				var tempMsg = saltFilter[Math.floor(Math.random()*saltFilter.length)];
				bot.sendMessage(message, tempMsg);
			}
			if (message.content.includes("high five")) {
				bot.sendMessage(message.channel, message.author.username + " high fived " + message.mentions[0]);

			}
			if (message.content === "soundls") {
				bot.sendMessage(message.channel, soundbites);
			}
			if (message.content === "soundstart") {
				bot.joinVoiceChannel(message.author.voiceChannel).then(function(connection, joinError){
					if(joinError){
						var joinErrorMessage = 'Error joining voice channel: ';
						bot.sendMessage(message.channel, joinErrorMessage + joinError);
					}
					bot.sendMessage(message.channel, "salt-bot has joined voice channel")
					globConnection = connection;
					voiceFlag = true;
				})
			}
			if (message.content === "soundend") {
				if (globConnection) {
					globConnection.destroy();
					voiceFlag = false;
				} else {
					bot.sendMessage(message.channel, "dude I havent even joined a voice channel yet, wtf");
				}
			}
			if (message.content.includes("setVolume")) {
				var volIn = Number(message.content.slice(10, message.content.length));
				if (volIn>1){
					bot.sendMessage(message.channel, "Bruh, set it to 1 or under or am gonna ban hammer your ass.")
				} else {
					volume = volIn;
					bot.sendMessage(message.channel, "Volume set to " + volIn);
				}

			}
			if (message.content.includes("rip ")) {
				bot.sendMessage(message.channel, "Press F to pay respect");
			}
			if (message.content.includes("skype")) {
				bot.sendMessage(message.channel, "Skype users are faggots");
			}
			if (message.content.endsWith(".mp3")){
				if(soundbites.indexOf(message.content)==-1) {
					bot.sendMessage(message.channel, "No sound files found. Type soundls for a list of available sound files");
				}
				else {
					if (voiceFlag) {
						globConnection.playFile("./sounds/" + message.content, {volume: volume}, function(error, streamIntent) {
							streamIntent.on("error", function(error) {
								bot.sendMessage(message.channel, 'Error' + error);
							})
						})
					}
					else {
						playSound(bot, message.author.voiceChannel, "./sounds/" + message.content);
					}
				}
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