const ErrorIndicator = ({ message }) => {
  return (
    <div
      className="p-4 mt-2 mb-2 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
      role="alert"
    >
      {message}
    </div>
  );
};

export default ErrorIndicator;
