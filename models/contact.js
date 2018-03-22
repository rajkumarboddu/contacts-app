let mongoose = require('mongoose');

let Contact = mongoose.model('Contact', {
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    mobile: {
        type: String,
        required: true,
        trim: true,
        length: 10
    },
    group: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    isFav: {
        type: Boolean,
        default: false
    }
});

module.exports = {Contact};