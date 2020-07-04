import express from 'express';
import jwtVerifier from '../lib/jwtVerifier.js';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
import dataWriter from './dataWriter.js';
import isEmail from 'validator/lib/isEmail';
dotenv.config();

const router = express.Router();

// Constants below to be used for JWT creation

const SECRET = process.env.SECRET;
const EXP = process.env.JWTEXPIRY;

// Post Validation Middleware

const postValidation = (req, res, next) => {
  const invalid = [];
  let keys = Object.keys(req.body);
  if (keys.length > 4) {
    return res.status(400).send({message: "Warning! Invalid request!"})
  }
  if (req.body.name == null) {
     invalid.push("name");
  }
  if (req.body.email == null || isEmail(req.body.email) != true) {
     invalid.push("email");
  }
  if (req.body.phoneNumber == null) {
     invalid.push("phone number");
  }
  if (req.body.content == null) {
     invalid.push("content");
  }
  if (invalid.length > 0) {
     return res.status(400).send({message: "validation error", invalid});
  }
  next()
}

// *** ROUTE 1 - POSTING AN ENTRY ***

router.post('/contact/entries', postValidation, async (req, res, next) => {
  try {
      req.body.id = uuidv4();
      await dataWriter.addPost(req.body);
      return res.status(201).send(req.body);
  }
  catch (err) {
    console.error(err);
    return next(err)
  }
});

// *** ROUTE 2 - RETRIEVING ENTRIES ***

router.get('/contact/entries', jwtVerifier, async (req, res, next) => {
  try {
    return res.status(200).send(await dataWriter.getAllPosts());
  }
  catch (err) {
    console.error(err);
    return next(err)
  }
});

// *** ROUTE 3 - GET AN ENTRY BY ITS ID ***

router.get('/contact/entries/:id', jwtVerifier, async (req, res, next) => {
  try {
    const allPosts = await dataWriter.getAllPosts();
    const requestedPost = allPosts.find(post => post.id === req.params.id);
    if (requestedPost != null && requestedPost != undefined) {
      return res.status(200).send(requestedPost);
    }
    return res.status(404).send({message: `entry ${req.params.id} not found`});
  }
  catch (err) {
    console.error(err);
    return next(err)
  }
});

export default router;

