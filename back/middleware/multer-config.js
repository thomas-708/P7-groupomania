const multer = require('multer');

//format pris en charge
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};
//enregistre dans le fichier cibler est assigne UUId de l'utilisateur au filename
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images/profils');
  },
  filename: (req, file, callback) => {
    
    const name = file.originalname.substring(0, file.originalname.indexOf('.'));
    const extension = MIME_TYPES[file.mimetype];
    
    if(name.includes(req.params.userId)) {
      callback(null, name +'.' + extension);

    }else{

      callback(null, name +'_' +req.params.userId+ '.' + extension);
    }
  }
});

module.exports = multer({storage: storage}).single('image');