const express = require("express");
const router = express.Router();

const comCtrl = require("../controllers/com");
const auth = require("../middleware/auth");

//gere les commentaire

//creation des route , appel des midelware d'auth et des gestion des images  et assigement des routes a des function
router.post("/create", auth, comCtrl.createCom);
router.get("/getAllComPost/:id", auth, comCtrl.getAllCom);
router.get("/getOneCom/:id", auth, comCtrl.getOneCom);
router.delete("/deleteCom/:id", auth, comCtrl.deleteCom);


module.exports = router;