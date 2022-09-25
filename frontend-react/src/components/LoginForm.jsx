import React, {useState} from "react";
import LoginFormField from "./LoginFormField";

function LoginForm(props){

let arr = props.inputs;
let [username, setUsername] = useState("");
let [firstName, setFirstName] = useState("");
let [lastName, setLastName] = useState("");
let [email, setEmail] = useState("");
let [city, setCity] = useState("");
let [state, setState] = useState("");
let [password, setPassword] = useState("");
let [passwordMatch, setPasswordMatch] = useState("");

function handleUsername(newValue){setUsername(newValue);}
function handleFirstName(newValue){setFirstName(newValue);}
function handleLastName(newValue){setLastName(newValue);}
function handleEmail(newValue){setEmail(newValue);}
function handleCity(newValue){setCity(newValue);}
function handleState(newValue){setState(newValue);}
function handlePassword(newValue){setPassword(newValue);}
function handlePasswordMatch(newValue){setPasswordMatch(newValue);}



function handleSubmit(event){
   event.preventDefault();
   if(city===""){
      props.func({username: username, password: password});
   }
   else{
      props.func({username: username, firstName: firstName, lastName: lastName, email: email, city: city, state: state, password: password, passwordMatch: passwordMatch});
   }
}

return (
<div>
<div style={{backgroundColor: props.color1, height: props.height}} className="login-divide">
<h1 className="login-divide-text">{props.title}</h1>
<div style={{backgroundColor: props.color2}} className="login-form">
<form className="row g-3 needs-validation" onSubmit={handleSubmit}>
      {arr.map((element) => (
         <LoginFormField
         key={element.key}
         fieldName = {element.fieldName}
         submitName = {element.submitName}
         changeFunction = {eval("handle" + element.submitName)}
         value = {eval(element.submitName.charAt(0).toLowerCase() + element.submitName.substring(1))}
         />
      ))}
   <div style={{textAlign: "center"}} className="col-12">
    <button className="btn btn-primary" type="submit">{props.btnName}</button>
  </div>
</form>
</div>
</div>
</div>
);
}
export default LoginForm;