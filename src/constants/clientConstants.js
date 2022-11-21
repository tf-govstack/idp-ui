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

const validAuthFactors = {
  PIN: "PIN",
  OTP: "OTP",
  BIO: "BIO",
};
const configurationKeys = {
  sbiEnv: "sbi.env",

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
  sendOtpChannels: "send.otp.channels",//comma separated list of otp channels.
};

export { deviceType, challengeTypes, configurationKeys, validAuthFactors };
