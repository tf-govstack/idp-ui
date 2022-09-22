const device_info_keyname = "deviceInfo";
const discover_keyname = "discover";

const clearDiscoveredDevices = () => {
  if (localStorage.getItem(device_info_keyname)) {
    localStorage.removeItem(device_info_keyname);
  }
};

const addDiscoveredDevices = (port, discoveredDevices) => {
  let discover = {};

  //initialize if empty
  if (!localStorage.getItem(discover_keyname)) {
    localStorage.setItem(discover_keyname, JSON.stringify(discover));
  }

  discover = JSON.parse(localStorage.getItem(discover_keyname));
  discover[port] = discoveredDevices;
  localStorage.setItem(discover_keyname, JSON.stringify(discover));
};

const clearDeviceInfos = () => {
  if (localStorage.getItem(device_info_keyname)) {
    localStorage.removeItem(device_info_keyname);
  }
};

const addDeviceInfos = (port, decodedDeviceInfo) => {
  let deviceInfo = {};

  //initialize if empty
  if (!localStorage.getItem(device_info_keyname)) {
    localStorage.setItem(device_info_keyname, JSON.stringify(deviceInfo));
  }
  deviceInfo = JSON.parse(localStorage.getItem(device_info_keyname));
  deviceInfo[port] = decodedDeviceInfo;
  localStorage.setItem(device_info_keyname, JSON.stringify(deviceInfo));
};

const getDeviceInfos = () => {
  return JSON.parse(window.localStorage.getItem(device_info_keyname));
};

export {
  addDeviceInfos,
  getDeviceInfos,
  clearDeviceInfos,
  clearDiscoveredDevices,
  addDiscoveredDevices,
};
