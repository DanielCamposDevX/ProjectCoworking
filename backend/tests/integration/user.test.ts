import { faker } from "@faker-js/faker";
import app, { close, init } from "app";
import httpStatus from "http-status";
import supertest from "supertest";
import { createUserData } from "types/user-types";
import { createFakeUser } from "../factories/user.factory";
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