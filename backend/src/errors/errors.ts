import { ErrorType } from '../middlewares/error-handling.js';

function unprocEntity(resource: string | string[]): ErrorType {
   return {
      type: 'unprocessableEntity',
      message: `${resource}`,
   };
}

function conflict(resource: string | string[]): ErrorType {
   return {
      type: 'conflict',
      message: `${resource}`,
   };
}

function notFound(resource: string | string[]): ErrorType {
   return {
      type: 'notfound',
      message: `${resource}`,
   };
}

function unauthorized(resource: string | string[]): ErrorType {
   return {
      type: 'unauthorized',
      message: `${resource}`,
   };
}

function badRequest(resource: string | string[]): ErrorType {
   return {
      type: 'badRequest',
      message: `${resource}`,
   };
}

function internalServerError(resource: string | string[]): ErrorType {
   return {
      type: 'internalServerError',
      message: `${resource}`,
   };
}

export const errors = {
   unprocEntity,
   conflict,
   notFound,
   unauthorized,
   badRequest,
   internalServerError,
};
