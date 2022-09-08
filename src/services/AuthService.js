import axios from "axios";

const baseUrl = process.env.REACT_APP_API_BASE_URL;
const authenticateEndPoint = "/authorization/authenticate";
const oauthDetailsEndPoint = "/authorization/oauth-details";

const post_AuthenticateUser = async (
  transactionId,
  individualId,
  challengeList
) => {
  let request = {
    id: "String",
    version: "String",
    requestTime: "String",
    request: {
      transactionId: transactionId,
      individualId: individualId,
      challengeList: challengeList
    },
  };

  console.log(request);

  const endpoint = baseUrl + authenticateEndPoint;
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

  const response = await axios.post(endpoint, request, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};


export { post_AuthenticateUser, post_OauthDetails }