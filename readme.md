# Pinterest Clone - GraphQL, NodeJS, ExpressJS, MongoDB


## Description:

This project is a clone of a very popular image sharing and social 
media service Pinterest. I build this project as a way to practice 
my GraphQL skills. I also used it to learn how to implement an ORM into my
back-end, which in this case I used Sequelize. It replicats the
famous column layout that Pinteres uses, and it exemplifies
several small features present in the real website. I made a
GraphQL API for my backend using Apollo Server, which allowed a
wall between the clients and the API. The user can also login
with their google account, and all info related to the user is
saved in a ClearDB MySQL database. If the user wants to upload a
pin, the image (and other details) are inserted to the database
and uploaded to Cloudinary as an image storage.

## Technologies Used:

- JavaScript
- NodeJS
- ExpressJS
- GraphQL
- MongoDB
- Mongoose ODM

### Back End

This repository is for the back-end.


## Design:

### Database:

2 Models:
- Users: Stores all users registered on the platform. Information for each user include the user first and last name, username, email, password, IDs of the pins created by the user and IDs of the pins saved by the user.
- Pins: Stores all pins uploaded to the platform. Information for each pin include the image url, userId of the user that uploaded, userId of the users that have saved this pin, a title, a description, and an optional url.


### Server-Side:
- Express server with a graphql enpoint:
  - Mutations and queries are handled.
  - Mongoose ODM is used for database requests.