import React, {useState} from "react";
function SendMessage(props){

let [writtenMessage, setWrittenMessage] = useState("");
function handleSubmit(event){
   event.preventDefault();
   props.func(writtenMessage);
}


return(
<div className="friend-contact-section">

<h1>Message Form</h1>
<div className="mb-3">
<label htmlFor="exampleFormControlInput1" className="form-label">Friend Username</label>
<input name="username" className="form-control" id="exampleFormControlInput1" value={props.username} readOnly />
</div>
<div className="mb-3">
<label htmlFor="exampleFormControlTextarea1" className="form-label">Message</label>
<textarea onChange={(event) => setWrittenMessage(event.target.value)}name="message" className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
</div>
<div className="col-auto">
<button onClick={handleSubmit} type="submit" className="btn btn-success mb-3">Send Message</button>
</div>
</div>
);
}
export default SendMessage;