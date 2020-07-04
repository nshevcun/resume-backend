import express from 'express';

const router = express.Router();

// Greeting route - connection test

router.get('/', (req, res) => res.send({message: "Congratulations! Connection established successfully."}));

export default router;
