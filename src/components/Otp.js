import { useState } from 'react';
import { otpFields } from "../constants/formFields";
import FormAction from "./FormAction";
import FormExtra from "./FormExtra";
import Input from "./Input";


const fields=otpFields;
let fieldsState = {};
fields.forEach(field=>fieldsState["Otp"+field.id]='');


export default function Otp(loginFields){
    const fields = loginFields["param"];
    const [loginState,setLoginState]=useState(fieldsState);

    const handleChange=(e)=>{
        setLoginState({...loginState,[e.target.id]:e.target.value})
    }

    const handleSubmit=(e)=>{
        e.preventDefault();
        authenticateUser();
    }

    //Handle Login API Integration here
    const authenticateUser = () =>{
        
     
        // let loginFields={
        //         vid:loginState['mosip-vid'],
        //         password:loginState['password']
        // };
           
        // const endpoint=`https://api.loginradius.com/identity/v2/auth/login?apikey=${apiKey}&apisecret=${apiSecret}`;
        //  fetch(endpoint,
        //      {
        //      method:'POST',
        //      headers: {
        //      'Content-Type': 'application/json'
        //      },
        //      body:JSON.stringify(loginFields)
        //      }).then(response=>response.json())
        //      .then(data=>{
        //         //API Success from LoginRadius Login API
        //      })
        //      .catch(error=>console.log(error))
         }
    

    return(
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="-space-y-px">
            {
                fields.map(field=>
                        <Input
                            key={"Otp_"+field.id}
                            handleChange={handleChange}
                            value={loginState["Otp_"+field.id]}
                            labelText={field.labelText}
                            labelFor={field.labelFor}
                            id={"Otp_"+field.id}
                            name={field.name}
                            type={field.type}
                            isRequired={field.isRequired}
                            placeholder={field.placeholder}
                    />
                
                )
            }
        </div>

        <div className="flex items-center justify-between ">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
            Resend OTP?
          </a>
        </div> 
      </div>
        <FormAction handleSubmit={handleSubmit} text="Login"/>

      </form>
    )
}