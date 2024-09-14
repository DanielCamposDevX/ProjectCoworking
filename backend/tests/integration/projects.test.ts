import { faker } from '@faker-js/faker';
import app, { close, init } from 'app';
import 'dotenv/config';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import supertest from 'supertest';
import { createFakeProject } from '../factories/project.factory';
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

describe('Get projects', () => {
   it('Should respond with 401 when token is invalid', async () => {
      const response = await server
         .get('/api/projetos')
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
         .get('/api/projetos')
         .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      expect(response.text).toBe('Token inválido! Faça login novamente.');
   });

   it('Should respond with 200 and return the projects', async () => {
      const user = await createFakeUser({
         email: faker.internet.email(),
         senha: '123456',
      });
      const session = await createFakeSession(user.id);
      const project = await createFakeProject({}, user.id);
      const formattedProject = {
         ...project,
         data_inicio: project.data_inicio.toISOString(),
         data_fim: project.data_fim ? project.data_fim.toISOString() : null,
         creator: {
            nome: user.nome,
         },
         _count: { usuarios: 0 },
      };
      const response = await server
         .get('/api/projetos')
         .set('Authorization', `Bearer ${session}`);
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toStrictEqual({
         projects: [formattedProject],
         total: 1,
         totalPages: 1,
         currentPage: 1,
      });
   });

   it('Should respond with 200 and return filtered projects', async () => {
      const user = await createFakeUser({
         email: faker.internet.email(),
         senha: '123456',
      });
      const session = await createFakeSession(user.id);

      await createFakeProject(
         { nome: 'Project A', status: 'CONCLUIDO' },
         user.id,
      );
      await createFakeProject(
         { nome: 'Project B', status: 'PENDENTE' },
         user.id,
      );
      const project3 = await createFakeProject(
         {
            nome: 'Project C',
            status: 'CONCLUIDO',
            data_inicio: new Date('2023-09-01'),
            data_fim: new Date('2023-09-10'),
         },
         user.id,
      );

      const formattedProjects = [
         {
            ...project3,
            data_inicio: project3.data_inicio.toISOString(),
            data_fim: project3.data_fim
               ? project3.data_fim.toISOString()
               : null,
            creator: { nome: user.nome },
            _count: { usuarios: 0 },
         },
      ];

      const response = await server
         .get('/api/projetos')
         .set('Authorization', `Bearer ${session}`)
         .query({
            search: 'Project',
            status: 'CONCLUIDO',
            data_inicio: '2023-09-01',
            data_fim: '2023-09-10',
         });

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toStrictEqual({
         projects: formattedProjects,
         total: 1,
         totalPages: 1,
         currentPage: 1,
      });
   });
});

describe('Post projects', () => {
   it('Should respond with 401 when token is invalid', async () => {
      const response = await server
         .post('/api/projetos')
         .set('Authorization', 'Bearer invalidtoken');
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      expect(response.text).toBe('Token inválido, faça login novamente!');
   });

   it('Should respond with 422 when body is invalid', async () => {
      const user = await createFakeUser({
         email: faker.internet.email(),
         senha: '123456',
      });
      const session = await createFakeSession(user.id);
      const response = await server
         .post('/api/projetos')
         .set('Authorization', `Bearer ${session}`)
         .send({
            invalidBody: faker.lorem.sentence(),
         });
      expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
   });

   it('Should respond with Unauthorized when jwt is valid but not from the user', async () => {
      const token = jwt.sign(
         { id: faker.seed(), token: faker.lorem.sentence() },
         process.env.JWT_KEY as string,
         { expiresIn: '1h' },
      );
      const response = await server
         .post('/api/projetos')
         .set('Authorization', `Bearer ${token}`)
         .send({
            nome: faker.person.firstName(),
            descricao: faker.lorem.sentence(),
            status: 'PENDENTE',
            data_inicio: faker.date.recent().toISOString(),
         });
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      expect(response.text).toBe('Token inválido! Faça login novamente.');
   });

   it('Should respond with 201 when created', async () => {
      const user = await createFakeUser({
         email: faker.internet.email(),
         senha: '123456',
      });
      const session = await createFakeSession(user.id);
      const response = await server
         .post('/api/projetos')
         .set('Authorization', `Bearer ${session}`)
         .send({
            nome: faker.person.firstName(),
            descricao: faker.lorem.sentence(),
            status: 'PENDENTE',
            data_inicio: faker.date.recent().toISOString(),
         });
      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body).toHaveProperty('id');
   });
});

describe('Update projects', () => {
   it('Should respond with 401 when token is invalid', async () => {
      const response = await server
         .put(`/api/projetos/${faker.number.int()}`)
         .set('Authorization', 'Bearer invalidtoken');
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      expect(response.text).toBe('Token inválido, faça login novamente!');
   });

   it('Should respond with 422 when body is invalid', async () => {
      const user = await createFakeUser({
         email: faker.internet.email(),
         senha: '123456',
      });
      const session = await createFakeSession(user.id);
      const response = await server
         .put(`/api/projetos/${faker.number.int()}`)
         .set('Authorization', `Bearer ${session}`)
         .send({
            invalidBody: faker.lorem.sentence(),
         });
      expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
   });

   it('Should respond with Unauthorized when jwt is valid but not from the user', async () => {
      const token = jwt.sign(
         { id: faker.seed(), token: faker.lorem.sentence() },
         process.env.JWT_KEY as string,
         { expiresIn: '1h' },
      );
      const response = await server
         .put(`/api/projetos/${faker.number.int()}`)
         .set('Authorization', `Bearer ${token}`)
         .send({
            nome: faker.person.firstName(),
            descricao: faker.lorem.sentence(),
            status: 'PENDENTE',
            data_inicio: faker.date.recent().toISOString(),
         });
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      expect(response.text).toBe('Token inválido! Faça login novamente.');
   });

   it('Should respond with 404 when project not found', async () => {
      const user = await createFakeUser({
         email: faker.internet.email(),
         senha: '123456',
      });
      const session = await createFakeSession(user.id);
      const response = await server
         .put(`/api/projetos/${faker.number.int()}`)
         .set('Authorization', `Bearer ${session}`)
         .send({
            nome: faker.person.firstName(),
            descricao: faker.lorem.sentence(),
            status: 'PENDENTE',
            data_inicio: faker.date.past(),
            data_fim: faker.date.future(),
         });
      expect(response.status).toBe(httpStatus.NOT_FOUND);
   });

   it('Should respond with 400 when initialDate is after end date', async () => {
      const user = await createFakeUser({
         email: faker.internet.email(),
         senha: '123456',
      });
      const session = await createFakeSession(user.id);
      const project = await createFakeProject({}, user.id);
      const response = await server
         .put(`/api/projetos/${project.id}`)
         .set('Authorization', `Bearer ${session}`)
         .send({
            nome: faker.person.firstName(),
            descricao: faker.lorem.sentence(),
            status: 'PENDENTE',
            data_inicio: faker.date.future(),
            data_fim: faker.date.past(),
         });
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
   });

   it('Should respond with 400 when data_inicio is greater than data_fim', async () => {
      const user = await createFakeUser({
         email: faker.internet.email(),
         senha: '123456',
      });
      const session = await createFakeSession(user.id);
      const project = await createFakeProject({}, user.id);

      const response = await server
         .put(`/api/projetos/${project.id}`)
         .set('Authorization', `Bearer ${session}`)
         .send({
            nome: faker.person.firstName(),
            descricao: faker.lorem.sentence(),
            status: 'PENDENTE',
            data_inicio: faker.date.future(),
            data_fim: faker.date.past(),
         });

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
      expect(response.text).toBe(
         'Data de início não pode ser maior que a data de fim',
      );
   });

   it('Should respond with 400 when data_inicio is greater than project data_fim', async () => {
      const user = await createFakeUser({
         email: faker.internet.email(),
         senha: '123456',
      });
      const session = await createFakeSession(user.id);
      const project = await createFakeProject(
         {
            data_fim: faker.date.past(),
         },
         user.id,
      );

      const response = await server
         .put(`/api/projetos/${project.id}`)
         .set('Authorization', `Bearer ${session}`)
         .send({
            nome: faker.person.firstName(),
            descricao: faker.lorem.sentence(),
            status: 'PENDENTE',
            data_inicio: faker.date.future(),
         });

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
      expect(response.text).toBe(
         'Data de início não pode ser maior que a data de fim',
      );
   });

   it('Should respond with 400 when data_fim is before data_inicio', async () => {
      const user = await createFakeUser({
         email: faker.internet.email(),
         senha: '123456',
      });
      const session = await createFakeSession(user.id);
      const project = await createFakeProject({}, user.id);

      const response = await server
         .put(`/api/projetos/${project.id}`)
         .set('Authorization', `Bearer ${session}`)
         .send({
            nome: faker.person.firstName(),
            descricao: faker.lorem.sentence(),
            status: 'PENDENTE',
            data_inicio: faker.date.past(),
            data_fim: faker.date.past(),
         });

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
      expect(response.text).toBe(
         'Data de fim não pode ser anterior à data de início',
      );
   });

   it('Should respond with 201 when updated', async () => {
      const user = await createFakeUser({
         email: faker.internet.email(),
         senha: '123456',
      });
      const session = await createFakeSession(user.id);
      const project = await createFakeProject({}, user.id);
      const response = await server
         .put(`/api/projetos/${project.id}`)
         .set('Authorization', `Bearer ${session}`)
         .send({
            nome: faker.person.firstName(),
            descricao: faker.lorem.sentence(),
            status: 'PENDENTE',
            data_inicio: faker.date.past(),
            data_fim: faker.date.future(),
         });
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toHaveProperty('id');
   });
});

describe('Delete projects', () => {
   it('Should respond with 401 when token is invalid', async () => {
      const response = await server
         .delete(`/api/projetos/${faker.number.int()}`)
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
         .delete(`/api/projetos/${faker.number.int()}`)
         .set('Authorization', `Bearer ${token}`)
         .send({
            nome: faker.person.firstName(),
            descricao: faker.lorem.sentence(),
            status: 'PENDENTE',
            data_inicio: faker.date.recent().toISOString(),
         });
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      expect(response.text).toBe('Token inválido! Faça login novamente.');
   });

   it('Should respond with 204 when deleted', async () => {
      const user = await createFakeUser({
         email: faker.internet.email(),
         senha: '123456',
      });
      const session = await createFakeSession(user.id);
      const project = await createFakeProject({}, user.id);
      const response = await server
         .delete(`/api/projetos/${project.id}`)
         .set('Authorization', `Bearer ${session}`)
         .send({
            nome: faker.person.firstName(),
            descricao: faker.lorem.sentence(),
            status: 'PENDENTE',
            data_inicio: faker.date.recent().toISOString(),
         });
      expect(response.status).toBe(httpStatus.NO_CONTENT);
   });
});
