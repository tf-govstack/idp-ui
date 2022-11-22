import axios from "axios";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_IDP_API_URL
    : window.origin + process.env.REACT_APP_IDP_API_URL;

const sendOtpEndPoint = "/authorization/send-otp";
const authenticateEndPoint = "/authorization/authenticate";
const oauthDetailsEndPoint = "/authorization/oauth-details";
const authCodeEndPoint = "/authorization/auth-code";

/**
 * Triggers /authenticate API on IDP service
 * @param {string} transactionId same as idp transactionId
 * @param {String} individualId UIN/VIN of the individual
 * @param {List<AuthChallenge>} challengeList challenge list based on the auth type(ie. BIO, PIN, INJI)
 * @returns /authenticate API response
 */
const post_AuthenticateUser = async (
  transactionId,
  individualId,
  challengeList
) => {
  let request = {
    requestTime: new Date().toISOString(),
    request: {
      transactionId: transactionId,
      individualId: individualId,
      challengeList: challengeList,
    },
  };

  const endpoint = baseUrl + authenticateEndPoint;

  const response = await axios.post(endpoint, request, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

/**
 * Triggers /auth-code API on IDP service
 * @param {string} nonce
 * @param {string} state
 * @param {string} clientId
 * @param {url} redirectUri
 * @param {string} responseType
 * @param {string} scope
 * @param {string} acrValues
 * @param {jsonObject} claims
 * @param {string} claimsLocales
 * @param {string} display
 * @param {int} maxAge
 * @param {string} prompt
 * @param {string} uiLocales
 * @returns /oauthDetails API response
 */
const post_OauthDetails = async (
  nonce,
  state,
  clientId,
  redirectUri,
  responseType,
  scope,
  acrValues,
  claims,
  claimsLocales,
  display,
  maxAge,
  prompt,
  uiLocales
) => {
  let request = {
    requestTime: new Date().toISOString(),
    request: {
      nonce: nonce,
      state: state,
      clientId: clientId,
      redirectUri: redirectUri,
      responseType: responseType,
      scope: scope,
      acrValues: acrValues,
      claims: claims,
      claimsLocales: claimsLocales,
      display: display,
      maxAge: maxAge,
      prompt: prompt,
      uiLocales: uiLocales,
    },
  };

  var endpoint = baseUrl + oauthDetailsEndPoint;

  const response = await axios.post(endpoint, request, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

/**
 * Triggers /auth-code API to IDP service
 * @param {String} transactionId
 * @param {List<String>} acceptedClaims
 * @param {List<String>} permittedAuthorizeScopes
 * @returns /auth-code API response
 */
const post_AuthCode = async (
  transactionId,
  acceptedClaims,
  permittedAuthorizeScopes
) => {
  let request = {
    requestTime: new Date().toISOString(),
    request: {
      transactionId: transactionId,
      acceptedClaims: acceptedClaims,
      permittedAuthorizeScopes: permittedAuthorizeScopes,
    },
  };

  const endpoint = baseUrl + authCodeEndPoint;
  const response = await axios.post(endpoint, request, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

const post_SendOtp = async (
  transactionId,
  individualId,
  otpChannels,
  token
) => {
  let request = {
    requestTime: new Date().toISOString(),
    request: {
      transactionId: transactionId,
      individualId: individualId,
      otpChannels: otpChannels,
      token: token,
    },
  };

  const endpoint = baseUrl + sendOtpEndPoint;

  const response = await axios.post(endpoint, request, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

const authService = {
  post_AuthenticateUser: post_AuthenticateUser,
  post_OauthDetails: post_OauthDetails,
  post_AuthCode: post_AuthCode,
  post_SendOtp: post_SendOtp,
};

export { authService };
