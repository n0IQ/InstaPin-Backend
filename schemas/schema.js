const { GraphQLSchema } = require('graphql');
const RootQuery = require('./RootQuery');
const Mutation = require('./Mutation');

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

module.exports = schema;