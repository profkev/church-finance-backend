require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const bodyParser = require('body-parser');
const incomeRoutes = require('./routes/incomeRoutes');
const expenditureRoutes = require('./routes/expenditureRoutes');
const reportRoutes = require('./routes/reportRoutes');
const balanceRoutes = require('./routes/balanceRoutes');
const voteheadRoutes = require('./routes/voteheadRoutes');
const auditRoutes = require('./routes/auditRoutes');





const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Database Connection
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/expenditures', expenditureRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/balance', balanceRoutes);
app.use('/api/voteheads', voteheadRoutes);

app.use('/api/audit', auditRoutes);




// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
