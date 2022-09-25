import React, {useState} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import Profile from "./Profile";
import Stocks from "./Stocks";
import Friends from "./Friends";
import Login from "./Login";

function App(){
const [username, setUsername] = useState(window.localStorage.getItem("myUsername") || "");
const [reroutedStock, setReroutedStock] = useState("");
// const link = "https://stock-trading-simulation-api.herokuapp.com";
const link = "http://localhost:3001"

function changeUsername(newUsername){
    window.localStorage.setItem("myUsername", newUsername);
    setUsername(newUsername);
}
//Clean up code
//Make frontend look better
   return(
    <Router>
        <Navbar rerouteStock={setReroutedStock} />
        <Routes>
            <Route exact path="/" element={<Home currentUsername={username} changeUsername={changeUsername} rerouteStock={setReroutedStock} link={link} />} />
            <Route path="/profile" element={<Profile currentUsername={username} changeUsername={changeUsername} rerouteStock={setReroutedStock} link={link} />} />
            <Route path="/stocks" element={<Stocks currentUsername={username} changeUsername={changeUsername} reroutedStock={reroutedStock} link={link} />} />
            <Route path="/friends" element={<Friends currentUsername={username} changeUsername={changeUsername} link={link} />} />
            <Route path="/login" element={<Login currentUsername={username} changeUsername={changeUsername} link={link} />}  />
        </Routes>
    </Router>
   );
}
export default App;