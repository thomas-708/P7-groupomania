const multer = require('multer');

// definie les format pris en charges
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};
//creer un UUId pour rendre les images unique
function UUID() {
  let s4 = () => {
     return Math.floor((1 + Math.random()) * 0x10000)
           .toString(16)
           .substring(1);
  }
  return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();       
}
//enregistre est definir le nom des fichier
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images/post')
  },
  filename: (req, file, callback) => {
    
    const name = file.originalname.substring(0, file.originalname.indexOf('.'));
    const extension = MIME_TYPES[file.mimetype];
      
    if(name.includes(UUID())) {
      callback(null, name +'.' + extension);

    }else{
      callback(null, name +'_' + UUID() + '.' + extension);
    }
      
     
  }
});

module.exports = multer({storage: storage}).single('image');