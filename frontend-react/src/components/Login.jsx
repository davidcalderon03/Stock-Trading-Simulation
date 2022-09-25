import React, {useState} from "react";
import Message from "./Message";
import LoginForm from "./LoginForm";
function Login(props){
let [message, setMessage] = useState("");
let [messageColor, setMessageColor] = useState("red");
let fullAccountParts = [{key: 1, fieldName: "Username", submitName: "Username"}, {key: 2, fieldName: "First Name", submitName: "FirstName"}, 
    {key: 3, fieldName: "Last Name", submitName: "LastName"}, {key: 4, fieldName: "Email", submitName: "Email"}, {key: 5, fieldName: "City", submitName: "City"}, 
    {key: 6, fieldName: "State", submitName: "State"}, {key: 7, fieldName: "Password", submitName: "Password"}, {key: 8, fieldName: "Confirm Password", submitName: "PasswordMatch"}];
let loginParts = [{key: 1, fieldName: "Username", submitName: "Username"}, {key: 2, fieldName: "Password", submitName: "Password"}];

function create(args){
fetch(props.link + "/create", {
    method: 'POST',
    mode: 'cors',
    headers: {"Accept": "application/json", "Content-Type": "application/json"},
    body: JSON.stringify({username: args.username, firstName: args.firstName, 
        lastName: args.lastName, email: args.email, city: args.city, 
        state: args.state, password: args.password, passwordMatch: args.passwordMatch}) //accept is not necessary
}).then(res => res.json())
.then( res => {
    if(res.message!=="Success"){
        setMessage(res.message);
    }
    else{
        setMessage("");
        props.changeUsername(args.username);
    }
    props.reload();
});
}
function edit(args){
fetch(props.link + "/editprofile", {
method: 'POST',
mode: 'cors',
headers: {"Accept": "application/json", "Content-Type": "application/json"},
body: JSON.stringify({username: props.currentUsername, newUsername: args.username, firstName: args.firstName, 
    lastName: args.lastName, email: args.email, city: args.city, 
    state: args.state, password: args.password}) //accept is not necessary
}).then(res => res.json())
.then( res => {
if(res.message!=="Success"){
    setMessage(res.message);
    setMessageColor("red");
}
else{
    setMessage(res.message);
    setMessageColor("green");
}
setTimeout(() => {
    setMessage("");
    props.reload();
}, "1000");
});
}
function login(args){  //for doing a post request
    console.log(args);
fetch(props.link + "/login", {
    method: 'POST',
    mode: 'cors',
    headers: {"Accept": "application/json", "Content-Type": "application/json"},
    body: JSON.stringify({username: args.username, password: args.password}) //accept is not necessary
}).then(res => res.json())
.then( res => {
    console.log(res.message);
    if(res.message!=="Success"){
        setMessage(res.message);
        console.log(args.username);
    }
    else{
        setMessage("");
        props.changeUsername(args.username);
    }
});
}
    if(props.currentUsername===""){
        return (
        <div>
        <Message message={message} color={messageColor} />
        <LoginForm title="Log In Here" inputs={loginParts} func={login} color1="#a5aaab" color2="white" btnName="Login" height="40vh" />
        <LoginForm title="Or, Create An Account" inputs={fullAccountParts} func={create} color1="#d2b6e5" color2="white" btnName="Create" height="60vh" />
        </div>
        );
    }
    else{
        return (
        <div>
        <Message message={message} color={messageColor} />
        <form className="row g-3 needs-validation" onSubmit={(event) => {event.preventDefault(); props.changeUsername(""); }}>
        <div style={{textAlign: "center", backgroundColor: "black", paddingBottom: "20px"}} className="col-12">
        <h1 style={{fontSize: "3rem", color: "green"}}>Logged In As {props.currentUsername}.</h1>
        <button className="btn btn-primary" type="submit">Logout</button>
        </div>
        </form>
        <LoginForm title="Edit Profile" inputs={fullAccountParts} func={edit} color1="#add8e6" color2="white" btnName="Save Changes" height="100vh"/>
        </div>
        );
    }
}
export default Login;