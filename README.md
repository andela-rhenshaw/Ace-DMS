[![Build Status](https://travis-ci.org/andela-rhenshaw/Ace-DMS.svg?branch=chore%2F%23142416561-integrate-travisCI)](https://travis-ci.org/andela-rhenshaw/Ace-DMS)
[![Coverage Status](https://coveralls.io/repos/github/andela-rhenshaw/Ace-DMS/badge.svg?branch=chore%2F%23142416561-integrate-travisCI)](https://coveralls.io/github/andela-rhenshaw/Ace-DMS?branch=chore%2F%23142416561-integrate-travisCI)
[![Code Climate](https://codeclimate.com/github/andela-rhenshaw/Ace-DMS/badges/gpa.svg)](https://codeclimate.com/github/andela-rhenshaw/Ace-DMS)
# Ace-DMS
Ace-DMS is a full stack document management system, complete with roles and privileges . Each document defines access rights; the document defines which roles can access it. Also, each document specifies the date it was published.
Users are categorized by roles. Users with access to specific documents can edit and update their documents but will not be granted access to read or write to a document with unathourized access role, only a view access.

###### Document Management
*   Visit the [hosted app](acedms.herokuapp.com)
*   Create an account
*   Login with your credentials
*   Create new document with specifying document title, content and document access
*   Edit Documents
*   Delete documents
*   View public documents created by other users.
*   View documents created by his access group with access level set as `role`.
*   Search a users public documents.
*   View `public` and `role` access level documents of other regular users.
*   Logout

-   In addition to the general user functions, an admin user can:
    -   View all users.
    -   View all created documents except documents with access set to private.
    -   Delete any user.
    -   Update any user's record.
    -   Create a new role.
    -   View all created roles.
    -   Search for any user.

## Postman Collection
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/79158ea63ffdea6731dd)

## Features

1. **Authentication**
  - It uses JWT for authentication.  
  - It generates and returns a token on successful login or creation of a user.
  - It saves users tokens to be used to manage sessions  
  - It verifies the token on every request to authenticated endpoints.

2. **Users**
  - It allows creation of new users. 
  - It ensures no other user can be assigned the admin role (there are only two admin roles)
  - It sets a newly created user's role category to `regular` by default.  
  - It allows created user to edit/update their information.
  - Only the admin user can update/edit other users information.
  - All registered users can be retrieved by the admin user or other registered users (it doesn't return sensitive information(passwords, tokens) of the users retrieved).

3. **Roles**
  - It makes sure  that created users have a role defined.
  - It ensures new roles can be created, updated and deleted by only the admin user.   
  - It does not currently allow the admin user carry out CRUD operations on the roles but that could be easily enabled.

4. **Documents**
  - It allows new documents to be created/saved by users.  
  - It ensures all documents have an access type defined (default access type is `public`).  
  - It allows only admin users retrieve all documents regardless of the document required access type.  
  - It ensures document retrieval by their owners, public access typed documents can be retrieved by all users and role access typed documents can be retrieved by ONLY users with the same role level as the document owner.     
  - It ensures only authenticated users can delete, edit and update documents they own and users cannot delete documents they do not own (with the exception of the admin). 

## API Endpoints
| **HTTP Verb** | **Endpoint** | **Functionality**|
|------|-------|-----------------|
| **POST** | api/users/login | Logs a user in and returns a token which should be subsequently used to access authenticated endpoints |
| **POST** | api/users/logout | Logs a user out, and destroys the current token used for managing sessions |
| **POST** | api/users/ | Creates a new user. Required attributes are `firstName`, `lastName`, `email`, `password`. If a `role` category is not specified, a default role of `regular` is assigned |
| **GET** | api/users/ | Fetch all registered users (`admin` privilege required) |
| **GET** | api/users/:id | Fetch a user by specific id |
| **PUT** | api/users/:id | Update a specific user (by id) attributes|
| **DELETE** | api/users/:id | Delete a specific user by id. (`admin` privilege required |
| **POST** | api/documents/ | Creates a new document instance. Required attributes are `title` and `content`. If an `access` restriction is NOT specified, the document is marked  _public_ |
| **GET** | api/documents/ | Fetch all documents (returns all documents the requester should have access to) |
| **GET** | api/documents/:id | Fectch a specific document by it's id |
| **PUT** | api/documents/:id | Update specific document attributes by it's id |
| **DELETE** | api/documents/:id | Delete a specific document by it's id |
| **GET** | api/users/:id/documents | Find a specific user and all documents belonging to the user|
| **POST** | api/roles/ | Create a new role (`admin` privilege required) |
| **GET** | api/roles/ | Fetches all available roles (`admin privilege required`) |
| **GET** | api/roles/:id | Find a role by id (`admin privilege required`) |
| **PUT** | api/roles/:id | Update role attributes (`admin privilege required`) |
| **DELETE** | api/delete/:id | Delete role (`admin privilege required`) |

## API Endpoints Sample Requests & Responses
##### _Users Endpoint_
1. *Create User*
  - Request
    * Endpoint - `post: /api/users`
    * Body - `application/json`
    ````javascript
    {
      "firstName": "john doe",
      "lastName": "lastname",
      "email": "johndoe@gmail.com",
      "password": "pabloescobar"
    }
    ````
  - Response
    * Status - `201`
    * Body - `application/json`
    ````javascript
    {
      "id": 5,
      "roleId": 2,
      "email": "johndoe@gmail.com",
      "firstName": "john",
      "lastName": "doe",
      "createdAt": "2017-04-08T18:13:42.019Z",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
    }
    ````
2. *User Log In*
  - Request
    * Endpoint - `post: /api/users/login`
    * Body - `application/json`
    ````javascript
    {
      "email": "johndoe@gmail.com",
      "password": "pabloescobar"
    }
    ````
  - Response
    * Status - `200`
    * Body - `application/json`
    ````javascript
    {
      "id": 5,
      "roleId": 2,
      "email": "johndoe@gmail.com",
      "firstName": "john",
      "lastName": "doe",
      "createdAt": "2017-04-08T18:13:42.019Z",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
    }
    ````
3. *User Log out*
  - Request
    * Endpoint - `post: /api/users/logout`
    * Header - `x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`

  - Response
    * Status - `200`
    * Body - `application/json`
    ````javascript
    {
      "message": "Successfully logged out"
    }
    ````
4. *Get users*
  - Request
    * Endpoint - `get: /api/users`
    * Header - `x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`
   
  - Response
    * Status - `200`
    * Body - `application/json`
    ````javascript
    {
      [
        {
          "id": 5,
          "email": "testuser1@mail.com",
          "firstName": "firstname",
          "lastName": "lastname",
          "createdAt": "2017-03-08T18:13:42.019Z"
        },
        {
          "id": 4,
          "email": "testuser2@mail.com",
          "firstName": "test",
          "lastName": "user",
          "createdAt": "2017-03-08T16:02:50.822Z"
        },
        {
          "id": 3,
          "email": "testuser3@testMail.com",
          "firstName": "test2",
          "lastName": "user2",
          "createdAt": "2017-03-08T15:46:08.499Z"
        }
      ]
    }
    ````

##### _Documents Endpoint_
1. *Create Document*
  - Request
    * Endpoint - `post: /api/documents`
    * Header - `x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`
    * Body - `application/json`
    ````javascript
    {
      "title": "Sample Title",
      "content": "Sample content",
      "access": "public"
    }
    ````
  - Response
    * Status - `201`
    * Body - `application/json`
    ````javascript
    {
      "id": 14,
      "title": "Sample Title",
      "content": "Sample Content",
      "ownerId": 1,
      "access": "public",
      "createdAt": "2017-03-08T18:29:02.187Z"
    }
    ````
2. *Get Documents*
  - Request
    * Endpoint - `get: /api/documents`
    * Body - `application/json`
    * Header - `x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`
  - Response
    * Status - `200`
    * Body - `application/json`
    ````javascript
      [
        {
          "id": 14,
          "ownerId": 1,
          "access": "public",
          "title": "Sample Title",
          "content": "Sample Content",
          "createdAt": "2017-03-08T18:29:02.187Z"
        },
        {
          "id": 13,
          "ownerId": 1,
          "access": "public",
          "title": "the titles",
          "content": "the contents again and again",
          "createdAt": "2017-03-08T17:19:20.629Z"
        },
        {
          "id": 12,
          "ownerId": 4,
          "access": "private",
          "title": "rerererr",
          "content": "theh re",
          "createdAt": "2017-03-08T16:05:48.160Z"
        },
        {
          "id": 4,
          "ownerId": 2,
          "access": "public",
          "title": "Test Document 4",
          "content": "Test Document 4",
          "createdAt": "2017-03-08T15:46:08.509Z"
        }
      ]
    ````
3. *Delete Document*
  - Request
    * Endpoint - `delete: /api/documents/14`
    * Header- `x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`

  - Response
    * Status - `200`
    * Body - `application/json`
    ````javascript
    {
      "message": "Successfully Deleted"
    }
    ````
4. *Update Document*
  - Request
    * Endpoint - `put: /api/documents/14`
    * Header- `x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`
  - Response
    * Status - `200`
    * body - `application/json`
    ````javascript
    {
        "message": "Document Updated"
    }
    ````

##### _Roles Endpoint_
1. *Create Role*
  - Request
    * Endpoint - `post: /api/roles`
    * Header - `x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`
    * Body - `application/json`
    ````javascript
    {
      "title": "guest"
    }
    ````
  - Response
    * Status - `201`
    * Body - `application/json`
    ````javascript
    {
        "id": 3,
        "title": "guest"
    }
    ````
2. *Get Roles*
  - Request
    * Endpoint - `get: /api/roles`
    * Body - `application/json`
    * Header - `x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`
  - Response
    * Status - `200`
    * Body - `application/json`
    ````javascript
      [
        {
          "id": 2,
          "title": "Sample Title",
          "createdAt": "2017-03-08T18:38:22.308Z"
        },
        {
          "id": 1,
          "title": "regular",
          "createdAt": "2017-03-08T15:46:08.245Z"
        }
      ]
    ````
3. *Delete Role*
  - Request
    * Endpoint - `delete: /api/roles/3`
    * Header- `x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`
  - Response
    * Status - `200`
    * Body - `application/json`
    ````javascript
    {
      "message": "Successfully Deleted"
    }
    ````
4. *Update Role*
  - Request
    * Endpoint - `put: /api/roles/3`
    * Header- `x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`
    ````javascript
    {
      "title": "ghosts"
    }
    ````
  - Response
    * Status - `200`
    * Body - `application/json`
    ````javascript
    {
        "message": "Role Updated"
    }
    ````
    
## Contributing
1. Fork this repository to your GitHub account
2. Clone the forked repository and cd into it
3. Create a .env file in the root of the project using this sample configuration 
(text within the < > represent placeholders)
    ````
    SECRET_KEY=mysecretkey
    DEV_DB_URL=postgres://<username>:<password>@<mydatabaseservice.com>:<port>/<databasename>
    TEST_DB_URL=postgres://<username>:<password>@<mydatabaseservice.com>:<port>/<databasename>
    PROD_URL=postgres:postgres://<username>:<password>@<mydatabaseservice.com>:<port>/<databasename>
    ADMIN_EMAIL=<admin@mail.com>
    ADMIN_FIRST_NAME=<admin_first_name>
    ADMIN_LAST_NAME=<admin_lastname>
    ADMIN_PASSWORD=<mypassword>
    ````
5. Install all dependencies by running this command below in your terminal/shell
    ````
    npm install
    ````
6. Run the command below in your terminal/shell (initializes and seeds the database tables)
    ```` 
    sequelize db:migrate && sequelize db:seed:all
    ````
7. To run the development server enter the command below in your terminal/shell
    ````
    npm run develop:server
    ````
    You should also explore the scripts section of the package.json to gain familiarity with other npm commands available 
    for this app.
8. Create your feature branch
9. Commit your changes
10. Push to the remote branch
11. Open a Pull Request

## Task List
- [x] Setup Version Control System
- [x] Integrate Hound CI service
- [x] Integrate Travis CI service
- [x] Integrate Code Coverage and Code Quality service
- [x] ORM (Sequelize) setup
- [x] Create specified API endpoints
- [x] Implement Feedback from API defense
- [ ] Set up Webpack to run mundane tasks for development of the Client side
- [ ] create a frontend/client side interface using React with Redux architecture

## Technologies
Ace-DMS is implemented using a number of technologies, these include:
* [material-ui] - evented I/O for the backend
* [material-css] - evented I/O for the backend
* [react-materialize] - evented I/O for the backend
* [react.js] - evented I/O for the backend
* [node.js] - evented I/O for the backend
* [babel-cli] - Babel Command line interface 
* [babel-core] - Babel Core for javascript transpiling
* [babel-loader] - Adds Babel support to Webpack
* [babel-preset-es2015] - Babel preset for ES2015
* [babel-preset-react] - Add JSX support to Babel
* [babel-preset-react-hmre] - Hot reloading preset for Babel
* [babel-register] - Register Babel to transpile our Mocha tests]
* [eslint] - Lints JavaScript
* [expect] - Assertion library for use with Mocha
* [express] - Serves development and production builds]
* [mocha] - JavaScript testing library
* [npm-run-all] - Display results of multiple commands on single command line
* [webpack] - Bundler with plugin system and integrated development server
* [webpack-dev-middleware] - Adds middleware support to webpack
* [webpack-hot-middleware] - Adds hot reloading to webpack


   [mocha]: <https://mochajs.org>
   [node.js]: <http://nodejs.org>
   [Gulp]: <http://gulpjs.com>
   [babel-cli]: <https://babeljs.io/>
   [babel-core]: <https://babeljs.io/>
   [babel-loader]: <https://babeljs.io/>
   [babel-preset-es2015]: <https://babeljs.io/>
   [babel-preset-react]: <https://babeljs.io/>
   [babel-preset-react-hmre]: <https://babeljs.io/>
   [babel-register]: <https://babeljs.io/>
   [eslint]: <http://eslint.org/>
   [expect]: <http://chaijs.com/api/bdd/>
   [express]: <http://expressjs.com/>
   [mocha]: <https://mochajs.org/>
   [npm-run-all]: <https://www.npmjs.com/package/npm-run-all>
   [webpack]: <https://webpack.github.io/>
   [webpack-dev-middleware]: <https://webpack.github.io/>
   [webpack-hot-middleware]: <https://webpack.github.io/>
