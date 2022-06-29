const User = require("../models/user");
const bcrypt = require("bcrypt"); // permet le chiffrement des donner
const jwt = require("jsonwebtoken"); // permet la creation d'un token pour la connection
const fs = require("fs"); //file system permet de gerer les fichier
require("dotenv").config();
const EMAIL_EGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


  //enregistrement de l'utilisateur
module.exports.signup = async (req, res) => {

  let email = req.body.email;
  let psw = req.body.password;
  let fName = req.body.firstname;
  let lName = req.body.lastname;

  //on verifie si les req ne sont pas null
      if(email == null || psw == null || fName == null || lName == null) return res.status(400).json({ error: "veuillez s'il vous plaîs remplire l'ensemble des champs." });

        //on verifie que les champs sont remplis
      if(fName == 0 || lName == 0) return res.status(401).json({ error : "Vous devez remplire ces champs"})
    //on hach le MDP
      bcrypt.hash(psw, 10)
        .then(hash => {
          const user = new User({ //on creer l'utilisateur
            email: email,
            password: hash,
            firstname: fName,
            lastname: lName
          });
          user.save() //on sauvgarde
            .then(() =>{
              res.status(201).json({ message: 'Utilisateur créé !' }) // on retourne un code 201 pour la creation

            })
            .catch((error) => {
              
              res.status(400).json(error.errors)
            });
        })
        .catch(error => { 
          console.log(error)
          return res.status(500).json({ error }) });

  
};
// permet a l'utilsateur de se connecter
module.exports.login = (req, res, next) => {
  let email = req.body.emailCox;
  let psw = req.body.passwordCox;
  //chercher l'utilisateur
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(psw, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          if(!user.isactive){
            return res.status(403).json({ activeacount: user.isactive, 
                error: 'Compte desactivée!'}) // verifie si le compte est actif
          }
          const token = res.status(200).json({ //creé un token de connection si l'utilisateur est trouver est s'il est valide
            userId: user._id,
             token: jwt.sign(
              { userId: user._id },
              'SECRET', 
              { expiresIn: '24h' }
            ),
            activeacount: user.isactive,
            isAdmin: user.isadmin
          });
      
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

//returne l'utilisateur cibler
exports.getUserById = (req, res, next) => {
  
  User.findOne({_id: req.params.userId})
  .then((user) => {
   
      if (!user) {
        return res.status(404).json({error: 'Utilisateur non trouvé !'});
      }
      if(user.isadmin){ // si l'utilisateur est admin 
          res.status(200).json({
            isAdmin: user.isadmin,
            userId: user._id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            bio: user.bio,
            avatarsrc: user.avatarsrc,
            activeacount: user.isactive,
          })
      }else{//s'il ne l'ai pas 
        res.status(200).json({
          userId: user._id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          bio: user.bio,
          avatarsrc: user.avatarsrc,
          activeacount: user.isactive,
        });
      } 
    }
  ).catch(
    () => {
      res.status(500).json({error: 'erreur'});
    }
    
  )
};

//permet la desactivation/bannisement d'un compte
exports.turnOffAccount = (req, res, next) =>{
  User.findOne({_id: req.params.userId}) 
  .then((user) => {
      console.log(user);
      if (!user) {
        return res.status(404).json({error: 'Utilisateur non trouvé !'});
      }
      if(user.isadmin){
        return res.status(403).json({error: 'Un compte administrateur ne peut être desactivée'})
      }
      user.isactive = false;
      user.save()
      .then(() => res.status(200).json({activeacount: user.isactive, message:'Votre compte est maintenant desactiver'}))
    }
  ).catch(
    () => {
      res.status(500).json({error: 'erreur dans la requetes de modification'});
    }
  )

} 

//permet la modification
exports.modifyAccount = (req, res, next) =>{
  User.findOne({_id: req.params.userId})
  .then((user) => {
    const filename = user.avatarsrc.split("/images/profils/")[1]; // trouve le filename
    let UserObjet
    if (!user) {
      return res.status(404).json({error: 'Utilisateur non trouvé !'});
    }
    if(req.file && filename != 'photo.jpg'){ //verifie si le filename n'ai pas l'image par defaut
      fs.unlink(`images/profils/${filename}`, () => { })//supprime l'image et l'utilisateur
      UserObjet = {
        ...JSON.parse(req.body.user),
        avatarsrc: `${req.protocol}://${req.get('host')}/images/profils/${req.file.filename}`,
      }
    }else{ // sinon supprique que l'utlisateur
      UserObjet = { ...JSON.parse(req.body.user)}
  }
  User.updateOne({_id: req.params.userId} , {...UserObjet})
  .then(() => res.status(200).json({ message: 'Votre profiles a bien etait modifier'}))
  .catch(error => res.status(400).json({ error }));
  })
} 
