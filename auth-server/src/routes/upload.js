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
  // User.authorize(req.token)
  //   .then(user=>{
  //     Image.create({fileName:req.files[0].originalname,type:req.files[0].mimetype})
  //     .then(Profile.findOneAndUpdate({'userID':user._id},{$set:{images:}},{new: true});)
  //   });
  User.authorize(req.token)
    .then(user=>{
      Image.create({fileName:req.files[0].originalname,type:req.files[0].mimetype})
        .then(image=>Profile.findOneAndUpdate({'userID':user._id},{$set:{images:image._id}},{new: true}));
    });
  
  if(!req.body.title || req.files.length > 1 || req.files[0].fieldname !== 'img')
    return next('title or sample was not provided');

  let file = req.files[0];
  let key = `${file.filename}.${file.originalname}`;

  console.log('body', req.body);

  console.log('files', req.files);
  console.log(key);
  return s3.upload(file.path, key)
    .then(url => {
      let output = {
        url: url,
      };
      res.send(output);
    })
    .catch(next);

  res.sendStatus(418);
  
});

export default uploadRouter;