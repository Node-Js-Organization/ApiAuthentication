const mongoose = require('mongoose'),
  bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ['local', 'google', 'facebook'],
    required: true
  },
  local: {
    email: {
      type: String,
      lowercase: true
    },
    password: {
      type: String
    }
  },
  google: {
    id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  },
  facebook: {
    id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  }
});

//run the following function before the save action
userSchema.pre('save', async function(next) {
  try {
    //if the method is not local ignore this method
    if (this.method !== 'local') {
      next();
    }
    //generate a salt
    const salt = await bcrypt.genSalt(10);

    //generate a password hash (salt + hash)
    const passwordHash = await bcrypt.hash(this.local.password, salt);

    //re-assign hashed version over original, plain text password
    this.local.password = passwordHash;

    next();
  } catch (err) {
    next(err);
  }
});

//used to validate password on sign in
userSchema.methods.isValidPassword = async function(newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.local.password);
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = mongoose.model('User', userSchema);
