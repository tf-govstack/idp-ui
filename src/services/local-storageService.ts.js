
const device_info_keyname = "deviceinfo";

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

export { addDeviceInfos }