import { Buffer } from "buffer";

class oAuthDetailsService {
  constructor(oAuthDetails) {
    this.oAuthDetails = oAuthDetails;
  }

  /**
   * @returns redirectUri
   */
  getRedirectUri = () => {
    return this.oAuthDetails.redirect_uri;
  };

  /**
   * @returns nonce
   */
  getNonce = () => {
    return this.oAuthDetails.nonce;
  };

  /**
   * @returns state
   */
  getState = () => {
    return this.oAuthDetails.state;
  };

  /**
   * @returns outhDetails
   */
  getOuthDetails = () => {
    return this.oAuthDetails;
  };

  /**
   * @returns transactionId
   */
  getTransactionId = () => {
    return this.oAuthDetails.transactionId;
  };

  /**
   *
   * @param {string} configKey
   * @returns configuration value of the given config key
   */
  getIdpConfiguration = (configKey) => {
    return this.oAuthDetails.configs[configKey];
  };

  /**
   * encodes a jsonObject into base64 string
   * @param {jsonObject} jsonObject
   * @returns
   */
  encodeBase64 = (jsonObject) => {
    let objJsonStr = JSON.stringify(jsonObject);
    let objJsonB64 = Buffer.from(objJsonStr).toString("base64");
    return objJsonB64;
  };

};



export default oAuthDetailsService;
