const express = require('express');
const cors = require('cors');
const router = require('./router');
const connectToDatabase = require('./db');

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:4200',
  credentials: true,
  exposedHeaders: 'Authorization',
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).send({ error: '500', message: 'Database connection failed' });
  }
});

app.use('/api', router);

module.exports = app;
