const mongoose = require('mongoose'),
  bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  }
});

//run the following function before the save action
userSchema.pre('save', async function(next) {
  try {
    //generate a salt
    const salt = await bcrypt.genSalt(10);

    //generate a password hash (salt + hash)
    const passwordHash = await bcrypt.hash(this.password, salt);

    //re-assign hashed version over original, plain text password
    this.password = passwordHash;

    next();
  } catch (err) {
    next(err);
  }
});

//used to validate password on sign in
userSchema.methods.isValidPassword = async function(newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.password);
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = mongoose.model('User', userSchema);
