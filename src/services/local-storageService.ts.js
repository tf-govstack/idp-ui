const device_info_keyname = "deviceInfo";
const discover_keyname = "discover";
const redirect_uri_keyname = "redirect_uri";
const nonce_keyname = "nonce";
const state_keyname = "state";
const oauth_details_keyname = "oauth_details";

const clearDiscoveredDevices = () => {
  if (localStorage.getItem(discover_keyname)) {
    localStorage.removeItem(discover_keyname);
  }
};

const clearDeviceInfos = () => {
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

const storeOauthDetails = (redirectUri, nonce, state, response) => {
  window.localStorage.setItem(redirect_uri_keyname, redirectUri);
  window.localStorage.setItem(nonce_keyname, nonce);
  window.localStorage.setItem(state_keyname, state);
  window.localStorage.setItem(oauth_details_keyname, JSON.stringify(response));
};

const getIdpConfiguration = (configKey) => {
  let oauthDetails = JSON.parse(
    window.localStorage.getItem(oauth_details_keyname)
  );
  return oauthDetails?.configs[configKey];
};

export {
  addDeviceInfos,
  getDeviceInfos,
  clearDeviceInfos,
  clearDiscoveredDevices,
  addDiscoveredDevices,
  storeOauthDetails,
  getIdpConfiguration,
};
