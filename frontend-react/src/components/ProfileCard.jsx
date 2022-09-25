import React from "react";
import {Link} from "react-router-dom";
function ProfileCard(props){
    let temp = props.statNames[0]!="Date"? "$": "";
    return(
    <div className="col">
        <div className={"card profile-recommend-card-" +props.cardType}>
            <div className="card-body">
                <h5 className="card-title card-title-other">{props.stockName}</h5>
                <h4 className="card-text card-text-other">{props.statNames[0]}: {temp}{props.stats[1]}</h4>
                <h4 className="card-text card-text-other">{props.statNames[1]}: {props.stats[0]}</h4>
                <Link onClick={ () => props.rerouteStock(props.stockName)} to="/stocks" className={"btn btn-secondary profile-recommend-button-" + props.cardType}>View Stock</Link> 
              </div>
        </div>
    </div>
    );
}
export default ProfileCard;