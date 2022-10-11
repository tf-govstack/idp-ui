import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import LoadingIndicator from "../common/LoadingIndicator";
import { challengeTypes, deviceType } from "../constants/clientConstants";
import { ERROR, LOADED, LOADING } from "../constants/states";
import { post_AuthenticateUser } from "../services/AuthService";
import { encodeBase64 } from "../services/cryptoService";
import { getDeviceInfos } from "../services/local-storageService.ts";
import { capture_Auth, mosipdisc_DiscoverDevicesAsync } from "../services/SbiService";
import BiometricInput from "./BiometricInput";
import InputWithImage from "./InputWithImage";

let fieldsState = {};
const host = "http://127.0.0.1";

const buttonImgPath = {
  Face: "images/face_capture.png",
  Finger: "images/fingerprint_scan.png",
  Iris: "images/iris_code.png",
};

export default function L1IndividualBiometric(loginFields) {
  const params = loginFields["param"];
  const inputFields = params.inputFields;
  const biometricFields = params.bioFields;

  inputFields.forEach((field) => (fieldsState["sbi_" + field.id] = ""));
  const [loginState, setLoginState] = useState(fieldsState);
  const [status, setStatus] = useState({ state: LOADED, msg: "" });
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [modalityDevices, setModalityDevices] = useState(new Map());

  const [selectedDevices, setSelectedDevices] = useState(new Map());

  const handleDeviceChange = (selectedDeviceSerialNo, type) => {
    selectedDevices.set(type, selectedDeviceSerialNo);
  };

  const handleChange = (e) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const { id } = e.nativeEvent.submitter;
    startCapture(id);
  };

  const startCapture = async (type) => {
    let transactionId = searchParams.get("transactionId");
    let vid = loginState["sbi_mosip-vid"];

    let deviceId = selectedDevices.get(type);

    let device = modalityDevices.get(type).get(deviceId);
    if (device === null) {
      setStatus({ state: ERROR, msg: "Device not found!" });
      return;
    }

    let biometricResponse = null;

    try {
      setStatus({
        state: LOADING,
        msg: device.type + " Capture Initiated on " + device.model,
      });

      biometricResponse = await capture_Auth(
        host,
        device.port,
        transactionId,
        device.specVersion,
        device.type,
        device.deviceId
      );

      let errorMsg = validateBiometricResponse(biometricResponse);

      setStatus({ state: LOADED, msg: "" });

      if (errorMsg !== null) {
        setStatus({
          state: ERROR,
          msg: "Biometric capture failed: " + errorMsg,
        });
        return;
      }
    } catch (errormsg) {
      setStatus({
        state: ERROR,
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
        state: ERROR,
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
        "/consent?transactionId=" + response.transactionId,
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

  const scanDevices = () => {
    try {
      setStatus({ state: LOADING, msg: "Scanning Devices. Please wait...." });

      mosipdisc_DiscoverDevicesAsync(host).then(() => {
        setStatus({ state: LOADED, msg: "" });
        refreshDeviceList();
      });
    } catch (errormsg) {
      setStatus({ state: ERROR, msg: errormsg.message });
    }
  };

  const refreshDeviceList = () => {
    let deviceInfosPortsWise = getDeviceInfos();

    let devicesModalityWise = new Map();

    let faceDevices = new Map();
    let fingerDevices = new Map();
    let irisDevices = new Map();

    Object.keys(deviceInfosPortsWise).map((port) => {
      let deviceInfos = deviceInfosPortsWise[port];

      deviceInfos?.forEach((deviceInfo) => {
        let deviceDetail = {
          port: port,
          specVersion: deviceInfo.specVersion[0],
          type: deviceInfo.digitalId.type,
          deviceId: deviceInfo.deviceId,
          deviceSubId: deviceInfo.deviceSubId,
          model: deviceInfo.digitalId.model,
          serialNo: deviceInfo.digitalId.serialNo,
        };

        switch (deviceDetail.type) {
          case deviceType.face:
            faceDevices.set(deviceDetail.serialNo, deviceDetail);
            break;
          case deviceType.finger:
            fingerDevices.set(deviceDetail.serialNo, deviceDetail);
            break;
          case deviceType.iris:
            irisDevices.set(deviceDetail.serialNo, deviceDetail);
            break;
        }
      });
    });

    if (faceDevices.size > 0)
      devicesModalityWise.set(deviceType.face, faceDevices);
    if (fingerDevices.size > 0)
      devicesModalityWise.set(deviceType.finger, fingerDevices);
    if (irisDevices.size > 0)
      devicesModalityWise.set(deviceType.iris, irisDevices);

    setModalityDevices(devicesModalityWise);

    let selectedDevices = new Map();

    selectedDevices.set(deviceType.face, [...faceDevices.keys()]?.at(0));
    selectedDevices.set(deviceType.finger, [...fingerDevices.keys()]?.at(0));
    selectedDevices.set(deviceType.iris, [...irisDevices.keys()]?.at(0));

    setSelectedDevices(selectedDevices);
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
              handleChange={handleChange}
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
            {/* <div class="{{ biometricFields.size === 1 ? 'grid flex justify-center grid-cols-1' : biometricFields.size === 2 ? 'grid flex justify-center grid-cols-2' : 'grid flex justify-center grid-cols-3' }}"> */}
            {biometricFields.map((biometric) => {
              let typeWiseDevices = modalityDevices.get(biometric.modality);
              return (
                <BiometricInput
                  typeWiseDevices={typeWiseDevices}
                  modality={biometric.modality}
                  selectedDevice={selectedDevices.get(biometric.modality)}
                  handleDeviceChange={handleDeviceChange}
                  buttonImgPath={buttonImgPath[biometric.modality]}
                />
              );
            })}
            {/* </div> */}
            <div class="flex justify-center">
              <Link class="text-center text-gray-500 font-semibold" to="#">
                More ways to sign in
              </Link>
            </div>
          </>
        )}
      </form>
    </>
  );
}
