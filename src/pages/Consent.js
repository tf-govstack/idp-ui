import React from "react";
import Header from "../components/Header"
import Consent from "../components/Consent";

export default function ConsentPage() {
  return (
    <>
      <Header
        heading="Login With Mosip"
      />
      <Consent />
    </>
  )
}