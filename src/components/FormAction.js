export default function FormAction({
  handleClick,
  type = "Button", //valid values: Button, Submit and Reset
  text,
}) {
  return (
    <>
      {type === "Button" && (
        <button
          type={type}
          value={type}
          className="flex justify-center w-full text-white bg-gradient-to-t from-cyan-500 to-blue-500 hover:bg-gradient-to-b focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          onClick={handleClick}
        >
          {text}
        </button>
      )}
      {type === "Submit" && (
        <button
          type={type}
          value={type}
          className="flex justify-center w-full text-white bg-gradient-to-t from-cyan-500 to-blue-500 hover:bg-gradient-to-b focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          onSubmit={handleClick}
        >
          {text}
        </button>
      )}
      {type === "Reset" && (
        <button
          type={type}
          value={type}
          className="flex justify-center w-full text-white bg-gradient-to-t from-cyan-500 to-blue-500 hover:bg-gradient-to-b focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          onClick={handleClick}
        >
          {text}
        </button>
      )}
    </>
  );
}
