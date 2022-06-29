const express = require("express");
const router = express.Router();
// appel des different fichiers
const userCtrl = require("../controllers/user");
const auth = require("../middleware/auth");
const multer = require('../middleware/multer-config');
const password = require("../middleware/password");
//gere la partie USER

//creation des route , appel des midelware d'auth et des gestion des images  et assigement des routes a des function
router.post("/signup", password, userCtrl.signup);
router.post("/login", userCtrl.login)
router.get("/getId/:userId", auth, userCtrl.getUserById)
router.put("/modifyAccount/:userId", auth, multer , userCtrl.modifyAccount)
router.put('/turnOff/:userId', auth, userCtrl.turnOffAccount)

module.exports = router;

