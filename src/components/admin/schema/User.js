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

    userListOrder: [
        {
            orderID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Order',
                default: null
            },
            acceptanceDateTime: {
                type: Date,
                default: new Date()
            },
        }
    ],

    userCreatedDateTime: {
        type: Date,
        default: new Date()
    },
    userAccountStatus: {
        type: String,
        default: 'ACTIVE'
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;