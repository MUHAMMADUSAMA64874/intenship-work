// controllers/jobController.js
const Job = require('../models/Job');
const Application = require('../models/Application');

exports.listJobs = async (req, res) => {
  const { title, location, category } = req.query;
  const query = {};
  if (title) query.title = { $regex: title, $options: 'i' };
  if (location) query.location = location;
  if (category) query.category = category;
  const jobs = await Job.find(query).populate('companyId');
  res.render('job/list', { jobs });
};

exports.viewJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('companyId');
    if (!job) {
      req.flash('error_msg', 'Job not found');
      return res.redirect('/jobs');
    }
    res.render('job/detail', { job });
  } catch (err) {
    req.flash('error_msg', 'Error loading job details');
    res.redirect('/jobs');
  }
};

exports.applyForJob = async (req, res) => {
  try {
    if (!req.session.user) {
      req.flash('error_msg', 'You must be logged in to apply for a job');
      return res.redirect('/users/login');
    }

    const jobId = req.params.id;
    const application = new Application({ jobId, userId: req.session.user._id });
    await application.save();
    req.flash('success_msg', 'Application submitted successfully');
    res.redirect('/jobs/' + jobId);
  } catch (err) {
    req.flash('error_msg', 'Error applying for job');
    res.redirect('/jobs/' + jobId);
  }
};
