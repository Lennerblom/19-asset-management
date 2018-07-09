'use strict';
import mongoose,{Schema} from 'mongoose';
const imageSchema = mongoose.Schema({
  id:{type:Schema.Types.ObjectId,ref:'profiles'},
  fileName: {type: String, required: true},
  awsKey: {type:String, required:true},
  type: {type: String, required: true},
});
const Image = mongoose.model('images', imageSchema);
export default Image;

//userID: {type:Schema.Types.ObjectId, ref:'profiles'},