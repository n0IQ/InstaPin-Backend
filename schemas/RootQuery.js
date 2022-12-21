const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
  GraphQLError,
} = require('graphql');

const User = require('../models/UserModel');
const Pin = require('../models/PinModel');

const UserType = require('./UserSchema');
const PinType = require('./PinSchema');

const {
  userExists,
  pinExists,
  validId
} = require('../utils/validate');

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    // Get all Users
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.find();
      },
    },
    // Get a Single User
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      async resolve(parent, args) {
        // check if id is valid
        if (!validId(args.id)) throw new GraphQLError('Invalid ID');

        // check if user exists
        const user = await userExists(args.id);
        if (!user) {
          throw new GraphQLError("User does not exist");
        }

        return User.findById(args.id);
      },
    },
    // Get all Pins
    pins: {
      type: new GraphQLList(PinType),
      resolve(parent, args) {
        return Pin.find();
      },
    },
    // Get a Single Pin
    pin: {
      type: PinType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      async resolve(parent, args) {
        // check if id is valid
        if (!validId(args.id)) throw new GraphQLError('Invalid ID');

        // check if pin exists
        const pin = await pinExists(args.id);
        if (!pin) {
          throw new GraphQLError("Pin does not exist");
        }

        return pin;
      },
    },
  },
});

module.exports = RootQuery;