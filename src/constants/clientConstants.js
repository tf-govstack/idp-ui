const deviceType = {
  face: "Face",
  finger: "Finger",
  iris: "Iris",
};

const challengeTypes = {
  bio: "BIO",
  pin: "PIN",
  otp: "OTP",
  wallet: "WALLET",
};

const challengeFormats = {
  bio: "encoded-json",
  pin: "number",
  otp: "alpha-numeric",
  wallet: "jwt",
};


const validAuthFactors = {
  PIN: "PIN",
  OTP: "OTP",
  BIO: "BIO",
};

const buttonTypes = {
  button: "Button",
  cancel: "Cancel",
  reset: "Reset",
  submit: "Submit",
};

const deepLinkParamPlaceholder = {
  linkCode: "LINK_CODE",
  linkExpiryDate: "LINK_EXPIRE_DT",
};

const configurationKeys = {
  sbiEnv: "sbi.env",
  sbiPortRange: "sbi.port.range", //hyphen separated numbers (inclusive). default is 4501-4600

  sbiCAPTURETimeoutInSeconds: "sbi.timeout.CAPTURE",
  sbiDISCTimeoutInSeconds: "sbi.timeout.DISC",
  sbiDINFOTimeoutInSeconds: "sbi.timeout.DINFO",

  sbiFaceCaptureCount: "sbi.capture.count.face",
  sbiFingerCaptureCount: "sbi.capture.count.finger",
  sbiIrisCaptureCount: "sbi.capture.count.iris",

  sbiFaceCaptureScore: "sbi.capture.score.face",
  sbiFingerCaptureScore: "sbi.capture.score.finger",
  sbiIrisCaptureScore: "sbi.capture.score.iris",

  sbiIrisBioSubtypes: "sbi.bio.subtypes.iris", //comma separated list of bio-subtypes. default is "UNKNOWN"
  sbiFingerBioSubtypes: "sbi.bio.subtypes.finger", //comma separated list of bio-subtypes. default is "UNKNOWN"

  resendOtpTimeout: "resend.otp.delay.secs",
  sendOtpChannels: "send.otp.channels", //comma separated list of otp channels.
  sendOTPShowCaptcha: "mosip.preregistration.captcha.enable", //display captcha or not
  sendOtpCaptchaSiteKey: "mosip.preregistration.captcha.sitekey", //site key for ReCAPTCHA

  linkCodeWaitTimeInSec: "mosip.idp.link-code-expire-in-secs",
  injiDeepLinkURI: "mosip.idp.inji.deep-link-uri",
  injiAppDownloadURI: "mosip.idp.inji.download-uri",
  signInWithInjiEnable: "mosip.idp.inji.enable",
};

export {
  deviceType,
  challengeTypes,
  configurationKeys,
  validAuthFactors,
  deepLinkParamPlaceholder,
  buttonTypes,
  challengeFormats
};
