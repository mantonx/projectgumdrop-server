import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import request from 'request';

const iss = 'https://projectgumdrop.auth0.com/';

// Policy helper function
const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};

const Auth = (event, context, callback) => {
  if (!event.authorizationToken) {
    return callback('Unauthorized');
  }

  const tokenParts = event.authorizationToken.split(' ');
  const tokenValue = tokenParts[1];

  if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
    console.log('Token does not exist.');
    return callback('Unauthorized');
  }
  request(
    { url: `${iss}.well-known/jwks.json`, json: true },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        console.error('Request error:', error);
        return callback('Unauthorized');
      }
      const keys = body;
      const k = keys.keys[0];
      const jwkArray = {
        kty: k.kty,
        n: k.n,
        e: k.e,
      };
      const pem = jwkToPem(jwkArray);
      try {
        jwt.verify(tokenValue, pem, { issuer: iss }, (err, decoded) => {
          if (err) {
            console.log('Unauthorized user:', err.message);
            return callback('Unauthorized');
          }
          return callback(null, generatePolicy(decoded.sub, 'Allow', event.methodArn));
        });
      } catch (invalid) {
        console.error('catch error. Invalid token', invalid);
        return callback('Unauthorized');
      }
      return true;
    },
  );
  return false;
};

export default Auth;
