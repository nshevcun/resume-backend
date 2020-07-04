import express from 'express';
import * as argon2 from 'argon2';
import * as jwtGen from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import dataWriter from './dataWriter.js';

dotenv.config();

const router = express.Router();

// Constants below to be used for JWT creation

const SECRET = process.env.SECRET;
const EXP = process.env.JWTEXPIRY;

// Authentication Validation Middleware

const authValidation = (req, res, next) => {
  let keys = Object.keys(req.body);
  if (keys.length > 2) {
    return res.status(400).send({message: "Invalid Request! No Cookie For You!"});
  }
  next()
}

// *** ROUTE 1 - AUTHENTICATING A USER ***

router.post('/login', authValidation, async (req, res, next) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const allUsers = await dataWriter.getAllUsers();
    const existingUser = allUsers.find(user => user.name === username);

    if (existingUser != undefined && password != null && username === existingUser.name && await argon2.verify(existingUser.password, password)) {
     const token = jwtGen.sign({username}, SECRET, {expiresIn: EXP});
     return res.status(200).send({token});
    }
    return res.status(401).send({message: "incorrect credentials provided"});
  }
  catch (err) {
    console.error(err);
    return next(err)
  }
});

export default router;
