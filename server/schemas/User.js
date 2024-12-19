const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userAvatar: {
        type: String,
        default: '',
        required: false,
    },

    userName: {
        type: String,
        required: true
    },

    userPhone: {
        type: String,
        required: true
    },

    userDateOfBirth: {
        type: String,
    },

    userEmail: {
        type: String,
    },

    userAddress: {
        type: String,
    },

    userPassword: {
        type: String,
        required: true
    },

    userRole: {
        type: String,
        required: true
    },

    userCreatedDateTime: {
        type: Date,
        default: new Date()
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;