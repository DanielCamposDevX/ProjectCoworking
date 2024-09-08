import { faker } from '@faker-js/faker';
import app, { close, init } from 'app';
import 'dotenv/config';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import supertest from 'supertest';
import { createUserData, loginUserData } from 'types/user-types';
import { createFakeSession, createFakeUser } from '../factories/user.factory';
import { cleanDb } from '../helpers';

beforeAll(async () => {
  await init();
  await cleanDb();
});

beforeEach(async () => {
  await cleanDb();
});

afterAll(async () => {
  await close();
});

const server = supertest(app);

describe('Create User', () => {
  it('Should respond with unprocEntity if body is invalid', async () => {
    const newUserData = {
      data: 'invalid',
    };
    const response = await server.post('/api/auth/register').send(newUserData);
    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it('Should respond with Conflict if email already exists', async () => {
    const newUserData: createUserData = {
      email: faker.internet.email(),
      nome: faker.person.fullName(),
      papel: faker.person.jobArea(),
      senha: faker.internet.password(),
    };
    await createFakeUser({ email: newUserData.email });
    const response = await server.post('/api/auth/register').send(newUserData);
    expect(response.status).toBe(httpStatus.CONFLICT);
    expect(response.text).toBe(
      'Já existe um usuário com esse email cadastrado',
    );
  });

  it('Should respond with 201 and create user', async () => {
    const newUserData: createUserData = {
      email: faker.internet.email(),
      nome: faker.person.fullName(),
      papel: faker.person.jobArea(),
      senha: faker.internet.password(),
    };
    const response = await server.post('/api/auth/register').send(newUserData);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toMatchObject({
      email: newUserData.email,
      nome: newUserData.nome,
      papel: newUserData.papel,
    });
  });
});

describe('Login User', () => {
  it('Should respond with 422 when body is invalid', async () => {
    const body = {
      data: 'invalid',
    };
    const response = await server.post('/api/auth/login').send(body);
    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it('Should respond with 404 when email is not found', async () => {
    const body: loginUserData = {
      senha: faker.internet.password(),
      email: faker.internet.email(),
    };
    const response = await server.post('/api/auth/login').send(body);
    expect(response.status).toBe(httpStatus.NOT_FOUND);
    expect(response.text).toBe('Email não cadastrado!');
  });

  it('Should respond with Unauthorized when Passwords dont match', async () => {
    const user = await createFakeUser({
      email: faker.internet.email(),
      senha: '123456',
    });
    const body: loginUserData = {
      senha: '1234567',
      email: user.email,
    };
    const response = await server.post('/api/auth/login').send(body);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    expect(response.text).toBe('Senha inválida!');
  });

  it('Should respond with 200 when Login is sucessfull', async () => {
    const user = await createFakeUser({
      email: faker.internet.email(),
      senha: '123456',
    });
    const body: loginUserData = {
      senha: '123456',
      email: user.email,
    };
    const response = await server.post('/api/auth/login').send(body);
    expect(response.status).toBe(httpStatus.OK);
  });
});

describe('GetUserAuth', () => {
  it('Should respond with 401 when token is invalid', async () => {
    const response = await server
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalidtoken');
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    expect(response.text).toBe('Token inválido, faça login novamente!');
  });

  it('Should respond with Unauthorized when jwt is valid but not from the user', async () => {
    const token = jwt.sign(
      { id: faker.seed(), token: faker.lorem.sentence() },
      process.env.JWT_KEY as string,
      { expiresIn: '1h' },
    );
    const response = await server
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    expect(response.text).toBe('Token inválido! Faça login novamente.');
  });

  it('Should respond with 200 when user is authenticated', async () => {
    const user = await createFakeUser({
      email: faker.internet.email(),
      senha: '123456',
    });
    const session = await createFakeSession(user.id);

    const response = await server
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${session}`);
    expect(response.status).toBe(httpStatus.OK);
    delete user.senha;
    expect(response.body).toStrictEqual(user);
  });
});
