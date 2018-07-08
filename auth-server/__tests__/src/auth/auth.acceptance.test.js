'use strict';

const superagent = require('superagent');
const mongoose = require('mongoose');
const app = require('../../../src/app.js');

describe('Authentication Server', () => {

  const PORT = 8888;
  beforeAll( () => {
    mongoose.connect(process.env.MONGODB_URI);
    app.start(PORT);
  });
  afterAll( () => {
    app.stop();
    mongoose.connection.close();
  });

  // Note that these will actually be using the mocked models
  // from the mock version of require-dir.  IOW .. no need to spin up
  // a mongo server to run these tests. (we don't want to test mongo anyway!)

  it('gets a 401 on a bad login', () => {
    return superagent.get('http://localhost:8888/login')
      .then(response => {
      })
      .catch(response => {
        expect(response.status).toEqual(401);
      });
  });

  it('gets a 401 on a bad login', () => {
    return superagent.get('http://localhost:8888/login')
      .auth('foo','bar')
      .then(response => {
      })
      .catch(response => {
        expect(response.status).toEqual(401);
      });
  });

  xit('gets a 200 on a good login', () => {
    return superagent.get('http://localhost:8888/login')
      .auth('madhums123','none')
      .then(response => {
        expect(response.statusCode).toEqual(200);
      })
      .catch(console.err);
  });

});
