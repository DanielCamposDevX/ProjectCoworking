import { faker } from '@faker-js/faker';
import { prisma } from 'config/database';

type createFakeProjectData = {
   nome?: string;
   descricao?: string;
   status?: string;
   data_inicio?: Date;
   data_fim?: Date;
};

export async function createFakeProject(data: createFakeProjectData) {
   return await prisma.projeto.create({
      data: {
         nome: data.nome ?? faker.company.name(),
         descricao: data.descricao ?? faker.lorem.sentence(),
         status: data.status ?? 'Pendente',
         data_inicio: data.data_inicio ?? faker.date.recent(),
         data_fim: data.data_fim ?? faker.date.future(),
      },
   });
}

export async function insertUserInProject(projectId: number, userId: number) {
   await prisma.projeto.update({
      where: { id: projectId },
      data: {
         usuarios: {
            connect: {
               id: userId,
            },
         },
      },
   });
}
