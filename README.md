- [![Build Status](https://www.travis-ci.com/bbaime98/freeMentors-project.svg?branch=develop)](https://www.travis-ci.com/bbaime98/freeMentors-project)
- [![Maintainability](https://api.codeclimate.com/v1/badges/c0fa93741dbe645888b2/maintainability)](https://codeclimate.com/github/bbaime98/freeMentors-project/maintainability)
-[![Coverage Status](https://coveralls.io/repos/github/bbaime98/freeMentors-project/badge.svg?branch=develop)](https://coveralls.io/github/bbaime98/freeMentors-project?branch=develop)

Free Mentors is a social initiative where accomplished professionals become role models to young people to provide free mentorship sessions.

##UI template for this project on github and you can  have a look follow this [link]https://bbaime98.github.io/freeMentors-project/

### All API Endpoints that you will find:

- POST /auth/signup Signs Up a user
- POST /auth/signin Logs In a user
- PATCH /user/:userId Turns a user to a mentor
- GET /mentors Gets all mentors
- GET /mentors/:mentorId Gets a specific mentor
- POST /sessions Creates a mentorship session
- PATCH /sessions/:sessionId/accept Accepts a mentorship session
- PATCH /sessions/:sessionId/reject Accepts a mentorship session
### Technology Tools used
- Server-side Framework: Node/Express JS
- Testing Framework: Mocha with Chai
### Additional Tools
- JavaScript Es6 with Babel transpiler
- TravisCI for Continous Integration
- nyc for test coverage
-CodeClimate and Coveralls for badges
- Heroku for Deployment
- For a better test you will need to use POSTMAN

### Setup Instruction
- Install git
- Install Node js
- For getting the files into your local machine open git bash and do git clone with repository url
## https://github.com/bbaime98/freeMentors-project.git
- $ git clone 
### Navigate to the folder containing all code files by typing cd folder_name

- $ cd Free-Mentors
Install dependincies as they appear in package.json file by

- $ npm install
To start the server do

- $ npm run dev-start
To run the test do

- $ npm run test
