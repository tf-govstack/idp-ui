import * as jose from "jose";
import { Buffer } from "buffer";

/**
 * decode the JWT
 * @param {JWT} signed_jwt
 * @returns decoded jwt data
 */
const decodeJWT = async (signed_jwt) => {
  const data = await new jose.decodeJwt(signed_jwt);
  return data;
};

/**
 * encodes a jsonObject into base64 string
 * @param {jsonObject} jsonObject
 * @returns
 */
const encodeBase64 = async (jsonObject) => {
  let objJsonStr = JSON.stringify(jsonObject);
  let objJsonB64 = new Buffer.from(objJsonStr).toString("base64");
  return objJsonB64;
};

export { decodeJWT, encodeBase64 };
