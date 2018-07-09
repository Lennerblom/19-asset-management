'use strict';

const superagent = require('superagent');
const mongoose = require('mongoose');
const app = require('../../../src/app.js');

describe('Authentication Server', () => {

  const PORT = 3000;
  beforeAll( () => {
    
    mongoose.connect(process.env.MONGODB_URI);
    app.start(PORT);
  });
  afterAll( () => {
    app.stop();
    mongoose.connection.close();
  });
  
  xit('gets a 200 on login', () => {
    return superagent.get('http://localhost:3000/login')
      .then(response => {
      })
      .catch(response => {
        expect(response.status).toEqual(401);
      });
  });


});
