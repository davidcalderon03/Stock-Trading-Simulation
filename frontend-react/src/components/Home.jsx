import React, {useState, useEffect} from "react";
import HomeCardSection from "./HomeCardSection";

function Home(props){
  let cards = [{key: 1, stockName: "Loading!", totalBought: 99, lastPrice: 99, lastDifference: 99}, {key: 2, stockName: "Loading!", totalBought: 99, lastPrice: 99, lastDifference: 99}, {key: 3, stockName: "Loading!", totalBought: 99, lastPrice: 99, lastDifference: 99}, 
  {key: 4, stockName: "Loading!", totalBought: 99, lastPrice: 99, lastDifference: 99}, {key: 5, stockName: "Loading!", totalBought: 99, lastPrice: 99, lastDifference: 99}, {key: 6, stockName: "Loading!", totalBought: 99, lastPrice: 99, lastDifference: 99}];
  let [cards1, setCards1] = useState(cards);
  let [cards2, setCards2] = useState(cards);
  let [cards3, setCards3] = useState(cards);

  useEffect( () => {
  if(cards1.length===6){
  fetch(props.link + "/gethome")
  .then((res) => res.json())
  .then((res) => {
    setCards1(res.highestBuys);
    setCards2(res.increasedMost);
    setCards3(res.decreasedMost);
  });
}
}, []);


  return (<div>
  <div className="front-ad">
  <div className="wrapper wrapper-home">
  <div className="title-divs">
  <h1 className="main-title text-white">Your Stocks, Simulated</h1>
  <p className="ad-p text-white">The Stock Exchange is the perfect way to have fun simulating the stock trading experience
  at no cost! Sign up today to try it out! You might even make a couple fake dollars!</p>
  </div>
  <div className="title-divs">
  <img style={{top: "5%", left: "10%"}} className="home-img" src={require("./../images/stock-1.jpg")} alt="Money Image" />
  <img style={{top: "20%", left: "25%"}} className="home-img" src={require("./../images/stock-2.jpeg")} alt="Money Image" />
  <img style={{top: "35%", left: "40%"}} className="home-img" src={require("./../images/stock-3.jpeg")} alt="Money Image" />
  </div>
</div>
</div>
<div className="featured text-white">
<div className="wrapper">
<div style ={{height: "20px"}}></div>
<HomeCardSection
rerouteStock={props.rerouteStock}
name = "Most Popular Now"
cards = {cards1}
/>
<HomeCardSection
rerouteStock={props.rerouteStock}
name = "Going Up"
cards = {cards2}
/>
<HomeCardSection
rerouteStock={props.rerouteStock}
name = "Going Down"
cards = {cards3}
/>
</div>
</div>
</div>);
// return <h1>Hello</h1>
}
export default Home;