// routes/companyRoutes.js
const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');

router.get('/dashboard', companyController.showDashboard);
router.post('/profile', companyController.updateProfile);
router.post('/post', companyController.postJob);

module.exports = router;
