import "dotenv/config";
import { projectsRepositories } from "repositories/projects-repositories";



async function getProjects(page=1, limit=10) {
    const projects = await projectsRepositories.getProjects(page, limit);
    return projects;
}






export const projectServices = { getProjects};