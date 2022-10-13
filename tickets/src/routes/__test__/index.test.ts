import { response } from 'express';
import request from 'supertest';
import { app } from '../../app';

const createTicket = () => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'adasd',
      price: 20
    })
    .expect(201);

}

it('can fetch a list of tickets', async () => {

  // create 3 tickets
  await createTicket();
  await createTicket();
  await createTicket();

  const reponse = await request(app)
    .get('/api/tickets')
    .send()
    .expect(200);

  expect(reponse.body.length).toEqual(3);

})