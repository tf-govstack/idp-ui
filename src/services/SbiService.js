import axios from "axios";
import { decodeJWT } from "./cryptoService";
import {
  addDeviceInfos,
  addDiscoveredDevices,
  clearDeviceInfos,
  clearDiscoveredDevices,
} from "./local-storageService.ts";
import { SBI_DOMAIN_URI } from "./serviceHelper";

const deviceEndPoint = "/device";
const infoEndPoint = "/info";
const captureEndPoint = "/capture";

const mosip_DiscoverMethod = "MOSIPDISC";
const mosip_DeviceInfoMethod = "MOSIPDINFO";
const mosip_CaptureMethod = "CAPTURE";

const env = process.env.REACT_APP_SBI_ENV;
const Certification = process.env.REACT_APP_SBI_CERTIFICATION;
const purpose = process.env.REACT_APP_SBI_PURPOSE;
const timeout = process.env.REACT_APP_SBI_TIMEOUT;

const faceCount = process.env.REACT_APP_SBI_FACE_CAPTURE_COUNT;
const fingerCount = process.env.REACT_APP_SBI_FINGER_CAPTURE_COUNT;
const irisCount = process.env.REACT_APP_SBI_IRIS_CAPTURE_COUNT;

const faceScore = process.env.REACT_APP_SBI_FACE_CAPTURE_SCORE;
const fingerScore = process.env.REACT_APP_SBI_FINGER_CAPTURE_SCORE;
const irisScore = process.env.REACT_APP_SBI_IRIS_CAPTURE_SCORE;

const FACE_TYPE = "Face";
const FINGER_TYPE = "Finger";
const IRIS_TYPE = "Iris";

const DeviceStatusReady = "Ready";

const fromPort = 4501;
const tillPort = 4600;

const capture = async (
  host,
  port,
  transactionId,
  specVersion,
  type,
  deviceId
) => {
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
    transactionId: transactionId, // same as idp transactionId
    bio: [
      {
        type: type, //FROM BUTTON
        count: count, // hardcode, for face 1, 2 for iris, 10 for finger
        //bioSubType: , // ignored
        requestedScore: requestedScore, // take from properties, modality specific
        deviceId: deviceId, // from discovery
        deviceSubId: 0, //Set as 0, not required for Auth capture.
        previousHash: "", // empty string //TODO do we need to store prev. hash
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

//----------------------------------------------------//

const discoverDevicesAsync = async (host) => {
  clearDiscoveredDevices();
  clearDeviceInfos();

  let discoverRequestList = [];
  for (let i = fromPort; i <= tillPort; i++) {
    discoverRequestList.push(discoverRequestBuilder(host, i));
  }

  return axios.all(discoverRequestList);
};

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
        await deviceInfo(host, port);
      }
    })
    .catch((error) => {
      //ignore
    });
};

const deviceInfo = async (host, port) => {
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

const decodeAndValidateDeviceInfo = async (deviceInfo) => {
  var deviceDetails = [];
  for (let i = 0; i < deviceInfo.length; i++) {
    var decodedDevice = await decodeJWT(deviceInfo[i].deviceInfo);
    decodedDevice.digitalId = await decodeJWT(decodedDevice.digitalId);

    if (validateDeviceInfo(decodedDevice)) {
      deviceDetails.push(decodedDevice);
    }
  }
  return deviceDetails;
};

//TODO add documentation to all methods
/**
 *
 * @param {*} deviceInfo
 * @returns
 */
const validateDeviceInfo = (deviceInfo) => {
  if (
    deviceInfo.certification === Certification &&
    deviceInfo.purpose === purpose &&
    deviceInfo.deviceStatus === DeviceStatusReady
  ) {
    return true;
  }
  return false;
};

export { capture, discoverDevicesAsync };
