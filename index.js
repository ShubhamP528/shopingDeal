const express = require("express");
const app = express();
const mongoose=require('mongoose');
// const Product=require('./model/product');
// const seedDB=require('./seed');
const path=require('path');
const methodOverride=require('method-override');
// const cookieParser=require('cookie-parser');
const session=require('express-session');
const flash=require('connect-flash');
const localStrategy=require('passport-local');
const passport=require('passport');
const User=require('./model/user');


// Routes
const productRoute=require('./routes/product');
const authRouter=require('./routes/auth');
const cartRouter=require('./routes/cart');


if(process.env.NODE_ENV!=='production'){
  require('dotenv').config();
}


mongoose.connect(process.env.DB_URL)
.then(()=>{
  console.log("DB connected");
})
.catch((err)=>{
  console.log("Connection ERROR!!");
  console.log(err.message);
})


app.set('view engine','ejs');
app.set('views',path.join(__dirname,"views"));



app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'thisisnotagoodguy',
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true }
}));
// app.use(cookieParser());
app.use(flash());

// initializing the passport
app.use(passport.initialize());
app.use(passport.session());


// configuring the passport to use local strategy!!
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash('success');
  res.locals.error=req.flash('error');
  res.locals.currUser=req.user;
  next();
})


app.use(express.static('public'));
app.get('/',(req,res)=>{
  res.render('products/start');
})

app.get('/error',(req,res)=>{
  res.render('error');
})

app.use(productRoute);
app.use(authRouter);
app.use(cartRouter);



// seedDB();

app.listen(3000, () => {
  console.log("server running at port 3000");
});
