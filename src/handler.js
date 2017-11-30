'use strict';

import { Auth } from './util/auth';
import { makeExecutableSchema } from 'graphql-tools';
import { schema } from './schema.graphql';
import { resolvers } from './resolvers';
import { graphqlLambda, graphiqlLambda } from 'apollo-server-lambda';
import { lambdaPlayground } from 'graphql-playground-middleware';

const GraphQLSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
  logger: console,
});

exports.auth = function auth(event, context, callback) {
  return Auth(event, context, callback);
};

exports.graphqlHandler = function graphqlHandler(event, context, callback) {
  function callbackFilter(error, output) {
    output.statusCode = 200;
    output.headers['Access-Control-Allow-Origin'] = '*';
    output.headers['Access-Control-Allow-Credentials'] = true;
    callback(error, output);
  }
  const handler = graphqlLambda({ schema: GraphQLSchema });
  return handler(event, context, callbackFilter);
};

exports.playgroundHandler = lambdaPlayground({
  endpoint: process.env.REACT_APP_GRAPHQL_ENDPOINT
    ? process.env.REACT_APP_GRAPHQL_ENDPOINT
    : '/production/graphql',
});
