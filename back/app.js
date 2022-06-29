const express        = require('express'); // api expresse gere le serveur
const mongoose       = require('mongoose'); // base de donner
const dotenv         = require("dotenv"); //permet l'utilsation des variable d'environement
const helmet         = require('helmet'); //Helmet  aide à sécuriser l applications Express en définissant divers en-têtes HTTP. 
const cors           = require("cors"); //CORS est un package node.js pour fournir un middleware Connect/Express qui peut être utilisé pour activer CORS avec diverses options.
const path           = require('path'); //Le module node:path fournit des utilitaires pour travailler avec les chemins de fichiers et de répertoires
const app            = express();

require('dotenv').config();

app.use(cors()); //utilisation de cors
app.use(helmet()); //utilisation de helmet
app.use(express.json());
// configuration des chemins des routes
const userRoutes = require("./routes/user");
const infoRoutes = require("./routes/info");
const postRoutes = require("./routes/post");
const comRoutes  = require("./routes/com");
//connection a la DB
mongoose.connect(process.env.DB_CONNECT,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
//creation des Headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy' , 'http://localhost:3000')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


//configuration des routes utilisatble depusi fetch
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use("/api/user", userRoutes);
app.use("/api/info", infoRoutes);
app.use("/api/post", postRoutes);
app.use("/api/com", comRoutes);



module.exports = app;
