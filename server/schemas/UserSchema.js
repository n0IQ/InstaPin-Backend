const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} = require('graphql');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: ()=> ({
      id: { type: GraphQLID },
      firstName: { type: GraphQLString },
      lastName: { type: GraphQLString },
      userName: { type: GraphQLString },
      createdPins: {
        type: new GraphQLList(PinType),
        resolve(parent, args) {
          return Pin.find({ userId: parent.id });
        }
      },
      savedPins: {
        type: new GraphQLList(PinType),
        resolve(parent, args) {
          return Pin.find({ savedBy: parent.id });
        }
      },
  }),
});

module.exports = UserType;

const PinType = require('./PinSchema');