import React from "react";

function FriendsTable(props){


return(
<div>

<table className="table caption-top table-dark table-striped table-friends">
      <caption>{props.name} ({props.data.length}) </caption>
      <thead>
        <tr>
         {props.headers.map((element, i) => (
            <th key={i} scope="col">{element}</th>  
         ))}
        </tr>
      </thead>
      <tbody> 
      {props.data.map((element, i)=> (
         <tr key={i}>
         {props.cols.map((colName, j) => (
            <td key={i.toString() + j.toString()} scope="row">{eval("element." + colName)}</td>
         ))}
         <td><button onClick={
            props.name==="Trade Requests"? 
            (event) => {event.preventDefault(); props.func(element.usernameSender, element.stockName, element.forUnitPrice, element.volume, element.tradeType);}:
            props.name==="Friends"?
            (event) => {event.preventDefault(); props.func(element.friendUsername);}:
            (event) => {event.preventDefault(); props.func(element.usernameSender);}
            } className="btn btn-success" type="submit">{props.buttonName}</button></td>
         </tr>
      ))}
      </tbody>
   </table>
   </div>
);
}
export default FriendsTable;