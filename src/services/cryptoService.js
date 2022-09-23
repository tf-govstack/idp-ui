import * as jose from "jose";
import { Buffer } from "buffer";

const decodeJWT = async (signed_jwt) => {
  const data = await new jose.decodeJwt(signed_jwt);
  return data;
};

const encodeBase64 = async (jsonObject) => {
  let objJsonStr = JSON.stringify(jsonObject);
  let objJsonB64 = new Buffer.from(objJsonStr).toString("base64");
  return objJsonB64;
};

export { decodeJWT, encodeBase64 };
