const mongoose = require('mongoose');
const { isEmail } = require('validator')
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    first_name: {
        type: String,
        required: [true, 'please enter your first name']
    },
    last_name: {
        type: String,
        required: [true, 'please enter your last name']
    },
    email: {
        type: String,
        required: [true, 'please enter an email address'],
        unique: [true, 'email already exists'],
        lowercase: true,
        validate: [isEmail, 'please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'please enter a password'],
        minlength: [6, 'Minimum password length is six characters']
    },
}, { timestamps: true });

userSchema.post('save', (doc, next) => {
    console.log('new user created and saved', doc);
    next();
});
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
//static method to log users in
userSchema.statics.login = async function(email, password) {

    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('password is incorrect');
    }
    throw Error('this email does not exist');
};

const User = mongoose.model('user', userSchema);
module.exports = User;