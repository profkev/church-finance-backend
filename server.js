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
const accountRoutes = require('./routes/accountRoutes');
const journalEntryRoutes = require('./routes/journalEntryRoutes');
const revenueSourceRoutes = require('./routes/revenueSourceRoutes');
const accountingRoutes = require('./routes/accountingRoutes');
const app = express();




const cors = require('cors');

app.use(cors({
    origin: ['http://localhost:3000', 'https://ackamune-fund-manager.vercel.app'],
    credentials: true,
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization'
}));




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
app.use('/api/accounts', accountRoutes);
app.use('/api/journal-entries', journalEntryRoutes);
app.use('/api/revenue-sources', revenueSourceRoutes);
app.use('/api/accounting', accountingRoutes);




// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
