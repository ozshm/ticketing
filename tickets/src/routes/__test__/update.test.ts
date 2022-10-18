import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { OperationCanceledException } from 'typescript';
import { natsWrapper } from '../../nats-wrapper';

const createTicket = (title: string, price: number, cookie?: string[]) => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', cookie || global.signin())
    .send({
      title,
      price
    });
}

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'sdadad',
      price: 20
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'sdadad',
      price: 20
    })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {

  const title = 'dsscvx';
  const price = 20;

  const response = await createTicket(title, price);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'sdasca',
      price: 102
    })
    .expect(401); 

  const responseAfter = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

    expect(responseAfter.body.title).toEqual(title);
    expect(responseAfter.body.price).toEqual(price);
  
});

it('returns a 400 if the user provides an invalid title or price', async () => {

  const cookie = global.signin();

  const response = await createTicket('abcd', 10, cookie);

    // invalid title
    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
        title: '',
        price: 20
      })
      .expect(400);

      // invalid price
    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
        title: 'aaxx',
        price: -20
      })
      .expect(400);
});

it('updated the ticket provided valid inputs', async () => {
  const cookie = global.signin();

  const response = await createTicket('abcd', 20, cookie);

  const newTitle = 'new title';
  const newPrice = 100;

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: newTitle,
      price: newPrice
    })
    .expect(200);

  const responseAfter = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

    expect(responseAfter.body.title).toEqual(newTitle);
    expect(responseAfter.body.price).toEqual(newPrice);


});

it('publishes an event', async () => {
  const cookie = global.signin();

  const response = await createTicket('abcd', 20, cookie);

  const newTitle = 'new title';
  const newPrice = 100;

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: newTitle,
      price: newPrice
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();


})