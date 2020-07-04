import express from 'express';
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
import dataWriter from './dataWriter.js';
import isEmail from 'validator/lib/isEmail';
dotenv.config();

const router = express.Router();

// SECRETS! Shhhhh.......
// Private functions for hiding the password

const privatizer = (request) => {
  Object.defineProperty(request, "password", {
     enumerable: false,
     writable: true
  });
}

const hashing = async (request) => {
  const hash = await argon2.hash(request.password);
  request.password = hash;
}

// Constants below to be used for JWT creation

const SECRET = process.env.SECRET;
const EXP = process.env.JWTEXPIRY;

// User Validation Middleware

const userValidation = (req, res, next) => {
  const invalid = [];
  let keys = Object.keys(req.body);
  if (keys.length > 3) {
    return res.status(400).send({message: "Warning! Invalid request!"})
  }
  if (req.body.name == null) {
     invalid.push("name");
  }
  if (req.body.password == null || req.body.password.length < 8) {
     invalid.push("password too short");
  }
  if (req.body.email == null || isEmail(req.body.email) != true) {
     invalid.push("email");
  }
  if (invalid.length > 0) {
     return res.status(400).send({message: "validation error", invalid});
  }
  next()
}

// *** ROUTE 1 - ADDING A NEW USER ***

router.post('/users', userValidation, async (req, res, next) => {
  try{
      console.log("Hello");
      req.body.id = uuidv4();
      await hashing(req.body);
      await dataWriter.addUser(req.body);

      let privateReturn = req.body;
      privatizer(privateReturn);
      return res.status(201).send(privateReturn);
  }
  catch (err) {
    console.error(err);
    return next(err)
  }
});

export default router;
