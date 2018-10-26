// get an instanccce of mongoose and mongoose.Schema

const mongoose = require ('mongoose');
const Schema = mongoose.Schema;


// set up a monoose model and pass it using module.exports

module.exports = mongoose.model('User', new Schema({
  name:  {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: Schema.ObjectId, ref: "Role"
  }
}));
