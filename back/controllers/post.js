const User = require("../models/user");
const Post = require("../models/post");
const Com  = require("../models/com");
const mongoose       = require('mongoose');
const fs = require("fs");
require("dotenv").config();



module.exports.createpost = async (req, res) => {
   const postObject = JSON.parse(req.body.post)
   let post;
   if(req.file){
     post = new Post({
        ...postObject,
        picture: `${req.protocol}://${req.get('host')}/images/post/${req.file.filename}`,
    })
  }else {
    post = new Post({
      ...postObject,     
      picture: `${req.protocol}://${req.get('host')}/images/post/default.jpg`,
    })
  }
       post.save()
       .then(() => res.status(200).json({ message:'Votre post est publier!'}))
       .catch(error => res.status(400).json({ error }))
};

module.exports.getAllPost = (req, res, next) => {
    Post.find()
    .then((info) => {
        res.status(200).json(info)
      }
    )
};

module.exports.getOne = (req, res, next) => {
    Post.findOne({_id: req.body.id})
    .then((post) => {
        if(post){
          res.status(200).json(post)
        }else{
          res.status(401).json({error:" Votre post n'existe pas "})
        }
      }
    )
};

module.exports.delete = (req, res, next) => {
  Post.findOne({_id: req.params.id})
    .then((info) => {
      const filename = info.picture.split("/images/post/")[1];
      if(filename === 'default.jpg'){
          info.deleteOne({_id: req.params.id})
          res.status(200).json({message:'Votre post est bien supprimer!'})
        }else{

          fs.unlink(`images/post/${filename}`, () => {
            info.deleteOne({_id: req.params.id})
            res.status(200).json({message:'Votre post est bien supprimer!'})
          })
        }
      })

};

module.exports.modify = (req, res, next) => {

  Post.findOne({_id: req.params.id})
  .then((info) => {
  const filename = info.picture.split("/images/post/")[1];
  let postObjet
  if(req.file){
    fs.unlink(`images/post/${filename}`, () => { })
    postObjet = {
      ...JSON.parse(req.body.post),
      picture: `${req.protocol}://${req.get('host')}/images/post/${req.file.filename}`,
    }
  }else{
    postObjet = { ...JSON.parse(req.body.post),}
  }
    Post.updateOne({_id: req.params.id},{...postObjet})
    .then((result) => {
      res.status(200).json({message:'votre post a bien etait modifier'})
      
    }).catch((err) => {
      res.status(400).json({ err ,  message:' modification impossible' })
    });
  })
};

module.exports.like = (req, res, next) => {
    let likes = req.body.like;

    Post.findOne({_id: req.params.id})
    .then((like) => {
      if(like.likes <0) res.status(500).json();
        if(!like.usersLiked.includes(req.body.usersLiked)){
          Post.updateOne({_id: req.params.id},{
            likes: like.likes +1,
            $push: {usersLiked : req.body.usersLiked},
          })
          .then(() => res.status(200).json({ message: 'like ajoutée !'}))
          .catch(error => res.status(400).json({ error }));
        }else{
          Post.updateOne({_id: req.params.id},{
            likes: like.likes -1,
            $pull: {usersLiked : req.body.usersLiked},
          })            
          .then(() => res.status(200).json({ message: 'like retirer !'}))
          .catch(error => res.status(400).json({ error }));
        }
      } 
    ).catch(error => res.status(500).json({ error }))
};
