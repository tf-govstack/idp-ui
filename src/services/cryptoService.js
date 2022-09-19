
import * as jose from 'jose';

const decodeJWT = async (signed_jwt) => {
    const data = await new jose.decodeJwt(signed_jwt);
    return data;
};

export { decodeJWT }