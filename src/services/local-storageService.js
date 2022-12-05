const device_info_keyname = "deviceInfo";
const discover_keyname = "discover";
const transaction_id_keyname = "transaction_id";
const redirect_uri_keyname = "redirect_uri";
const nonce_keyname = "nonce";
const state_keyname = "state";
const oauth_details_keyname = "oauth_details";

/**
 * Clear the cache of discovered devices
 */
const clearDiscoveredDevices = () => {
  if (localStorage.getItem(discover_keyname)) {
    localStorage.removeItem(discover_keyname);
  }
};

/**
 * Clear the cache of deviceInfo
 */
const clearDeviceInfos = () => {
  if (localStorage.getItem(device_info_keyname)) {
    localStorage.removeItem(device_info_keyname);
  }
};

/**
 * cache discoveredDevices against the port no.
 * @param {int} port
 * @param {*} discoveredDevices
 */
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

/**
 * cache deviceInfo against the port no.
 * @param {int} port
 * @param {*} decodedDeviceInfo
 */
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

/**
 * @returns deviceInfoList
 */
const getDeviceInfos = () => {
  return JSON.parse(localStorage.getItem(device_info_keyname));
};

/**
 * store the oauth details into cache
 * @param {*} redirectUri
 * @param {*} nonce
 * @param {*} state
 * @param {*} response
 */
const storeOauthDetails = (redirectUri, nonce, state, response) => {
  localStorage.setItem(redirect_uri_keyname, redirectUri);
  localStorage.setItem(nonce_keyname, nonce);
  localStorage.setItem(state_keyname, state);
  localStorage.setItem(oauth_details_keyname, JSON.stringify(response));
};

/**
 * @returns redirectUri
 */
const getRedirectUri = () => {
  return localStorage.getItem(redirect_uri_keyname);
};

/**
 * @returns nonce
 */
const getNonce = () => {
  return localStorage.getItem(nonce_keyname);
};

/**
 * @returns state
 */
const getState = () => {
  return localStorage.getItem(state_keyname);
};

/**
 * @returns outhDetails
 */
const getOuthDetails = () => {
  return localStorage.getItem(oauth_details_keyname);
};

/**
 * @param {*} transactionId stores the transactionId in cache
 */
const storeTransactionId = (transactionId) => {
  localStorage.setItem(transaction_id_keyname, transactionId);
};

/**
 * @returns transactionId
 */
const getTransactionId = () => {
  return localStorage.getItem(transaction_id_keyname);
};

/**
 *
 * @param {string} configKey
 * @returns configuration value of the given config key
 */
const getIdpConfiguration = (configKey) => {
  let oauthDetails = JSON.parse(localStorage.getItem(oauth_details_keyname));
  return oauthDetails?.configs[configKey];
};

const localStorageService = {
  addDeviceInfos: addDeviceInfos,
  getDeviceInfos: getDeviceInfos,
  clearDeviceInfos: clearDeviceInfos,
  clearDiscoveredDevices: clearDiscoveredDevices,
  addDiscoveredDevices: addDiscoveredDevices,
  storeOauthDetails: storeOauthDetails,
  getIdpConfiguration: getIdpConfiguration,
  getTransactionId: getTransactionId,
  storeTransactionId: storeTransactionId,
  getRedirectUri: getRedirectUri,
  getNonce: getNonce,
  getState: getState,
  getOuthDetails: getOuthDetails,
};

export { localStorageService };
