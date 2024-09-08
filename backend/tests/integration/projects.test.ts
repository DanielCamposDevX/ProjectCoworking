import { faker } from "@faker-js/faker";
import app, { close, init } from "app";
import "dotenv/config";
import httpStatus from "http-status";
import jwt from 'jsonwebtoken';
import supertest from "supertest";
import { createFakeProject } from "../factories/project.factory";
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


describe("Get projects", () => {
  
  it("Should respond with 401 when token is invalid", async () => {
    const response = await server.get("/api/projetos").set('Authorization', 'Bearer invalidtoken');
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    expect(response.text).toBe("Token inválido, faça login novamente!");
  })

  it("Should respond with Unauthorized when jwt is valid but not from the user", async () => {
    const token = jwt.sign({ id: faker.seed(), token: faker.lorem.sentence()}, process.env.JWT_KEY as string, { expiresIn: '1h' });
    const response = await server.get("/api/projetos").set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    expect(response.text).toBe("Token inválido! Faça login novamente.");
  })

  it("Should respond with 200 and return the projects", async () => {
    const user = await createFakeUser({ email: faker.internet.email(), senha: '123456' });
    const session = await createFakeSession(user.id);
    const project = await createFakeProject({});
    const formattedProject = {
      ...project,
      data_inicio: project.data_inicio.toISOString(),
      data_fim: project.data_fim ? project.data_fim.toISOString() : null
    };
    const response = await server.get("/api/projetos").set('Authorization', `Bearer ${session}`);
    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toStrictEqual({projects: [formattedProject] , total: 1});
  })
})


describe("Post projects", () => {
  
  it("Should respond with 401 when token is invalid", async () => {
    const response = await server.get("/api/projetos").set('Authorization', 'Bearer invalidtoken');
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    expect(response.text).toBe("Token inválido, faça login novamente!");
  })

  it("Should respond with Unauthorized when jwt is valid but not from the user", async () => {
    const token = jwt.sign({ id: faker.seed(), token: faker.lorem.sentence()}, process.env.JWT_KEY as string, { expiresIn: '1h' });
    const response = await server.get("/api/projetos").set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    expect(response.text).toBe("Token inválido! Faça login novamente.");
  })

  it("Should respond with 422 when body is invalid", async () => {
    const user = await createFakeUser({ email: faker.internet.email(), senha: '123456' });
    const session = await createFakeSession(user.id);
    const response = await server.post("/api/projetos").set('Authorization', `Bearer ${session}`).send({
      invalidBody: faker.lorem.sentence(),
    });
    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  })

  it("Should respond with 201 when created", async () => {
    const user = await createFakeUser({ email: faker.internet.email(), senha: '123456' });
    const session = await createFakeSession(user.id);
    const response = await server.post("/api/projetos").set('Authorization', `Bearer ${session}`).send({
      nome: faker.lorem.sentence(),
      descricao: faker.lorem.sentence(),
      status: "Pendente",
      data_inicio: faker.date.recent(),
    });
    console.log(response.body);
    expect(response.status).toBe(httpStatus.CREATED);
    expect(response.body).toHaveProperty('id');
  })
})

