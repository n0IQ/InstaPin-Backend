const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} = require('graphql');

const Pin = require('../models/PinModel');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: ()=> ({
      id: { type: GraphQLID },
      firstName: { type: GraphQLString },
      lastName: { type: GraphQLString },
      userName: { type: GraphQLString },
      createdPins: {
        type: new GraphQLList(PinType),
        async resolve(parent, args) {
          return await Pin.find({ userId : parent.id});
        }
      },
      savedPins: {
        type: new GraphQLList(PinType),
        async resolve(parent, args) {
          return await Pin.find({ savedBy: parent.id });
        }
      },
  }),
});

module.exports = UserType;

const PinType = require('./PinSchema');