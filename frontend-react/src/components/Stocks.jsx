import React, {useState, useEffect} from "react";
import Message from "./Message";

function Stocks(props){
    let [money, setMoney] = useState(0);
    let [stockSearch, setStockSearch] = useState("");
    let [currentStock, setCurrentStock] = useState("");
    let [currentHigh, setCurrentHigh] = useState(0);
    let [volumeOwned, setVolumeOwned] = useState(0);

    let [volumeTrade, setVolumeTrade] = useState(0);

    let [message, setMessage] = useState("");
    let [messageColor, setMessageColor] = useState("red");    

    let [seeTrade, setSeeTrade]  = useState(false);
    let [tradeType, setTradeType] = useState("Buy");

    let [total, setTotal] = useState(0);
    function configureTotal(volume){
      if(currentHigh!==0 && volume!==0){
        setTotal(Math.round(currentHigh*volume*100)/100);
      }
    }


    function checkMoney(){
      fetch(props.link + "/checkmoney", {
        method: 'POST',
        mode: 'cors',
        headers: {"Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({username: props.currentUsername}) //accept is not necessary
    }).then((res) => res.json())
      .then((res) => {
          setMoney(Math.round(res.money*100)/100);
      });
    }
    if(props.currentUsername!=="" && money===0){
    checkMoney();
    }

    function findStock(name){
      fetch(props.link + "/searchstock", {
        method: 'POST',
        mode: 'cors',
        headers: {"Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({stockName: name, username: props.currentUsername}) //accept is not necessary
    }).then((res) => res.json())
    .then((res) => {
       if(res.high===0){
         setMessage("Stock Not Found.");
       }
       else{
         setCurrentStock(name);
         setCurrentHigh(Math.round(res.high*100)/100);
         setVolumeOwned(res.volumeOwned);
         setMessage("");
         setSeeTrade(false);
       }
    });
    }
    function tradeStock(){
      if(currentStock!==""){
        fetch(props.link + "/" + tradeType.toLowerCase() + "stock", {
          method: 'POST',
          mode: 'cors',
          headers: {"Accept": "application/json", "Content-Type": "application/json"},
          body: JSON.stringify({stockName: currentStock, unitPrice: currentHigh, quantity: volumeTrade, username: props.currentUsername}) //accept is not necessary
      }).then((res) => res.json())
      .then((res) => {
        setMessage(res.message);
        setMessageColor("green");
        setTimeout(()=>{
          setCurrentStock("");
          setMessage("");
          window.location.reload();
          }, "1500")
      });
      }
    }

    useEffect (() => {
      if(props.reroutedStock!==""){
        findStock(props.reroutedStock);
      }
    }, []);


    return (
        <div>
        <div className="stocks-search-section bg-dark justify-content-center">
        <form className="d-flex">
        {props.currentUsername!=="" ?
          <input onChange={(event) => setStockSearch(event.target.value.toUpperCase())}className="form-control stocks-searchbar me-2" name="stockName" type="search" placeholder="Search for any stock!" aria-label="Search" autoComplete="off" />:
          <input onChange={(event) => setStockSearch(event.target.value.toUpperCase())}className="form-control stocks-searchbar me-2" name="stockName" type="search" placeholder="Login to Trade Stocks!" aria-label="Search" autoComplete="off" readOnly />}
          <button onClick={(event) => {event.preventDefault(); findStock(stockSearch);}} className="btn btn-success" type="submit">Search</button>
        </form>
      </div>
      {props.currentUsername !== "" ? 
      <h1 style={{color: "green"}}>Money: ${money}</h1>
      :
      <Message message="Login to see Stocks" color="black" />
      }
      <Message message={message} color={messageColor} />

{currentStock!=="" ? <div>



    <div className="parchment">
      <h1 className="stocks-header">Result: {currentStock}</h1>
      <h1 className="stocks-header"> Unit Price: ${currentHigh}</h1>
      <h1 className="stocks-header">Owned: {volumeOwned}</h1>
      <button onClick={() => setSeeTrade(!seeTrade)} type="button" className="btn btn-lg btn-success trade-button">Trade</button>
    </div>

      {/* old way of showing stock info */}
  {/* <div className="stocks-info-section container-fluid">
    <div className="row align-items-center" style={{height: "100%"}}>
      <div className="col card stocks-info-card">
        <div className="card-body">
          <h2 id="custom" className="card-header stocks-header">Result:</h2>
          <h1 className="card-text">{currentStock}</h1>
        </div>
      </div>
      <div className="col card stocks-info-card">
        <div className="card-body">
          <h2 className="card-header stocks-header"> Unit Price:</h2>
          <h1 id="up2" type="text" className="card-text" aria-label="Server" readOnly>${currentHigh} </h1>
        </div>
      </div>
      <div className="col card stocks-info-card">
        <div className="card-body">
          <h2 className="card-header stocks-header">Owned:</h2>
          <h1 className="card-text">{volumeOwned}</h1>
          </div>
        </div>
      <div className="col card stocks-info-card">
        <button onClick={() => setSeeTrade(!seeTrade)} type="button" className="btn btn-lg btn-danger stocks-info-button">Trade</button>
        <button onClick={() => setSeeGraph(!seeGraph)} type="button" className="btn btn-lg btn-danger stocks-info-button">Graph</button>
      </div>
    </div>
    </div> */}
    
    </div>:<div></div>}

{currentStock!== "" && seeTrade ?
<div>
{/* <img className="arrow-image" src={require("./../images/arrow.png")} alt="Arrow Image" /> */}
<div className="parchment">
<select onChange={(event) => setTradeType(event.target.value)} className="new-stock-input" aria-label=".form-select-lg example">
      <option value="Buy">Buy</option>
      <option value="Sell">Sell</option>
      </select>
<input autoComplete="off" onChange={(event) => {setVolumeTrade(event.target.value); configureTotal(event.target.value); }} style={{textAlign: "center"}} placeHolder="Quantity" name="quantity" type="text" className="new-stock-input" aria-label="Server" />
<input onChange={(event)=>setVolumeTrade(event.target.value)} style={{backgroundColor: "#eeeeee"}} type="text" className="new-stock-input" aria-label="Server" value={"Total: $" + total} readOnly></input>
<button onClick={tradeStock} type="submit" className="btn btn-lg btn-success trade-button">{tradeType} Stock</button>
</div>


  {/* <div className="stocks-buy-section container-fluid">
    <div className="row align-items-center" style={{height: "100%"}}>
      <div className="col-4">
        <div className="col card stocks-buy-card">
          <select onChange={(event) => setTradeType(event.target.value)} className="form-select form-select-lg" aria-label=".form-select-lg example">
          <option value="Buy">Buy</option>
          <option value="Sell">Sell</option>
          </select>

        </div>
      </div>
      <div className="col-4">
        <div className="mb-3 row stocks-buy-input">
          <label htmlFor="inputPassword" className="col-sm-4 col-form-label">Quantity:</label>
          <div className="col-sm-8">
            <input autoComplete="off" onChange={(event) => {setVolumeTrade(event.target.value); configureTotal(event.target.value); }} style={{textAlign: "center"}} name="quantity" type="text" className="form-control" id="qty" aria-label="Server" />
          </div>
        </div>
        <div className="mb-3 row stocks-buy-input">
          <label htmlFor="inputPassword" className="col-sm-4 col-form-label">Total:</label>
          <div className="col-sm-8">
            <input onChange={(event)=>setVolumeTrade(event.target.value)} style={{textAlign: "center"}} type="text" className="form-control" id="total" aria-label="Server" value={"$" + total} readOnly></input>
          </div>
        </div>
      </div>
      <div className="col-3 card stocks-buy-card">
        <button onClick={tradeStock} type="submit" className="btn btn-lg btn-success stocks-buy-button">{tradeType} Stock</button>
      </div>
      <div className="col-3">
      </div>
    </div>
  </div> */}



</div>
:<div></div>}

</div>
);
}
export default Stocks;