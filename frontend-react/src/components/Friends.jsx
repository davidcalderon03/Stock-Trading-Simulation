import React, {useState} from "react";
import FriendsTable from "./FriendsTable";
import Message from "./Message";
import TradeRequest from "./TradeRequest";
import SendMessage from "./SendMessage";

function Friends(props){

let [friend, setFriend] = useState("");
let [searchedFriend, setSearchedFriend] = useState("");
let [isYourFriend, setIsYourFriend] = useState(false);
let [message, setMessage] = useState("");
let [messageColor, setMessageColor] = useState("red");

let [friendRequests, setFriendRequests] = useState(0);
let [tradeRequests, setTradeRequests] = useState(0);
let [messages, setMessages] = useState(0);
let [friends, setFriends] = useState(0);

let [formType, setFormType] = useState(0);
let [money, setMoney] = useState(0);

let [layout, setLayout] = useState(1); //1 for tables, 2 for friend search, 3 for contact

function find(routeName, override){
if(eval(routeName.charAt(0).toLowerCase() + routeName.substring(1) + "=== 0") || override){
fetch(props.link + "/find" + routeName.toLowerCase() , {
    method: 'POST',
    mode: 'cors',
    headers: {"Accept": "application/json", "Content-Type": "application/json"},
    body: JSON.stringify({username: props.currentUsername}) //accept is not necessary
}).then(res => res.json())
.then( res => {
    if(res.result.length>0){
        eval("set" + routeName + "(res.result)");
    }
    else{
        eval("set" + routeName + "(1)");        
    }
});
}
}
if(props.currentUsername!==""){ //call all the methods!
    find("FriendRequests");find("TradeRequests");find("Messages");find("Friends");
    if(tradeRequests!==0 && tradeRequests!==1){
        tradeRequests.map((element) => {
            element.tradeType==="Buying"? element.tradeType="Sell":element.tradeType="Buy";
        });
    }
}

function changeFriendInput(event){
    setFriend(event.target.value);
}
function findFriend(event){
    event.preventDefault();
    fetch(props.link + "/searchfriend", {
        method: 'POST',
        mode: 'cors',
        headers: {"Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({username: props.currentUsername, friendUsername: friend}) //accept is not necessary
    }).then((res) => res.json())
    .then(res => {
        if(res.error===0){
            setMessageColor("green");
            setSearchedFriend(friend);
            setLayout(2);
        }
        else{
            setMessageColor("red");
        }
        setIsYourFriend(res.isYourFriend);
        setMessage(res.message);
        setTimeout( () => setMessage(""), 2000);
    })
}
function sendFriendRequest(name){
    fetch(props.link + "/sendfriendrequest", {
        method: 'POST',
        mode: 'cors',
        headers: {"Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({username: props.currentUsername, friendUsername: name}) //accept is not necessary
    }).then((res) => res.json())
    .then((res) => {
        setMessage(res.message);
        setMessageColor("green");
        setTimeout( () => {
            setMessage("");
            setSearchedFriend("");
            setLayout(1);
        }, "2000");
    });
}
function sendTradeRequest(tradeType, stockName, forUnitPrice, volume){
    console.log(volume);
    fetch(props.link + "/sendtraderequest", {
        method: 'POST',
        mode: 'cors',
        headers: {"Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({username: props.currentUsername, friendUsername: searchedFriend, tradeType: tradeType, stockName: stockName, forUnitPrice: forUnitPrice, volume: volume}) //accept is not necessary
    }).then((res) => res.json())
    .then((res) => {
        setMessage(res.message);
        setMessageColor("green");
        setFormType(0);
        setLayout(1);
        setTimeout(() => {setMessage("");}, "2000");
    });
}
function sendMessage(msg){
    fetch(props.link + "/sendmessage", {
        method: 'POST',
        mode: 'cors',
        headers: {"Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({username: props.currentUsername, friendUsername: searchedFriend, message: msg}) //accept is not necessary
    }).then((res) => res.json())
    .then((res) => {
        setMessage(res.message);
        setMessageColor("green");
        setFormType(0);
        setLayout(1);
        incrementInteractions(props.currentUsername, searchedFriend);
        setTimeout(() => {setMessage("")}, "2000");
    });
}
function acceptFriendRequest(un){
    fetch(props.link + "/acceptfriendrequest", {
        method: 'POST',
        mode: 'cors',
        headers: {"Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({username: props.currentUsername, friendUsername: un}) //accept is not necessary
    }).then((res) => res.json())
    .then((res) => {
        setMessage(res.message);
        setMessageColor("green");
        incrementInteractions(props.currentUsername, un);
        setTimeout(()=>{
        find("FriendRequests", 1);find("Friends", 1); setMessage("");
        }, "2000")
    });
}
function acceptTradeRequest(username, stockName, unitPrice, quantity, tradeType){
    fetch(props.link + "/accepttraderequest", {
        method: 'POST',
        mode: 'cors',
        headers: {"Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({username: props.currentUsername, friendUsername: username, stockName: stockName, unitPrice: unitPrice, quantity: quantity, tradeType: tradeType}) //accept is not necessary
    }).then((res) => res.json())
    .then((res) => {
        setMessage(res.message);
        if(res.message==="Exchange Failed."){
            setMessageColor("red");
        }
        else {
            setMessageColor("green");
            incrementInteractions(props.currentUsername, username);
        }
        setTimeout(()=>{
        find("TradeRequests", 1); setMessage("");
        }, "2000")
    });
}

function checkMoney(){
    fetch(props.link + "/checkmoney", {
        method: 'POST',
        mode: 'cors',
        headers: {"Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({username: props.currentUsername}) //accept is not necessary
    }).then((res) => res.json())
    .then((res) => {
        setMoney(res.money);
    });
}
checkMoney();
function incrementInteractions(username1, username2) {
    fetch(props.link + "/addinteraction", {
        method: 'POST',
        mode: 'cors',
        headers: {"Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({username: username1, friendUsername: username2})
    }).then((res) => res.json())
    .then(res => {
        console.log(res.result);
        setTimeout( () => {
            window.location.reload();
        }, 1000);
    })
}



return (<div>
    <div className="stocks-search-section bg-dark justify-content-center">
      <form className="d-flex" onSubmit={findFriend}>
      {props.currentUsername!==""?
        <input onChange={changeFriendInput} className="form-control stocks-searchbar me-2" type="search" placeholder="Search for a Friend!" aria-label="Search" />:
        <input onChange={changeFriendInput} className="form-control stocks-searchbar me-2" type="search" placeholder="Login to Find Friends!" aria-label="Search" readOnly />}
        <button className="btn btn-success" type="submit">Search</button>
      </form>
    </div>


    <Message message={message} color={messageColor} />
    {props.currentUsername!=="" ? 
    <div class="background-filler">
    <div className="wrapper">
    <div>
    {layout === 1 ?
    <div>
    <h1 style={{color: "green"}}>Money: ${Math.round(money*100)/100}</h1>
    {friendRequests!==0 && friendRequests!==1 ? //0 is for not loaded yet, is for no results returned
    <FriendsTable name="Friend Requests" data={friendRequests} headers={["Username", "Name", "Date Sent", "Accept"]} buttonName="Accept"  //check to see if custom button names work
        cols={["usernameSender", "nameSender", "dateSent"]} func={acceptFriendRequest}
    /> : <Message message="No Friend Requests" color="black" /> }
    {tradeRequests!==0 && tradeRequests!==1 ? 
    <FriendsTable name="Trade Requests" data={tradeRequests} headers={["Username", "Asks You To...", "Stock Name", "Unit Price", "Quantity", "Total Price", "Accept"]}  buttonName="Accept"
        cols={["usernameSender", "tradeType", "stockName", "forUnitPrice", "volume", "total"]} func={acceptTradeRequest}
    /> : <Message message="No Trade Requests" color="black" /> }
    {messages!==0 && messages!==1 ? 
    <FriendsTable name="Messages" data={messages} headers={["Username", "Message", "Respond"]} buttonName="Respond"
        cols={["usernameSender", "message"]} func={(thisUsername) => { setSearchedFriend(thisUsername); setFormType(2); setLayout(3);}}  //may need to be fixed
    /> : <Message message="No Messages" color="black" /> }
    {friends!==0 && friends!==1 ? 
    <FriendsTable name="Friends" data={friends} headers={["Username", "Name", "Friends Since", "Interactions", "Contact"]} buttonName = "Contact"
        cols={["friendUsername", "friendName", "dateStart", "interactions"]} func={(thisUsername)=>{setSearchedFriend(thisUsername); setFormType(1); setLayout(3); } } //this one too
    /> : <Message message="No Friends" color="black" /> }
    </div>
    : 
    <div>
    {layout === 2 ? //next, layout is 2, for finding someone
    <div>
    {searchedFriend!=="" && messageColor==="green" ? <div>
        <button onClick={isYourFriend ? () => {setFormType(1); setLayout(3)}: () => sendFriendRequest(searchedFriend)} className="friends-custom-button" style={{backgroundColor: "#007806"}} type="submit">{isYourFriend ? "Contact " + searchedFriend: "Send Friend Request"}</button>
        <button className="friends-custom-button" onClick={() => { setLayout(1); setSearchedFriend(""); }}>Return To Main</button>

    </div>: <div></div>}
    </div>
    : //next, layout must be 3, for contacting
    <div>
    {formType!==0 ? 
    <div>

    <h1>Contacting: {searchedFriend} </h1>
    <div className="contact-flex-container">
        <div clasName="contact-flex-div">
            <button style={{backgroundColor: "green", border: formType===1 ? "3px solid #222222":"none"}} onClick={ () => {setLayout(3); setFormType(1); }} type="submit" className="friends-custom-button">Trade Request</button>
        </div>
        <div clasName="contact-flex-div">
            <button style={{backgroundColor: "green", border: formType===2 ? "3px solid #222222":"none"}} onClick={ () => {setLayout(3); setFormType(2); }} type="submit" className="friends-custom-button">Send Message</button>
        </div>
        <div clasName="contact-flex-div">
        <button className="friends-custom-button" onClick={() => { setLayout(1); setSearchedFriend(""); }}>Return To Main</button>
        </div>
    </div>
    </div>:<div></div> } 
    {formType===1 ? <TradeRequest func={sendTradeRequest} />:<div></div>}
    {formType===2 ? <SendMessage func={sendMessage} username={searchedFriend} />:<div></div>}
    </div>
    }
    </div>
    
    }
    </div>
    </div>
    </div>
    :
    <Message message="Login to see Friends" color="black" />
    }
</div>);
}
export default Friends;