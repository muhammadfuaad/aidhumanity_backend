import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
import productRouter from "./product/productRouter";
import appealRouter from "./appeal/appealRouter";
import cors from "cors";
import { googleAuth, googleAuthCallback } from "./user/socialSignUpController";
import passport from "passport"

const app = express();
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Set up CORS options
const corsOptions = {
  origin: ["http://localhost:3000"], // Array of allowed origins
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

// Apply CORS middleware with options
app.use(cors(corsOptions));
app.get('/auth/google', googleAuth)
app.get('/auth/google/callback', googleAuthCallback)

// Routes
app.use("/api/user", userRouter);
app.use("/api/products", productRouter);
app.use("/api/appeals", appealRouter);


// Global error handler
app.use(globalErrorHandler);

export default app;
