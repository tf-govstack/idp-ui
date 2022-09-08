import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingIndicator from '../common/LoadingIndicator';
import { otpFields } from "../constants/formFields";
import { post_AuthenticateUser } from '../services/AuthService';
import FormAction from "./FormAction";
import Input from "./Input";


const fields = otpFields;
let fieldsState = {};
fields.forEach(field => fieldsState["Otp" + field.id] = '');


export default function Otp(loginFields) {
  const fields = loginFields["param"];
  const [loginState, setLoginState] = useState(fieldsState);
  const [error, setError] = useState(null)
  const [transactionId, setTransactionId] = useState(null)
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


  useEffect(() => {
    setTransactionId(searchParams.get("transactionId"));
  }, [])

  //Handle Login API Integration here
  const authenticateUser = async () => {

    try {
      let vid = loginState['Otp_mosip-vid'];
      let challengeType = "OTP";
      let challenge = loginState['Otp_otp'];

      let challengeList = [
        {
          type: challengeType,
          challenge: challenge
        }
      ]

      setStatus("LOADING");

      const authenticateResponse = await post_AuthenticateUser(transactionId, vid, challengeList);

      setStatus("LOADED");

      const { response, errors } = authenticateResponse

      if (errors != null && errors.length > 0) {
        console.log(errors);
        setError("Authentication failed: " + errors[0].errorCode)
        return;
      } else {
        console.log(response);
        setError(null)
        navigate("/consent", { replace: false });
      }
    }
    catch (errormsg) {
      // setError(errormsg)
      // setStatus("ERROR")
    }
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="-space-y-px">
        {
          fields.map(field =>
            <Input
              key={"Otp_" + field.id}
              handleChange={handleChange}
              value={loginState["Otp_" + field.id]}
              labelText={field.labelText}
              labelFor={field.labelFor}
              id={"Otp_" + field.id}
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
      {
        (transactionId === null || transactionId === "") && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
            Invalid transactionId
          </div>
        )
      }
      {
        (transactionId !== null && transactionId !== "") && <FormAction handleSubmit={handleSubmit} text="Login" />
      }
    </form>
  )
}