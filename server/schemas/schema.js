const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLString,
} = require('graphql');

const User = require('../models/UserModel');
const Pin = require('../models/PinModel');

const UserType = require('./UserSchema');
const PinType = require('./PinSchema');

// Query
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
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
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
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Pin.findById(args.id);
      },
    },
  },
});

// Mutation
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // Create User
    createUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        userName: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return User.create({
          name: args.name,
          userName: args.userName,
          email: args.email,
          password: args.password,
        });
      },
    },
    // Delete User
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        // delete all pins created by this user
        Pin.find({ userId: args.id }).then((pins) => {
          pins.forEach((pin) => {
            pin.remove();
          });
        });
        return User.findByIdAndRemove(args.id);
      },
    },
    // Create a Pin
    createPin: {
      type: PinType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        imageUrl: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        link: { type: GraphQLString },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Pin.create({
          title: args.title,
          imageUrl: args.imageUrl,
          description: args.description,
          link: args.link,
          userId: args.userId,
        });
      },
    },
    // Update a Pin
    updatePin: {
      type: PinType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: GraphQLString },
        imageUrl: { type: GraphQLString },
        description: { type: GraphQLString },
        link: { type: GraphQLString },
      },
      resolve(parent, args) {
        return Pin.findByIdAndUpdate(
          args.id,
          {
            $set: {
              title: args.title,
              imageUrl: args.imageUrl,
              description: args.description,
              link: args.link,
            },
          },
          { new: true }
        );
      },
    },
    // Delete a Pin
    deletePin: {
      type: PinType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        // remove this pin from the createdPins of the user
        User.updateMany(
          {},
          {
            $pullAll: {
              createdPins: [args.id],
            },
          }
        );
        // delete this pin
        return Pin.findByIdAndRemove(args.id);
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

module.exports = schema;
