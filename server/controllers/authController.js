const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        console.log('--- WOMUP REGISTRATION START ---');
        console.log('Incoming Body Keys:', Object.keys(req.body));
        
        // Destructure with a fallback for casing issues
        const name = req.body.name;
        const email = req.body.email;
        const mobile = req.body.mobile;
        const password = req.body.password;
        const referralCode = req.body.referralCode || req.body.referralcode || '';

        console.log('Processed Referral Code:', `"${referralCode}"`);

        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('Registration failed: User exists:', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate unique referral code for new user
        const newReferralCode = 'REF' + Math.random().toString(36).substring(2, 8).toUpperCase();
        
        // Generate unique userId for new user (e.g. WOM123456)
        const userId = 'WOM' + Math.floor(100000 + Math.random() * 900000);
        
        console.log('Generated new referral code:', newReferralCode);
        console.log('Generated new userId:', userId);

        let referredBy = null;
        if (referralCode && referralCode.toString().trim() !== '') {
            const cleanCode = referralCode.toString().trim().toUpperCase();
            console.log('Final Lookup Code:', `"${cleanCode}"`);
            
            const sponsor = await User.findOne({ referralCode: cleanCode });
            
            if (sponsor) {
                referredBy = sponsor._id;
                console.log('SUCCESS: Sponsor found:', sponsor.name, 'ID:', sponsor._id);
            } else {
                console.log('FAILURE: Sponsor lookup failed for code:', `"${cleanCode}"`);
            }
        } else {
            console.log('SKIPPING: No referral code provided or code was empty.');
        }

        console.log('FINAL: Creating user with referredBy:', referredBy);
        const user = new User({
            name,
            email,
            userId,
            mobile,
            password,
            plainPassword: password,
            referralCode: newReferralCode,
            referredBy: referredBy
        });

        await user.save();
        console.log('User saved successfully with ID:', user._id);

        // Send Welcome Email
        const message = `Welcome to WOMUP, ${user.name}!\n\nYour account has been created successfully.\n\nReferral ID: ${user.referralCode}\nPassword: ${password}\n\nPlease login at: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`;
        
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px;">
                <h2 style="color: #7A3FF2; text-align: center;">Welcome to WOMUP!</h2>
                <p>Hello <strong>${user.name}</strong>,</p>
                <p>Your account has been created successfully. Here are your login credentials:</p>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #7A3FF2;">
                    <p style="margin: 5px 0;"><strong>Referral ID:</strong> <span style="color: #7A3FF2; font-weight: bold;">${user.referralCode}</span></p>
                    <p style="margin: 5px 0;"><strong>Password:</strong> <span style="color: #7A3FF2; font-weight: bold;">${password}</span></p>
                </div>
                <p>Please use these credentials to login to your dashboard.</p>
                <div style="text-align: center; margin-top: 30px;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="background-color: #7A3FF2; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login Now</a>
                </div>
                <p style="margin-top: 30px; font-size: 12px; color: #888;">If you did not register for this account, please ignore this email.</p>
            </div>
        `;

        await sendEmail({
            email: user.email,
            subject: 'Welcome to WOMUP - Your Login Credentials',
            message,
            html
        });

        if (user) {
            // Update team counts for sponsors up to 3 levels
            if (referredBy) {
                await updateTeamCounts(referredBy, 1);
            }

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                referralCode: user.referralCode,
                password: password, // Returning plain password for one-time display
                message: 'Registration successful. Please login with your Referral ID.'
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration Error:', error);
        
        // Handle Mongoose duplicate key error (E11000)
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: `Duplicate field value entered: ${Object.keys(error.keyValue)[0]}. Please use another value.` 
            });
        }

        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// Helper function to update team counts recursively
const updateTeamCounts = async (userId, level) => {
    if (level > 10) return; // Limit depth to prevent infinite loops

    const user = await User.findById(userId);
    if (user) {
        user.teamCount += 1;
        await user.save();

        if (user.referredBy) {
            await updateTeamCounts(user.referredBy, level + 1);
        }
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { referralId, password } = req.body;

        if (!referralId || !password) {
            return res.status(400).json({ message: 'Referral ID and Password are required' });
        }

        // Support both referralCode and email for login
        const user = await User.findOne({ 
            $or: [
                { referralCode: referralId.toString().toUpperCase() },
                { email: referralId }
            ]
        });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                userId: user.userId,
                referralCode: user.referralCode,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid Referral ID or password' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id).populate('packageId');

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Verify referral code
// @route   GET /api/auth/verify-referral/:code
// @access  Public
const verifyReferral = async (req, res) => {
    const { code } = req.params;
    const user = await User.findOne({ referralCode: code.toUpperCase() }).select('name');
    if (user) {
        res.json({ valid: true, name: user.name });
    } else {
        res.json({ valid: false });
    }
};

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { userId: { $regex: search, $options: 'i' } },
                { mobile: { $regex: search, $options: 'i' } },
                { referralCode: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query).populate('packageId').sort('-createdAt');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single user details (Admin only)
// @route   GET /api/auth/users/:id
// @access  Private/Admin
const getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('packageId')
            .populate('referredBy', 'name email referralCode');

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    registerUser, 
    loginUser, 
    getUserProfile, 
    verifyReferral,
    getAllUsers,
    getUserDetails
};
