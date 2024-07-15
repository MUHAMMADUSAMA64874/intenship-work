// controllers/userController.js
const User = require('../models/User');

exports.showRegisterForm = (req, res) => {
  res.render('user/register');
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, type } = req.body;
    const user = new User({ name, email, password, type });
    await user.save();
    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/users/login');
  } catch (err) {
    req.flash('error_msg', 'Error registering user');
    res.redirect('/users/register');
  }
};

exports.showLoginForm = (req, res) => {
  res.render('user/login');
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.comparePassword(password)) {
      req.flash('error_msg', 'Incorrect email or password');
      return res.redirect('/users/login');
    }
    req.session.user = user;
    req.flash('success_msg', 'You are now logged in');
    res.redirect('/');
  } catch (err) {
    req.flash('error_msg', 'Error logging in user');
    res.redirect('/users/login');
  }
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.redirect('/');
      }
      res.clearCookie('connect.sid');
      req.flash('success_msg', 'You are logged out');
      res.redirect('/users/login');
    });
  };
  
