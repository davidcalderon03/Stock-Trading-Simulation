import React from "react";

function Message(props){
   let color = "red";
   if(props.color){
      color = props.color
   }
   if(props.message===""){
      return <div></div>
   }
   else{
   return (
    <div className="alert" style={{backgroundColor: color}}>
      {/* <span class="closebtn" onClick={()=>this.parentElement.style.display='none'}>&times;</span>  */}
      <strong>{props.message}</strong>
   </div>
   );
   }
}
export default Message;