const mongoose = require('mongoose');
const User = require('../models/users');
const jwt = require('jsonwebtoken');

const connUri = `${process.env.MONGO_DEV_CONN_URL}/${process.env.MONGO_DB_NAME}`;
// JWT SECRET SIGN-KEY
const secret = process.env.JWT_SECRET;
const options = { expiresIn: '2d', issuer: 'https://hamzeen.github.io' };

module.exports = {
    updateEvents: (req, res) => {
      mongoose.connect(connUri, { useNewUrlParser : true, useUnifiedTopology: true }, (err) => {
        let result = {};
        let status = 200;

        if (!err) {
          const updateQuery = req.body;
          console.log(updateQuery);
          User.findOneAndUpdate({_id: req.body._id}, { timeline: updateQuery.timeline }, {new: true}, (err, user) => {
            if (err) {
              status = 500;
              result.status = status;
              result.error = err;
            } else {
              result.status = 200;
              result.result = user;
              console.log('LC::: after update: ', user);
            }
            res.status(status).send(result);
            mongoose.connection.close(); // close the connection after saving
          });
        } else {
          status = 500;
          result.status = status;
          result.error = err;
          res.status(status).send(result);
          mongoose.connection.close();
        }
      });
    },

    getAllEvents: (req, res) => {
        mongoose.connect(connUri, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
            let result = {};
            let status = 200;
            if (!err) {
              const extractedToken = req.headers.authorization.split(' ')[1];
              const verifiedToken = jwt.verify(extractedToken, secret, options);
              User.find({name: verifiedToken.user}, (err, events) => {
                if (!err) {
                            result.status = status;
                            result.error = err;
                            result.result = events;
                } else {
                            status = 500;
                            result.status = status;
                            result.error = err;
                }
                res.status(status).send(result);
                mongoose.connection.close()
              });
            } else {
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
                mongoose.connection.close();
            }
        });
    }
};
