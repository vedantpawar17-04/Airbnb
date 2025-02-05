//Basic Setup
const express=require('express');
const app=express();

//Dotenv Setup
if(process.env.NODE_ENV!=='production'){
require('dotenv').config();
}

//Method Override Setup
const methodOverride=require('method-override');
app.use(methodOverride('_method'));

//ejs-mate Setup
const ejsMate=require('ejs-mate');
app.engine('ejs',ejsMate);

//Extract The URL Data
app.use(express.urlencoded({ extended:true }));

//ExpressError 
const ExpressError=require('./Utils/ExpressError.js');

//Express-Session Required
const session = require('express-session');
const MongoStore= require("connect-mongo");

//Implementing A Flash
const flash=require('connect-flash');

//Passport Implementation
const passport = require('passport');
const LocalStrategy=require('passport-local');

//Requiring User Model
const User=require('./models/user.js');

//Require The Route
//For Listing
const listingRouter=require('./routes/listing.js');
//For Reviews
const reviewRouter=require('./routes/review.js');
//For Signup
const userRouter=require('./routes/user.js');

//ejs setup
const path=require('path');
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

//Server Setup
app.listen(3030,()=>{
    console.log(`Connect To The Server Is http://localhost:3030/listings`);
});

//mongoose Setup
const mongoose=require('mongoose');
const MONGO_URL=process.env.ATLASDB_URL;
async function main(){
    await mongoose.connect(MONGO_URL);
}
main().then(()=>{
    console.log('Connecting To MongoDB');
}).catch((err)=>{
    console.error('Error Connecting To MongoDB',err);
})

//Serving A Static File
app.use(express.static(path.join(__dirname,'/public')));

const store = MongoStore.create({
mongoUrl : MONGO_URL,
crypto:{
    secret:process.env.SECRET,
},
touchAfter:24*3600,
});

const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expire:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true, 
    }
};

app.use(session(sessionOptions));
app.use(flash());

//Passport Setup
app.use(passport.initialize());
//A Web Application Needs The Ability To Identify Users As They Browse From Page To Page.
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
//Generates a function that is used by Passport to serialize(Store User Data)users into the session.
passport.serializeUser(User.serializeUser());
// Generates a function that is used by Passport to deserialize(Remove User Data)users into the session.
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success=req.flash('success'); 
    res.locals.error = req.flash('error');
    res.locals.currUser=req.user;
    next();
})

//Routes
//listing Related
app.use('/listings',listingRouter);
//Reviews Related
app.use('/listings/:id/reviews',reviewRouter);
//Signup Related
app.use('/',userRouter);
app.all('*',(req,res,next)=>{
    next(new ExpressError(404,'Page Not Found!'));
});

//Middleware
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something Want Wrong!"}=err;
    //res.status(statusCode).send(message);
    res.status(statusCode).render('listings/error.ejs',{message});
});