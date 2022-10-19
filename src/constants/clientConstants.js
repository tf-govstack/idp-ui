const deviceType = {
  face: "Face",
  finger: "Finger",
  iris: "Iris",
};

const challengeTypes = {
  bio: "BIO",
  pin: "PIN",
  otp: "OTP",
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
};

export { deviceType, challengeTypes, configurationKeys };
