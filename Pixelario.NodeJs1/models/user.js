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
module.exports = mongoose.model('Users', UserSchema);