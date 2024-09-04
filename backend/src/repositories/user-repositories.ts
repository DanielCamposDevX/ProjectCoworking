import { prisma } from "../config/database"
import { createUserData } from "../types/user-types"

async function findUserByEmail(email: string) {
    return await prisma.usuario.findFirst({
        where: {
            email
        }
    })
}

async function createUser(userData: createUserData) {
    return await prisma.usuario.create({
        data: userData
    })
}


export const userRepositories = {  createUser, findUserByEmail }