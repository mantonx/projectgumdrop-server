import { graphqlLambda } from 'apollo-server-lambda';
import { makeExecutableSchema } from 'graphql-tools';
import { lambdaPlayground } from 'graphql-playground-middleware';
import Auth from './util/auth';
import { User } from './schema.graphql';
import resolvers from './resolvers';

const GraphQLSchema = makeExecutableSchema({
  typeDefs: User,
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
  endpoint: (process.env.currentStage === 'dev') ? 'http://localhost:4000/graphql' : '/graphql',
});
