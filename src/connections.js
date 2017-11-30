'use strict';

import AWS from 'aws-sdk';
import dynogels from 'dynogels-promisified';
import User from './schema';

const dynamodb = new AWS.DynamoDB({
  region: 'localhost',
  endpoint: 'http://localhost:8000'
});

dynogels.dynamoDriver(dynamodb);

const Users = dynogels.define('users', {
  hashKey : 'id',
  timestamps : true,
  schema : User,
});

const Endpoint = {
  getUser(args) {
    return Users
    .getAsync(args.id)
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
    .createAsync({id: args.id, email: args.email, firstName: args.firstName, lastName: args.lastName}, {overwrite : false})
    .then(function(res){
      if (res) {
        return res.attrs;
      }
    })
    .catch(function(err){
      console.error(err);
      return null;
    });
  },
  removeUser(args) {
    return Users
    .destroyAsync({id: args.id}, {ReturnValues: 'ALL_OLD'})
    .then(function(res){
      if (res) {
        return {id: res.attrs.id};
      }
    })
    .catch(function(err){
      console.error(err);
    });
  }
};

export { Endpoint };