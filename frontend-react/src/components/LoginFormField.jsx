import React from "react";

function LoginFormField(props){

  function handleChange(event){
    props.changeFunction(event.target.value);
  }

   return(
      <div className="col-lg-6">
      <label style={{color: "black"}} htmlFor="validationCustom01" className="form-label">{props.fieldName}</label>
      <input value = {props.value} onChange={handleChange} type="text" name={props.submitName} className="form-control" id="validationCustom01" required />
    </div>
  );
}
export default LoginFormField;