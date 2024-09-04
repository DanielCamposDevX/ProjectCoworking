import { faker } from "@faker-js/faker";
import { prisma } from "config/database";

type createfakeUserData = {
  senha?: string;
  nome?: string;
  email?: string;
  papel?: string;
}


export async function createFakeUser(data:createfakeUserData) {
  return await prisma.usuario.create({
      data: {
          email: data.email ?? faker.internet.email(),
          nome: data.nome ?? faker.person.fullName(),
          senha: data.senha ?? faker.internet.password(),
          papel: data.papel ?? faker.person.jobArea()
      }
  })
}