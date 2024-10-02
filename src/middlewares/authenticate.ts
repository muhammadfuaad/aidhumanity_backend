import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import {verify} from 'jsonwebtoken';
// import { jwtSecret } from {config};
import {config} from '../config/config'

export interface AuthRequest extends Request{
  userId: string
}

const authenticate = (request: Request, response: Response, next: NextFunction) => {
  const token = request.header('Authorization')
  if (!token) {
    return next(createHttpError(401, 'Authorization Token is required'))
  }
  try {
    const parsedToken = token.split(' ')[1]

    const decoded = verify(parsedToken, config.jwtSecret as string)
    console.log('decoded:', decoded);
    const _request = request as AuthRequest
    _request.userId = decoded.sub as string
    next()
  } catch (error) {
    console.log('authenticate error:', error);
    return createHttpError(401, 'Error')
  }
}

export default authenticate