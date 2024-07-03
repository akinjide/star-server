# Star Server

This repository contains the server side logic for the Star project.


## Requirements

- Node.js version 18.17 or higer
- PostgreSQL server
- PostgreSQL database `star`


## Setup

The instructions below will install the required project dependencies and setup the `star` database with the neccessary tables.

```bash
$ npm install
$ npm run migrate:up
```


## Configuration

- In `database.json`, change the following:
    - `user` replace value `postgres` with your database username
    - `password` with your database password
- In `default.json` change the following:
    - `connection` replace value `postgres` with your database password
    - `connection` add your database password if available after the colon `:`


## Run

The instruction below will start the project on `localhost:3000`

```bash
$ npm run dev
```


## Project Structure

- config - includes application and database configuration
- migrations - includes SQL for setting up new database
- node_modules - includes project dependencies after running `npm install`
- src - includes project source code
    - hooks - includes pre and post middlewares for services endpoint
    - services - includes endpoints and application logic based functional requirements
    - app.js - includes package and application initialization
    - index.js - includes error handlers and application startup logic
    - logger.js - includes application logging logic
    - pg.js - includes postgreSQL connection and query logic
    - query.js - includes SQL queries executable by application logic
