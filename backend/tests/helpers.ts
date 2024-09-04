import { prisma } from "../src/config/database";


export async function cleanDb() {
    await prisma.projeto.deleteMany();
    await prisma.usuario.deleteMany();
  }