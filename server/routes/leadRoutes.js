const express = require('express');
const router = express.Router();
const { createLead, getAllLeads, deleteLead } = require('../controllers/leadController');

// Lead collection routes
router.route('/')
    .post(createLead)
    .get(getAllLeads);

router.route('/:id')
    .delete(deleteLead);

module.exports = router;
