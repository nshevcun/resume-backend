import { promises as fs } from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

const userFile = path.resolve(process.env.USER_LIST_PATH);
const postFile = path.resolve(process.env.ENTRY_LIST_PATH);

// WRITING/READING USER DATABASE

const getAllUsers = async () => {
  try{
    let allUsers = await fs.readFile(userFile);
    return JSON.parse(allUsers);
  }
  catch (err) {
    console.error(err);
    throw(err);
  }
}

const writeToUsers = async (newUser) => {
  try {
    await fs.writeFile(userFile, JSON.stringify(newUser, null, 2)); // The null and the 2 are included for readability purposes
  }
  catch (err) {
    console.error(err);
    throw(err);
  }
}

const addUser = async (newUser) => {
  try{
    let allUsers = JSON.parse(JSON.stringify(await getAllUsers()));
    allUsers.push(newUser);
    writeToUsers(allUsers);
    console.log(`New User Added Successfully! Welcome, ${newUser.name}!`); // Testing connection :)
  }
  catch (err) {
    if (err && err.code === 'ENOENT') {
      writeToUsers([newUser]);
      return console.log(`New User Added Successfully! Welcome, ${newUser.name}!`);
    }
    console.error(err);
    throw(err);
  }
}

// WRITING/READING POST DATABASE
const getAllPosts = async () => {
  try{
    let allPosts = await fs.readFile(postFile);
    return JSON.parse(allPosts);
  }
  catch (err) {
    console.error(err);
    throw(err);
  }
}

const writeToPosts = async (newPost) => {
  try{
    await fs.writeFile(postFile, JSON.stringify(newPost, null, 2));
  }
  catch (err) {
    console.error(err);
    throw(err);
  }
}

const addPost = async (newPost) => {
  try{
    let allPosts = JSON.parse(JSON.stringify(await getAllPosts()));
    allPosts.push(newPost);
    writeToPosts(allPosts);
    console.log(`New Post Added. Thanks, ${newPost.name}!`)
  }
  catch (err) {
    if (err && err.code === 'ENOENT') {
      writeToPosts([newPost]);
      return console.log(`New Post Added. Thanks, ${newPost.name}!`);
    }
    console.error(err);
    throw(err);
  }
}

export default {
  getAllUsers,
  addUser,
  getAllPosts,
  addPost
}
