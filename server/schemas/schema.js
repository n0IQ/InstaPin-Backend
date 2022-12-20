const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLString,
  GraphQLError,
} = require('graphql');

const User = require('../models/UserModel');
const Pin = require('../models/PinModel');

const UserType = require('./UserSchema');
const PinType = require('./PinSchema');
const { default: mongoose } = require('mongoose');

// check if the user exists
const userExists = async (userId) => {
  const user = await User.findById(userId);
  if(!user) return false;
  return user;
}

// check if the pin exists
const pinExists = async (pinId) =>{
  const pin = await Pin.findById(pinId);
  if(!pin) return false;
  return pin;
}

// check if id is valid
const validId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
}

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
      args: { 
        id: { type: new GraphQLNonNull(GraphQLID) } 
      },
      async resolve(parent, args) {
        // check if id is valid
        if(!validId(args.id)) throw new GraphQLError('Invalid ID');
        
        // check if user exists
        const user = await userExists(args.id);
        if(!user) {
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
        if(!validId(args.id)) throw new GraphQLError('Invalid ID');
        
        // check if pin exists
        const pin = await pinExists(args.id);
        if(!pin) {
          throw new GraphQLError("Pin does not exist");
        }

        return pin;
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
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type : new GraphQLNonNull(GraphQLString) },
        userName: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        // create a new user
        return User.create({
          firstName: args.firstName,
          lastName: args.lastName,
          userName: args.userName,
          email: args.email,
          password: args.password,
        });
      },
    },
    // Update a User
    updateUser : {
      type : UserType,
      args : {
        id : { type : new GraphQLNonNull(GraphQLID) },
        firstName : { type : GraphQLString },
        lastName : {type : GraphQLString }
      },
      async resolve(parent, args) {
        // check if id is valid
        if(!validId(args.id)) throw new GraphQLError("Invalid User ID");

        // check if user exists
        const user = await userExists(args.id);
        if(!user) {
          throw new GraphQLError("User does not exist");
        }
        
        // update the user
        return await User.findByIdAndUpdate (
          args.id,
          {
            $set:
            {
              firstName : args.firstName,
              lastName : args.lastName,
            }
          },
          { new : true },
        );
      },
    },
    // Delete User
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, args) {
        // check if id is valid
        if(!validId(args.id)) {
          throw new GraphQLError('Invalid User ID');
        }

        // check if the user exists
        const user = await userExists(args.id);
        if(!user) {
          throw new GraphQLError("User does not exist");
        }

        // delete all pins created by this user
        await Pin.deleteMany({ userId: args.id });
        
        // delete a user
        return User.findByIdAndDelete(args.id);
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
      async resolve(parent, args) {
        // check if id is valid
        if(!validId(args.userId)) {
          throw new GraphQLError('Invalid ID');
        }

        // check if the user exists
        const user = await userExists(args.userId);
        if(!user) {
          throw new GraphQLError("User does not exist");
        }

        // create a pin
        const pin = await Pin.create({
          title: args.title,
          imageUrl: args.imageUrl,
          description: args.description,
          link: args.link,
          userId: args.userId,
        });


        // add the pin to the user's created pins
        const createdPinsObj = [...user.createdPins, pin._id];
        await User.findByIdAndUpdate(
          args.userId,
          { $set : { "createdPins" : createdPinsObj}},
          {new: true},
        );
        
        return pin;
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
        userId : { type : new GraphQLNonNull(GraphQLID)}
      },
      async resolve(parent, args) {
        // check if ids are valid
        if(!validId(args.id)) throw new GraphQLError('Invalid Pin ID');
        if(!validId(args.userId)) throw new GraphQLError('Invalid User ID');

        // check if the user exists
        const user = await userExists(args.userId);
        if(!user) {
          throw new GraphQLError("User does not exist");
        }
        
        // check if the pin exists
        const pin = await pinExists(args.id);
        if(!pin) {
          throw new GraphQLError("Pin does not exist");
        }

        // check if the user is the creator of the pin
        if (pin.userId.valueOf() !== args.userId) {
          throw new GraphQLError('User is not the Creator of this pin');
        }

        // update a pin
        return await Pin.findByIdAndUpdate(
          args.id,
          {
            $set: 
            {
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
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, args) {
        // check if Id is valid
        if(!validId(args.id)) throw new GraphQLError('Invalid Pin ID');
        else if(!validId(args.userId)) throw new GraphQLError('Invalid User ID');

        // check if the user exists
        const user = await userExists(args.userId);
        if(!user) {
          throw new GraphQLError("User does not exist");
        }

        // check if the pin exists
        const pin = await pinExists(args.id);
        if(!pin) {
          throw new GraphQLError("Pin does not exist");
        }

        // check if the user is the creator of the pin
        if (pin.userId.valueOf() !== args.userId) {
          throw new GraphQLError('User is not the Creator of this pin');
        }

        // remove this pin from the createdPins of the user
        await User.findByIdAndUpdate(
          args.userId,
          { $pull : {createdPins : args.id} }
        );

        // remove this pin from the savedPins of the users
        await User.updateMany(
          { savedPins: args.id },
          { $pull: { savedPins: args.id } }
        );
      
        // delete this pin
        return Pin.findByIdAndDelete(args.id);
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

module.exports = schema;
