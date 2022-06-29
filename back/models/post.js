const mongoose = require('mongoose');


const uniqueValidator = require("mongoose-unique-validator");
const postModel = mongoose.Schema({
    owner :{type: String, require: true},
    text : {type: String, require: true},
    likes: { type: Number, req: true, default: 0 },
    com: { type: Number, req: true, default: 0 },
    usersLiked: { type: [String], req: true, default: [] },
    picture: {type: String, require: true , default:"images/post/default.jpg"},
    CreatedAt: {type: String, require: false},
    lastupdate: {type: String, require: false},
});

postModel.plugin(uniqueValidator);
const Model = mongoose.model("Post", postModel);

module.exports = Model;