const mongoose = require('mongoose');
const {ObjectID} = require('mongodb');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: validator.isEmail
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [
        {
            access: String,
            token: String
        }
    ]
});

userSchema.pre('save', function(next) {
    let user = this;
    if(user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

userSchema.methods.toJSON = function() {
    let user = this;
    user = _.pick(user.toObject(), ['_id', 'email']);
    return user;
};

userSchema.methods.generateAuthToken = function() {
    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id: user._id, access}, 'somesalt');

    user.tokens.push({access, token});

    return user.save();
};

userSchema.methods.removeToken = function(token) {
    let user = this;
    return user.update({
            $pull: {
                tokens: {
                    'token': token
                }
            }
        });
};

userSchema.statics.findByToken = function (token) {
    let user = this;
    return user.findOne({
        'tokens.access': 'auth',
        'tokens.token': token
    });
};

let User = mongoose.model('User', userSchema);

module.exports = {User};