import React, {useState, useEffect} from "react";
import { useRef } from "react";
import ProfileCard from "./ProfileCard";

function ProfileCardSection(props){




let arr = props.cards.map((x) => x);
arr.splice(0, -3 + arr.length- parseInt(props.width / 500));





return (
<div className={"text-white recommend-section-" + props.cardType} style={{padding: 6 - arr.length + "rem"}}>
   <h1 className="recommend-title">{props.name}:</h1>
   <div className="row align-items-center">
   {/* {props.cards.length!==0? <div> */}
   {arr.map((element)=> (
      <ProfileCard
      key={element.key}
      stockName = {element.stockName}
      stats={element.stats}
      statNames={props.statNames}
      cardType = {props.cardType}
      rerouteStock={props.rerouteStock}
      />
   ))}
   {/* </div>:<div></div>} */}
   </div>
</div>
);
}
export default ProfileCardSection;