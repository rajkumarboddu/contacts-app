const {User} = require('./../models/user');
const jwt = require('jsonwebtoken');

let authenticate = (req, res, next) => {
    let token = req.header('x-auth');

    User.findByToken(token)
        .then((user) => {
            if(!user) {
                res.status(401).send();
            }

            let decoded;
            try{
                decoded = jwt.verify(user.tokens[0].token, 'somesalt');
            } catch (e) {
                res.status(400).send(e);
            }

            if(user._id.toHexString() === decoded._id){
                next();
            } else{
                res.status(401).send();
            }
        })
        .catch((e) => res.status(401).send());
};

module.exports = {authenticate};