const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const contactRoutes = require('./routes/contacts');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected ✌'))
  .catch((error) => console.error('MongoDB connection error:', error));

module.exports = app;
