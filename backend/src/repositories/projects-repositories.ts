import { prisma } from "../config/database";

async function getProjects(page: number, limit: number) {
  const skip = (page - 1) * limit;

  const [projects, totalProjects] = await prisma.$transaction([
    prisma.projeto.findMany({
      skip,
      take: limit
    }),
    prisma.projeto.count() 
  ]);

  return { projects, total: totalProjects };
}

async function createProject(data:projectType) {
  return await prisma.projeto.create({
    data
  });
}



export const projectsRepositories = { getProjects, createProject }