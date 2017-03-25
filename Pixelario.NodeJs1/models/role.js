var mongoose = require('mongoose');
var RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    }
},{
        timestamps:true
    }
);
module.exports = mongoose.model('Roles', RoleSchema);