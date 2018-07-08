'use strict';

require('dotenv').config({path: `${__dirname}/../../../.env`});
const mongoose = require('mongoose');
const supertest = require('supertest');
const {app} = require('../../../src/app.js');
import superagent from 'superagent';


let instagramURL = 'https://api.instagram.com/oauth/authorize/';

let options = {
  client_id:'f6fe9347cc7b4e51a141127857b8ca42',
  redirect_uri: 'http://localhost:3000/oauth',
  // scope: 'full_name openid profile',
  // prompt: 'consent',
  response_type: 'code',
};

let QueryString = Object.keys(options).map( (key,i) => {
  return `${key}=` + encodeURIComponent(options[key]);
}).join('&');

let authURL = `${instagramURL}?${QueryString}`;


const request = supertest(app);

describe('/upload', () => {

  beforeAll( () => {
    mongoose.connect(process.env.MONGODB_URI);
  });
  afterAll( () => {
    mongoose.connection.close();
  });

  xit('POST /upload  200', () => {
    return request.get('/login')
      .auth('john','john')
      .then(response => {
        return request.post(`/upload`)
          .set('Authorization', `Bearer ${response.text}`)
          .field('title', 'my image')
          .attach('img', `${__dirname}/asset/mario-sell.gif`)
          .then(res => {
            expect(res.status).toEqual(200);
            expect(res.body.url).toBeTruthy();
          });
      });
  });
  it('POST /upload to AWS', () => {

    return superagent.post(authURL)
      .send({

      })
    //return request.get('/oauth')
      .auth('john','john')
      .then(response => {
        return request.post(`/upload`)
          .set('Authorization', `Bearer ${response.text}`)
          .field('title', 'my image')
          .attach('img', `${__dirname}/asset/mario-sell.gif`)
          .then(res => {
            expect(res.status).toEqual(200);
            expect(res.body.url).toBeTruthy();
          });
      });
  });
});

