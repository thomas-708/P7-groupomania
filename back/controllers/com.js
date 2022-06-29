const User = require("../models/user");
const Com = require("../models/com");
const Post = require("../models/post");
const mongoose       = require('mongoose');
require("dotenv").config();

module.exports.createCom = async (req, res) => {

     const com = new Com({
        postid : req.body.postid,
        owner :req.body.owner,
        text : req.body.text,
        CreatedAt: req.body.CreatedAt,
     })

        com.save()
        .then(() => res.status(200).json({ message: 'Votre commentaire est publier!'}))
        .catch(error => res.status(400).json({ error }))
};
 
module.exports.getAllCom = (req, res, next) => {
    Com.find({postid : req.params.id})
    .then((com) => {
        res.status(200).json(com)
      }
    )
};

module.exports.getOneCom = (req, res, next) => {
    Com.findOne({_id: req.body.id})
    .then((com) => {
        if(com){
          res.status(200).json(com)
        }else{
          res.status(401).json({error:" Votre post n'existe pas "})
        }
      }
    )
};

module.exports.deleteCom = async (req, res) => {

    Com.findOne({_id: req.params.id})
    .then((com) => {
   
      com.deleteOne({_id: req.params.id})
        res.status(200).json({message:'Votre Commentaire est bien supprimer!'})
    })
    .catch((err) =>{
        res.status(400).json({error :'Votre Commentaire n\'a pas pu être supprimer!'})
    })
};
 