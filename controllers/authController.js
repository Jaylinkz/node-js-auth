const User = require('../models/users');
const jwt = require('jsonwebtoken');
//handle errors

const handleErrors = (err) => {

    console.log(err.message, err.code);
    let error = { email: '', password: '', first_name: '', last_name: '' };

    if (err.message === 'this email does not exist') {
        error.email = 'this email does not exist';
    }
    if (err.message === 'password is incorrect') {
        error.password = 'password is incorrect';
    }



    if (err.code === 11000) {
        error.email = 'that email is already registered';
        return error;
    }

    //validation errors
    if (err.message.includes('user validation failed')) {
        let errors = Object.values(err.errors);
        for (const erro of errors) {

            error[erro.properties.path] = erro.properties.message;


        }
    }

    return error;

}
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {

    return jwt.sign({ id }, 'jurbe bawa secrets', {
        expiresIn: maxAge,
    })

}
module.exports.signup_get = (req, res) => {
    res.render('signup');
}
module.exports.login_get = (req, res) => {
    res.render('login');
}
module.exports.signup_post = async(req, res) => {
    const { first_name, last_name, email, password } = req.body;

    try {
        const user = await User.create({ first_name, last_name, email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000
        });
        res.status(201).json({
            user: user._id
        });

    } catch (err) {
        const errors = handleErrors(err);

        res.status(400).json({ errors });
    }
}
module.exports.login_post = async(req, res) => {

    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000
        });
        res.status(200).json({ user: user._id })
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}
module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');

}