// import { request } from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  var signin: () => string[];
}

jest.mock('../nats-wrapper.ts');
let mongo: any;

beforeAll( async () => {

  process.env.JWT_KEY = 'asdfasdf';

  const mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});

})

beforeEach( async () => {
  const collections = await mongoose.connection.db.collections();
  jest.clearAllMocks();
  for (let collection of collections) {
    await collection.deleteMany({});
  }

})

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = () => {
  // Build a JWT payload { id, email }

  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  }

  // Create the JWT! 
  const token = jwt.sign(payload, process.env.JWT_KEY!)

  // Build session object { jwt: MY_JWT }
  const session = { jwt: token };
  
  // Turn that session into JSON
  const seesionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(seesionJSON).toString('base64');

  // Return a string thats the cookie with the encoded data
  return [`session=${base64}`];

}; 