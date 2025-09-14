// backend/src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const storesRoutes = require('./routes/stores');

const app = express();
app.use(cors()); // for demo allow all origins
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/stores', storesRoutes);

// quick health
app.get('/', (req, res) => res.send('Backend running'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
