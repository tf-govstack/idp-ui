const fixedInputClass =
  "rounded-md bg-white shadow-lg appearance-none block w-full px-3.5 py-2.5 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm pr-10 p-2.5";

export default function InputWithImage({
  handleChange,
  value,
  labelText,
  labelFor,
  id,
  name,
  type,
  isRequired = false,
  placeholder,
  customClass,
  imgPath,
}) {
  return (
    <>
      <label
        htmlFor={labelFor}
        class="block mb-2 text-xs font-medium text-gray-900 text-opacity-70"
      >
        {labelText}
      </label>
      <div class="relative my-5">
        <div class="flex absolute inset-y-0 right-0 items-center pr-3 pointer-events-none">
          <img class="w-6 h-6" src={imgPath} />
        </div>
        <input
          onChange={handleChange}
          value={value}
          type={type}
          id={id}
          name={name}
          required={isRequired}
          className={fixedInputClass + customClass}
          placeholder={placeholder}
        />
      </div>
    </>
  );
}
