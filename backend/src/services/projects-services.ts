import "dotenv/config";
import { errors } from "errors/errors";
import { projectsRepositories } from "repositories/projects-repositories";
import { userRepositories } from "repositories/user-repositories";



async function getProjects(page=1, limit=10) {
    const projects = await projectsRepositories.getProjects(page, limit);
    return projects;
}

async function createProject(data: projectType) {
  return await projectsRepositories.createProject(data);
}

async function updateProject(id: number, data: updateProjectType) {
  const project = await projectsRepositories.getProjectById(id);
  if (!project) {
    throw errors.notFound('Projeto não encontrado');
  }

  if (data.data_inicio && data.data_fim) {
    const dataInicio = new Date(data.data_inicio);
    const dataFim = new Date(data.data_fim);
    
    if (dataInicio > dataFim) {
      throw errors.badRequest('Data de início não pode ser maior que a data de fim');
    }
  }

  if (data.data_inicio && project.data_fim) {
    const dataInicio = new Date(data.data_inicio);
    const dataFim = new Date(project.data_fim);

    if (dataInicio > dataFim) {
      throw errors.badRequest('Data de início não pode ser maior que a data de fim');
    }
  }

  if (data.data_fim && project.data_inicio) {
    const dataFim = new Date(data.data_fim);
    const dataInicio = new Date(project.data_inicio);

    if (dataFim < dataInicio) {
      throw errors.badRequest('Data de fim não pode ser anterior à data de início');
    }
  }

  return await projectsRepositories.updateProject(id, data);
}

async function deleteProject(id: number) {
  const project = await projectsRepositories.getProjectById(id);
  if (!project) {
    throw errors.notFound('Projeto não encontrado');
  }

  await projectsRepositories.deleteProject(id);
}

async function getProjectUsers(id: number, page=1, limit=10) {
  const project = await projectsRepositories.getProjectById(id);
  if (!project) {
    throw errors.notFound('Projeto não encontrado');
  }
  const users = await projectsRepositories.getProjectUsers(id, page, limit);
  return users;
}

async function postProjectUsers(id: number,userId: number) {
  const user = await userRepositories.findUserById(userId);
  if (!user) {
    throw errors.notFound('Usuário não encontrado');
  }
  const project = await projectsRepositories.getProjectById(id);
  if (!project) {
    throw errors.notFound('Projeto não encontrado');
  }
  await projectsRepositories.postProjectUsers(id, userId);
  return user;
}

async function deleteProjectUsers(id: number, userId: number) {

  const user = await userRepositories.findUserById(userId);
  if (!user) {
    throw errors.notFound('Usuário não encontrado');
  }
  const project = await projectsRepositories.getProjectById(id);
  if (!project) {
    throw errors.notFound('Projeto não encontrado');
  }

  await projectsRepositories.deleteProjectUsers(id);
}






export const projectServices = { getProjects , createProject , updateProject,deleteProject , getProjectUsers, postProjectUsers, deleteProjectUsers };