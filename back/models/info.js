const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");


const infoModels = mongoose.Schema({
    owner :{type: String, require: true},
    info: {type: String, require: true},
    createdAt: {type: Date, require: false, default: Date.now},
});

infoModels.plugin(uniqueValidator);
const Model = mongoose.model("Info", infoModels);

module.exports = Model;