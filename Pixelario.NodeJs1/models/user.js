var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
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
    roles: [{
        type: String      
    }]
},{
        timestamps:true
    }
);
UserSchema.pre("save", function (next) {
    if (this.roles.length == 0)
        this.roles.push("init");    
    next();
});
UserSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};
module.exports = mongoose.model('Users', UserSchema);