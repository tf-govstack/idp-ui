import { deviceType } from "./clientConstants";

const pinFields = [
  {
    labelText: "Uin",
    labelFor: "Mosip Uin",
    id: "mosip-uin",
    name: "uin",
    type: "text",
    autoComplete: "uin",
    isRequired: true,
    placeholder: "uin_vid_placeholder",//transaction key
  },
  {
    labelText: "Pin",
    labelFor: "pin",
    id: "pin",
    name: "pin",
    type: "password",
    autoComplete: "",
    isRequired: true,
    placeholder: "pin_placeholder",//transaction key
  },
];

const otpFields = [
  {
    labelText: "Vid",
    labelFor: "Mosip vid",
    id: "mosip-vid",
    name: "vid",
    type: "text",
    autoComplete: "vid",
    isRequired: true,
    placeholder: "VID",
  },
  {
    labelText: "Otp",
    labelFor: "otp",
    id: "otp",
    name: "otp",
    type: "password",
    autoComplete: "",
    isRequired: true,
    placeholder: "1234",
  },
];

const bioLoginFields = {
  inputFields: [
    {
      labelText: "Enter your VID",
      labelFor: "Mosip vid",
      id: "mosip-vid",
      name: "vid",
      type: "text",
      autoComplete: "vid",
      isRequired: true,
      placeholder: "VID",
    },
  ],
  bioFields: [deviceType.face, deviceType.finger, deviceType.iris],
};

const signupFields = [
  {
    labelText: "Username",
    labelFor: "username",
    id: "username",
    name: "username",
    type: "text",
    autoComplete: "username",
    isRequired: true,
    placeholder: "Username",
  },
  {
    labelText: "Vid",
    labelFor: "mosip-vid",
    id: "mosip-vid",
    name: "vid",
    type: "text",
    autoComplete: "vid",
    isRequired: true,
    placeholder: "Mosip vid",
  },
  {
    labelText: "Password",
    labelFor: "password",
    id: "password",
    name: "password",
    type: "password",
    autoComplete: "current-password",
    isRequired: true,
    placeholder: "Password",
  },
  {
    labelText: "Confirm Password",
    labelFor: "confirm-password",
    id: "confirm-password",
    name: "confirm-password",
    type: "password",
    autoComplete: "confirm-password",
    isRequired: true,
    placeholder: "Confirm Password",
  },
];

//TODO fetch tablist from oidcDetails response
const tabList = [
  {
    name: "Sign in with PIN",
    icon: "space-shuttle",
    comp: "PIN",
  },
  {
    name: "Log in with Inji",
    icon: "cog",
    comp: "QRCode",
  },
  {
    name: "Log in with Biometrics",
    icon: "bio_capture",
    comp: "Biometrics",
  },
];

export {
  pinFields,
  otpFields,
  signupFields,
  tabList,
  bioLoginFields,
};
