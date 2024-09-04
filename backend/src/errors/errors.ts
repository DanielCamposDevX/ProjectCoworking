import { ErrorType } from "middlewares/error-handling";

function unprocEntity(resource: string | string[]):ErrorType {
   return {
       type: "unprocessableEntity",
       message: `${resource ? resource : "ERROR 400"}`
    }
}

function conflict(resource: string | string[]): ErrorType {
  return {
    type: "conflict",
    message: `${resource ? resource : "ERROR 400"}`
 }
}




export const errors = { unprocEntity, conflict };