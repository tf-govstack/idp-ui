import axios from "axios";
import { decodeJWT } from "./cryptoService";
import { addDeviceInfos } from "./local-storageService.ts";

const deviceEndPoint = "/device";
const infoEndPoint = "/info";

const mosipDiscoverMethod = "MOSIPDISC";
const mosipDeviceInfoMethod = "MOSIPDINFO";
const Certification = process.env.REACT_APP_SBI_CERTIFICATION;
const Purpose = process.env.REACT_APP_SBI_PURPOSE;

const DeviceStatusReady = "Ready";

const fromPort = 4501;
const tillPort = 4600;

const scanDeviceInfoAsync = async (host) => {
  let deviceInfoRequestList = [];
  for (let i = fromPort; i <= tillPort; i++) {
    deviceInfoRequestList.push(deviceInfoRequestBuilder(host, i));
  }

  return axios.all(deviceInfoRequestList);
};

const deviceInfoRequestBuilder = async (host, port) => {
  let endpoint = host + ":" + port + infoEndPoint;

  return axios({
    method: mosipDeviceInfoMethod,
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

const validateDeviceInfo = async (deviceInfo) => {
  if (
    deviceInfo.certification === Certification &&
    deviceInfo.purpose === Purpose &&
    deviceInfo.deviceStatus === DeviceStatusReady
  ) {
    return true;
  }
  return false;
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

export { scanDeviceInfoAsync };
