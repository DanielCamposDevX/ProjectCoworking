import { projectControllers } from "controllers/projects-controller";
import { Router } from "express";
import { authUser } from "middlewares/jwt-verification";

const projectRouter = Router();

projectRouter
    .get("/api/projetos", authUser, projectControllers.getProjects);
    




export default projectRouter;