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

// // route middleware to verify a token
// apiRoutes.use(function(req, res, next){
//   // check header or URL parameters or post parameters for token
//   let token = req.body.token || req.query.token || req.headers['x-access-token']
//
//   // decode token
//   if (token) {
//
//     // verifies secret and checks exp
//     jwt.verify(token, app.get('secret'), function (err, decoded) {
//       if(err) {
//         return res.json({ success: false, message: 'Failed to authenticate token.' });
//       } else {
//         // if everything is good, save to request for use in other routes
//         req.decoded = decoded;
//         next();
//       }
//     });
//   } else {
//
//     // if there is no token
//     // return an error
//     return res.status(403).send({
//       success: false,
//       message: 'No token provided'
//     });
//   }
// })
//
// // route to show a random message (GET http://localhost:8080/api/)
// apiRoutes.get('/', function(req, res) {
//   return res.status(401).json({ message: 'Welcome to the coolest API on earth!' });
// });
//
// // route to return all users (GET http://localhost:8080/api/users)
// apiRoutes.get('/users', function(req, res){
// //defined only one user and check if it's available on server
//     User.findOne({
//       name: req.decoded.user
//   }, function(err, users){
//     res.json(users);
//   });
// });
//
// // route middleware to  verify a token
// apiRoutes.use(decodeToken, validateUser);
//
// // route to show a random message   (GET http//localhost:8080/api/)
//
// apiRoutes.get('/', (req, res) => {
//   res.json({message: 'Welcome to the coolest API on earth'  });
// });
//   // route to return all users (GET http//localhost:8080/api/users)
//   apiRoutes.route('/users')
//     .get(async (req, res) => {
//       if(!req.user){
//         return res.status(403).json ({message: 'You do not have sufficient permissions to read this resource'});
//       }
//       const data = await User.find();
//       res.json(data);
//     })
//     .post(async (req, res, next) => {
//       const newUser = new User(req.body);
//
//       try {
//         await newUser.save();
//         req.user = newUser;
//         next();
//       } catch(err) {
//         console.error(err);
//       }
//     }, sendToken);

module.exports = apiRoutes;
