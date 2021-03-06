'use strict';

import mongoose,{Schema} from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Profile from './profiles.js';

const userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  full_name: {type: String},
  profiles:{type:Schema.Types.ObjectId, ref: 'profiles'},
});

// Before we save, hash the plain text password
userSchema.pre('save', function(next) {
  bcrypt.hash(this.password,10)
    .then(hashedPassword => {
      // Update the password for this instance to the hashed version
      this.password = hashedPassword;
      // Continue on (actually do the save)
      next();
    })
    // In the event of an error, do not save, but throw it instead
    .catch( error => {throw error;} );
});

//userSchema.statics.createFromOAuth = function(incoming) {
  
// {
//   kind: 'plus#personOpenIdConnect',
//   sub: '100592365129823370453',
//   name: 'John Cokos',
//   given_name: 'John',
//   family_name: 'Cokos',
//   picture: 'https://lh4.googleusercontent.com/-qN0rHFTCPXY/AAAAAAAAAAI/AAAAAAAAAAw/lGUgjyX0vIc/photo.jpg?sz=50',
//   email: 'john@codefellows.com',
//   email_verified: 'true',
//   locale: 'en',
//   hd: 'codefellows.com'
// }
   

//   if ( ! incoming || ! incoming.username ) {
//     return Promise.reject('VALIDATION ERROR: missing username or password ');
//   }

//   return this.findOne({username:incoming.username})
//     .then(user => {
//       if ( ! user ) { throw new Error ('User Not Found yet'); }
//       console.log('Welcome Back', user.username);
//       return user;
//     })
//     .catch( error => {
//     // Create the user
//       let username = incoming.username;
//       let password = 'none';
//       return this.create({
//         username: username,
//         password: password,
//         full_name:incoming.full_name,
//       }).then(user=>Profile.create({
//         userID: user._id,
//         username: username,
//         fullName : incoming.full_name,
//       }));
//     });

// };

// If we got a user/password, compare them to the hashed password
// return the user instance or an error
userSchema.statics.authenticate = function(auth) {
  let query = {username:auth.username};
  return this.findOne(query)
    .then(user => user && user.comparePassword(auth.password))
    .catch(error => error);
};

userSchema.statics.authorize = function(token) {
  console.log('auth',token);
  let parsedToken = jwt.verify(token, process.env.SECRET || 'changeit');
  let query = {_id:parsedToken.id};
  return this.findOne(query)
    .then(user => {
      // looked up their role and then all capabilities
      return user;
    })
    .catch(error => error);
};

// Compare a plain text password against the hashed one we have saved
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password)
    .then(valid => valid ? this : null);
};

// Generate a JWT from the user id and a secret
userSchema.methods.generateToken = function() {
  return jwt.sign( {id:this._id}, process.env.SECRET || 'changeit' );
};

export default mongoose.model('users', userSchema);
