import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingIndicator from "../common/LoadingIndicator";
import { ERROR, LOADED, LOADING } from "../constants/states";

export default function SignInOptions() {
  const [status, setStatus] = useState({ state: LOADED, msg: "" });
  const [singinOptions, setSinginOptions] = useState(null);

  const modalityIconPath = {
    PIN: "images/sign_in_with_otp.png",
    Inji: "images/Sign in with Inji.png",
    Biometrics: "images/Sign in with fingerprint.png",
  };

  useEffect(() => {
    setStatus({ state: LOADING, msg: "Loading" });

    //TODO integration with Auth factors
    // let oAuthDetails = JSON.parse(window.localStorage.getItem("oauth_details"));
    // let authFactors = oAuthDetails.authFactors;

    // if (authFactors === null || authFactors.size === 0) {
    //   setStatus({ state: ERROR, msg: "Options to signing not found!" });
    //   return;
    // }

    //dummy
    let loginOptions = [
      { value: "PIN", icon: modalityIconPath["PIN"], to: "login" },
      { value: "Inji", icon: modalityIconPath["Inji"], to: "login" },
      {
        value: "Biometrics",
        icon: modalityIconPath["Biometrics"],
        to: "login",
      },
    ];

    setSinginOptions(loginOptions);

    setStatus({ state: LOADED, msg: "" });
  }, []);

  return (
    <>
      <h1 class="text-center text-black-600 font-bold text-lg">
        Choose how you want to login:
      </h1>

      {status.state === LOADING && (
        <div>
          <LoadingIndicator size="medium" message={status.msg} />
        </div>
      )}

      {status.state === ERROR && (
        <>
          <div
            className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
            role="alert"
          >
            {status.msg}
          </div>
        </>
      )}

      {status.state === LOADED && singinOptions && (
        <div className="divide-y">
          {singinOptions.map((option) => (
            <Link class="text-gray-500 font-semibold text-base" to={option.to}>
              <div class="flex items-center">
                <img class="w-7" src={option.icon} />
                <span class="ml-4 mb-4 mt-4">Login with {option.value}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
