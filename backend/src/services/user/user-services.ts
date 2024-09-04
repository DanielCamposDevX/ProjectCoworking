import bcrypt from 'bcrypt';
import { createUserData } from "types/user-types";

import { errors } from 'errors/errors';
import { userRepositories } from 'repositories/user-repositories';



async function createUser(userData: createUserData) {
    const exists = await userRepositories.findUserByEmail(userData.email)
    if (exists) { throw errors.conflict('Já existe um usuário com esse email cadastrado'); }
    const hashPass = bcrypt.hashSync(userData.senha, 10);
    userData = { ...userData, senha: hashPass }
    const create = await userRepositories.createUser(userData)
    return create;
}





export const userServices = { createUser };