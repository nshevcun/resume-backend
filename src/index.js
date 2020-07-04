import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import userRoutes from './userRoutes.js';
import authRoutes from './authRoutes.js';
import entryRoutes from './entryRoutes.js';
import testRoutes from './testRoutes.js';


import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security installations
app.use(cors());
app.use(helmet());
app.disable('x-powered-by');

app.use(express.json());

// All the routes

app.use(userRoutes);
app.use(authRoutes);
app.use(entryRoutes);
app.use(testRoutes);

// The 404 Not Found error handler - in case a requested route is not found
app.use((req, res, next) => res.status(404).send({message: "not found"}));

// The global error handler - to avoid a "neverending request" in case all else fails
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  if (process.env.ENVIRONMENT == 'production'){
    console.log(err.stack);
    return res.status(500).send({message: "Whoops! Something went wrong :("});
  }
  return res.status(500).send({error});
});

app.listen(PORT, () => console.log(`Natalia's Contact Form API started on Port ${PORT}! See you there :)`));
