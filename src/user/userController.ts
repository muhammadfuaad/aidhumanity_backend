import { NextFunction, Request, Response } from "express"
import createHttpError from "http-errors"
import userModel from "./userModel"
import bcrypt from 'bcrypt'
import { sign } from "jsonwebtoken"
import { config } from "../config/config"
import { User } from "./userTypes"

export const createUser = async (request: Request, response: Response, next: NextFunction)=>{
  // response.json({message: 'User registered successfully'})
  const {name, email, password} = request.body
  // console.log('name:', name);

  if (!name || !email || !password) {
    const error = createHttpError(400, 'All fields are required')
    return next(error)
  }

  try {
    const user = await userModel.findOne({email})
    if (user) {
      return next(createHttpError(400, 'User already exists with this email address'))
      // console.log('user:', user);
      // return next(error)
    }
  } catch (error) {
    console.log('error:', error);
    return next(createHttpError(500, 'Error while getting user'))
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  console.log('hashedPassword:', hashedPassword);
  let newUser: User
  try {
      newUser = await userModel.create({
      name, email, password: hashedPassword
    })

    return response.status(200).json({
      message: "Registered Successfully",
      data: newUser
    })
  } catch (error) {
    console.log('error:', error);
    return next(createHttpError(500, 'Error while generating user'))
  }

  // response.json({id: newUser._id})
}

export const loginUser = async (request: Request, response: Response, next: NextFunction)=>{
  // response.json({message: 'User registered successfully'})
  const {email, password} = request.body
  console.log('password:', password);

  if (!email || !password) {
    const error = createHttpError(400, 'All fields are required')
    return next(error)
  }
  let user
  try {
    user = await userModel.findOne({email})
    if (!user) {
      const error = createHttpError(404, 'User not found')
      return next(error)
    }
  } catch (error) {
    console.log('error:', error);
    return next(createHttpError(500, 'Error while getting user'))
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    const error = createHttpError(400, "Password is incorrect");
    return next(error);
  } 

  try {
    const token = sign({ sub: user._id }, config.jwtSecret as string, {
      expiresIn: "7d",
      algorithm: "HS256",
    });
    return response.status(200).json({ 
      message: "Welcome Back",
      accessToken: token 
    });
  } catch (error) {
    console.log("token generation error:", error);
    return next(createHttpError(500, "Token generation failed"));
  }
}