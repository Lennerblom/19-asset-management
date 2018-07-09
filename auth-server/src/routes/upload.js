'use strict';

import express from 'express';
import multer from 'multer';
import auth from '../auth/middleware.js';
import User from '../auth/model.js';
import Image from '../auth/images.js';
import Profile from '../auth/profiles.js';

import s3 from '../auth/lib/s3';

const upload = multer({dest: `${__dirname}/../tmp`});

const uploadRouter = express.Router();

uploadRouter.post('/upload', auth, upload.any(), (req, res, next) => {
  
  if(!req.body.title || req.files.length > 1 || req.files[0].fieldname !== 'img')
    return next('title or sample was not provided');

  let file = req.files[0];
  let key = `${file.filename}.${file.originalname}`;
  User.authorize(req.token)
    .then(user=>{
      Image.create({fileName:req.files[0].originalname,awsKey:key,type:req.files[0].mimetype})
        .then(image=>Profile.findOneAndUpdate({'userID':user._id},{$set:{images:image._id}},{new: true}));
    });
  // console.log('body', req.body);
  // console.log('files', req.files);
  // console.log(key);
  return s3.upload(file.path, key)
    .then(url => {
      let output = {
        url: url,
      };
      res.send(output);
    })
    .catch(next);
});
uploadRouter.delete('/remove/:key',auth,(req,res,next)=>{
  if(req.params.key){
    return s3.remove(req.params.key)
      .then(response => {
        console.log('response for remove',response);
        Image.findOneAndRemove({awsKey:req.params.key})
          .then(data=>{
            console.log(data);
            res.status(204);
            res.send();
          });      
      })
      .catch(next);
  }
  else{
    res.status(400);
    res.send('no key passed as part of request');
  }
});
uploadRouter.get('/profile/:id',auth, (req,res,next)=>{
  Profile.findById(req.params.id)
    .populate('images').exec()
    .then( data => res.send(data))
    .catch(next);
});
export default uploadRouter;