'use strict';

import { makeExecutableSchema } from 'graphql-tools';
import { schema } from './src/schema.graphql';
import { resolvers } from './src/resolvers';

const { graphqlLambda, graphiqlLambda } = require('apollo-server-lambda');
const { lambdaPlayground } = require('graphql-playground-middleware');

const GraphQLSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
  logger: console,
});

exports.graphqlHandler = function graphqlHandler(event, context, callback) {
  function callbackFilter(error, output) {
    output.headers['Access-Control-Allow-Origin'] = '*';
    callback(error, output);
  }
   
  console.log('Received event', event);

  const handler = graphqlLambda({ schema: GraphQLSchema });
  return handler(event, context, callbackFilter);
};

exports.graphiqlHandler = graphiqlLambda({
  endpointURL: process.env.REACT_APP_GRAPHQL_ENDPOINT
    ? process.env.REACT_APP_GRAPHQL_ENDPOINT
    : '/production/graphql',
});

exports.playgroundHandler = lambdaPlayground({
  endpoint: process.env.REACT_APP_GRAPHQL_ENDPOINT
    ? process.env.REACT_APP_GRAPHQL_ENDPOINT
    : '/production/graphql',
});
