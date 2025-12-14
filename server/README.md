This directory consist of the backend and middleware code.

To run the database ,
first run node seed.js------> this will put initial data into MongoDB
then run node server.js------>this will connect the code to MongoDB

MongoDB runs on localhost:27017 and basic configuration was done on MongoDB Compass using MongoDB official documentation.

The main files are seed.js, server.js .
Node_modules are installed through npm install

The earlier version was vulnerable to NoSQL injection , which have been mitigated by using parametrized queries as in the code.
