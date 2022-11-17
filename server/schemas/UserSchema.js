const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} = require('graphql');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => {
    return({
      id: { type: GraphQLID },
      firstName: { type: GraphQLString },
      lastName: { type: GraphQLString },
      userName: { type: GraphQLString },
      createdPins: { type: new GraphQLList(PinType) },
      savedPins: { type: new GraphQLList(PinType) },
    });
  },
});

module.exports = UserType;

const PinType = require('./PinSchema');