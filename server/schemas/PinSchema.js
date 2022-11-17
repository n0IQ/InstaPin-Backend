const { GraphQLObjectType, GraphQLID, GraphQLString } = require('graphql');
const User = require('../models/UserModel');

const PinType = new GraphQLObjectType({
  name: 'Pin',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    imageUrl: { type: GraphQLString },
    description: { type: GraphQLString },
    link: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.userId);
      },
    },
    createdAt: { type: String },
  }),
});

module.exports = PinType;

const UserType = require('./UserSchema');