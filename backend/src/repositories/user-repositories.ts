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


async function createSession(id: number) {
    const session = await prisma.session.findFirst({
        where: {
            userId: id
        }
    })
    if(session){
        await prisma.session.delete({
            where: {
                id: session.id
            } 
        })
    }
    return await prisma.session.create({
            data: {
                userId: id
            }
        })
}


export const userRepositories = {  createUser, findUserByEmail, createSession }