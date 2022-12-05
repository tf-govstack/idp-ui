import axios from "axios";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_IDP_API_URL
    : window.origin + process.env.REACT_APP_IDP_API_URL;

const linkCodeGenerateEndPoint = "/linked-authorization/link-code";
const linkStatusEndPoint = "/linked-authorization/link-status";
const linkAuthorizationCodeEndPoint = "/linked-authorization/authenticate";

/**
 * Triggers /linked-authorization/link-code API on IDP service
 * @param {string} transactionId same as idp transactionId
 * @returns /linked-authorization/link-code API response
 */
const post_GenerateLinkCode = async (transactionId) => {
  let request = {
    requestTime: new Date().toISOString(),
    request: {
      transactionId: transactionId,
    },
  };

  const endpoint = baseUrl + linkCodeGenerateEndPoint;

  const response = await axios.post(endpoint, request, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

/**
 * Triggers /linked-authorization/link-status API on IDP service
 * @param {string} transactionId same as idp transactionId
 * @param {string} linkCode generated idp linkcode
 * @returns /linked-authorization/link-status API response
 */
const post_LinkStatus = async (transactionId, linkCode) => {
  let request = {
    requestTime: new Date().toISOString(),
    request: {
      transactionId: transactionId,
      linkCode: linkCode,
    },
  };

  const endpoint = baseUrl + linkStatusEndPoint;
  const response = await axios.post(endpoint, request, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

/**
 * Triggers /linked-authorization/authenticate API on IDP service
 * @param {string} transactionId same as idp transactionId
 * @param {string} linkedCode linked idp linkcode
 * @returns /linked-authorization/authenticate API response
 */
const post_AuthorizationCode = async (transactionId, linkedCode) => {
  let request = {
    requestTime: new Date().toISOString(),
    request: {
      transactionId: transactionId,
      linkedCode: linkedCode,
    },
  };

  const endpoint = baseUrl + linkAuthorizationCodeEndPoint;

  const response = await axios.post(endpoint, request, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

const linkAuthService = {
  post_GenerateLinkCode: post_GenerateLinkCode,
  post_LinkStatus: post_LinkStatus,
  post_AuthorizationCode: post_AuthorizationCode,
};

export { linkAuthService };
