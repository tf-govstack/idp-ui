import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingIndicator from '../common/LoadingIndicator';
import { otpFields } from "../constants/formFields";
import { post_AuthenticateUser } from '../services/AuthService';
import FormAction from "./FormAction";
import Input from "./Input";


const fields = otpFields;
let fieldsState = {};
fields.forEach(field => fieldsState["Pin" + field.id] = '');


export default function Pin(loginFields) {
  const fields = loginFields["param"];
  const [loginState, setLoginState] = useState(fieldsState);
  const [error, setError] = useState(null)
  const [status, setStatus] = useState("LOADED")

  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    authenticateUser();
  }

  //Handle Login API Integration here
  const authenticateUser = async () => {

    try {
      let transactionId = searchParams.get("transactionId");

      let uin = loginState['Pin_mosip-uin'];
      let challengeType = "PIN";
      let challenge = loginState['Pin_pin'];

      let challengeList = [
        {
          authFactorType: challengeType,
          challenge: challenge
        }
      ]

      setStatus("LOADING");

      const authenticateResponse = await post_AuthenticateUser(transactionId, uin, challengeList);

      setStatus("LOADED");

      const { response, errors } = authenticateResponse

      if (errors != null && errors.length > 0) {
        setError("Authentication failed: " + errors[0].errorCode)
        return;
      } else {
        setError(null)
        navigate("/consent?transactionId=" + response.transactionId, { replace: true });
      }
    }
    catch (errormsg) {
      setError(errormsg.message)
      setStatus("ERROR")
    }
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="-space-y-px">
        {
          fields.map(field =>
            <Input
              key={"Pin_" + field.id}
              handleChange={handleChange}
              value={loginState["Pin_" + field.id]}
              labelText={field.labelText}
              labelFor={field.labelFor}
              id={"Pin_" + field.id}
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
            className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-cyan-900">
            Remember me
          </label>
        </div>
      </div>
      {
        <div>
          {
            (status === "LOADING") && <LoadingIndicator size="medium" message="Authenticating. Please wait...." />
          }
        </div>
      }
      {
        (status !== "LOADING") && error && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
            {error}
          </div>
        )
      }
      <FormAction handleSubmit={handleSubmit} text="Login" />
    </form>
  )
}