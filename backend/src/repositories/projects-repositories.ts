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

async function getProjectById(id: number) {
  return await prisma.projeto.findUnique({
    where: {
      id
    }
  });
}

async function createProject(data:projectType) {
  return await prisma.projeto.create({
    data
  });
}

async function updateProject(id: number, data: updateProjectType) {
  return await prisma.projeto.update({
    where: {
      id
    },
    data
  });
}

async function deleteProject(id: number) {
  return await prisma.projeto.delete({
    where: {
      id
    }
  });
}




export const projectsRepositories = { getProjects, createProject, updateProject, getProjectById,deleteProject };