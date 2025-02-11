const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../src/models/user');
const Blog = require('../src/models/blog');

const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

describe('User/Blog Routes', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  let req;

  beforeEach(async () => {
    req = {
      flash: jest.fn(),
      session: {
        user: {
          id: '1',
          username: 'svadikari',
          firstName: 'Shyam',
          lastName: 'Vadikari',
        },
      },
    };
    await Blog.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect().then(result => {
    }).catch(error => { console.error(error) });
    await mongoServer.stop();
  });

  test('POST /register should create a new user', async () => {
    const response = await request(app)
      .post('/users/register')
      .send({ username: 'svadikari', password: 'test123', firstName: 'Shyam', lastName: 'Vadikari' });
    expect(response.status).toBe(302);
    const user = await User.findOne({ username: 'svadikari' });
    expect(user).not.toBeNull();
  });

  test('POST /login should login a user', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({ username: 'svadikari', password: 'test123' });
    expect(response.status).toBe(302);
  });

  test('POST /create should create a new blog', async () => {
    const response = await request(app)
      .post('/blogs/create')
      .send({ title: 'New Blog', details: 'Test Content', author: 'svadikari' });
    expect(response.status).toBe(302);
  });

  test('GET / should return all blogs', async () => {
    const response = await request(app).get('/blogs');
    expect(response.status).toBe(302);
    expect(response).not.toBeNull();
  });

  test('GET /:id should return a blog by id', async () => {
    const response = await request(app).get(`/blogs/1`);
    expect(response.status).toBe(302);
  });

  test('POST /:id should update a blog by id', async () => {
    const response = await request(app)
      .post(`/blogs/1`)
      .send({ title: 'Updated Blog', details: 'Updated Content' });
    expect(response.status).toBe(302);
  });

  test('DELETE /delete/:id should delete a blog by id', async () => {
    const response = await request(app).get(`/blogs/delete/1`);
    expect(response.status).toBe(302);
  });
});