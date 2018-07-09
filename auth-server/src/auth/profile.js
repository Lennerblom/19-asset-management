'use strict';

import mongoose from 'mongoose';

const profileSchema = mongoose.Schema({
  profileName: {type:String, required: true},
  age: {type:Number},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
  
});

export default mongoose.model('profile', profileSchema);