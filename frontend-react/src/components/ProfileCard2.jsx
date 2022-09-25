import React from "react";
import {Link} from "react-router-dom";

function ProfileCard2(props){ 
   return (
      <div className="profile-stock">
        <h3 className="card-title-other">{props.stockName}</h3>
        <h4 className="card-text-other">Owned: {props.qty}</h4>
        <h4 className="card-text-other">Worth: ${props.total}</h4>
        <div className="profile-stock-button">
         <Link onClick={ () => props.rerouteStock(props.stockName)} to="/stocks" className="profile-stock-link">View</Link>
        </div>
        </div>
   );
}
export default ProfileCard2;