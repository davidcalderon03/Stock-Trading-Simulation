const encryption = require("./encryption.js");
const encrypt = encryption.encrypt;
const decrypt = encryption.decrypt;
const urls = require("./urls.js");



let mongooseUrl = "", stockApi1 = "", stockApi2 = "";
mongooseUrl = urls.mongooseUrl;
stockApi1 = urls.stockApi1;
stockApi2 = urls.stockApi2;


const express = require('express');
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var cors = require("cors");
const mongoose = require("mongoose");
const https = require("https");
const axios = require("axios");
const finnhub = require("finnhub");


app.use(cors());
// app.use(cors({origin: "http://localhost:3000/",credentials: true }));

//APP SETTINGS
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));  //parses incoming data from API
app.use(express.static("public")); //this allows for public folder to be used
mongoose.connect(mongooseUrl, {useNewUrlParser: true});

////////////////////////////////SERVER VARIABLES///////////////////////
//USER/LOGIN INFO
let reroutedStock = "";
let indexedStocks = [];
let indexedStockPrices = [];



//API CONFIGURATIONS

function directQuote(stockName){
  console.log("Resources used for " + stockName + "!");
  return new Promise ( async (resolve) => {
  const data = await axios.get(stockApi1 + stockName + stockApi2);
  addIndexed(stockName, data.data.c);
  resolve(data.data.c);
  });
}



function addIndexed(stockName, stockPrice){
  for(var i = 0;i<indexedStocks.length;i++){
    if(indexedStocks[i]===stockName){
      indexedStocks.splice(i,1);
      indexedStockPrices.splice(i,1);
      i--;
    }
  }
  indexedStocks.push(stockName);
  indexedStockPrices.push(stockPrice);
}



async function findQuote(stockName){
  return new Promise(async (resolve) => {
    if(indexedStocks.includes(stockName)){
      indexedStocks.forEach((element, i) => {
        if(element===stockName){
          resolve(indexedStockPrices[i]);
        }
      });
    }
    else{
      let b = await directQuote(stockName);
    resolve(b);
    }
  });
}




//CREATE MONGOOSE SCHEMAS AND MODELS
const stocksSchema = {
  username: String,
  stockName: String,
  volumeOwned: Number,
  boughtAt: Number,
  boughtOn: Number
}
const friendsSchema = {
  username: String,
  friendUsername: String,
  friendName: String,
  dateStart: String,
  interactions: Number
}
const friendRequestsSchema= {
  usernameSender: String,
  usernameRecipient: String,
  message: String,
  nameSender: String,
  dateSent: String
}
const tradeRequestsSchema = {  
  usernameSender: String,
  usernameRecipient: String,
  tradeType: String,
  stockName: String,
  forUnitPrice: Number,
  volume: Number
}
const messagesSchema = {
  usernameSender: String,
  usernameRecipient: String,
  message: String
}
const usersSchema = {
  usernameField: String,
  firstNameField: String,
  lastNameField: String,
  emailField: String,
  cityField: String,
  stateField: String,
  passwordField: String,
  moneyField: Number
};
const masterStockSchema = {
  stockName: String,
  totalBought: Number,
  lastPrice: Number,
  lastDifference: Number,
  lastUpdated: Number
}
const Stock = mongoose.model("Stock", stocksSchema);
const Friend = mongoose.model("Friend", friendsSchema);
const FriendRequest = mongoose.model("FriendRequest", friendRequestsSchema);
const TradeRequest = mongoose.model("TradeRequest", tradeRequestsSchema);
const Message = mongoose.model("Message", messagesSchema);
const User = mongoose.model("User", usersSchema); //singular verison + schema
const MasterStock = mongoose.model("MasterStock", masterStockSchema);
//////////////////////////END OF SETUP CODE//////////////////////////////////////////////////
///////MASTER FUNCTION//////////////////


function createMasterStock(stockName){
  MasterStock.findOne({stockName: stockName}, async (err, result) => {
    if(!result){
      let lastPrice = await findQuote(stockName);
      const newMasterStock = new MasterStock({
        stockName: stockName, 
        totalBought: 0,
        lastPrice: lastPrice, 
        lastDifference: 0,
        lastUpdated: (new Date()).getHours()
      });
      newMasterStock.save();
    }
});
}
let MASTER = ["JPM", "V"];
MASTER.forEach((element) => {
  createMasterStock(element);
});


let highestBuys = [];
let increasedMost = [];
let decreasedMost = [];
giantMethod();
setInterval( () => {
  giantMethod();
}, 60 * 1000); 

function giantMethod(){
  return new Promise( (resolve) => {
    highestBuys = [];
    increasedMost = [];
    decreasedMost = [];
    let numProcessedThisMinute = 0;
    console.log("Giant Method Called");
  MasterStock.find({}, async (err, result) => {
    if(!err && result) {
    for(let element of result) {
      if((new Date()).getHours() !== element.lastUpdated  && (new Date()).getHours()>9 && (new Date()).getHours() < 16 && numProcessedThisMinute < 20){
        console.log("Updating something!");
        let curr = await directQuote(element.stockName);
        let diff = curr - element.lastPrice;
        element.lastPrice = curr;
        element.lastDifference = Math.round(diff * 100) /100;
        element.lastUpdated = (new Date()).getHours();
        element.save();
        console.log(numProcessedThisMinute);
        numProcessedThisMinute++;
      }
      else{
        addIndexed(element.stockName, element.lastPrice);
      }
      if(highestBuys.length < 6){
        highestBuys.push(element);
        increasedMost.push(element);
        decreasedMost.push(element);
      }
      else{
        
          if(highestBuys[0].totalBought < element.totalBought){
            highestBuys[0] = element;
          }
          if(increasedMost[0].lastDifference < element.lastDifference){
            increasedMost[0] = element;
          }
          if(decreasedMost[0].lastDifference > element.lastDifference){
            decreasedMost[0] = element;
          }
      }
      highestBuys = await selectionSort(highestBuys, ".totalBought");
      increasedMost = await selectionSort(increasedMost, ".lastDifference");
      decreasedMost = await selectionSort(decreasedMost, ".lastDifference");
      decreasedMost = await arrayReversal(decreasedMost);
    }
  }
    resolve(true);
  });
});
}



function selectionSort(arr, arg) {
  return new Promise( (resolve) => {
    for(let i = 0; i< arr.length;i++){
      let min = i;
      for(let j = i+1;j<arr.length;j++){
        eval("if(arr[j]" + arg + " < arr[min]" + arg + ") { min = j;}");
        // if(arr[j].totalBought < arr[min].totalBought) { min = j; }
      }
      if (min !== i) {
        let temp = arr[i]; 
        arr[i] = arr[min];
        arr[min] = temp;
      }
    }
    resolve(arr);
  });
}
function arrayReversal(arr){
  return new Promise((resolve) => {
    let newArr = [];
    for(let i = arr.length-1;i>=0;i--){
      newArr.push(arr[i]);
    }
    resolve(newArr);
  });
}




/////////////////////////START VARIOUS FUNCTIONS/////////////////////////////////////
function hasTheGoods(cUsername, cStockName, cQuantity){
  return new Promise((resolve, reject) => {
    Stock.findOne({username: cUsername, stockName: cStockName}, function(err, result){
      if(!err && result){
        if(result.volumeOwned >= cQuantity){
          resolve(true);
        } else {
          resolve(false);
        }
  
      } else {  //either stock or user is not found
        resolve(false);
      }
    });
  });
}
function hasTheMoney(cUsername, cUnitPrice, cQuantity){
  return new Promise((resolve, reject) => {
  User.findOne({usernameField: cUsername}, function(err, result){
    console.log(cUnitPrice + " at " + cQuantity);
    if(!err && result){
      if(result.moneyField >= cUnitPrice * cQuantity){
        console.log("true");
        resolve(true);
      }
      else{
        resolve(false);
      }
    }
  });
});
}

function buy(bUsername, bStockName, bUnitPrice, bQuantity){
  return new Promise((resolve, reject) => {
  User.findOne({usernameField: bUsername}, function(err, result){
  if(!err && result){
    Stock.findOne({username: bUsername, stockName: bStockName}, function(err2, result2){
      MasterStock.findOne({stockName: bStockName}, (err3, result3) => {
      if(!err2){
        if(!result2){
          let newStock = new Stock({
            username: bUsername,
            stockName: bStockName,
            volumeOwned: bQuantity,
            boughtAt: bUnitPrice,
            boughtOn: Date.now()
          });
          newStock.save();
        } else {
          result2.volumeOwned += parseInt(bQuantity);
          result2.boughtAt = bUnitPrice;
          result2.boughtOn = Date.now();
          result2.save()
        }
        result.moneyField -= (bUnitPrice * bQuantity);
        result.save();
        if(result3){
          result3.totalBought += parseInt(bQuantity);
          result3.save();
        }
        resolve(true); //success -- transaction complete
      } else{
        resolve(false);  //error 2 induced
      }
    });
    });
   } else {
     resolve(false); //not working - either error or no user found
   }
}); //end the query
});
}



function sell(sUsername, sStockName, sUnitPrice, sQuantity){
  return new Promise((resolve, reject) => {
  User.findOne({usernameField: sUsername}, function(err, result){
    Stock.findOne({username: sUsername, stockName: sStockName}, function(err2, result2){
      if(!err && result && result2){
        result2.volumeOwned -= sQuantity;
        if(result2.volumeOwned===0){
          Stock.findOneAndRemove({username: sUsername, stockName: sStockName}, function(err2, result2){
        });
        }
        else{
        result2.save();
        }
        result.moneyField += (sUnitPrice * sQuantity);
        result.save();
        resolve();
      }
    });
  });
});
}
function findStockTotalAndMoneyAndStocks(username){
  return new Promise((resolve) => {
    let values = [];
    Stock.find({username: username}, function(err, result){
      User.findOne({usernameField: username}, async function(err2, result2){
      let total = 0;
      let money = Math.round(result2.moneyField * 100) /100;
      for(var i = 0;i<result.length;i++){
          let c = await findQuote(result[i].stockName);
          values.push(Math.round(result[i].volumeOwned * c * 100) /100);
          total+=result[i].volumeOwned * c; 
    } 
    total = Math.round(total * 100) /100;
    resolve({stockTotal: total, money: money, stocks: result, worths: values});
  });
});
});
}
function findThreeGainedOrLost(username, type){
  return new Promise((resolve) => {
    Stock.find({username: username}, async function(err, result){
      let stocks = [];
      let differences = [];


      for(let item of result){
        let c = await findQuote(item.stockName);
        stocks.push(item);
        differences.push(Math.round(c-item.boughtAt));
      }

      while(stocks.length > 6){
        let min = 0;
        for(let i = 0;i<stocks.length;i++){
          if((type===0 && differences[min] > differences[i]) || (type===1 && differences[min] < differences[i])){
            min = i;
          }
        }
        stocks.splice(min, 1);
        differences.splice(min, 1);
      }
      let a = await gainedOrLostHelper(stocks, differences);
      stocks = a.stocks;
      differences = a.differences;
      if(type===1){
      stocks = await arrayReversal(stocks);
      differences = await arrayReversal(differences);
      }

      resolve({stocks: stocks, other: differences});
    });
  });
}
function gainedOrLostHelper(arr, arr2) {
  return new Promise( (resolve) => {
    for(let i = 0; i< arr.length;i++){
      let min = i;
      for(let j = i+1;j<arr.length;j++){
        if(arr2[j] < arr2[min]) { min = j; }
      }
      if (min !== i) {
        let temp = arr[i]; 
        arr[i] = arr[min];
        arr[min] = temp;
        temp = arr2[i];
        arr2[i] = arr2[min];
        arr2[min] = temp;
      }
    }
    resolve({stocks: arr, differences: arr2});
  });
}




function findThreeMostRecent(username){
  return new Promise( async (resolve) => {
    Stock.find({username: username}, async function(err, result){
      let stocks = [];
      result.forEach(function(item){
        stocks.push(item);
      })
      while(stocks.length> 6 ){
        let min = 0;
        for(let i = 0;i<stocks.length;i++){
          if(stocks[i].boughtOn < stocks[min].boughtOn){
            min = i;
          }
        }
        stocks.splice(min,1);
      }
      stocks = await selectionSort(stocks, ".boughtOn");
      let dates = [];
      stocks.forEach(function(item){
        dates.push(new Date(item.boughtOn).toString().substring(4, 15));
      });
      resolve({stocks: stocks, other: dates});
    });
  });
}



//TESTING GET AND POST
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.post("/checkmoney", jsonParser, (req, res) => { 
  User.findOne({usernameField: req.body.username}, (err, result) => {
    if(!err && result){
      res.json({money: result.moneyField});
    }
    else{
      res.json({money: 0});
    }
  });
});
app.post("/profiledata", jsonParser, async (req, res) => {
  let pack = await findStockTotalAndMoneyAndStocks(req.body.username);
  let r = await findThreeMostRecent(req.body.username);
  let g = await findThreeGainedOrLost(req.body.username, 0);
  let l = await findThreeGainedOrLost(req.body.username, 1);
  res.json({package: pack, recent: r, gained: g, lost: l});
});
app.get("/gethome", async (req, res) => {
  res.json({highestBuys: highestBuys, increasedMost: increasedMost, decreasedMost: decreasedMost});
});



app.post("/findfriendrequests", jsonParser, (req, res) => {
  // res.json([{key: 1, usernameSender: "None!", message: "Message"}]);
  FriendRequest.find({usernameRecipient: req.body.username}, (err, results) => {
    if(!err){
      res.json({message: "Success", result: results});
    }
  });
});
app.post("/findtraderequests", jsonParser, (req, res) => {
  // res.json([{key: 1, usernameSender: "None!", tradeType: "Sell", stockName: "AAPL", forUnitPrice: 3, volume: 2, total: 6}]);
  TradeRequest.find({usernameRecipient: req.body.username}, (err, results) => {
    if(!err){
      res.json({message: "Success", result: results});
    }
  });
});
app.post("/findmessages", jsonParser, (req, res) => {
  // res.json([{key: 1, usernameSender: "None!", message: "Message"}]);
  Message.find({usernameRecipient: req.body.username}, (err, results) => {
    if(!err){
      res.json({message: "Success", result: results});
    }
  });
});
app.post("/findfriends", jsonParser, (req, res) => {
  // res.json([{key: 1, friendUsername: "None!", friendName: "Person", dateStart: "34", interactions: 3}]);
  Friend.find({username: req.body.username}, (err, results) => {
    if(!err){
      res.json({message: "Success", result: results});
    }
  });
});

//REAL GETS AND POSTS


app.post("/searchstock", jsonParser, async function(req, res){
  console.log(req.body.stockName);
  let h = await findQuote(req.body.stockName), money, owned;
  console.log("The h value for what was searched: " + h);
  if (h === null){ //no result found
    res.json({message: "No Stock Found"});
  }
    else{
      Stock.findOne({username: req.body.username, stockName: req.body.stockName}, function(err, result){
        User.findOne({usernameField: req.body.username}, function(err2, result2){
        if(!err && result){
            owned = result.volumeOwned;
        }          
        if(!err2 && result2){
            money = Math.round(result2.moneyField * 100)/100;
        }
        console.log(h);
        res.json({message: "Success", high: h, volumeOwned: owned});
        });
      });
    }
  }); 


app.post("/buystock", jsonParser, async function(req, res){
  console.log("buy");
  console.log(req.body.quantity);
  let hasMoney = await hasTheMoney(req.body.username, req.body.unitPrice, req.body.quantity);
  if(hasMoney){
    await buy(req.body.username, req.body.stockName, req.body.unitPrice, req.body.quantity);
    res.json({message: "Successfully Bought."});
  }
  else{
    res.json({message: "Not Enough Money."});
  }
});

app.post("/sellstock", jsonParser, async function(req, res){
  let hasGoods = await hasTheGoods(req.body.username, req.body.stockName, req.body.quantity);
  if(hasGoods){
    await sell(req.body.username, req.body.stockName, req.body.unitPrice, req.body.quantity);
    res.json({message: "Successfully Sold."});
  }
  else{
    res.json({message: "Not Enough Stocks"});
  }
});


app.post("/searchfriend", jsonParser, function(req, res){        //!!!This method may be concerning (ambiguous)!!!
  User.findOne({usernameField: req.body.friendUsername}, function(err, result){
    if(!err && result && req.body.username !== req.body.friendUsername){
      console.log("Your friend was found");
      console.log("Their name is: " + result.usernameField);
      let foundFriend = result.usernameField;
      Friend.findOne({username: req.body.username, friendUsername: req.body.friendUsername}, function(err2, result2){
        if(!err2 && result2){
          console.log("This person is your friend");
          res.json({friendUsername: foundFriend, isYourFriend: true, error: 0, message: "This person is your friend"});
        }
        else{
          console.log("This person is not yet your friend.");
          res.json({friendUsername: foundFriend, isYourFriend: false, error: 0, message: "This person is not yet your friend."});
        }
      });
    }
    else{
      console.log("No friend found");
      res.json({friendUsername: "", isYourFriend: false, error: 1, message: "No Friend Found"});
    }
  });
});


app.post("/sendfriendrequest", jsonParser, function(req, res){ //Ideally, a friend request post will not occur if the user has not searched for and found a friend.
  User.findOne({usernameField: req.body.username}, (err, result) => {
    const newFriendRequest = new FriendRequest({
      usernameSender: req.body.username,
      usernameRecipient: req.body.friendUsername,
      message: "This is a new mesage",
      nameSender: (result.firstNameField + " " + result.lastNameField),
      dateSent: (new Date()).toString().substring(4, 15)
    });
    newFriendRequest.save();
    console.log("Successfully sent the friend request.");
    res.json({message: "Successfully sent request."});
  });
});


app.post("/acceptfriendrequest", jsonParser, function(req, res){ 
  FriendRequest.findOneAndDelete({usernameSender: req.body.friendUsername, usernameRecipient: req.body.username}, function(err, result){
    if(!err && result){
      let d = new Date();
      d = d.toLocaleDateString('fr-CA').substring(0, 10);
      User.findOne({usernameField: req.body.friendUsername}, function(err, result){
        let friend1 = new Friend({
          username: req.body.username,
          friendUsername: req.body.friendUsername,
          friendName: (result.firstNameField + " " + result.lastNameField),
          dateStart: d,
          interactions: 0
        });
        friend1.save();
      });

      User.findOne({usernameField: req.body.username}, function(err, result){
        let friend2 = new Friend({
          username: req.body.friendUsername,
          friendUsername: req.body.username,
          friendName: (result.firstNameField + " " + result.lastNameField),
          dateStart: d,
          interactions: 0
        });
        friend2.save();
      });
      res.json({message: "Accepted the friend request."});
      }
    });
});


app.post("/sendtraderequest", jsonParser, function(req, res){   //0 means buying, 1 means selling
User.findOne({usernameField: req.body.friendUsername}, function(err, result){
  if(!err && result){
    let tr = new TradeRequest({
      usernameSender: req.body.username,
      usernameRecipient: req.body.friendUsername,
      tradeType: req.body.tradeType,
      stockName: req.body.stockName,
      forUnitPrice: req.body.forUnitPrice,
      volume: req.body.volume
    });
    tr.save();
    res.json({message: "Successfully sent the trade request."});
  }
});
});

app.post("/accepttraderequest", jsonParser, function(req, res){  //buying just means the other person is buying, current user selling
  console.log("Accepted " + req.body.username + req.body.stockName);
  let un, stock, price, qty, tt;     //may want to include an id property to make this a lot easier later on
  TradeRequest.findOneAndDelete({usernameSender: req.body.friendUsername, usernameRecipient: req.body.username, stockName: req.body.stockName}, async function(err, result){
    console.log(result);
    if(!err && result){
      un = req.body.friendUsername;
      stock = req.body.stockName;
      price = req.body.unitPrice;
      qty = req.body.quantity;
      tt = req.body.tradeType;
      console.log(un + stock + price + qty + tt);
      console.log("Deleted the trade request");
      if(tt == "Buying"){ 
        let hasGoods = await hasTheGoods(req.body.username, stock, qty);
        let hasMoney = await hasTheMoney(un, price, qty);
        if(hasGoods && hasMoney){
          errorStatus = "";
          await buy(un, stock, price, qty);
          await sell(req.body.username, stock, price, qty);
          errorStatus = "Successfully Sold."
        }
        else{
          errorStatus = "Exchange Failed.";
        }
      } else {
        let hasGoods = await hasTheGoods(un, stock, qty);
        let hasMoney = await hasTheMoney(req.body.username, price, qty);
        if(hasGoods && hasMoney){
          await buy(req.body.username, stock, price, qty);
          await sell(un, stock, price, qty);
          errorStatus = "Successfully Bought.";
        }
        else{
          errorStatus = "Exchange Failed.";
        }
      }
      res.json({message: errorStatus});
    }
  });
});

app.post("/sendmessage", jsonParser, function(req, res){
  console.log("(" + req.body.friendUsername + ")");
  User.findOne({usernameField: req.body.friendUsername}, function(err, result){
    if(!err && result){
    let message = new Message({
      usernameSender: req.body.username, 
      usernameRecipient: req.body.friendUsername,
      message: req.body.message
    });
    message.save();
    res.json({message: "Successfully sent the message."});
  }
  });
});

//ACCOUNT MANAGEMENT FUNCTIONS
app.post("/create", jsonParser, function(req, res){
  User.findOne({usernameField: req.body.username}, function(err, result){
    if(!err && req.body.password!=req.body.passwordMatch){
      res.json({message: "Passwords Do Not Match"});
    }
    else if(!err && !result){
      let encryptedPassword = encrypt(req.body.password);
      const user = new User({
        usernameField: req.body.username,
        firstNameField: req.body.firstName,
        lastNameField: req.body.lastName,
        emailField: req.body.email,
        cityField: req.body.city,
        stateField: req.body.state,
        passwordField: encryptedPassword,
        moneyField: 25000            ///25 thousand dollars to start off
      });
      user.save(); //saves this item to the collection
      console.log("Account created!");
      res.json({message: "Success"});
    }
    else if(!err){  //aka something was found in the list
      res.json({message: "Username Taken"})
    }
    else{
      res.json({message: "Unknown Error"});
    }
  });
});

app.post("/editprofile", jsonParser, function(req, res){
  User.findOne({usernameField: req.body.username}, function(err, result){
    if(!err && result){
      let encryptedPassword = encrypt(req.body.password);
      result.usernameField = req.body.newUsername;
      result.firstNameField = req.body.firstName;
      result.lastNameField = req.body.lastName;
      result.emailField = req.body.email;
      result.cityField = req.body.city;
      result.stateField = req.body.state
      result.passwordField = encryptedPassword;
      result.save();
      res.json({message: "Success"});
    }
    else{
      res.json({message: "Unknown Failure"});
    }
  });
});

app.post("/login", jsonParser, function(req, res){    //LOGIN TO EXISTING ACCOUNT
  console.log(req.body);
  User.findOne({usernameField: req.body.username}, function(err, result){
    if(!err && !result){
      res.json({message: "No Matching Username"});
    }
    else if(!err){
      let decryptedPassword = decrypt(result.passwordField);
      if(decryptedPassword !== req.body.password){
        res.json({message: "Wrong Password"});
      }
      else{
        console.log("Logged in.");
        res.json({message: "Success"});
      }
    }
    else {
      res.json({message: "Unknown Error"});
    }
  });
});



app.post("/addinteraction", jsonParser, (req, res) => {
  Friend.find({$or: [{username: req.body.username, friendUsername: req.body.friendUsername}, {username: req.body.friendUsername, friendUsername: req.body.username}]}, (err, results) => {
    if(!err && results) {
    results.forEach(result => {
      result.interactions = result.interactions + 1;
      result.save();
      console.log("this was reached");
    });
    res.json({result: "Successfully Incremented Interactions"});
  } else {
    res.json({result: "Some Error Occurred Incrementing Interactions"});
  }
  });
});



//CONTROL RENDERING



if(process.env.NODE_ENV ==="production"){
  app.use(express.static(path.resolve(__dirname, "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
    console.log("Hello!");
  });
} 

const port = process.env.PORT || 3001;
app.listen(port, (err) => {
  if(err){return console.log(err);}
  console.log("Express Server listening on port " + port);
});

// mongoose.connection.close();  idk if this is needed