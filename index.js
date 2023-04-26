const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const schema = require('./schemas/schema');

const app = express();

// Global MiddleWares
app.use(cors());

// Connect Database
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database Connected Successfully');
  })
  .catch((err) => {
    console.log('Database Error', err);
  });

// GraphQL API Endpoint
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development',
  })
);

// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on Port ${port}`);
});
