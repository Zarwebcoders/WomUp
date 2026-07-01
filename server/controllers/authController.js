const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const cache = require('../utils/dashboardCache');

// Cache TTL for profile responses — profile data changes rarely
const PROFILE_CACHE_TTL = 5 * 60; // 5 minutes

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

        // Generate unique userId based on role
        let userId;
        let isUnique = false;
        const role = req.body.role === 'distributer' ? 'distributer' : 'user';

        while (!isUnique) {
            if (role === 'distributer') {
                userId = 'DSB' + Math.floor(1000 + Math.random() * 9000);
            } else {
                userId = 'WOM' + Math.floor(100000 + Math.random() * 900000);
            }
            const existing = await User.findOne({ userId });
            if (!existing) {
                isUnique = true;
            }
        }
        
        // Referral code is now the same as userId
        const newReferralCode = userId;
        
        console.log('User ID and Referral Code:', userId, 'Role:', role);

        let referredBy = null;
        if (referralCode && referralCode.toString().trim() !== '') {
            const cleanCode = referralCode.toString().trim().toUpperCase();
            console.log('Final Lookup Code:', `"${cleanCode}"`);
            
            const sponsor = await User.findOne({ referralCode: cleanCode });
            
            if (sponsor) {
                if (sponsor.role === 'user') {
                    console.log('Registration failed: Sponsor is an investor:', sponsor.name);
                    return res.status(400).json({ message: 'Investors cannot refer users. Please use a distributor referral code.' });
                }
                // Store the sponsor's referralCode (userId) as a string
                referredBy = sponsor.referralCode;
                console.log('SUCCESS: Sponsor found:', sponsor.name, 'Referral ID:', sponsor.referralCode);
            } else {
                console.log('FAILURE: Sponsor lookup failed for code:', `"${cleanCode}"`);
                return res.status(400).json({ message: 'Invalid referral code.' });
            }
        } else {
            console.log('SKIPPING: No referral code provided or code was empty.');
        }

        console.log('FINAL: Creating user with referredBy (string):', referredBy, 'Role:', role);
        const user = new User({
            name,
            email,
            userId,
            mobile,
            password,
            plainPassword: password,
            referralCode: newReferralCode,
            referredBy: referredBy,
            role: role
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
const updateTeamCounts = async (sponsorIdOrCode, level) => {
    if (level > 10) return; // Limit depth to prevent infinite loops

    // Search by referralCode or by _id (to support old data)
    const query = { $or: [{ referralCode: sponsorIdOrCode }] };
    if (require('mongoose').isValidObjectId(sponsorIdOrCode)) {
        query.$or.push({ _id: sponsorIdOrCode });
    }

    const user = await User.findOne(query);
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
        }).select('+password');

        if (user) {
            // (No expiry auto-deactivation — unactivated users are cleaned up by scheduled job)
        }

        if (user && (await user.matchPassword(password))) {
            if (user.role === 'distributer' && !user.isActive) {
                return res.status(403).json({ message: 'Distributor account is not active. Please wait for admin approval.' });
            }
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
        res.status(500).json({ 
            message: 'Internal Server Error',
            error: error.message 
        });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
// PERF: Uses a whitelist select (positive projection) to guarantee the kyc sub-document
// (including Base64 image strings up to 10MB) is NEVER returned.
// Negative projections like .select('-kyc.profilePhoto') are unreliable with Mongoose
// populate and can still return the parent kyc object.
// Cached for 5 minutes per user — profile data changes infrequently.
const getUserProfile = async (req, res) => {
    const cacheKey = `profile:${req.user._id}`;
    const cached = cache.get(cacheKey);
    if (cached) {
        console.log(`[profile] Cache HIT for ${cacheKey}`);
        return res.json(cached);
    }

    const user = await User.findById(req.user._id)
        .select(
            '_id name email mobile userId referralCode referredBy role isActive ' +
            'activatedAt expiresAt createdAt packageId ' +
            'totalIncome roiIncome referralIncome levelIncome teamCount monthlyRoiAmount '
            // kyc.* is intentionally NOT selected — images are served via /api/kyc/images
        )
        .populate('packageId', 'packageName price')
        .lean();

    if (user) {
        cache.set(cacheKey, user, PROFILE_CACHE_TTL);
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Verify referral code
// @route   GET /api/auth/verify-referral/:code
// @access  Public
const verifyReferral = async (req, res) => {
    try {
        const { code } = req.params;
        const user = await User.findOne({ referralCode: code.toUpperCase() }).select('name role');
        if (user) {
            if (user.role === 'user') {
                return res.json({ valid: false, message: 'Investors cannot refer users. Must be a distributor.' });
            }
            res.json({ valid: true, name: user.name });
        } else {
            res.json({ valid: false, message: 'Invalid referral code.' });
        }
    } catch (error) {
        console.error('Error verifying referral code:', error);
        res.status(500).json({ message: error.message });
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

        let users = await User.find(query)
            .select('-kyc -password -plainPassword')
            .populate('packageId')
            .sort('-createdAt')
            .lean();

        // Manually "populate" referredBy since it's a string now
        for (let user of users) {
            if (user.referredBy) {
                const sponsorQuery = { $or: [{ referralCode: user.referredBy }] };
                if (require('mongoose').isValidObjectId(user.referredBy)) {
                    sponsorQuery.$or.push({ _id: user.referredBy });
                }
                const sponsor = await User.findOne(sponsorQuery).select('name referralCode');
                user.referredBy = sponsor || { name: 'Root/System', referralCode: user.referredBy };
            } else {
                user.referredBy = { name: 'Root', referralCode: 'SYSTEM' };
            }
        }

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
        let user = await User.findById(req.params.id)
            .select('-kyc -password -plainPassword')
            .populate('packageId')
            .lean();

        if (user) {
            // Manually populate referredBy
            if (user.referredBy) {
                const sponsorQuery = { $or: [{ referralCode: user.referredBy }] };
                if (require('mongoose').isValidObjectId(user.referredBy)) {
                    sponsorQuery.$or.push({ _id: user.referredBy });
                }
                const sponsor = await User.findOne(sponsorQuery).select('name email referralCode userId');
                user.referredBy = sponsor || { name: 'Root/System', referralCode: user.referredBy };
            } else {
                user.referredBy = { name: 'Root', referralCode: 'SYSTEM' };
            }
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user active status (Admin only)
// @route   PUT /api/auth/users/:id/status
// @access  Private/Admin
const updateUserStatus = async (req, res) => {
    try {
        const { isActive } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isActive = isActive;
        if (isActive) {
            user.activatedAt = new Date();
        }

        await user.save();
        
        // Exclude KYC details and credentials from response payload
        const userResponse = user.toObject();
        delete userResponse.kyc;
        delete userResponse.password;
        delete userResponse.plainPassword;
        
        res.json({ message: `User status updated to ${isActive ? 'Active' : 'Inactive'}`, user: userResponse });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Impersonate user (Admin only)
// @route   POST /api/auth/users/:id/impersonate
// @access  Private/Admin
const impersonateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            userId: user.userId,
            referralCode: user.referralCode,
            role: user.role,
            token: generateToken(user._id)
        });
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
    getUserDetails,
    updateUserStatus,
    impersonateUser
};

