import React from "react";
import ProfileCard2 from "./ProfileCard2";

function ProfileCardSection2(props){
return(
<div className="container-fluid profile-stocks">
{/* {props.cards.length!==0? <div> */}
{props.cards.map((element) => (
   <ProfileCard2 
   width = {props.width}
   stockName = {element.stockName}
   qty = {element.stats[0]}
   total = {element.stats[1]}
   key={element.key}
   rerouteStock={props.rerouteStock}
   />
))}
{/* </div>:<div></div>} */}
</div>
);
}
export default ProfileCardSection2;