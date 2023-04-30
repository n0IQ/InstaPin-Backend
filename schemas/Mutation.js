const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
  GraphQLError,
  GraphQLList,
} = require('graphql');

const jwt = require('jsonwebtoken');

const User = require('../models/UserModel');
const Pin = require('../models/PinModel');

const UserType = require('./UserSchema');
const PinType = require('./PinSchema');

const { userExists, pinExists, validId } = require('../utils/validate');

const signToken = (id, userName) => {
  return jwt.sign({ id, userName }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // Create User
    createUser: {
      type: UserType,
      args: {
        firstName: {
          type: new GraphQLNonNull(GraphQLString),
        },
        lastName: {
          type: GraphQLString,
        },
        userName: {
          type: new GraphQLNonNull(GraphQLString),
        },
        email: {
          type: new GraphQLNonNull(GraphQLString),
        },
        password: {
          type: new GraphQLNonNull(GraphQLString),
        },
        passwordConfirm: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve(parent, args) {
        // create a new user
        return User.create({
          firstName: args.firstName,
          lastName: args.lastName,
          userName: args.userName,
          email: args.email,
          password: args.password,
          passwordConfirm: args.passwordConfirm,
        });
      },
    },
    // Signup User
    signup: {
      type: UserType,
      args: {
        firstName: {
          type: new GraphQLNonNull(GraphQLString),
        },
        lastName: {
          type: GraphQLString,
        },
        userName: {
          type: new GraphQLNonNull(GraphQLString),
        },
        email: {
          type: new GraphQLNonNull(GraphQLString),
        },
        password: {
          type: new GraphQLNonNull(GraphQLString),
        },
        passwordConfirm: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      async resolve(parent, args) {
        // check if user exists
        const user = await User.findOne({ email: args.email });
        if (user) {
          throw new GraphQLError('User already exists');
        }

        // create a new user
        const newUser = new User({
          firstName: args.firstName,
          lastName: args.lastName,
          userName: args.userName,
          email: args.email,
          password: args.password,
          passwordConfirm: args.passwordConfirm,
        });

        // create a token
        const token = signToken(newUser._id, newUser.userName);
        // console.log(token);

        newUser.jwtToken = token;
        newUser.save(function () {});

        return newUser;
      },
    },
    // Login User
    login: {
      type: UserType,
      args: {
        email: {
          type: new GraphQLNonNull(GraphQLString),
        },
        password: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      async resolve(parent, args) {
        // check if user exists
        const user = await User.findOne({ email: args.email }).select(
          '+password'
        );

        if (
          !user ||
          !(await user.checkPassword(args.password, user.password))
        ) {
          throw new GraphQLError('Incorrect email or password');
        }

        // create a token
        const token = signToken(user._id, user.userName);
        user.jwtToken = token;
        user.save(function () {});

        return user;
      },
    },
    // Update a User
    updateUser: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
        firstName: {
          type: GraphQLString,
        },
        lastName: {
          type: GraphQLString,
        },
      },
      async resolve(parent, args) {
        // check if id is valid
        if (!validId(args.id)) throw new GraphQLError('Invalid User ID');

        // check if user exists
        const user = await userExists(args.id);
        if (!user) {
          throw new GraphQLError('User does not exist');
        }

        // update the user
        return await User.findByIdAndUpdate(
          args.id,
          {
            $set: {
              firstName: args.firstName,
              lastName: args.lastName,
            },
          },
          {
            new: true,
          }
        );
      },
    },
    // Delete User
    deleteUser: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      async resolve(parent, args) {
        // check if id is valid
        if (!validId(args.id)) {
          throw new GraphQLError('Invalid User ID');
        }

        // check if the user exists
        const user = await userExists(args.id);
        if (!user) {
          throw new GraphQLError('User does not exist');
        }

        // delete all pins created by this user
        await Pin.deleteMany({
          userId: args.id,
        });

        // delete a user
        return User.findByIdAndDelete(args.id);
      },
    },
    // Create a Pin
    createPin: {
      type: PinType,
      args: {
        title: {
          type: new GraphQLNonNull(GraphQLString),
        },
        imageUrl: {
          type: new GraphQLNonNull(GraphQLString),
        },
        description: {
          type: GraphQLString,
        },
        link: {
          type: GraphQLString,
        },
        userId: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      async resolve(parent, args) {
        // check if id is valid
        if (!validId(args.userId)) {
          throw new GraphQLError('Invalid ID');
        }

        // check if the user exists
        const user = await userExists(args.userId);
        if (!user) {
          throw new GraphQLError('User does not exist');
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
          {
            $set: {
              createdPins: createdPinsObj,
            },
          },
          {
            new: true,
          }
        );

        return pin;
      },
    },
    // Save Pin
    savePin: {
      type: PinType,
      args: {
        pinId: {
          type: new GraphQLNonNull(GraphQLID),
        },
        userId: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      async resolve(parent, args) {
        await User.findByIdAndUpdate(args.userId, {
          $addToSet: { savedPins: args.pinId },
        });

        return await Pin.findByIdAndUpdate(args.pinId, {
          $addToSet: { savedBy: args.userId },
        });
      },
    },
    // Update a Pin
    updatePin: {
      type: PinType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
        title: {
          type: GraphQLString,
        },
        imageUrl: {
          type: GraphQLString,
        },
        description: {
          type: GraphQLString,
        },
        link: {
          type: GraphQLString,
        },
        userId: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      async resolve(parent, args) {
        // check if ids are valid
        if (!validId(args.id)) throw new GraphQLError('Invalid Pin ID');
        if (!validId(args.userId)) throw new GraphQLError('Invalid User ID');

        // check if the user exists
        const user = await userExists(args.userId);
        if (!user) {
          throw new GraphQLError('User does not exist');
        }

        // check if the pin exists
        const pin = await pinExists(args.id);
        if (!pin) {
          throw new GraphQLError('Pin does not exist');
        }

        // check if the user is the creator of the pin
        if (pin.userId.valueOf() !== args.userId) {
          throw new GraphQLError('User is not the Creator of this pin');
        }

        // update a pin
        return await Pin.findByIdAndUpdate(
          args.id,
          {
            $set: {
              title: args.title,
              imageUrl: args.imageUrl,
              description: args.description,
              link: args.link,
            },
          },
          {
            new: true,
          }
        );
      },
    },
    // Remove Pins from Saved Pins
    removePin: {
      type: PinType,
      args: {
        pinId: {
          type: new GraphQLNonNull(GraphQLID),
        },
        userId: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      async resolve(parent, args) {
        await User.findByIdAndUpdate(args.userId, {
          $pull: { savedPins: args.pinId },
        });

        return await Pin.findByIdAndUpdate(args.pinId, {
          $pull: { savedBy: args.userId },
        });
      },
    },
    // Delete a Pin
    deletePin: {
      type: PinType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
        userId: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      async resolve(parent, args) {
        // check if Id is valid
        if (!validId(args.id)) throw new GraphQLError('Invalid Pin ID');
        else if (!validId(args.userId))
          throw new GraphQLError('Invalid User ID');

        // check if the user exists
        const user = await userExists(args.userId);
        if (!user) {
          throw new GraphQLError('User does not exist');
        }

        // check if the pin exists
        const pin = await pinExists(args.id);
        if (!pin) {
          throw new GraphQLError('Pin does not exist');
        }

        // check if the user is the creator of the pin
        if (pin.userId.valueOf() !== args.userId) {
          throw new GraphQLError('User is not the Creator of this pin');
        }

        // remove this pin from the createdPins of the user
        await User.findByIdAndUpdate(args.userId, {
          $pull: {
            createdPins: args.id,
          },
        });

        // remove this pin from the savedPins of the users
        await User.updateMany(
          {
            savedPins: args.id,
          },
          {
            $pull: {
              savedPins: args.id,
            },
          }
        );

        // delete this pin
        return Pin.findByIdAndDelete(args.id);
      },
    },
  },
});

module.exports = Mutation;
