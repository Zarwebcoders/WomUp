const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
const Income = require('./models/Income');
const User = require('./models/User');

// Run every day at 8:00 AM IST to reveal hidden incomes
cron.schedule('0 8 * * *', async () => {
    try {
        console.log('Running 8 AM IST cron job to reveal hidden incomes...');
        const hiddenIncomes = await Income.find({ showToUser: false });
        if (hiddenIncomes.length === 0) return;

        for (const income of hiddenIncomes) {
            const user = await User.findById(income.userId);
            if (user) {
                income.showToUser = true;
                user.totalIncome += income.amount;
                if (income.incomeType === 'referral') user.referralIncome += income.amount;
                if (income.incomeType === 'level') user.levelIncome += income.amount;
                if (income.incomeType === 'roi') user.roiIncome += income.amount;
                
                await income.save();
                await user.save();
            }
        }
        console.log(`Successfully revealed ${hiddenIncomes.length} incomes.`);
    } catch (err) {
        console.error('Error revealing incomes in cron:', err);
    }
}, {
    timezone: "Asia/Kolkata"
});

// Ensure upload directories exist (Only locally, skip on Vercel to avoid crashes)
if (process.env.NODE_ENV !== 'production') {
    try {
        const uploadDir = path.join(__dirname, 'uploads/slips');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
    } catch (err) {
        console.log('Upload directory creation skipped or failed:', err.message);
    }
}

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Enable CORS - Place at the very top
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());

// Serve Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Serve static from public root if needed for Vercel
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.send('WOMUP API is running...');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/packages', require('./routes/packageRoutes'));
app.use('/api/kyc', require('./routes/kycRoutes'));

// Define other routes
const dashboardRoutes = express.Router();
dashboardRoutes.get('/', require('./middleware/authMiddleware').protect, require('./controllers/dashboardController').getDashboardSummary);
app.use('/api/dashboard', dashboardRoutes);

const referralRoutes = express.Router();
referralRoutes.get('/team/:level', require('./middleware/authMiddleware').protect, require('./controllers/referralController').getTeamByLevel);
app.use('/api/referral', referralRoutes);

const incomeRoutes = express.Router();
incomeRoutes.get('/admin/all', require('./middleware/authMiddleware').protect, require('./middleware/authMiddleware').admin, require('./controllers/incomeController').getAllIncomeLogs);
incomeRoutes.patch('/admin/toggle-visibility/:id', require('./middleware/authMiddleware').protect, require('./middleware/authMiddleware').admin, require('./controllers/incomeController').toggleIncomeVisibility);
incomeRoutes.get('/:type', require('./middleware/authMiddleware').protect, require('./controllers/incomeController').getIncomeLogs);
app.use('/api/income', incomeRoutes);

const roiRoutes = express.Router();
// Allow GET for Vercel Cron, and remove auth for this specific endpoint (will check inside controller)
roiRoutes.get('/distribute', require('./controllers/roiController').distributeMonthlyROI);
roiRoutes.post('/distribute', require('./controllers/roiController').distributeMonthlyROI);
roiRoutes.post('/set-custom-roi', require('./middleware/authMiddleware').protect, require('./middleware/authMiddleware').admin, require('./controllers/roiController').setCustomROI);
app.use('/api/roi', roiRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.status(500).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
