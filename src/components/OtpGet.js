import { useState } from "react";
import LoadingIndicator from "../common/LoadingIndicator";
import FormAction from "./FormAction";
import { LoadingStates as states } from "../constants/states";
import { useTranslation } from "react-i18next";
import ErrorIndicator from "../common/ErrorIndicator";
import InputWithImage from "./InputWithImage";
import { buttonTypes, configurationKeys } from "../constants/clientConstants";

export default function OtpGet({
  param,
  authService,
  localStorageService,
  onOtpSent,
  i18nKeyPrefix = "otp",
}) {
  const { t } = useTranslation("translation", { keyPrefix: i18nKeyPrefix });
  const fields = param;
  let fieldsState = {};
  fields.forEach((field) => (fieldsState["Otp" + field.id] = ""));

  const { getTransactionId, getIdpConfiguration } = {
    ...localStorageService,
  };
  const { post_SendOtp } = { ...authService };

  const commaSeparatedChannels =
    getIdpConfiguration(configurationKeys.sendOtpChannels) ?? "email,mobile";

  const [loginState, setLoginState] = useState(fieldsState);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState({ state: states.LOADED, msg: "" });

  const handleChange = (e) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  };

  const sendOTP = async () => {
    try {
      setError(null);

      let transactionId = getTransactionId();
      let vid = loginState["Otp_mosip-vid"];

      let otpChannels = commaSeparatedChannels.split(",").map((x) => x.trim());

      setStatus({ state: states.LOADING, msg: t("sending_otp_msg") });
      const sendOtpResponse = await post_SendOtp(
        transactionId,
        vid,
        otpChannels
      );
      setStatus({ state: states.LOADED, msg: "" });

      const { response, errors } = sendOtpResponse;

      if (errors != null && errors.length > 0) {
        setError({
          prefix: t("send_otp_failed"),
          errorCode: errors[0].errorCode,
          defaultMsg: errors[0].errorMessage,
        });
        return;
      } else {
        onOtpSent(vid, response);
      }
    } catch (error) {
      setError({
        prefix: t("send_otp_failed"),
        errorCode: error.message,
      });
      setStatus({ state: states.ERROR, msg: "" });
    }
  };

  return (
    <>
      <div className="  mt-16">
        {fields.map((field) => (
          <div>
            <InputWithImage
              key={"Otp_" + field.id}
              handleChange={handleChange}
              value={loginState["Otp_" + field.id]}
              labelText={t(field.labelText)}
              labelFor={field.labelFor}
              id={"Otp_" + field.id}
              name={field.name}
              type={field.type}
              isRequired={field.isRequired}
              placeholder={t(field.placeholder)}
              imgPath="images/photo_scan.png"
            />
          </div>
        ))}

        <div className="mt-10 mb-5">
          <FormAction
            type={buttonTypes.button}
            text={t("get_otp")}
            handleClick={sendOTP}
            disabled={!loginState["Otp_mosip-vid"]}
          />
        </div>

        {status.state === states.LOADING && (
          <LoadingIndicator size="medium" message={status.msg} />
        )}

        {status.state !== states.LOADING && error && (
          <ErrorIndicator
            prefix={error.prefix}
            errorCode={error.errorCode}
            defaultMsg={error.defaultMsg}
          />
        )}
      </div>
    </>
  );
}
