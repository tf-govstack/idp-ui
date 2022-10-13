const IDP_SERVER_API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_IDP_API_URL
    : window.origin + process.env.REACT_APP_IDP_API_URL;

const SBI_DOMAIN_URI = window.origin;

export { IDP_SERVER_API_URL, SBI_DOMAIN_URI };
