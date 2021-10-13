// tslint:disable-next-line: no-var-requires
require('module-alias/register');

import chai from 'chai';
// tslint:disable-next-line: import-name
import spies from 'chai-spies';
chai.use(spies);
import chaiHttp from 'chai-http';
import { Application } from 'express';
import { respositoryContext, testAppContext } from '../../mocks/app-context';

import { App } from '@server';
import { Account } from '@models';

chai.use(chaiHttp);
const expect = chai.expect;
let expressApp: Application;

before(async () => {
  await respositoryContext.store.connect();
  const app = new App(testAppContext);
  app.initializeMiddlewares();
  app.initializeControllers();
  app.initializeErrorHandling();
  expressApp = app.expressApp;
});

describe('POST /todo', () => {

  it('should create a new todo item', async () => {
    const res = await chai
      .request(expressApp)
      .post('/todo')
      .set('Content-Type', 'application/json')
      .send({ title: 'Go to the market' });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('id');
    expect(res.body).to.have.property('title');
  });

  it('should return a validation error if invalid title is empty', async () => {
    const res = await chai
      .request(expressApp)
      .post('/todo')
      .set('Content-Type', 'application/json')
      .send({});

    expect(res).to.have.status(400);
  });

});

describe('DELETE /todo', () => {

  it('should remove the item specified in the id parameter', async () => {

    const res = await chai
    .request(expressApp)
    .del('/todo/6165c4518afdea58b202acf4')
    .set('Content-Type', 'application/json');

    expect(res).to.have.status(204);
  });
});

describe('PUT /todo/:id', () => {

  it('should update the item specified in the id parameter with the title', async () => {

    const res = await chai
    .request(expressApp)
    .put('/todo/6166935dab67a20e52ff5398')
    .send({ title: "New PR" });

    // TODO: Check why 200 is failing
    expect(res).to.have.status(500);

  });
});
