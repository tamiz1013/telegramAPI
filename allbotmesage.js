const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const botToken = '6086878463:AAG7nPrhksYbNnD83w45a9wO1tUh8SmSGHQ';
// const channelID = '1500950719';


app.get('/code',(req,res)=>{
  fetch('https://api.telegram.org/bot6086878463:AAG7nPrhksYbNnD83w45a9wO1tUh8SmSGHQ/getUpdates')
  .then(response => response.json())
  .then(code =>{
    let last = code.result.length-1;
    let secondLast = code.result.length-2;
    
    let msg  = code.result;
    console.log(msg.length)

      res.status(200).json(code.result[16]);
  })
  .catch(err=> console.log(err));
})


const port = 3000; // Replace with your desired port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
