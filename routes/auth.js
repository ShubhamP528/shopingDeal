const express=require('express');
const router=express.Router();
const User=require('../model/user');
const passport = require('passport');


// router.get('/fakeuser', async(req,res)=>{
//     const user=new User({email:"shubham@gamil.com", username:"Shubham"});
//     const newUser=await User.register(user,"Shubham@123");
//     res.send(newUser);
// })


// registeration form
router.get('/register',async(req,res)=>{
    res.render('auth/signup');
})


// registeration
router.post('/register',async(req,res)=>{
    try
    {
        console.log(req.body);
        const user=new User({email:req.body.email, userType:req.body.userType, username:req.body.username});
        await User.register(user,req.body.password);
        req.flash('success','Registered Successfully login and start' );
        passport.authenticate('local',{
            failureRedirect:'/register',
            failureFlash:true,
        });
        res.redirect('/login'); 
    }
    catch(e)
    {
        req.flash('error',`${e.message}`);
        res.redirect('/register');
    }
    
})


// login form
router.get('/login',async(req,res)=>{
    res.render('auth/login');
})


// logined
router.post('/login', passport.authenticate('local',{
    failureRedirect:'/login',
    failureFlash:true
}),async(req,res)=>{
    try
    {
        console.log(await User.find({username:"shubham"}));
        req.flash('success',`Welcome Back!! ${req.user.username}`);
        res.redirect('/product');
    
    }
    catch(e)
    {
        req.flash('error',`${e.message}`)
        res.redirect('/login')
    }
})


router.get('/logout',(req,res)=>{
    try
    {
        req.logOut(()=>{
            req.flash('success','logged out successfully');
            res.redirect('/login');
        });
        
        
    }
    catch(e)
    {
        req.flash('error',`${e.message}`)
        res.redirect('/error')
    }
    
})





module.exports=router;
