import axios from "axios";
import { decodeJWT } from "./cryptoService";
import { addDeviceInfos, clearDeviceInfos } from "./local-storageService.ts";

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
const domainUri = process.env.REACT_APP_SBI_DOMAIN_URI;

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
const tillPort = 4510;

const capture = async (
  host,
  port,
  transactionId,
  specVersion,
  type,
  deviceId,
  deviceSubId
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
    domainUri: domainUri,
    transactionId: transactionId, // same as idp transactionId
    bio: [
      {
        type: type, //FROM BUTTON
        count: count, // hardcode, for face 1, 2 for iris, 10 for finger
        //bioSubType: , // ignored
        requestedScore: requestedScore, // take from properties, modality specific
        deviceId: deviceId, // from discovery
        deviceSubId: 0, //TODO pass proper subtype id
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
  });

  let data = response?.data?.biometrics[0].data;
  if (data !== null) {
    return await decodeJWT(data);
  }
  return null;
};

//----------------------------------------------------//

const scanDeviceInfoAsync = async (host) => {
  clearDeviceInfos();
  let deviceInfoRequestList = [];
  for (let i = fromPort; i <= tillPort; i++) {
    deviceInfoRequestList.push(deviceInfoRequestBuilder(host, i));
  }

  return axios.all(deviceInfoRequestList);
};

const deviceInfoRequestBuilder = async (host, port) => {
  let endpoint = host + ":" + port + infoEndPoint;

  return axios({
    method: mosip_DeviceInfoMethod,
    url: endpoint,
  })
    .then((response) => {
      if (response?.data !== null) {
        cacheDeviceInfo(port, response.data);
      }
    })
    .catch((error) => {
      //ignore
    });
};

const cacheDeviceInfo = async (port, deviceInfo) => {
  var decodedDeviceDetails = await decodeDeviceInfo(deviceInfo);

  addDeviceInfos(port, decodedDeviceDetails);
};

const decodeDeviceInfo = async (deviceInfo) => {
  var deviceDetails = [];
  for (let i = 0; i < deviceInfo.length; i++) {
    var decodedDevice = await decodeJWT(deviceInfo[i].deviceInfo);

    if (!validateDigitaIdlSignature(decodedDevice)) {
      return;
    }

    decodedDevice.digitalId = await decodeJWT(decodedDevice.digitalId);

    if (validateDeviceInfo(decodedDevice)) {
      deviceDetails.push(decodedDevice);
    }
  }
  return deviceDetails;
};

const validateDigitaIdlSignature = async (digitalIdJWT) => {
  //TODO implementation
  return true;
};

const validateDeviceInfo = (deviceInfo) => {
  // console.log(deviceInfo.certification + "::" + Certification);
  // console.log(deviceInfo.purpose + "::" + purpose);
  // console.log(deviceInfo.deviceStatus + "::" + DeviceStatusReady);
  if (
    deviceInfo.certification === Certification &&
    deviceInfo.purpose === purpose &&
    deviceInfo.deviceStatus === DeviceStatusReady
  ) {
    return true;
  }
  return true;
};

//----------------------------------------------------

// const scanSync = async (host) => {
//   for (let i = fromPort; i <= tillPort; i++) {
//     try {
//       discover(host, i);
//     } catch (e) {
//       //ignore
//     }
//   }
// };

// const discover = async (host, port) => {
//   let endpoint = host + ":" + port + deviceEndPoint;

//   let request = {
//     type: "Biometric Device",
//   };

//   axios({
//     method: mosipDiscoverMethod,
//     url: endpoint,
//     data: request,
//   })
//     .then((response) => {
//       if (response?.data !== null) {
//         deviceInfo(host, port);
//       }
//     })
//     .catch((error) => {
//       console.err(error);
//     });
// };

// const deviceInfo = async (host, port) => {
//   let endpoint = host + ":" + port + infoEndPoint;

//   axios({
//     method: mosipDeviceInfoMethod,
//     url: endpoint,
//   })
//     .then((response) => {
//       if (response?.data !== null) {
//         cacheDeviceInfo(port, response.data);
//       }
//     })
//     .catch((error) => {
//       console.err(error);
//     });
// };

// const cacheDiscoveredDevice = async (port, deviceDiscover) => {
//   localStorage.setItem(
//     discover_keyname + "-" + port,
//     JSON.stringify(deviceDiscover)
//   );
// };

// const addDeviceDiscover = async (port, deviceDiscover) => {
//   let discoverNew = {
//     port: port + "",
//     deviceDiscoverInfo: JSON.stringify(deviceDiscover),
//   };
//   let emptyList = [];

//   //initialize if does not exist
//   if (!localStorage.getItem(cacheKeyName)) {
//     localStorage.setItem(cacheKeyName, JSON.stringify(emptyList));
//   }

//   let discoveredList = JSON.parse(localStorage.getItem(cacheKeyName));

//   if (discoveredList.length <= 0) {
//     discoveredList.push(discoverNew);
//   } else if (discoveredList.length > 0) {
//     var found = false;
//     for (var index = 0; index < discoveredList.length; index++) {
//       var discoverInfo = discoveredList[index];
//       if (parseInt(discoverInfo.port + "") == parseInt(port)) {
//         discoveredList[index] = discoverNew;
//         found = true;
//         break;
//       }
//     }
//     if (!found) {
//       discoveredList.push(discoverNew);
//     }
//   }

//   localStorage.setItem(cacheKeyName, JSON.stringify(discoveredList));
// };

export { scanDeviceInfoAsync, capture };
