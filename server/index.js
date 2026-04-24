const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const path = require('path');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS with dynamic origin support
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.CLIENT_URL,
    'https://womup-backend.vercel.app',
    'https://womup-frontend.vercel.app'
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        
        const isAllowed = allowedOrigins.some(o => origin.startsWith(o)) || origin.endsWith('.vercel.app');
        
        if (isAllowed) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Serve Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => {
    res.send('WOMUP API is running...');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/packages', require('./routes/packageRoutes'));

// Define other routes
const dashboardRoutes = express.Router();
dashboardRoutes.get('/', require('./middleware/authMiddleware').protect, require('./controllers/dashboardController').getDashboardSummary);
app.use('/api/dashboard', dashboardRoutes);

const referralRoutes = express.Router();
referralRoutes.get('/team/:level', require('./middleware/authMiddleware').protect, require('./controllers/referralController').getTeamByLevel);
app.use('/api/referral', referralRoutes);

const incomeRoutes = express.Router();
incomeRoutes.get('/:type', require('./middleware/authMiddleware').protect, require('./controllers/incomeController').getIncomeLogs);
app.use('/api/income', incomeRoutes);

const roiRoutes = express.Router();
roiRoutes.post('/distribute', require('./middleware/authMiddleware').protect, require('./middleware/authMiddleware').admin, require('./controllers/roiController').distributeMonthlyROI);
app.use('/api/roi', roiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
