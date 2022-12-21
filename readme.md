# Pinterest Clone - GraphQL, NodeJS, ExpressJS, MongoDB

## Description:

This project is a clone of a very popular image-sharing and social
media service - Pinterest. I built this project as a way to practice
my GraphQL skills and also used it to learn how to implement an ODM
into my backend, which in this case, I used Mongoose. It replicates
the famous Pinterest as well as exemplifies several small features present
in the original website. I made a GraphQL API for my backend. The user
can register on the platform, and all info related to the user gets stored
in a NoSQL MongoDB database. If the user wants to upload a pin, the image
(and other details) gets inserted into the database.

## Technologies Used:

- JavaScript
- NodeJS
- ExpressJS
- GraphQL
- MongoDB
- Mongoose ODM

### Back End

This repository is for the backend.

## Design:

### Database:

2 Models:

- Users: Stores all users registered on the platform. Information for each user includes the user's first and last name, username, email, password, IDs of the pins created by the user, and IDs of the pins saved by the user.
- Pins: Stores all pins uploaded to the platform. Information for each pin includes the image URL, userId of the user that uploaded, the userId of the users that have saved this pin, a title, a description, and an optional URL.

### Server-Side:

- Express server with a graphql enpoint:
  - Mutations and queries are handled.
  - Mongoose ODM is used for database requests.
