const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const session = require('express-session')
const dotenv = require('dotenv')
const morgan = require('morgan')
const methodOverride = require('method-override')
const passport = require('passport')
const LocalStrategy = require('passport-local');
const User = require('./models/User');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const mongoSanitize = require('express-mongo-sanitize');
const MongoDBStore = require('connect-mongo')(session)
const connectDB = require('./config/db')
const userRoutes = require('./routes/users');
const homeRoutes = require('./routes/index');
const storyRoutes = require('./routes/stories');
 


// Load config
dotenv.config({path: './config/config.env'})

// Passport config
// require('./config/passport')(passport)

connectDB()
const dbURL = process.env.DB_URL || "mongodb://localhost:27017/Storybooks"

const app = express()

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Method override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}
// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars Helpers
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs')

// Handlebars
app.engine('.hbs', 
exphbs({
    helpers: { 
        formatDate, 
        stripTags, 
        truncate, 
        editIcon,
        select, 
    },
    defaultLayout: 'main', 
    extname: '.hbs',
    })
    )

app.set('view engine', '.hbs');

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';
const store = new MongoDBStore({
  url: dbURL,
  secret,
  touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e)
})

// Sessions
const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      // secure: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
    },
  }
app.use(session(sessionConfig))
app.use(flash());


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})



// Routes
app.use('/', userRoutes);
app.use('/dashboard', homeRoutes);
app.use('/stories', storyRoutes);

app.get('/', (req, res) => {
  res.render('home')
});

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!'
  res.status(statusCode).render('error/404', { err })
  console.log(err)
})

const PORT = process.env.PORT || 3000

// Server PORT
app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))
