const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const botToken = '6086878463:AAG7nPrhksYbNnD83w45a9wO1tUh8SmSGHQ';
const channelID = '-959530759';

const bot = new TelegramBot(botToken, { polling: true });
bot.on('message', (msg) => {
  if (msg.chat.id == channelID) {
    const message = msg.text;
    // Process the message as needed
    console.log(message);
  }
});


// Start the Express.js server
const port = 3000; // Replace with your desired port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
