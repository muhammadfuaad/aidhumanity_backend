import { HttpError } from "http-errors";
import { NextFunction, Request, Response } from 'express';
import { config } from "../config/config";


const globalErrorHandler = (error: HttpError, request: Request, response: Response, next: NextFunction)=>{
  const statusCode = error.statusCode || 500
  return response.status(statusCode).json({
    message: error.message,
    errorStack: config.env === 'development' ? error.stack : ''
  })
}

export default globalErrorHandler;