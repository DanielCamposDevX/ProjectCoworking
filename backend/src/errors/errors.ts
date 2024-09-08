import { ErrorType } from "middlewares/error-handling";

function unprocEntity(resource: string | string[]):ErrorType {
   return {
       type: "unprocessableEntity",
       message: `${resource}`
    }
}

function conflict(resource: string | string[]): ErrorType {
  return {
    type: "conflict",
    message: `${resource}`
 }
}

function notFound(resource: string | string[]): ErrorType {
   return {
     type: "notfound",
     message: `${resource}`
  }
 }

 function unauthorized(resource: string | string[]): ErrorType {
   return {
     type: "unauthorized",
     message: `${resource}`
  }
 }






export const errors = { unprocEntity, conflict, notFound,unauthorized };