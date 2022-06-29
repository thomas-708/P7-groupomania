const jwt = require('jsonwebtoken');
//midelware permetant de verifier la connection d'unutilisateur
module.exports = (req, res, next) => { 
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'SECRET'); 
        const userId = decodedToken.sub;
          
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User id non valable !';
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: new Error('Invalid request !') });
    }
};

