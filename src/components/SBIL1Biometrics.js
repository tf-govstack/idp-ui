import React, { useEffect } from "react";
import { useState } from "react";
import LoadingIndicator from "../common/LoadingIndicator";
import { scanDeviceInfoAsync } from "../services/SbiService";

import FormAction from "./FormAction";
import Input from "./Input";

let captured = false;
let fieldsState = {};


function discover(theUrl, port) {
  console.log("Discover");
}

function deviceInfo(theUrl) {
  console.log("Device info");
}

function capture(theUrl) {
  console.log("Catpure");
}

export default function SBIL1Biometrics(loginFields) {
  const fields = loginFields["param"];
  fields.forEach((field) => (fieldsState["sbi_" + field.id] = ""));
  const [loginState, setLoginState] = useState(fieldsState);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("LOADED");

  const handleChange = (e) => {
    console.log("Attempt to handle change");
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  };

  const StartCapture = (e) => {
    console.log("Start capture");
    e.preventDefault();
    captured = true;
    console.log("Start capture");
  };

  const Authenticate = () => {
    captured = false;
    return; //Send to server
  };

  const handleScan = (e) => {
    e.preventDefault();
    scan();
  };

  useEffect(() => {
    scan();
  }, []);

  const scan = async () => {
    try {
      setError(null);
      setStatus("LOADING");
      scanDeviceInfoAsync("http://127.0.0.1").then(() => {
        setStatus("LOADED");
      });
    } catch (errormsg) {
      setError(errormsg.message);
      setStatus("ERROR");
    }
  };

  return (
    <>
      {
        <div>
          {status === "LOADING" && (
            <LoadingIndicator
              size="medium"
              message="Scanning Devices. Please wait...."
            />
          )}
        </div>
      }
      {status !== "LOADING" && error && (
        <div
          className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
          role="alert"
        >
          {error}
          <button
            type="button"
            class="flex justify-center w-full text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 light:bg-gray-800 light:text-white light:border-gray-600 light:hover:bg-gray-700 light:hover:border-gray-600 light:focus:ring-gray-700"
            onClick={handleScan}
          >
            Scan Devices again
          </button>
        </div>
      )}
      {status === "LOADED" && error === null && (
        <>
          <form className="mt-8 space-y-6" onSubmit={StartCapture}>
            <div className="-space-y-px">
              {fields.map((field) => (
                <Input
                  key={"sbi_" + field.id}
                  handleChange={handleChange}
                  value={loginState["sbi_" + field.id]}
                  labelText={field.labelText}
                  labelFor={field.labelFor}
                  id={"sbi_" + field.id}
                  name={field.name}
                  type={field.type}
                  isRequired={field.isRequired}
                  placeholder={field.placeholder}
                />
              ))}
            </div>
            <FormAction
              handleSubmit={StartCapture}
              text={captured ? "Authenticate" : "Capture"}
            />
          </form>
          <button
            type="button"
            class="flex justify-center w-full text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 light:bg-gray-800 light:text-white light:border-gray-600 light:hover:bg-gray-700 light:hover:border-gray-600 light:focus:ring-gray-700"
            onClick={handleScan}
          >
            Scan Devices again
          </button>
        </>
      )}
    </>
  );
}
