if(process.env.NODE_ENV !="production"){
    require('dotenv').config();

}
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoStore=require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const path = require('path');
const ExpressError = require('./utils/ExpressError.js');
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const MongoStore = require('connect-mongo');



// Set up EJS as the template engine
app.engine("ejs", ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(cookieParser());
// Connect to MongoDB
const dbUrl = process.env.ATLASDB_URL;
//const dbUrl="mongodb://127.0.0.1:27017/wanderLust";



async function main() {
    try {
        await mongoose.connect(dbUrl,{
            
           
           
           
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

main();
const store=MongoStore.create({
   mongoUrl:dbUrl,
   crypto:
   {
    secret:"mysupersecretstring",
   },
   touchAfter:24*3600,
});
store.on("error",(err)=>
{
    console.log("error in mongo session",err);
});

app.use(session({
    store,
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to pass flash messages to templates
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
     res.locals.currUser=req.user;
     res.locals.mapToken = process.env.MAP_TOKEN;
   
    next();
});











// Routes



app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);

// Catch-all for non-existent routes
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

// Global error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err });
});

// Start the server
app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
