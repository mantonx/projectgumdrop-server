import AWS from 'aws-sdk';
import dynogels from 'dynogels-promisified';
import Joi from 'Joi';

require('babel-polyfill');

const dynamodb = new AWS.DynamoDB({
  region: 'localhost',
  endpoint: 'http://localhost:8000'
})

dynogels.dynamoDriver(dynamodb);

const Users = dynogels.define('users', {
  hashKey : 'id',
  timestamps : true,
  schema : {
    id: Joi.string().email(),
    firstName : Joi.string(),
    lastName : Joi.string(),
    uuid : dynogels.types.uuid(),
  },
});

const projectGumpDropEndpoint = {
  getUser(args) {
    return Users
    .getAsync(args.email)
    .then(function(res){
      console.log(res.attrs);
      return res.attrs;;
    })
    .catch(function(err){
      console.error(err);
    });
  },
  addUser(args) {
    return Users
    .createAsync({id: args.email, firstName: args.firstName, lastName: args.lastName})
    .then(function(res){
      console.log(res.attrs);
      return res.attrs;
    })
    .catch(function(err){
      console.error(err);
    });
  }
};

export const resolvers = {
  Query: {
    getUser: (_, args, context) => {
      return projectGumpDropEndpoint.getUser(args);
    },
  },
  Mutation: {
    addUser: (_, args, context) => {
      return projectGumpDropEndpoint.addUser(args);
    },
  },
};