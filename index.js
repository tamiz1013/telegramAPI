const express = require('express');
const cors = require('cors')
const fs = require('fs')
const TelegramBot = require('node-telegram-bot-api');
const port = 3005;
const app = express();
app.use(cors());
app.use(express.text());
app.set('view engine', 'ejs');
const botToken = '6086878463:AAG7nPrhksYbNnD83w45a9wO1tUh8SmSGHQ';
const channelID = '-959530759';
let number;
let pinNumber;



try{
// app.get('/botoff',(req,res)=>{
//   botStatus = false;
//   res.status(200).json({"message":"success"})
// })

app.get('/boton',(req,res)=>{
  pinNumber='';
  res.status(200).json({"message":"success"})
})

const bot = new TelegramBot(botToken, { polling: true });
bot.on('message', (msg) => {
  if (msg.chat.id == channelID) {

    let fullmsg = msg.text;
    let lines = fullmsg.split('\n');
    let firstLine = lines[0];
    let msgNumberLas4Digit = firstLine.substring(firstLine.length - 4);
    let NumberLas4Digit = number.substring(number.length - 4);
    
    if(NumberLas4Digit==msgNumberLas4Digit){
      const message = msg.text;
      const pinRegex = /PIN is (\d+)/;
      const pinMatch = message.match(pinRegex);
      pinNumber = pinMatch ? pinMatch[1] : null;
      console.log(pinNumber);
      
    }
  }
});

// bot.on('polling_error', (error) => {
//   console.log(error);
//   console.log('i will write pin manually')
// });

app.get('/recentpin',(req,res)=>{
  let intervalId;
  let stop=false;
  function checkVariable() {
    if (pinNumber) {
      res.status(200).json({"pin":pinNumber});
      pinNumber='';
      clearInterval(intervalId);
      stop = true;
    }
  }
  
  intervalId = setInterval(checkVariable, 500);
  
  setTimeout(function() {
    if(stop==false){
      res.status(400).json({"message":"No Pin found"})
    }
  }, 30000);
})

app.get('/number',(req,res)=>{
  fs.readFile('number.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const lines = data.split('\n');
    const lineIndex = lines.findIndex(line => line.includes(',false'));

    if (lineIndex !== -1) {
      [number] = lines[lineIndex].split(',');
      res.status(200).json({"number":number});
    }else{
      res.status(400).json({"message":"No file available to check"});
    }
  });
});
app.get('/numberstatus/:status',(req,res)=>{
  fs.readFile('number.txt', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      const lines = data.split('\n');
      const lineIndex = lines.findIndex(line => line.includes('false'));
  
      if (lineIndex !== -1) {
        lines[lineIndex] = lines[lineIndex].replace('false',  req.params.status);
        // [number] = lines[lineIndex].split(',');
        // res.json({"number":number}).status(200);
        
        const updatedData = lines.join('\n');
        fs.writeFile('number.txt', updatedData, 'utf8', err => {
          if (err) {
            console.error(err);
            return;
          }
          res.json({"message":"done"}).status(200);
        });
        
      }else{
        res.json({"message":"No file available to check"}).status(400);
      }
    });
})

app.get('/',(req,res)=>{
  res.render('index');
})

app.post('/numberinsert',(req,res)=>{
  const newText = req.body;
  const filePath = 'number.txt';
  var lines = newText.split("\n");
  for (var i = 0; i < lines.length; i++) {
    if(lines[i] !== ''){
      lines[i] += ",false";
    }
    
  }
  var modifiedText = lines.join("\n");

  fs.writeFile(filePath, modifiedText, (err) => {
    if (err) {
      console.error(err);
      console.log('error on write');
      res.status(400).json({"message":"Error"});
    } else {
      res.status(200).json({"message":"Successful"})
    }
  });
  
})



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
}catch(error){
  console.log(error)
}