var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    role: {
        type: String,
        enum: ['super admin', 'admin', 'member', 'init'],
        default: 'member'
    }
},{
        timestamps:true
    }
);
module.exports = mongoose.model('Users', UserSchema);