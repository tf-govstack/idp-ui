const fixedInputClass =
  "rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm";

export default function BiometricInput({
  typeWiseDevices,
  modality,
  selectedDevice,
  handleDeviceChange,
  buttonImgPath
}) {
  return (
    <>
      {typeWiseDevices?.size > 0 && (
        <div class="flex justify-center">
          <div>
            <div class="flex justify-center mb-2">
              <select
                class="text-center w-32 px-1 py-1 bg-blue-600 text-white font-medium text-xs
                              leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg
                              focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg active:text-white transition duration-150 ease-in-out flex items-center"
                value={selectedDevice}
                onChange={(e) => handleDeviceChange(e.target.value, modality)}
              >
                {[...typeWiseDevices.keys()].map((serialNo) => {
                  let device = typeWiseDevices.get(serialNo);
                  return (
                    <option
                      class="font-medium block text-xs w-full whitespace-nowrap bg-gray text-white-700 hover:bg-gray-100 items-center"
                      key={device.serialNo}
                      value={device.serialNo}
                    >
                      {device.model}
                    </option>
                  );
                })}
              </select>
            </div>
            <button
              class="w-32 h-32 text-black bg-white-200 font-medium rounded-lg 
                          text-sm ml-2 mt-2 mr-2 mb-2 dark:bg-white-200 hover:scale-105"
              type="submit"
              id={modality}
            >
              <img src={buttonImgPath} />
              <p class="text-center font-bold text-sm">{modality} Capture</p>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
