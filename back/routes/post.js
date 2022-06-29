const express = require("express");
const router = express.Router();

const postCtrl = require("../controllers/post");
const auth = require("../middleware/auth");
const multer = require('../middleware/multer-config-post');

//gere la partir poste
//creation des route , appel des midelware d'auth et des gestion des images  et assigement des routes a des function
router.post("/createPost/", auth , multer, postCtrl.createpost);
router.get("/getAllPost/", auth, postCtrl.getAllPost);
router.get("/getOnePost/:id", auth, postCtrl.getOne);
router.delete("/delPost/:id", auth,multer, postCtrl.delete);
router.put("/modifyPost/:id", auth, multer, postCtrl.modify);
router.post("/:id/like", auth, postCtrl.like);

module.exports = router;