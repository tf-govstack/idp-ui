import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingIndicator from "../common/LoadingIndicator";
import { ERROR, LOADED, LOADING } from "../constants/states";
import { post_AuthenticateUser } from "../services/AuthService";
import { getDeviceInfos } from "../services/local-storageService.ts";
import { capture, discoverDevicesAsync } from "../services/SbiService";

import Input from "./Input";

let fieldsState = {};
const host = "http://127.0.0.1";
const defaultPort = 4501;

const buttonImgPath = {
  Face: "images/face_capture.png",
  Finger: "images/fingerprint_scan.png",
  Iris: "images/iris_code.png",
};

export default function SBIL1Biometrics(loginFields) {
  const fields = loginFields["param"];
  fields.forEach((field) => (fieldsState["sbi_" + field.id] = ""));
  const [loginState, setLoginState] = useState(fieldsState);
  const [status, setStatus] = useState({ state: LOADED, msg: "" });

  const [devices, setDevices] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const { id } = e.nativeEvent.submitter;
    startCapture(id);
  };

  const startCapture = async (serialNo) => {
    let transactionId = searchParams.get("transactionId");
    let nonce = searchParams.get("nonce");
    let uin = loginState["sbi_mosip-vid"];

    let deviceDetail = devices.get(serialNo);

    try {
      setStatus({
        state: LOADING,
        msg: deviceDetail.type + " Capture Initiated on " + deviceDetail.model,
      });

      let response = await capture(
        host,
        defaultPort,
        transactionId,
        deviceDetail.specVersion,
        deviceDetail.type,
        deviceDetail.deviceId,
        deviceDetail.deviceSubId
      );

      setStatus({ state: LOADED, msg: "" });

      await Authenticate(transactionId, nonce, uin, response.bioValue);
    } catch (errormsg) {
      setStatus({ state: ERROR, msg: errormsg.message });
    }
  };

  const Authenticate = async (transactionId, nonce, uin, bioValue) => {
    let challengeType = "BIO"; //TODO where to get this value from?
    let challenge = bioValue;

    let challengeList = [
      {
        authFactorType: challengeType,
        challenge: challenge,
      },
    ];

    setStatus({ state: LOADING, msg: "Authenticating! Please wait" });

    const authenticateResponse = await post_AuthenticateUser(
      transactionId,
      uin,
      challengeList
    );

    setStatus({ state: LOADED, msg: "" });

    const { response, errors } = authenticateResponse;

    if (errors != null && errors.length > 0) {
      setStatus({
        state: ERROR,
        msg: "Authentication failed: " + errors[0].errorCode,
      });
    } else {
      navigate(
        "/consent?transactionId=" + response.transactionId + "&nonce=" + nonce,
        { replace: true }
      );
    }
  };

  const handleScan = (e) => {
    e.preventDefault();
    scanDevices();
  };

  useEffect(() => {
    scanDevices();
  }, []);

  const scanDevices = async () => {
    try {
      setStatus({ state: LOADING, msg: "Scanning Devices. Please wait...." });

      discoverDevicesAsync(host).then(() => {
        setStatus({ state: LOADED, msg: "" });
        refreshDeviceList();
      });
    } catch (errormsg) {
      setStatus({ state: ERROR, msg: errormsg.message });
    }
  };

  const refreshDeviceList = () => {
    let deviceInfosPortsWise = getDeviceInfos();

    let devicesDetails = new Map();

    Object.keys(deviceInfosPortsWise).map((port) => {
      let deviceInfos = deviceInfosPortsWise[port];

      deviceInfos?.forEach((deviceInfo) => {
        let deviceDetail = {
          specVersion: deviceInfo.specVersion[0],
          type: deviceInfo.digitalId.type,
          deviceId: deviceInfo.deviceId,
          deviceSubId: deviceInfo.deviceSubId,
          model: deviceInfo.digitalId.model,
          serialNo: deviceInfo.digitalId.serialNo,
        };
        devicesDetails.set(deviceInfo.digitalId.serialNo, deviceDetail);
      });
    });

    setDevices(devicesDetails);
  };

  return (
    <>
      <form className="mt-8 space-y-6" onSubmit={submitHandler}>
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
            <button
              type="button"
              class="flex justify-center w-full text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 light:bg-gray-800 light:text-white light:border-gray-600 light:hover:bg-gray-700 light:hover:border-gray-600 light:focus:ring-gray-700"
              onClick={handleScan}
            >
              Retry!
            </button>
          </>
        )}

        {status.state === LOADED && (
          <>
            <div class="grid grid-cols-3 flex justify-center">
              {[...devices.keys()].map((serialNo) => {
                let deviceDetail = devices.get(serialNo);

                return (
                  <div>
                    <button
                      class="w-32 h-32 text-black bg-white-200 font-medium rounded-lg text-sm mr-2 mb-2 dark:bg-white-200 hover:scale-105"
                      type="submit"
                      id={serialNo}
                    >
                      <img src={buttonImgPath[deviceDetail.type]} />
                    </button>
                    <div>
                      <p class="text-center font-bold text-sm">
                        {deviceDetail.type} Capture
                      </p>
                      <p class="text-center text-gray-700 text-sm">
                        {deviceDetail.model}-{deviceDetail.deviceId}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </form>
    </>
  );
}
