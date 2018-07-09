'use strict';
import mongoose,{Schema} from 'mongoose';
const profileSchema = mongoose.Schema({
  userID: {type:Schema.Types.ObjectId, ref:'users'},
  username: {type:String},
  fullName: {type:String},
  images:[{type: Schema.Types.ObjectId, ref:'images'}],
});
const Profile = mongoose.model('profiles', profileSchema);
export default Profile;