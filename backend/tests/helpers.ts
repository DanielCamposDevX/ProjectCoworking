import { prisma } from '../src/config/database';

export async function cleanDb() {
   await prisma.logs.deleteMany();
   await prisma.comment.deleteMany();
   await prisma.task.deleteMany();
   await prisma.projeto.deleteMany();
   await prisma.session.deleteMany();
   await prisma.usuario.deleteMany();
}
