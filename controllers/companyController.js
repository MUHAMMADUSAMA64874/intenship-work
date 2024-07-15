// controllers/companyController.js
const Company = require('../models/Company');
const Job = require('../models/Job');

exports.showDashboard = async (req, res) => {
  const company = await Company.findById(req.session.user._id);
  res.render('company/dashboard', { company });
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, description, logo } = req.body;
    await Company.findByIdAndUpdate(req.session.user._id, { name, description, logo });
    req.flash('success_msg', 'Profile updated successfully');
    res.redirect('/companies/dashboard');
  } catch (err) {
    req.flash('error_msg', 'Error updating profile');
    res.redirect('/companies/dashboard');
  }
};

exports.postJob = async (req, res) => {
  try {
    const { title, description, requirements, location, category } = req.body;
    const job = new Job({ title, description, requirements, location, category, companyId: req.session.user._id });
    await job.save();
    req.flash('success_msg', 'Job posted successfully');
    res.redirect('/companies/dashboard');
  } catch (err) {
    req.flash('error_msg', 'Error posting job');
    res.redirect('/companies/dashboard');
  }
};
