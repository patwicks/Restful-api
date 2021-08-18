const jwt = require("jsonwebtoken");
require("dotenv").config();

const AUTH_TOKEN  = async (req,res,next) => {
    const token =  req.headers('auth-token');
    if(!token) return res.sendStatus(401).json({message: 'Access denied!'})
        try {
            const verified = jwt.verify(token, process.env.TOKEN_SECRET);
            req.user = verified;
            next();
        } catch(err) {
            if (err) {
                res.status(403).json({message: 'Bad request!'});
            }
        }
}