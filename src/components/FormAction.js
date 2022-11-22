export default function FormAction({
  handleClick,
  type = "Button", //valid values: Button, Submit and Reset
  text,
  disabled = false,
}) {
  const className =
    "flex justify-center w-full font-medium rounded-lg text-sm px-5 py-2.5 text-center border border-2 ";

  return (
    <>
      {type === "Button" && (
        <button
          type={type}
          value={type}
          className={
            className +
            (disabled
              ? "text-slate-400 bg-white"
              : "text-white bg-gradient-to-t from-cyan-500 to-blue-500 hover:bg-gradient-to-b")
          }
          onClick={handleClick}
          disabled={disabled}
        >
          {text}
        </button>
      )}
      {type === "Submit" && (
        <button
          type={type}
          value={type}
          className={
            className +
            (disabled
              ? "text-slate-400 bg-white"
              : "text-white bg-gradient-to-t from-cyan-500 to-blue-500 hover:bg-gradient-to-b")
          }
          onSubmit={handleClick}
          disabled={disabled}
        >
          {text}
        </button>
      )}
      {type === "Reset" && (
        <button
          type={type}
          value={type}
          className={
            className +
            (disabled
              ? "text-slate-400 bg-white"
              : "text-white bg-gradient-to-t from-cyan-500 to-blue-500 hover:bg-gradient-to-b")
          }
          onClick={handleClick}
          disabled={disabled}
        >
          {text}
        </button>
      )}
    </>
  );
}
