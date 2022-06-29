const mongoose = require('mongoose');

const comModel = mongoose.Schema({
    postid :{type: String, require: true},
    owner :{type: String, require: true},
    text : {type: String, require: true},
    CreatedAt: {type: String, require: false},
    lastupdate: {type: String, require: false},
});


const Model = mongoose.model("Com", comModel);

module.exports = Model;