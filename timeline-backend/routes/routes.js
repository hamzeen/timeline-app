// routes.js -login.timeline routes module

const controller = require('../controllers/users');
const timelineControls = require('../controllers/timeline');
const validateToken = require('../utils').validateToken;

const express = require('express');
const router = express.Router();

// User routes
router.route('/users')
    .post(controller.add)
    .get(validateToken, controller.getAll);

// Timeline routes
router.route('/timeline')
    .post(validateToken, timelineControls.updateEvents)
    .get(validateToken,  timelineControls.getAllEvents);

// Login route
router.route('/login')
    .post(controller.login);

// Home page route
router.get('/', function(req, res) {
    res.send('api ver 1.0.0');
});

// About page route
router.get('/about', function(req, res) {
    console.log('log:: about');
    res.send('About');
});

module.exports = router;
