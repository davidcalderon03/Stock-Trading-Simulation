import React, {useState} from "react";
import {NavLink, Link} from "react-router-dom";

function Navbar(props) {


  let [searchedStock, setSearchedStock] = useState("");

    return(
    <nav className="navbar navbar-expand-md navbar-dark bg-dark">
    <div className="container-fluid" style = {{padding: "0"}}>
      <a className="navbar-brand" to="/" style={{margin: "0 30px"}}>Stock Trading Simulation</a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div style= {{backgroundColor: "#212529"}}className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0 nav-pills nav-fill nav-justified">
          <li className="nav-item">
            <NavLink to="/" className="nav-link">Home</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/profile" className="nav-link">Profile</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/stocks" className="nav-link">Stocks</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/friends" className="nav-link">Friends</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/login" className="nav-link">Login</NavLink>
          </li>
        </ul>
        {/* <form className="d-flex" onSubmit={(event) => {event.preventDefault(); props.rerouteStock(searchedStock.toUpperCase())}}>
          <input onChange={(event)=> setSearchedStock(event.target.value)} className="form-control me-2" type="search" placeholder="Find Stock" aria-label="Search"></input>
          <Link type="submit" onClick={ () => props.rerouteStock(searchedStock.toUpperCase())} to="/stocks" className="btn btn-outline-success">Search</Link> 
        </form> */}
      </div>
    </div>
  </nav>
    );
}

export default Navbar;