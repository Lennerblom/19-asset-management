'use strict';

require('dotenv').config({path: `${__dirname}/../../../.env`});
const mongoose = require('mongoose');
//const supertest = require('supertest');
const app = require('../../../src/app.js');
import superagent from 'superagent';
import Profile from '../../../src/auth/profiles.js';
import Image from '../../../src/auth/images.js';
//const request = supertest(app);

describe('/upload', () => {

  const PORT = 3000;
  beforeAll( () => {
    mongoose.connect(process.env.MONGODB_URI);
    app.start(PORT);
  });
  afterAll( () => {
    app.stop();
    //drop all collections to start fresh next time
    mongoose.connection.db.dropCollection('images',(err)=>{
      if(err) throw err;

      else{
        console.log('successfully dropped images collection');
      }});
    mongoose.connection.db.dropCollection('profiles',(err)=>{
      if(err) throw err;
  
      else{
        console.log('successfully dropped profiles collection');
      }});
    mongoose.connection.db.dropCollection('users',(err)=>{
      if(err) throw err;
    
      else{
        console.log('successfully dropped users collection');
      }});

    mongoose.connection.close();

  });
  
  it('should create a user login on signup',() =>{
    return superagent.post('http://localhost:3000/signup')
      .send({username:'mrebb', password:'foo', full_name:'madhu'})
      .then(response=>{
        let user = JSON.parse(response.text);
        expect(response.status).toEqual(200);
        expect(user.username).toEqual('mrebb');
        Profile.create({userID:user._id,username:user.username,fullName:user.full_name});
      })
      .catch(err=>expect(err).toEqual('nothing here'));
  });
  it('POST /upload to AWS', () => {
    return superagent.get('http://localhost:3000/login')
      .auth('mrebb','foo')
      .then(response => {
        return superagent.post(`http://localhost:3000/upload`)
          .set('Authorization', `Bearer ${response.text}`)
          .field('title', 'my image')
          .attach('img', `${__dirname}/asset/mario-sell.gif`)
          .then(res => {
            expect(res.status).toEqual(200);
            expect(res.body.url).toBeTruthy();
          });
      });
  });
  it('populate full user profile',()=>{
    return superagent.get('http://localhost:3000/login')
      .auth('mrebb','foo')
      .then(response => {
        return Profile.findOne({username:'mrebb'}).
          then(profile=>{
            console.log(profile);
            return superagent.get(`http://localhost:3000/profile/${profile._id}`)
              .set('Authorization', `Bearer ${response.text}`)
              .then(res=>{
                let actual = JSON.parse(res.text);
                expect(res.status).toEqual(200);
                expect(actual.username).toEqual('mrebb');
                expect(actual.images[0].fileName).toEqual('mario-sell.gif');
              });
          });
      });
  });
  it('Delete from AWS and model', () => {
    return superagent.get('http://localhost:3000/login')
      .auth('mrebb','foo')
      .then(response => {
        return Image.find({fileName:'mario-sell.gif'})
          .then(image=>{
            return superagent.delete(`http://localhost:3000/remove/${image[0].awsKey}`)
              .set('Authorization', `Bearer ${response.text}`)
              .then(res => {
                expect(res.status).toEqual(204);
              })
              .catch(err=>expect(err).toEqual('no error'));
          });
      });
    
  });
});

