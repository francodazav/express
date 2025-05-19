import express, { json } from "express";
import { movieRouter } from "./routes/movies.js";
import { corsMiddleware } from "./middlewares/cors.js";

const app = express();
app.use(json());
app.disable("x-powered-by");

app.use(corsMiddleware());
app.use("/movies", movieRouter);

export default app;
