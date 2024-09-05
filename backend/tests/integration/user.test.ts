import { faker } from "@faker-js/faker";
import app, { close, init } from "app";
import "dotenv/config";
import httpStatus from "http-status";
import jwt, { JwtPayload } from 'jsonwebtoken';
import supertest from "supertest";
import { createUserData, loginUserData } from "types/user-types";
import { createFakeSession, createFakeUser } from "../factories/user.factory";
import { cleanDb } from "../helpers";




beforeAll(async () => {
  await init();
  await cleanDb();
});

beforeEach(async () => {
  await cleanDb();
})

afterAll(async () => {
  await close();
});

const server = supertest(app);


describe("Create User", () => {
  it("Should respond with unprocEntity if body is invalid", async () => {
    const newUserData = {
      data: 'invalid'
     }
    const response = await server.post('/api/auth/register').send(newUserData);
    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  })


  it("Should respond with Conflict if email already exists", async () => {
    const newUserData: createUserData = {
      email: faker.internet.email(),
      nome: faker.person.fullName(),
      papel: faker.person.jobArea(),
      senha: faker.internet.password()
     }
    await createFakeUser({ email: newUserData.email });
    const response = await server.post('/api/auth/register').send(newUserData);
    expect(response.status).toBe(httpStatus.CONFLICT);
    expect(response.text).toBe("Já existe um usuário com esse email cadastrado");
  })

  it("Should respond with 201 and create user", async () => {
    const newUserData: createUserData = {
      email: faker.internet.email(),
      nome: faker.person.fullName(),
      papel: faker.person.jobArea(),
      senha: faker.internet.password()
     }
    const response = await server.post('/api/auth/register').send(newUserData);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toMatchObject({
      email: newUserData.email,
      nome: newUserData.nome,
      papel: newUserData.papel,
    });
  })
})

describe("Login User", () => {

  it("Should respond with 422 when body is invalid", async () => {
    const body = {
      data: 'invalid',
    }
    const response = await server.post("/api/auth/login").send(body);
    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  })

  it("Should respond with 404 when email is not found", async () => {
    const body : loginUserData = {
      senha: faker.internet.password(),
      email: faker.internet.email(),
    }
    const response = await server.post("/api/auth/login").send(body);
    expect(response.status).toBe(httpStatus.NOT_FOUND);
    expect(response.text).toBe("Email não cadastrado!");
  })

  it("Should respond with Unauthorized when Passwords dont match", async () => {
    const user = await createFakeUser({ email: faker.internet.email(), senha: '123456' });
    const body: loginUserData  = {
      senha: '1234567',
      email: user.email,
    }
    const response = await server.post("/api/auth/login").send(body);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    expect(response.text).toBe("Senha inválida!");
  })

  it("Should respond with 200 when Login is sucessfull and the session already exists", async () => {
    const user = await createFakeUser({ email: faker.internet.email(), senha: '123456' });
    const session = await createFakeSession(user.id);
    let token = '';
    let restoken = '';
    jwt.verify(session, process.env.JWT_KEY, (err, decoded) => {
      token = (decoded as JwtPayload).token;
    })
    const body: loginUserData = {
      senha: '123456',
      email: user.email,
    }
    const response = await server.post("/api/auth/login").send(body);
    console.log(response.text)
    jwt.verify(response.text, process.env.JWT_KEY, (err, decoded) => {
      restoken = (decoded as JwtPayload).token;
    })
    expect(response.status).toBe(httpStatus.OK);
    expect(restoken).toBe(token);

  })


  it("Should respond with 200 when Login is sucessfull", async () => {
    const user = await createFakeUser({ email: faker.internet.email(), senha: '123456' });
    const body: loginUserData = {
      senha: '123456',
      email: user.email,
    }
    const response = await server.post("/api/auth/login").send(body);
    expect(response.status).toBe(httpStatus.OK);
  })

})