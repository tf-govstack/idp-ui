import React from "react";
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Error404, Error500 } from '../common/Errors';
import LoadingIndicator from "../common/LoadingIndicator";
import { post_OauthDetails } from '../services/AuthService';
const Authorize = () => {
  const [status, setStatus] = useState("LOADING")
  const [oAuthDetailResponse, setOAuthDetailResponse] = useState(null)
  const [error, setError] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  useEffect(() => {
    const callAuthorize = async () => {
      try {

        let nonce = searchParams.get("nonce");
        let client_id = searchParams.get("client_id");
        let scope = searchParams.get("scope");
        let response_type = searchParams.get("response_type");
        let redirect_uri = searchParams.get("redirect_uri");
        let display = searchParams.get("display");
        let prompt = searchParams.get("prompt");
        let acr_values = searchParams.get("acr_values");
        //let claims = searchParams.get("claims");

        const response = await post_OauthDetails(nonce, client_id, scope,
          response_type, redirect_uri, display, prompt, acr_values, {});

        // const response = await post_OauthDetails("string", "C01", "resident-service",
        //   "code", "http://anshulvanawat.info/", "page", "consent", "level1", {});

        setOAuthDetailResponse(response);
        setStatus("LOADED");
      }
      catch (errormsg) {
        setError(errormsg)
        setStatus("ERROR")
      }
    }

    callAuthorize();
  }, [])


  useEffect(() => {
    redirectToLogin();
  }, [status])

  const redirectToLogin = async () => {
    if (status === "LOADED") {
      if (oAuthDetailResponse === null) {
        return;
      }

      const { id, version, responseTime, response, errors } = oAuthDetailResponse

      if (errors != null && errors.length > 0) {
        return;
      } else {
        window.localStorage.setItem("OauthDetails", JSON.stringify(response));
        navigate('/login');
      }
    }
  }

  let el;

  switch (status) {
    case "LOADING":
      el = <LoadingIndicator size="medium" message="Loading. Please wait...." />;
      break;
    case "LOADED":
      if (oAuthDetailResponse === null) {
        el = (
          <Error404 />
        );
        break;
      }

      const { id, version, responseTime, response, errors } = oAuthDetailResponse

      if (errors != null && errors.length > 0) {
        el = (
          errors?.map(
            ({ errorCode, errorMessage }, idx) => (
              <div key={idx} className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
                {errorCode}
              </div>
              // < Alert variant="danger" key={idx} >
              //   {errorMessage}
              // </Alert >
            )
          )
        )
      }
      // else {
      //   el = (
      //     <>
      //       <div>
      //         Transaction Id = {response.transactionId}
      //       </div>
      //       <div>
      //         Auth Factor Name = {response.authFactors[0][0].name}
      //       </div>
      //       <div>
      //         Auth Factor Count = {response.authFactors[0][0].count}
      //       </div>
      //       <div>
      //         Auth Factor Bio Sub Types = {response.authFactors[0][0].bioSubTypes}
      //       </div>
      //     </>
      //   )
      // }
      break;
    case "ERROR":
      let msg = error?.message ?? '';

      if (msg?.indexOf("404") > -1) {
        el = (
          <Error404 />
        )
      } else {
        el = (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
            {error?.message}
          </div>
        )
      }
      break;
  }

  return el;
}

export default Authorize;