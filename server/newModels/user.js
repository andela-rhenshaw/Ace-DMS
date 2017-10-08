import bcrypt from 'bcrypt-nodejs';
import mongoose from '../db';

const { Schema } = mongoose;

const UserSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: Array
  }
});

/**
 * Pre-save hook
 */
UserSchema.pre('save', function (next) {
  const user = this;

    // only hash the password if has been saved or modified or is new
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    // hash the password using our new salt
    // user.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) {
        return next(err);
      }
        // override the cleartext password with the hashed one
      user.password = hash;
      user.roles.push('default');
      next();
    });
  });
});

UserSchema.methods.comparePassword = (candidatePassword, cb) => {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

const User = mongoose.model('User', UserSchema);

export default User;
