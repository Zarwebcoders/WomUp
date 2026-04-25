const User = require('../models/User');
const generateToken = require('../utils/generateToken');

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
        const newReferralCode = 'WOM' + Math.random().toString(36).substring(2, 8).toUpperCase();
        console.log('Generated new code for user:', newReferralCode);

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
            mobile,
            password,
            plainPassword: password,
            referralCode: newReferralCode,
            referredBy: referredBy
        });

        await user.save();
        console.log('User saved successfully with ID:', user._id);

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
                token: generateToken(user._id)
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
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            referralCode: user.referralCode,
            role: user.role,
            token: generateToken(user._id)
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
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
