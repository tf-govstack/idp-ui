import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ErrorIndicator from "../common/ErrorIndicator";
import LoadingIndicator from "../common/LoadingIndicator";
import { otpFields } from "../constants/formFields";
import { LoadingStates as states } from "../constants/states";
import FormAction from "./FormAction";
import Input from "./Input";

const fields = otpFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState["Pin" + field.id] = ""));

export default function Pin({ param, authService, localStorageService }) {
  const { t } = useTranslation();

  const fields = param;
  const { post_AuthenticateUser } = { ...authService };
  const { getTransactionId, storeTransactionId } = { ...localStorageService };

  const [loginState, setLoginState] = useState(fieldsState);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(states.LOADED);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    authenticateUser();
  };

  //Handle Login API Integration here
  const authenticateUser = async () => {
    try {
      let transactionId = getTransactionId();

      let uin = loginState["Pin_mosip-uin"];
      let challengeType = "PIN";
      let challenge = loginState["Pin_pin"];

      let challengeList = [
        {
          authFactorType: challengeType,
          challenge: challenge,
        },
      ];

      setStatus(states.LOADING);
      const authenticateResponse = await post_AuthenticateUser(
        transactionId,
        uin,
        challengeList
      );

      setStatus(states.LOADED);

      const { response, errors } = authenticateResponse;

      if (errors != null && errors.length > 0) {
        setError(
          t("authentication_failed_msg", {
            errorMsg: errors[0].errorCode,
          })
        );
        return;
      } else {
        setError(null);
        storeTransactionId(response.transactionId);
        navigate("/consent", {
          replace: true,
        });
      }
    } catch (errormsg) {
      setError(errormsg.message);
      setStatus(states.ERROR);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="-space-y-px">
        {fields.map((field) => (
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
        ))}
      </div>

      <div className="flex items-center justify-between ">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-cyan-900"
          >
            {t("remember_me")}
          </label>
        </div>
      </div>
      {
        <div>
          {status === states.LOADING && (
            <LoadingIndicator size="medium" message={t("authenticating_msg")} />
          )}
        </div>
      }
      {status !== states.LOADING && error && <ErrorIndicator message={error} />}
      <FormAction handleSubmit={handleSubmit} text={t("login")} />
    </form>
  );
}
