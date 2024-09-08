import { Response } from "express";
import { customRequest } from "middlewares/jwt-verification";
import { projectServices } from "services/projects-services";
import { userServices } from "services/user-services";

async function getProjects(req: customRequest, res: Response) {
  await userServices.getAuthUser(req.token, req.id)
  req.query.page = req.query.page || '1';
  req.query.limit = req.query.limit || '10';
  const projects = await projectServices.getProjects(Number(req.query.page), Number(req.query.limit));
  res.status(200).json(projects);
}

async function createProject(req: customRequest, res: Response) {
  await userServices.getAuthUser(req.token, req.id)
  const project = await projectServices.createProject(req.body);
  res.status(201).json(project);
}



export const projectControllers = { getProjects, createProject };