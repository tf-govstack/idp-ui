export default function BiometricInput({ modality, buttonImgPath }) {
  return (
    <>
      <div>
        <div class="flex justify-center mb-10">
          <div class="w-40 h-40 text-black bg-white-200 font-medium rounded-lg text-sm">
            <img src={buttonImgPath} />
            <p class="text-center font-bold text-sm mt-2">{modality} Capture</p>
          </div>
        </div>

        <div class="flex justify-center">
          <button
            class="w-10/12 text-white bg-gradient-to-t from-cyan-500 to-blue-500 hover:bg-gradient-to-b font-medium rounded-lg text-sm py-2.5 text-center"
            type="submit"
            id={modality}
          >
            Scan and verify
          </button>
        </div>
      </div>
    </>
  );
}
