import React from "react";
import Consent from "../components/Consent";
import { authService } from "../services/authService";
import { Buffer } from "buffer";
import { useSearchParams } from "react-router-dom";
import oAuthDetailsService from "../services/oAuthDetailsService";

export default function ConsentPage() {

  const [searchParams, setSearchParams] = useSearchParams();
  let response = searchParams.get("response")
  var decodeOAuth = Buffer.from(response, 'base64')?.toString();
  const oAuthDetails = new oAuthDetailsService(JSON.parse(decodeOAuth));

  return (
    <Consent
      authService={authService}
      oAuthDetailsService={oAuthDetails}
    />
  );
}
