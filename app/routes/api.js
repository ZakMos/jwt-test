const express   = require ('express');
const User      = require ('../models/user');
const config    = require ('../../config');
const jwt       = require ('jsonwebtoken');

const apiRoutes = express.Router();

apiRoutes.post('/authenticate', (req, res) => {
    User.findOne({
      email: req.body.email
    }, function(err, user){
    if (err) throw err;
    if(!user){


      return res.status(401).json({message: 'Authentication failed.'});
    } else if (user) {
      //check if password mathces
      bcrypt.compare(req.body.password, user.password,(err, isMatch) =>  {
        if(!isMatch){
      return res.status(401).json({message: 'Authentication failed.'});
      } else {
        const payload = {
          role: user.role, user: user.name, email: user.email, password: user.password
        };
        const token = jwt.sign(payload, config.secret, {
          expiresIn: 60 * 60 * 24 // 24 hours
        });
        // return the information including token as JSON
        res.json({
          success: true,
          message: "Enjoy your token",
          token: token
        });
      }
      });
    }
  });
});

module.exports = apiRoutes;
