import axios from "axios";
import { configurationKeys } from "../constants/clientConstants";
import { decodeJWT } from "./cryptoService";
import {
  addDeviceInfos,
  addDiscoveredDevices,
  clearDeviceInfos,
  clearDiscoveredDevices,
  getIdpConfiguration,
} from "./local-storageService.ts";

const SBI_DOMAIN_URI = window.origin;
const purpose = "Auth";

const deviceEndPoint = "/device";
const infoEndPoint = "/info";
const captureEndPoint = "/capture";

const mosip_DiscoverMethod = "MOSIPDISC";
const mosip_DeviceInfoMethod = "MOSIPDINFO";
const mosip_CaptureMethod = "CAPTURE";

const FACE_TYPE = "Face";
const FINGER_TYPE = "Finger";
const IRIS_TYPE = "Iris";

const DeviceStatusReady = "Ready";

const fromPort = 4501;
const tillPort = 4600;

/**
 * Triggers capture request of SBI for auth capture
 * @param {url} host SBI is hosted on given host
 * @param {int} port port on which SBI is listening to.
 * @param {string} transactionId same as idp transactionId
 * @param {string} specVersion supported spec version
 * @param {string} type modality type
 * @param {string} deviceId
 * @returns auth capture response
 */
const capture_Auth = async (
  host,
  port,
  transactionId,
  specVersion,
  type,
  deviceId
) => {
  const env =
    getIdpConfiguration(configurationKeys.sbiEnv) ??
    process.env.REACT_APP_SBI_ENV;
  const timeout =
    getIdpConfiguration(configurationKeys.sbiCaptureTimeoutInSeconds) ??
    process.env.REACT_APP_SBI_TIMEOUT_IN_SECONDS;

  const faceCount =
    getIdpConfiguration(configurationKeys.sbiFaceCount) ??
    process.env.REACT_APP_SBI_FACE_CAPTURE_COUNT;
  const fingerCount =
    getIdpConfiguration(configurationKeys.sbiFingerCount) ??
    process.env.REACT_APP_SBI_FINGER_CAPTURE_COUNT;
  const irisCount =
    getIdpConfiguration(configurationKeys.sbiIrisCount) ??
    process.env.REACT_APP_SBI_IRIS_CAPTURE_COUNT;

  const faceScore =
    getIdpConfiguration(configurationKeys.sbiThresholdFace) ??
    process.env.REACT_APP_SBI_FACE_CAPTURE_SCORE;
  const fingerScore =
    getIdpConfiguration(configurationKeys.sbiThresholdFinger) ??
    process.env.REACT_APP_SBI_FINGER_CAPTURE_SCORE;
  const irisScore =
    getIdpConfiguration(configurationKeys.sbiThresholdIris) ??
    process.env.REACT_APP_SBI_IRIS_CAPTURE_SCORE;

  let count = 1;
  let requestedScore = 70;
  switch (type) {
    case FACE_TYPE:
      count = faceCount;
      requestedScore = faceScore;
      break;
    case FINGER_TYPE:
      count = fingerCount;
      requestedScore = fingerScore;
      break;
    case IRIS_TYPE:
      count = irisCount;
      requestedScore = irisScore;
      break;
  }

  let request = {
    env: env,
    purpose: purpose,
    specVersion: specVersion,
    timeout: timeout * 1000,
    captureTime: new Date().toISOString(),
    domainUri: SBI_DOMAIN_URI,
    transactionId: transactionId,
    bio: [
      {
        type: type, //modality
        count: count, // from configuration
        //bioSubType: , // ignored
        requestedScore: requestedScore, // from configuration
        deviceId: deviceId, // from discovery
        deviceSubId: 0, //Set as 0, not required for Auth capture.
        previousHash: "", // empty string
      },
    ],
    customOpts: null,
  };

  let endpoint = host + ":" + port + captureEndPoint;

  let response = await axios({
    method: mosip_CaptureMethod,
    url: endpoint,
    data: request,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: timeout * 1000,
  });

  return response?.data;
};

/**
 * Triggers MOSIPDISC request on multiple port simultaneously.
 * @param {url} host SBI is hosted on given host
 * @returns MOSIPDISC requests for the given host and the port ranging between fromPort and tillPort
 */

const mosipdisc_DiscoverDevicesAsync = async (host) => {
  clearDiscoveredDevices();
  clearDeviceInfos();

  let discoverRequestList = [];
  for (let i = fromPort; i <= tillPort; i++) {
    discoverRequestList.push(discoverRequestBuilder(host, i));
  }

  return axios.all(discoverRequestList);
};

/**
 * Builds MOSIPDISC API request for multiple ports to discover devices on
 * the specifed host and port. On success response, discovered devices
 * are cached and MOSIPDINFO API is called to fetch deviceInfo.
 * @param {url} host SBI is hosted on given host
 * @param {int} port port on which SBI is listening to.
 * @returns MOSIPDISC request for the give host and port
 */
const discoverRequestBuilder = async (host, port) => {
  let endpoint = host + ":" + port + deviceEndPoint;

  let request = {
    type: "Biometric Device",
  };

  return axios({
    method: mosip_DiscoverMethod,
    url: endpoint,
    data: request,
  })
    .then(async (response) => {
      if (response?.data !== null) {
        addDiscoveredDevices(port, response.data);
        await mosipdinfo_DeviceInfo(host, port);
      }
    })
    .catch((error) => {
      //ignore
    });
};

/**
 * MOSIPDINFO API call for fetch deviceinfo from SBI on the specifed host and port
 * On success response, the device infos are decoded, validated and cached.
 * @param {url} host SBI is hosted on given host
 * @param {int} port port on which SBI is listening to.
 */
const mosipdinfo_DeviceInfo = async (host, port) => {
  let endpoint = host + ":" + port + infoEndPoint;

  await axios({
    method: mosip_DeviceInfoMethod,
    url: endpoint,
  })
    .then(async (response) => {
      if (response?.data !== null) {
        var decodedDeviceDetails = await decodeAndValidateDeviceInfo(
          response.data
        );
        addDeviceInfos(port, decodedDeviceDetails);
      }
    })
    .catch((error) => {
      //ignore
    });
};

/**
 * decodes and validates the JWT device info response from /deviceinfo api of SBI
 * @param {json Object} deviceInfo JWT response array from /deviceinfo api of SBI
 * @returns {Array<Object>} JWT decoded deviceInfo array
 */
const decodeAndValidateDeviceInfo = async (deviceInfoList) => {
  var deviceDetailList = [];
  for (let i = 0; i < deviceInfoList.length; i++) {
    var decodedDevice = await decodeJWT(deviceInfoList[i].deviceInfo);
    decodedDevice.digitalId = await decodeJWT(decodedDevice.digitalId);

    if (validateDeviceInfo(decodedDevice)) {
      deviceDetailList.push(decodedDevice);
    }
  }
  return deviceDetailList;
};

/**
 * validates the device info for device certification level, purpose and status.
 * @param {*} deviceInfo decoded deviceInfo
 * @returns {boolean}
 */
const validateDeviceInfo = (deviceInfo) => {
  const certification =
    getIdpConfiguration(configurationKeys.sbiDeviceCertification) ??
    process.env.REACT_APP_SBI_CERTIFICATION;

  if (
    deviceInfo.certification === certification &&
    deviceInfo.purpose === purpose &&
    deviceInfo.deviceStatus === DeviceStatusReady
  ) {
    return true;
  }
  return false;
};

export { capture_Auth, mosipdisc_DiscoverDevicesAsync };
