const { application } = require('express');
const { requireAuth, checkUser } = require('../middleware/authMiddleware');
const express = require('express');
const { body, validationResult } = require("express-validator");
const authController = require('../controllers/authController')
    //const authController = require('../controllers/authController');
const router = express.Router();

router.get('*', checkUser);
router.get('/', (req, res) => {
    res.render('home');
});
router.get('/smoothies', requireAuth, (req, res) => {
    res.render('smoothies');
});
router.get('/signup', authController.signup_get);
router.get('/login', authController.login_get);
router.post('/register', authController.signup_post);
router.post('/access', authController.login_post);
router.get('/logout', authController.logout_get);

// router.post('/save-user', (req, res) => {
//     if (!((req.body.email && req.body.first_name && req.body.last_name && req.body.password && req.body.c_password))) {
//         res.status(400).send("all fields are required");
//     }

// });

module.exports = router;