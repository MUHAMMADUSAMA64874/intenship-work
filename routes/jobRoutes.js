const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

router.get('/', jobController.listJobs);
router.get('/:id', jobController.viewJob);
router.post('/apply/:id', jobController.applyForJob);

module.exports = router;
