import { projectControllers } from "controllers/projects-controller";
import { Router } from "express";
import { authUser } from "middlewares/jwt-verification";
import { validate } from "middlewares/schema-validation";
import { projectSchema } from "schemas/projects-schema";

const projectRouter = Router();

projectRouter
    .get("/api/projetos", authUser, projectControllers.getProjects)
    .post("/api/projetos",authUser, validate(projectSchema, "body"), projectControllers.createProject);

    




export default projectRouter;