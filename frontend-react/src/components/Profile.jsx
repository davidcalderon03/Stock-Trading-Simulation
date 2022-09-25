import React, {useEffect, useState, useRef } from "react";
import Message from "./Message";
import ProfileCardSection from "./ProfileCardSection";
import ProfileCardSection2 from "./ProfileCardSection2";

function Profile(props){

let [updates, setUpdates] = useState(0);
let [recents, setRecents] = useState([{key: 1, stockName: "Loading", stats: [100, 2000]}, {key: 2, stockName: "Loading", stats: [100, 2000]}, {key: 3, stockName: "Loading", stats: [100, 2000]}]);
let [gained, setGained] = useState([{key: 1, stockName: "Loading", stats: [100, 2000]}, {key: 2, stockName: "Loading", stats: [100, 2000]}, {key: 3, stockName: "Loading", stats: [100, 2000]}]);
let [lost, setLost] = useState([{key: 1, stockName: "Loading", stats: [100, 2000]}, {key: 2, stockName: "Loading", stats: [100, 2000]}, {key: 3, stockName: "Loading", stats: [100, 2000]}]);
let [stocks, setStocks] = useState([{key: 1, stockName: "Loading", stats: [100, 2000]}, {key: 2, stockName: "Loading", stats: [100, 2000]}, {key: 3, stockName: "Loading", stats: [100, 2000]}]);
let [netStock, setNetStock] = useState(0);
let [money, setMoney] = useState(0);

function configureCards(which, data){
  eval("set" + which + "([]);");
  data.stocks.forEach((element, i) => {
  eval("set" + which + "(oldArray => [...oldArray , {key: i, stockName: element.stockName, stats: [element.volumeOwned, data.other[i]]}]);");
  });
}
function configureStocks(data){
  setStocks([]);
  setNetStock(data.stockTotal);
  setMoney(data.money);
  data.stocks.forEach((element, i) => {
    setStocks(oldArray => [...oldArray, {key: i, stockName: element.stockName, stats: [element.volumeOwned, data.worths[i]]}]);
  });

}

function getProfileDetails(){
  fetch(props.link + "/profiledata", {
    method: 'POST',
    mode: 'cors',
    headers: {"Accept": "application/json", "Content-Type": "application/json"},
    body: JSON.stringify({username: props.currentUsername}) //accept is not necessary
})
  .then((res) => res.json())
  .then((res) => {
  configureCards("Recents", res.recent);
  configureCards("Gained", res.gained);
  configureCards("Lost", res.lost);
  configureStocks(res.package);
  setUpdates(1);
  });
}
if(props.currentUsername!=="" && updates===0){
  getProfileDetails();
}


const [width, setWidth] = useState(window.innerWidth);

const updateWidth = () => {
    if(document.getElementById("wrapper")) {
      setWidth(document.getElementById("wrapper").getBoundingClientRect().width);
      console.log(document.getElementById("wrapper").getBoundingClientRect().width);
    } 
  };

useEffect( () => {
  window.addEventListener("resize", updateWidth);
  updateWidth();
});




return (
<div>
{props.currentUsername!=="" ?
<div className="background-filler">
<div className="wrapper" id="wrapper">


<div className="activity-header">
  <div className="activity-header-div">
    <h2 className="profile-activity-top-text" style={{color: "#0f52ba"}}>Net Stock:</h2>
    <h2 className="profile-activity-top-text" style={{color: "#0f52ba"}}>${netStock}</h2>

  </div>
  <div className="activity-header-div">
    <h1 className="profile-activity-top-title">Activity</h1>
  </div>
  <div className="activity-header-div">
    <h2 className="profile-activity-top-text" style={{color: "#50c878", textAlign: "right"}}>Money:</h2>
    <h2 className="profile-activity-top-text" style={{color: "#50c878", textAlign: "right"}}>${money}</h2>
  </div>
</div>


<ProfileCardSection 
rerouteStock={props.rerouteStock}
name="Recently Bought"
cards = {recents}
statNames={["Date", "Owned"]}
cardType = {2}
width={width}
/>
<ProfileCardSection
rerouteStock={props.rerouteStock}
name="Gained Most"
cards = {gained}
statNames={["Gained", "Owned"]}
cardType = {3}
width={width}
 />
<ProfileCardSection
rerouteStock={props.rerouteStock}
name="Lost Most"
cards = {lost}
statNames={["Lost", "Owned"]}
cardType = {1 }
width={width}
 />

<div className="your-stocks-header">
  <h1 className="profile-stocks-top-title"><u>Your Stocks</u></h1>
</div>
<ProfileCardSection2
rerouteStock={props.rerouteStock}
cards = {stocks}
width={width}
/>
</div>
</div>
:
<div>
<Message message="Login to see Profile" color="black" />
</div>
}

</div>
);
}
export default Profile;