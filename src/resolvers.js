import { Endpoint } from './connections';

const resolvers = {
  Query: {
    getUser: (_, args, context) => {
      return Endpoint.getUser(args);
    },
  },
  Mutation: {
    addUser: (_, args, context) => {
      return Endpoint.addUser(args);
    },
    removeUser: (_, args, context) => {
      return Endpoint.removeUser(args);
    },
  },
};

export default resolvers;

