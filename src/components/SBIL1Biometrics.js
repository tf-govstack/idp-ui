import React from "react";
import { useState } from 'react';

import FormAction from "./FormAction";
import Input from "./Input";

let captured = false;
let startPort = "4501";
const searchUrl = "http://127.0.0.1";
let fieldsState = {}; 


function discover(theUrl, port) {
    console.log("Discover");
}

function deviceInfo(theUrl){
    console.log("Device info");
}

function capture(theUrl){
    console.log("Catpure");
}

export default function SBIL1Biometrics(loginFields) {
    
    const fields = loginFields["param"];
    fields.forEach(field=>fieldsState["sbi_"+field.id]='');
    const [loginState,setLoginState]=useState(fieldsState);
    
    const handleChange=(e)=>{
        console.log("Attempt to handle change");
        setLoginState({...loginState,[e.target.id]:e.target.value})
    }

    const StartCapture=(e)=>{
        console.log("Start capture")
        e.preventDefault();
        captured = true;
        console.log("Start capture");
    }

    const Authenticate=()=>{

        captured = false;
        return ; //Send to server
    }

    return ( 
        <form className="mt-8 space-y-6" onSubmit={StartCapture}>
        <div className="-space-y-px">
        {
                fields.map(field=>
                        <Input
                            key={"sbi_"+field.id}
                            handleChange={handleChange}
                            value={loginState["sbi_"+field.id]}
                            labelText={field.labelText}
                            labelFor={field.labelFor}
                            id={"sbi_"+field.id}
                            name={field.name}
                            type={field.type}
                            isRequired={field.isRequired}
                            placeholder={field.placeholder}
                    />
                
                )
        }
        </div>
        <FormAction handleSubmit={StartCapture} text={(captured)?"Authenticate":"Capture"}/>
        </form>
    )

}
