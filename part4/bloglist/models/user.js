const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 32,
  },
  name: { type: String },
  passwordHash: { type: String, required: true }, // todo: add blogs
});

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // Never reveal the passwordhash!
    delete returnedObject.passwordHash;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
