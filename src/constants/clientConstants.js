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
  sbiThresholdFace: "sbi.threshold.face",
  sbiThresholdFinger: "sbi.threshold.finger",
  sbiThresholdIris: "sbi.threshold.iris",
  sbiFaceCount: "sbi.count.face",
  sbiFingerCount: "sbi.count.finger",
  sbiIrisCount: "sbi.count.iris",
  sbiCaptureTimeoutInSeconds: "sbi.timeout.capture",
  sbiDeviceCertification: "sbi.device.certification",
};

export { deviceType, challengeTypes, configurationKeys };
