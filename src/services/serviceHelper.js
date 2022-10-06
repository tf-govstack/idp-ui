const IDP_SERVER_BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_IDP_BASE_URL
    : window.origin + process.env.REACT_APP_IDP_BASE_URL;

const SBI_DOMAIN_URI =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_SBI_DOMAIN_URI
    : window.origin;

export { IDP_SERVER_BASE_URL, SBI_DOMAIN_URI };
