const jwt = require('jsonwebtoken');


const ensureUserAuthenticated = (req, res, next) => {
    const auth = req.headers['authorization'];
    // console.log(req.headers);
    // console.log(auth);
    // console.log(req.user);
    if(!auth){
        res.status(400).json({error:'jwt token is required'});
    }
    try{
        const decoded = jwt.verify(auth, process.env.JWT_SECRET);
        
        if(decoded){
            // console.log(decoded);
            req.user = decoded;
            // console.log(req.user);
            next();
        }
    }
    catch(error){
        res.status(401).json({error:'json web token is invalid or expired'});
    }
}

module.exports = ensureUserAuthenticated;