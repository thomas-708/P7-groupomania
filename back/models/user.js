const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");


const userModels = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: {type: String, require: true},
    lastname: {type: String, require: true},
    avatarsrc: {type: String, require: false , default:"http://localhost:3000/images/profils/photo.jpg"},
    bio: {type: String, require: true, default:"OUPS!.....Ces informations n'ont pas etait fournis pas l'utilisateur"},
    isactive: {type: Boolean, require: true, default: true},
    isadmin: {type: Boolean, require: true, default: false},
    lastupdate: {type: Date, require: false, default: Date.now},
});

userModels.plugin(uniqueValidator);
const Model = mongoose.model("User", userModels);


module.exports = Model;


