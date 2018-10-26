// ============================
// get the packages we need ===
// ============================
const express     = require('express');
const app         = express();
const morgan      = require('morgan');
const mongoose    = require('mongoose');
const config      = require('./config'); // get our config file
const User        = require('./app/models/user'); //get our mongoose models
const Role        = require('./app/models/role'); // get our role models

const apiRoutes = require('./app/routes/api');

// const bcrypt      = require('bcrypt');
// const jwt         = require('jsonwebtoken'); // used to create, sign, and verfy tokens
// const Schema      = mongoose.Schema;

//=======================
// configuration ========
// ======================
const port = process.env.PORT || 8080; // used to create, sign, and verfy tokens

mongoose.connect(config.db, {
  useNewUrlParser: true,
  useCreateIndex: true
 }); // connect to database

 // use express so we can get info from POST and/or URL parameters
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

 // use morgan to log requests to the console
app.use(morgan('dev'));

// app.set('superSecret', config.secret); //secret variable






//=======================
// routers ==============
// ======================
// basic route


app.get('/api', function(req, res){
  res.send(`<p>welcome to my page, please log in or register from here</p>
    <form method="get" action='./register'>
<button type="submit">Continue</button>
</form>
`);

// app.get('/', function(req, res){
//   res.send('Hello! The API is at http://localhost:' + port + '/api');



});



/// users roles
app.post('/roles', (req, res) => {
    let newRole = new Role({
      name: req.body.name
    });
    newRole.save((err) => {
      if (err) throw err;
      console.log('Role granted sucessfully');
      res.json({ success: true});
    });
});


// users register

app.post('/register', (req, res) => {
  let hashPass = req.body.password;
  let saltRounds = 10;
  bcrypt
  .genSalt(saltRounds)
  .then(salt => {
     console.log(`Salt: ${salt}`);
    return bcrypt.hash(hashPass, salt);
    console.log(hashPass);
  })
  .then(hash => {
    console.log(`Hash: ${hash}`)
    let newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hash,
      role: req.body.role
    });
    // save the sample User
    newUser.save(function(err){
      if (err) throw err;
      console.log('User saved sucessfully');
      res.json({ success: true });
    });
  })
  .catch(err => console.error(err.message));
  // create a sample User

});
// API ROUTES ------------------
// get an instance of the router for api ROUTES
// const apiRoutes = express.Router();
//
// // route to authenticate a user (POST http://localhost:8080/api/authenticate)
//
// apiRoutes.post('/authenticate', function(req, res){
//
//   // find the user
//   User.findOne({
//     email: req.body.email
//   }, function(err, user){
//     if (err) throw err;
//     if(!user){
//
//       res.json({ success: false, message: 'Authentication failed. User not found.'});
//     } else if (user) {
//       //check if password mathces
//       bcrypt.compare(req.body.password, user.password,(err, isMatch) =>  {
//         if(!isMatch){
//           res.json({success: false, message: 'Authentication failed. Wrong password.'});
//       } else {
//         // if user is found and password is right
//         // create a token with only our given payload
//         // we don't want to pass in the entire user since that has the password
//         const payload = {
//           role: user.role, user: user.name, email: user.email, password: user.password
//         };
//         const token = jwt.sign(payload, app.get('superSecret'), {
//           expiresIn: 1440 // expires in 24 hous
//         });
//
//         // return the information including token as JSON
//         res.json({
//           success: true,
//           message: "Enjoy your token",
//           token: token
//         });
//       }
//       });
//     }
//   });
// });
//
// // route middleware to verify a token
// apiRoutes.use(function(req, res, next){
//   // check header or URL parameters or post parameters for token
//   let token = req.body.token || req.query.token || req.headers['x-access-token']
//
//   // decode token
//   if (token) {
//
//     // verifies secret and checks exp
//     jwt.verify(token, app.get('superSecret'), function (err, decoded) {
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
//   res.json({ message: 'Welcome to the coolest API on earth!' });
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

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

//=======================
// start the server =====
// ======================
// process.setMaxListeners(0);
app.listen(port);
console.log('Magic happens at http:/localhost:' + port);
