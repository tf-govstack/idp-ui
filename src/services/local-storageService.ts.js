
const device_info_keyname = "deviceInfo";

const clearDeviceInfos= () => {
  if (localStorage.getItem(device_info_keyname)) {
    localStorage.removeItem(device_info_keyname);
  }
}

const addDeviceInfos = (port, decodedDeviceInfo) => {
    let deviceInfo = {};

    //initialize if empty
    if (!localStorage.getItem(device_info_keyname)) {
      localStorage.setItem(device_info_keyname, JSON.stringify(deviceInfo));
    }
    deviceInfo = JSON.parse(localStorage.getItem(device_info_keyname));
    deviceInfo[port] = decodedDeviceInfo;
    localStorage.setItem(device_info_keyname, JSON.stringify(deviceInfo));
}

const getDeviceInfos = () => {
  return JSON.parse(window.localStorage.getItem(device_info_keyname));
}

export { addDeviceInfos, getDeviceInfos , clearDeviceInfos}