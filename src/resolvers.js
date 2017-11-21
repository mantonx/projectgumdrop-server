'use strict';

import AWS from 'aws-sdk';
import dynogels from 'dynogels-promisified';
import Joi from 'Joi';
import {User} from './schema';

require('babel-polyfill');

const dynamodb = new AWS.DynamoDB({
  region: 'localhost',
  endpoint: 'http://localhost:8000'
})

dynogels.dynamoDriver(dynamodb);

const Users = dynogels.define('users', {
  hashKey : 'id',
  timestamps : true,
  schema : User,
});

const projectGumpDropEndpoint = {
  getUser(args) {
    return Users
    .getAsync(args.email)
    .then(function(res){
      if (res) {
        return res.attrs;
      }
    })
    .catch(function(err){
      console.error(err);
    });
  },
  addUser(args) {
    return Users
    .createAsync({id: args.email, firstName: args.firstName, lastName: args.lastName})
    .then(function(res){
      if (res) {
        return res.attrs;
      }
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