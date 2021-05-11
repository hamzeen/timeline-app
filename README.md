# timeline-app


## Pre-Requisites ##
*   [**mongodb**] (https://docs.mongodb.com/guides/server/install/)


## start MongoDB service
```
cd mongodb/bin/mongo
sudo mkdir -p /Users/hanz/data/db
./mongod --dbpath=/Users/hanz/data/db
./mongod
./mongo
use opruimen
show collections
db.users.find().pretty()

```
* https://medium.com/mongoaudit/how-to-enable-authentication-on-mongodb-b9e8a924efac

## Running backend
* install dependencies:
    ```npm install```
* start backend server:
    ```npm run dev```
* JWT: head, body signature

## Running Front-End
* ```npm install```
* ```npm start```
* browse: <localhost:4200>


### intialize from existing code
* ```git init```
* ```git add .```
* ```git commit -m "first commit"```
* ```git remote add origin git@github.com:hamzeen/new_repo```

~LC 

06/05/2021
