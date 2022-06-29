const Info = require("../models/info");
const User = require("../models/user");
const mongoose       = require('mongoose');
const fs = require("fs");
require("dotenv").config();

  
module.exports.set = async (req, res) => {
    const info = new Info({
      owner : req.body.owner,
      info : req.body.info
    })
       info.save()
       .then(() => res.status(200).json({InfoId: info._id ,message:'la note a etait enregistrer!'}))
       .catch(error => res.status(400).json({ error }))

};


module.exports.getInfoById = (req, res, next) => {
    Info.find()
    .then((info) => {
        res.status(200).json(info)
      }
    )
};

//   User.findOne({_id: req.params.userId})
//   .then((user) => {
// 
//       if(!user.isadmin){
//         return res.status(401).json({error: 'les permission admin sont requise!'})
//       }
//       const info = new Info({
//           owner: req.body.owner,
//           infos: req.body.info,
//         });
//       
// 
//       })
//       .then((info) => {
// 
//    
//         const info = new Info({
//             owner: req.body.owner,
//             infos: req.body.info,
//           });
//         info.save({
// 
//         }).then(() => res.status(200).json({ InfoId: info._id,message:'la note a etait enregistrer!'}))
//         .catch(error => res.status(400).json({ error }));
//       })
//       .catch(error => res.status(400).json({ error }));
//     }).catch(
//     () => {
//       res.status(500).json({error: 'erreur dans la requetes de modification'});
//     }
//   )