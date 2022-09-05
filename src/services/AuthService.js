import axios from "axios";

const baseUrl = process.env.REACT_APP_API_BASE_URL;
const authenticateEndPoint = "/authorization/authenticate";
const oauthDetailsEndPoint = "/authorization/oauth-details";

const post_AuthenticateUser = (
  transactionId,
  individualId,
  otp,
  biometrics
) => {
  let loginFields = {
    id: "String",
    version: "String",
    requestTime: "String",
    request: {
      transactionId: transactionId,
      individualId: individualId,
      otp: otp,
      biometrics: biometrics,
    },
  };

  const endpoint = baseUrl + authenticateEndPoint;
  fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginFields),
  })
    .then((response) => response.json())
    .then((data) => {
      //API Success from LoginRadius Login API
    })
    .catch((error) => console.log(error));
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
  let loginFields = {
    id: "String",
    version: "String",
    requestTime: "String",
    request: {
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

  var endpoint = baseUrl + oauthDetailsEndPoint + "?nonce=" + nonce;

  return axios.post(endpoint, loginFields, {
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.data);
};


export { post_AuthenticateUser, post_OauthDetails }