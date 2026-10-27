const Lead = require('../models/Lead');

// @desc    Create a new lead from landing page
// @route   POST /api/leads
// @access  Public
exports.createLead = async (req, res) => {
    try {
        const { name, email, mobile, city, area, role, pincode, location, message, source } = req.body;

        // Validation
        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Name is required'
            });
        }

        const cleanedMobile = String(mobile || '').replace(/\D/g, '');
        if (!cleanedMobile || cleanedMobile.length < 10) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid 10-digit mobile number'
            });
        }

        // Computed location fallback if not explicitly provided
        const locFallback = (area && city) ? `${area.trim()}, ${city.trim()}` : (area || city || '');

        const newLead = await Lead.create({
            name: name.trim(),
            email: email ? String(email).trim().toLowerCase() : '',
            mobile: cleanedMobile,
            city: city ? String(city).trim() : '',
            area: area ? String(area).trim() : '',
            role: role || 'Join as Customer',
            pincode: pincode ? String(pincode).trim() : '',
            location: location ? String(location).trim() : locFallback,
            message: message ? String(message).trim() : '',
            source: source || 'womup_landing_page'
        });

        console.log(`[Lead Captured] New submission from ${newLead.name} (${newLead.mobile}, ${newLead.email}) - City: ${newLead.city}, Area: ${newLead.area}`);

        return res.status(201).json({
            success: true,
            message: 'Lead saved successfully',
            data: newLead
        });
    } catch (error) {
        console.error('Error creating lead:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
};

// @desc    Get all leads
// @route   GET /api/leads
// @access  Public / Admin
exports.getAllLeads = async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: leads.length,
            data: leads
        });
    } catch (error) {
        console.error('Error fetching leads:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
};

// @desc    Delete a lead by ID
// @route   DELETE /api/leads/:id
// @access  Admin
exports.deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findByIdAndDelete(req.params.id);
        if (!lead) {
            return res.status(404).json({
                success: false,
                message: 'Lead not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Lead removed successfully'
        });
    } catch (error) {
        console.error('Error deleting lead:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
};
