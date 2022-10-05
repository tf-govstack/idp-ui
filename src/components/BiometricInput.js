export default function BiometricInput({
  typeWiseDevices,
  modality,
  selectedDevice,
  handleDeviceChange,
  buttonImgPath,
}) {
  return (
    <>
      {typeWiseDevices?.size > 0 && (
        <div>
          <div class="flex justify-center mb-2">
            <div class="w-40 h-40 text-black bg-white-200 font-medium rounded-lg text-sm mb-2">
              <img
                src={buttonImgPath}
              />
            </div>
          </div>
          <div class="flex justify-center mb-2">
            <select
              class="text-center w-32 px-1 py-1 bg-blue-600 text-white font-medium text-xs
                              leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg
                              focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg 
                              active:text-white transition duration-150 ease-in-out flex items-center"
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
            class="flex justify-center w-full text-white bg-gradient-to-t from-cyan-500 to-blue-500 hover:bg-gradient-to-b font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            type="submit"
            id={modality}
          >
            Scan and verify
          </button>
        </div>
      )}
    </>
  );
}
