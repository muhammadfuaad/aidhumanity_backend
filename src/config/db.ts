import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
  try {
    mongoose.connection.once('open', () => {
      console.log('Mongoose running successfully');
    })

    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected successfully');
    })

    mongoose.connection.on('error', (error) => {
      console.log('mongoose error:', error);
    })
    mongoose.connect(config.databaseUrl as string)
  } catch(error) {
    console.log('error:', error);
    process.exit(1)
  }
}

export default connectDB;