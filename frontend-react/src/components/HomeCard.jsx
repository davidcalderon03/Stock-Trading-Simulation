import React, {useState} from "react";
import {Link} from "react-router-dom";

function HomeCard(props){
  function stockReroute(stockName){
    fetch(props.link + "/postreroutedstock", {
        method: 'POST',
        mode: 'cors',
        headers: {"Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({stockName: stockName}) //accept is not necessary
    });
}

    return(
    <div className="col">
    <div className="color-midnight-blue card">
      <div className="card-body">
        <h5 className="card-title">{props.stock.stockName}</h5>
        <h5 className="card-title">Total Bought: {props.stock.totalBought}</h5>
        <h5 className="card-title">Difference: ${props.stock.lastDifference}</h5>
        <h1 className="card-text">${Math.round(props.stock.lastPrice*100)/100}</h1>
        <Link onClick={ () => props.rerouteStock(props.stock.stockName)} to="/stocks" className="btn btn-secondary">View Stock</Link> 
      </div>
    </div>
  </div>
);
}
export default HomeCard;