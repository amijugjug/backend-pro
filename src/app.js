import express from "express";
import cookieParser from "cookie-parser";

import cors from 'cors'
import { DATA_REQUEST_SIZE_LIMIT } from "./constants";

const app = express();

/*
These middleware functions are essential for handling incoming HTTP requests in a Node.js application built with Express. They enable the application to parse JSON and URL-encoded payloads, as well as serve static files to the client.
*/

app.use(express.json({ limit: DATA_REQUEST_SIZE_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: DATA_REQUEST_SIZE_LIMIT}));
app.use(express.static("public/static"));


// For setting CORS headers
app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true,
}));


// For setting cookies to the client or reading the cookies
app.use(cookieParser());

export default app;