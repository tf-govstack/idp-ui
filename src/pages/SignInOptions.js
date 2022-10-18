import React from "react";
import Background from "../components/Background";
import SignInOptions from "../components/SignInOptions";

export default function SignInOptionsPage() {
  return (
    <>
      <Background
        heading="Login with MOSIP"
        logoPath="logo.png"
        backgroundImgPath="images/illustration_one.png"
        component={React.createElement(SignInOptions)}
      />
    </>
  );
}
