import app from './src/app';
import {config} from "./src/config/config";
import connectDB from './src/config/db';

const startServer = async () => {
  try {
    const port = config.port;
    await connectDB();

    app.listen(port, () => {
      console.log(`Server is running at port ${port}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
}

startServer()