import AWS from 'aws-sdk';
import dynogels from 'dynogels-promisified';
import User from './schema';

if (process.env.currentStage === 'dev') {
  const dynamodb = new AWS.DynamoDB({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  });
  dynogels.dynamoDriver(dynamodb);
} else {
  dynogels.AWS.config.update({ region: 'us-east-1' });
}

const stage = () => {
  if (process.env.currentStage === 'dev') {
    return 'dev-';
  } else if (process.env.currentStage === 'qa') {
    return 'qa-';
  }
  return '';
};

const Users = dynogels.define(`${stage()}users`, {
  hashKey: 'id',
  timestamps: true,
  schema: User,
});

const Endpoint = {
  getUser(args) {
    return Users
      .getAsync(args.id)
      .then(function(res) {
      if (res) {
        return res.attrs;
      }
    })
      .catch(function(err) {
      console.error(err);
    });
  },
  addUser(args) {
    return Users
      .createAsync({
        id: args.id,
        email: args.email,
        firstName: args.firstName,
        lastName: args.lastName,
      }, { overwrite: false })
      .then(function(res) {
      if (res) {
        return res.attrs;
      }
    })
      .catch(function(err) {
      console.error(err);
      return null;
    });
  },
  removeUser(args) {
    return Users
      .destroyAsync({ id: args.id }, { ReturnValues: 'ALL_OLD' })
      .then(function(res) {
      if (res) {
        return { id: res.attrs.id };
      }
    })
      .catch(function(err) {
      console.error(err);
    });
  },
};

export default Endpoint;
