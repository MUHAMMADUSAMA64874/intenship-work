// app.js
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const dotenv = require('dotenv');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const companyRoutes = require('./routes/companyRoutes');
const jobRoutes = require('./routes/jobRoutes');
const Company = require('./models/Company');
const Job = require('./models/Job');

dotenv.config();

const app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false, // Ensure sessions are only created when needed
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.user = req.session.user || null;  // Ensure user is available in all views
  next();
});

// Routes
app.use('/users', userRoutes);
app.use('/companies', companyRoutes);
app.use('/jobs', jobRoutes);

// Homepage
app.get('/', async (req, res) => {
  try {
    const featuredJobs = await Job.find({}).limit(5).populate('companyId').exec();
    const featuredCompanies = await Company.find({}).limit(5).exec();
    res.render('index', { featuredJobs, featuredCompanies });
  } catch (err) {
    console.error(err);
    res.render('index', { featuredJobs: [], featuredCompanies: [] });
  }
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Middleware for sessions
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Middleware for flash messages
app.use(flash());

// Middleware to set flash messages in locals
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});