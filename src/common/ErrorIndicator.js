import { useTranslation } from "react-i18next";

/**
 * @param {string} errorCode is a key from locales file under errors namespace
 * @param {string} defaultMsg (Optional) is a fallback value if transaction for errorCode not found.
 * If defaultMsg is not passed then errorCode key itself became the fallback value.
 */
const ErrorIndicator = ({ prefix, errorCode, defaultMsg }) => {
  const { t } = useTranslation("errors");
  return (
    <div
      className="p-4 mt-2 mb-2 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
      role="alert"
    >
      {prefix}
      {t(errorCode, defaultMsg)}
    </div>
  );
};

export default ErrorIndicator;
