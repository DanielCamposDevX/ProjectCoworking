import { ErrorType } from "middlewares/error-handling";

function unprocEntity(resource: string | string[]):ErrorType {
   return {
       type: "unprocessableEntity",
       message: `${resource ? resource : "ERROR 422"}`
    }
}

function conflict(resource: string | string[]): ErrorType {
  return {
    type: "conflict",
    message: `${resource ? resource : "ERROR 409"}`
 }
}

function notFound(resource: string | string[]): ErrorType {
   return {
     type: "conflict",
     message: `${resource ? resource : "ERROR 404"}`
  }
 }




export const errors = { unprocEntity, conflict, notFound };