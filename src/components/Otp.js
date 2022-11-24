import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "../common/LoadingIndicator";
import { otpFields } from "../constants/formFields";
import FormAction from "./FormAction";
import { LoadingStates as states } from "../constants/states";
import {
  challengeTypes,
  configurationKeys,
} from "../constants/clientConstants";
import { useTranslation } from "react-i18next";
import ErrorIndicator from "../common/ErrorIndicator";
import InputWithImage from "./InputWithImage";

const fields = otpFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState["Otp" + field.id] = ""));

const OTPStatusEnum = {
  getOtp: "GETOTP",
  verifyOtp: "VERIFYOTP",
};

export default function Otp({
  param,
  authService,
  localStorageService,
  i18nKeyPrefix = "otp",
}) {
  const { t } = useTranslation("translation", { keyPrefix: i18nKeyPrefix });
  const fields = param;
  const { post_AuthenticateUser, post_SendOtp } = { ...authService };
  const { getTransactionId, storeTransactionId, getIdpConfiguration } = {
    ...localStorageService,
  };

  const resendOtpTimeout =
    getIdpConfiguration(configurationKeys.resendOtpTimeout) ?? "30";
  const commaSeparatedChannels =
    getIdpConfiguration(configurationKeys.sendOtpChannels) ?? "email,mobile";

  const [loginState, setLoginState] = useState(fieldsState);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState({ state: states.LOADED, msg: "" });
  const [otpStatus, setOtpStatus] = useState(OTPStatusEnum.getOtp);
  const [formErrors, setFormErrors] = useState({});
  const [resendOtpCountDown, setResendOtpCountDown] = useState();
  const [showResendOtp, setShowResendOtp] = useState(false);
  const [showTimmer, setShowTimmer] = useState(false);
  const [otpSentMsg, setOtpSentMsg] = useState("");
  const [timer, setTimer] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    authenticateUser();
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    sendOTP();
  };

  const sendOTP = async () => {
    try {
      setShowTimmer(false);
      setShowResendOtp(false);
      setFormErrors({});
      setError(null);

      let transactionId = getTransactionId();
      let vid = loginState["Otp_mosip-vid"];

      let otpChannels = commaSeparatedChannels.split(",").map((x) => x.trim());

      if (!vid) {
        setFormErrors({ "Otp_mosip-vid": "*Required" });
        return;
      }

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
        startTimer();
        setOtpStatus(OTPStatusEnum.verifyOtp);

        let otpChannels = "";

        if (response.maskedMobile) {
          otpChannels =
            " " +
            t("mobile_number", {
              mobileNumber: response.maskedMobile,
            });
        }

        if (response.maskedEmail) {
          if (otpChannels.length > 0) {
            otpChannels += " & ";
          } else {
            otpChannels += " ";
          }
          otpChannels += t("email_address", {
            emailAddress: response.maskedEmail,
          });
        }

        let msg = t("otp_sent_msg", {
          otpChannels: otpChannels,
        });
        setOtpSentMsg(msg);
      }
    } catch (error) {
      setError({
        prefix: t("send_otp_failed"),
        errorCode: error.message,
      });
      setStatus({ state: states.ERROR, msg: "" });
    }
  };

  const startTimer = async () => {
    clearInterval(timer);
    setResendOtpCountDown(
      t("resent_otp_counter", { timeLeft: resendOtpTimeout + "s" })
    );
    setShowResendOtp(false);
    setShowTimmer(true);
    let timePassed = 0;
    var interval = setInterval(function () {
      timePassed++;
      let timeLeft = resendOtpTimeout - timePassed;

      setResendOtpCountDown(
        t("resent_otp_counter", { timeLeft: timeLeft + "s" })
      );

      if (timeLeft === 0) {
        clearInterval(interval);
        setShowTimmer(false);
        setShowResendOtp(true);
      }
    }, 1000);
    setTimer(interval);
  };

  //Handle Login API Integration here
  const authenticateUser = async () => {
    try {
      let transactionId = getTransactionId();

      let vid = loginState["Otp_mosip-vid"];
      let challengeType = challengeTypes.otp;
      let challenge = loginState["Otp_otp"];

      let challengeList = [
        {
          authFactorType: challengeType,
          challenge: challenge,
        },
      ];

      setStatus({ state: states.LOADING, msg: t("authenticating_msg") });
      const authenticateResponse = await post_AuthenticateUser(
        transactionId,
        vid,
        challengeList
      );
      setStatus({ state: states.LOADED, msg: "" });

      const { response, errors } = authenticateResponse;

      if (errors != null && errors.length > 0) {
        setError({
          prefix: t("authentication_failed_msg"),
          errorCode: errors[0].errorCode,
          defaultMsg: errors[0].errorMessage,
        });
        return;
      } else {
        setError(null);
        storeTransactionId(response.transactionId);
        navigate("/consent", {
          replace: true,
        });
      }
    } catch (error) {
      setError({
        prefix: t("authentication_failed_msg"),
        errorCode: error.message,
      });
      setStatus({ state: states.ERROR, msg: "" });
    }
  };

  return (
    <>
      <div className="grid grid-cols-6 items-center">
        {otpStatus === OTPStatusEnum.verifyOtp && (
          <button
            onClick={() => {
              setOtpStatus(OTPStatusEnum.getOtp);
            }}
            class="text-sky-600 text-3xl flex justify-left"
          >
            &#8592;
          </button>
        )}
        <div className="flex justify-center col-start-2 col-span-4">
          <h1 class="text-center text-sky-600 font-semibold">
            {t("sign_in_with_otp")}
          </h1>
        </div>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className={"space-y-px"}>
          {fields.map((field) => (
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
              disabled={otpStatus !== OTPStatusEnum.getOtp}
              formError={formErrors["Otp_" + field.id]}
            />
          ))}
        </div>

        {/* {otpStatus === OTPStatusEnum.getOtp && (
          <div className="flex items-center justify-between ">
            <div className="flex items-center rounded-md appearance-none w-full px-3 py-3 border border-gray-300">
              <input
                id="captcha"
                name="captcha"
                type="checkbox"
                className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label
                htmlFor="captcha"
                className="ml-2 block font-semibold text-gray-900"
              >
                {t("not_a_robot")}
              </label>
            </div>
          </div>
        )} */}

        {otpStatus === OTPStatusEnum.verifyOtp && (
          <div className={"space-y-px"}>
            <InputWithImage
              key={"Otp_" + "otp"}
              handleChange={handleChange}
              value={loginState["Otp_" + "otp"]}
              labelText={t("otp_label_text")}
              labelFor={"otp"}
              id={"Otp_" + "otp"}
              name={"otp"}
              type={"password"}
              isRequired={true}
              placeholder={t("otp_placeholder")}
              imgPath="images/photo_scan.png"
              disabled={otpStatus !== OTPStatusEnum.verifyOtp}
              formError={formErrors["Otp_" + "otp"]}
            />
          </div>
        )}

        {otpStatus === OTPStatusEnum.getOtp && (
          <FormAction
            type="Button"
            text={t("get_otp")}
            handleClick={handleSendOtp}
            disabled={!loginState["Otp_mosip-vid"]}
          />
        )}

        {otpStatus === OTPStatusEnum.verifyOtp && (
          <>
            <span class="w-full flex justify-center text-sm text-gray-500">
              {otpSentMsg}
            </span>
            <FormAction type="Submit" text={t("verify")} />
            {showTimmer && (
              <span class="w-full flex justify-center text-md text-gray-500">
                {resendOtpCountDown}
              </span>
            )}
            {showResendOtp && (
              <FormAction
                type="Button"
                text={t("resent_otp")}
                handleClick={handleSendOtp}
              />
            )}
          </>
        )}

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
      </form>
    </>
  );
}
