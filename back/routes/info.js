const express = require("express");
const router = express.Router();

const infoCtrl = require("../controllers/info");
const auth = require("../middleware/auth");
// const multer = require('../middleware/multer-config');
//gere la partie Note

//creation des route , appel des midelware d'auth et des gestion des images  et assigement des routes a des function
router.post("/set/", auth, infoCtrl.set);
router.get("/getInfo/", auth, infoCtrl.getInfoById);

module.exports = router;