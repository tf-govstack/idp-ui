import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingIndicator from "../common/LoadingIndicator";
import { challengeTypes } from "../constants/clientConstants";
import { LoadingStates as states } from "../constants/states";
import BiometricInput from "./BiometricInput";
import InputWithImage from "./InputWithImage";
import Select from "react-select";
import ErrorIndicator from "../common/ErrorIndicator";

let fieldsState = {};
const host = "http://127.0.0.1";

const modalityImgPath = {
  Face: "images/face_capture.png",
  Finger: "images/fingerprint_scan.png",
  Iris: "images/iris_code.png",
};

const modalityIconPath = {
  Face: "images/Sign in with face.png",
  Finger: "images/Sign in with fingerprint.png",
  Iris: "images/Sign in with Iris.png",
};

export default function L1Biometrics({
  param,
  authService,
  localStorageService,
  cryptoService,
  sbiService,
}) {
  const inputFields = param.inputFields;
  const biometricFields = param.bioFields;

  const { encodeBase64 } = { ...cryptoService };
  const { capture_Auth, mosipdisc_DiscoverDevicesAsync } = { ...sbiService };
  const { post_AuthenticateUser } = { ...authService };
  const { getDeviceInfos, getTransactionId, storeTransactionId } = {
    ...localStorageService,
  };

  inputFields.forEach((field) => (fieldsState["sbi_" + field.id] = ""));
  const [loginState, setLoginState] = useState(fieldsState);
  const [status, setStatus] = useState({
    state: states.LOADED,
    msg: "",
  });
  const navigate = useNavigate();

  const [modalityDevices, setModalityDevices] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);

  // handle onChange event of the dropdown
  const handleDeviceChange = (device) => {
    setSelectedDevice(device);
  };

  const handleInputChange = (e) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    startCapture();
  };

  const startCapture = async () => {
    let transactionId = getTransactionId();

    if (!transactionId) {
      setStatus({
        state: states.ERROR,
        msg: "Invalid transaction Id",
      });
      return;
    }

    let vid = loginState["sbi_mosip-vid"];

    if (selectedDevice === null) {
      setStatus({ state: states.ERROR, msg: "Device not found!" });
      return;
    }

    let biometricResponse = null;

    try {
      setStatus({
        state: states.AUTHENTICATING,
        msg:
          selectedDevice.type + " Capture initiated on " + selectedDevice.model,
      });

      biometricResponse = await capture_Auth(
        host,
        selectedDevice.port,
        transactionId,
        selectedDevice.specVersion,
        selectedDevice.type,
        selectedDevice.deviceId
      );

      let errorMsg = validateBiometricResponse(biometricResponse);

      setStatus({ state: states.LOADED, msg: "" });

      if (errorMsg !== null) {
        setStatus({
          state: states.ERROR,
          msg: "Biometric capture failed: " + errorMsg,
        });
        return;
      }
    } catch (errormsg) {
      setStatus({
        state: states.ERROR,
        msg: "Biometric capture failed: " + errormsg.message,
      });
      return;
    }

    try {
      await Authenticate(
        transactionId,
        vid,
        await encodeBase64(biometricResponse)
      );
    } catch (errormsg) {
      setStatus({
        state: states.ERROR,
        msg: "Authentication failed: " + errormsg.message,
      });
    }
  };

  const validateBiometricResponse = (response) => {
    if (
      response === null ||
      response["biometrics"] === null ||
      response["biometrics"].length === 0
    ) {
      return "Empty response";
    }

    let biometrics = response["biometrics"];

    let errorMsg = null;
    for (let i = 0; i < biometrics.length; i++) {
      let error = biometrics[i]["error"];
      if (error !== null && error.errorCode !== "0") {
        errorMsg = "ErrorCode-" + error.errorCode + ":" + error.errorInfo;
        break;
      }
    }

    return errorMsg;
  };

  const Authenticate = async (transactionId, uin, bioValue) => {
    let challengeType = challengeTypes.bio; //TODO Get these values from config
    let challenge = bioValue;

    let challengeList = [
      {
        authFactorType: challengeType,
        challenge: challenge,
      },
    ];

    setStatus({
      state: states.AUTHENTICATING,
      msg: "Authenticating. Please wait...",
    });

    const authenticateResponse = await post_AuthenticateUser(
      transactionId,
      uin,
      challengeList
    );

    setStatus({ state: states.LOADED, msg: "" });

    const { response, errors } = authenticateResponse;

    if (errors != null && errors.length > 0) {
      setStatus({
        state: states.ERROR,
        msg: "Authentication failed: " + errors[0].errorCode,
      });
    } else {
      storeTransactionId(response.transactionId);
      navigate("/consent", {
        replace: true,
      });
    }
  };

  const handleScan = (e) => {
    e.preventDefault();
    scanDevices();
  };

  useEffect(() => {
    scanDevices();
  }, []);

  const scanDevices = () => {
    try {
      setStatus({
        state: states.LOADING,
        msg: "Scanning Devices. Please wait....",
      });

      mosipdisc_DiscoverDevicesAsync(host).then(() => {
        setStatus({ state: states.LOADED, msg: "" });
        refreshDeviceList();
      });
    } catch (errormsg) {
      setStatus({ state: states.ERROR, msg: errormsg.message });
    }
  };

  const refreshDeviceList = () => {
    let deviceInfosPortsWise = getDeviceInfos();

    let modalitydevices = [];

    Object.keys(deviceInfosPortsWise).map((port) => {
      let deviceInfos = deviceInfosPortsWise[port];

      deviceInfos?.forEach((deviceInfo) => {
        let deviceDetail = {
          port: port,
          specVersion: deviceInfo.specVersion[0],
          type: deviceInfo.digitalId.type,
          deviceId: deviceInfo.deviceId,
          model: deviceInfo.digitalId.model,
          serialNo: deviceInfo.digitalId.serialNo,
          text: deviceInfo.digitalId.make + "-" + deviceInfo.digitalId.model,
          value: deviceInfo.digitalId.serialNo,
          icon: modalityIconPath[deviceInfo.digitalId.type],
        };

        modalitydevices.push(deviceDetail);
      });
    });

    setModalityDevices(modalitydevices);

    if (modalitydevices.size === 0) {
      setStatus({
        state: states.ERROR,
        msg: "No Devices Found!",
      });
      return;
    }

    let selectedDevice = modalitydevices[0];
    setSelectedDevice(selectedDevice);
  };

  return (
    <>
      <h1 class="text-center text-sky-600 font-semibold">
        Sign with Biometric
      </h1>
      <form className="mt-8 space-y-6" onSubmit={submitHandler}>
        <div className="-space-y-px">
          {inputFields.map((field) => (
            <InputWithImage
              key={"sbi_" + field.id}
              handleChange={handleInputChange}
              value={loginState["sbi_" + field.id]}
              labelText={field.labelText}
              labelFor={field.labelFor}
              id={"sbi_" + field.id}
              name={field.name}
              type={field.type}
              isRequired={field.isRequired}
              placeholder={field.placeholder}
              imgPath="images/photo_scan.png"
            />
          ))}
        </div>

        {status.state === states.LOADING && (
          <div>
            <LoadingIndicator size="medium" message={status.msg} />
          </div>
        )}

        {status.state === states.ERROR && (
          <>
            <ErrorIndicator message={status.msg} />
            <button
              type="button"
              class="flex justify-center w-full text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 light:bg-gray-800 light:text-white light:border-gray-600 light:hover:bg-gray-700 light:hover:border-gray-600 light:focus:ring-gray-700"
              onClick={handleScan}
            >
              Retry!
            </button>
          </>
        )}

        {(status.state === states.LOADED ||
          status.state === states.AUTHENTICATING) &&
          modalityDevices && (
            <>
              {selectedDevice && (
                <>
                  <div class="flex justify-center w-full">
                    <Select
                      className="w-8/12"
                      placeholder="Select Option"
                      value={selectedDevice}
                      options={modalityDevices}
                      onChange={handleDeviceChange}
                      getOptionLabel={(e) => (
                        <div class="flex items-center h-7">
                          <img class="w-8" src={e.icon} />
                          <span class="ml-2 text-xs">{e.text}</span>
                        </div>
                      )}
                    />
                  </div>
                  <BiometricInput
                    modality={selectedDevice.type}
                    buttonImgPath={modalityImgPath[selectedDevice.type]}
                    loadingMsg={
                      status.state === states.AUTHENTICATING ? status.msg : ""
                    }
                  />
                </>
              )}
            </>
          )}

        <div class="flex justify-center">
          <Link class="text-center text-gray-500 font-semibold" to="#">
            More ways to sign in
          </Link>
        </div>
      </form>
    </>
  );
}
