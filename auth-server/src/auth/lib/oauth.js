'use strict';

import superagent from 'superagent';

import User from '../model';

// This is currently setup for instagram, but we could easily swap it out
// for any other provider or even use a totally different module to
// to do this work.
//
// So long as the method is called "authorize" and we get the request,
// we should be able to roll on our own here...

const authorize = (req) => {

  let code = req.query.code;

  console.log('(1) code', code);

  // exchange the code to get access token and user details in single request
  return superagent.post('https://api.instagram.com/oauth/access_token')
    .type('form')
    .send({
      code: code,
      client_id: process.env.INSTAGRAM_CLIENT_ID,
      client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
      redirect_uri: `${process.env.API_URL}/oauth`,
      grant_type: 'authorization_code',
    })
    .then(response => {
      let instagramToken = response.body.access_token;
      console.log('(2) instagram token', instagramToken);
      console.log('(3) Creating Account');
      return User.createFromOAuth(response.body.user);
    })
    .then (user => {
      console.log('(4) Created User, generating token');
      return user.generateToken();
    })
    .catch(error=>error);
};



export default {authorize};
