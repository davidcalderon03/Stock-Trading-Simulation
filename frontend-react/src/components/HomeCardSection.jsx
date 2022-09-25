import React, {useEffect, useState} from "react";
import HomeCard from "./HomeCard";
function HomeCardSection(props){

const [width, setWidth] = useState(window.innerWidth);
const [height, setHeight] = useState(window.innerHeight);
const updateWidthAndHeight = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
    
  };
useEffect(() => {
    window.addEventListener("resize", updateWidthAndHeight);
    return () => window.removeEventListener("resize", updateWidthAndHeight);
});
let arr = props.cards.map((x) => x);
arr.splice(0, arr.length- parseInt(width / 350));

return (<div className="home-card-section">
<h1>{props.name}</h1>
<div className="row">
    {arr.map((element, i) => (
        <HomeCard
        rerouteStock={props.rerouteStock}
        key={i}
        stock={element}
         />
    ))}
</div>
</div>);
}
export default HomeCardSection;