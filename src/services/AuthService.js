import axios from "axios";
import { IDP_SERVER_BASE_URL } from "./serviceHelper";

const authenticateEndPoint = "/authorization/authenticate";
const oauthDetailsEndPoint = "/authorization/oauth-details";
const authCodeEndPoint = "/authorization/auth-code";


const post_AuthenticateUser = async (
  transactionId,
  individualId,
  challengeList
) => {
  let request = {
    id: "String",
    version: "String",
    requestTime: new Date().toISOString(),
    request: {
      transactionId: transactionId,
      individualId: individualId,
      challengeList: challengeList
    },
  };

  const endpoint = IDP_SERVER_BASE_URL + authenticateEndPoint;
  const response = await axios.post(endpoint, request, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

const post_OauthDetails = async (
  nonce,
  clientId,
  scope,
  responseType,
  redirectUri,
  display,
  prompt,
  acrValues,
  claims
) => {
  let request = {
    id: "String",
    version: "String",
    requestTime: new Date().toISOString(),
    request: {
      nonce: nonce,
      clientId: clientId,
      scope: scope,
      responseType: responseType,
      redirectUri: redirectUri,
      display: display,
      prompt: prompt,
      acrValues: acrValues,
      claims: claims,
    },
  };

  var endpoint = IDP_SERVER_BASE_URL + oauthDetailsEndPoint;

  const response = await axios.post(endpoint, request, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};


const post_AuthCode = async (
  nonce,
  state,
  transactionId,
  acceptedClaims,
  permittedAuthorizeScopes
) => {
  let request = {
    id: "String",
    version: "String",
    requestTime: new Date().toISOString(),
    request: {
      transactionId: transactionId,
      acceptedClaims: acceptedClaims,
      permittedAuthorizeScopes: permittedAuthorizeScopes
    },
  };

  const endpoint = IDP_SERVER_BASE_URL + authCodeEndPoint + "?nonce=" + nonce + "&state=" + state;
  const response = await axios.post(endpoint, request, {
    headers: {
      "Content-Type": "application/json"
    },
  });
  return response.data;
};


export { post_AuthenticateUser, post_OauthDetails, post_AuthCode }