import React, {useState} from "react";
function TradeRequest(props){

let [tradeType, setTradeType] = useState("Buying");
let [stockName, setStockName] = useState("");
let [forUnitPrice, setForUnitPrice] = useState(0);
let [volume, setVolume] = useState(0);
let [total, setTotal] = useState(0);

function configureTotal(up, vol){
  if(up!==0 && vol!==0){
    setTotal(Math.round(up * vol * 100)/100);
  }
}

function handleSubmit(event){
   event.preventDefault();
   props.func(tradeType, stockName, forUnitPrice, volume);
}

return(
<div className="friend-contact-section">
  <h1>Trade Request Form</h1>
<div className="request-form">
<form action="/sendtraderequest" method="post">
  <input style={{display: "none"}} name="username" value={props.friendUsername} readOnly />
  <table className="table caption-top table-striped">
    <thead>
      <tr>
        <th colSpan="2" scope="col">
          <div className="row" style={{height: "100%"}}>
          <div className="col form-check">
            <input onChange={(event) => setTradeType(event.target.value)} className="form-check-input" type="radio" name="tradeType" id="flexRadioDefault1" value="Buying" checked />
            <label className="form-check-label" htmlFor="flexRadioDefault1">
              Buying
            </label>
          </div>
          <div className="col form-check">
            <input onChange={(event) => setTradeType(event.target.value)} className="form-check-input" type="radio" name="tradeType" id="flexRadioDefault2" value="Selling" />
            <label className="form-check-label" htmlFor="flexRadioDefault2">
              Selling
            </label>
          </div>
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Stock Name:</th>
        <td>
          <div className="input-group input-group-lg">
              <input onChange={(event) => setStockName(event.target.value)} name="stockName" type="text" className="form-control input-group-lg" placeholder="Stock" aria-label="Server" />
          </div>
        </td>
      </tr>
      <tr>
        <th scope="row">Unit Price:</th>
        <td>
          <div className="input-group input-group-lg">
              <input onChange={(event) => {setForUnitPrice(event.target.value); configureTotal(event.target.value, volume)}} name="forUnitPrice" type="text" id="up" className="form-control input-group-lg" placeholder="Price" aria-label="Server" />
          </div>
        </td>
      </tr>
      <tr>
        <th scope="row">Quantity:</th>
        <td>
          <div className="input-group input-group-lg">
              <input onChange={(event) => {setVolume(event.target.value); configureTotal(forUnitPrice, event.target.value)}} name="volume" type="text" id="qty" className="form-control input-group-lg" placeholder="Qty" aria-label="Server" />   
          </div>
        </td>
      </tr>
      <tr>
        <th scope="row">Total Price:</th>
        <td id="total" type="text">${total}</td>
      </tr>
    </tbody>
  </table>
  <div className="request-form-submit-div">
    <button onClick={handleSubmit} type="submit" className="btn btn-lg btn-success request-form-submit">Request</button>
  </div></form></div>
  </div>
);
}
export default TradeRequest;