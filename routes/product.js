const express=require('express');
const router=express.Router();
const Product=require('../model/product');
const Review=require('../model/reviews');
const {isLoggedIn}=require('../middleware');
const { route } = require('./cart');


// Landing Page



// Products Page
router.get('/product',async(req,res)=>{
    const prod=await Product.find({});
    res.render('products/home',{prod});
})


// Show Page
router.get('/product/:id/show',async (req,res)=>{
    const {id}=req.params;
    const prod=await (await Product.findById(id)).populate('reviews');
    res.render('products/show',{prod});
 
})


// Add new Product
router.get('/product/new',isLoggedIn,(req,res)=>{
    // if(!req.isAuthenticated()){
    //     req.flash('error','please login to add new product');
    //     res.redirect('/error');
    // }
    res.render('products/new');
})

router.post('/product',async(req,res)=>{
    try
    {
        await Product.create({...req.body.product, owner:req.user.username});
        req.flash('success','Product Created SuccessFully');
        res.redirect('/product');
    }
    catch(e)
    {
        req.flash('error',e.message);
        res.redirect('/error');
    }
})


// Edit Product 
router.get('/product/:id/edit',isLoggedIn,async(req,res)=>{
    const {id}=req.params;
    const prod=await Product.findById(id);
    res.render('products/edit',{prod});
})

router.patch('/product/:id/show',async(req,res)=>{
    try
    {
        const {id}=req.params;
        const {product}=req.body;
        await Product.findByIdAndUpdate(id,product);
        req.flash('success','Product Edited SuccessFully')
        res.redirect(`/product/${id}/show`);
    }
    catch(e)
    {
        req.flash('error',e.message);
        res.redirect('/error');
    }

})


// Delete Product
router.delete('/product/:id/delete',isLoggedIn,async(req,res)=>{
    try
    {
        const {id}=req.params;
        await Product.findByIdAndDelete(id);
        req.flash('success','Product Deleted SuccessFully')
        res.redirect('/product');
    }
    catch(e)
    {
        rq.flash('error',e.message);
        res.redirect('/error');
    }

})


// Comment
router.post('/product/:id/show/comment',isLoggedIn,async(req,res)=>{
    try
    {
        const product=await Product.findById(req.params.id);
        const review=new Review({user:req.user.username, ...req.body});
    
        product.reviews.push(review);
    
        await product.save();
        await review.save();
    
        req.flash('success','SuccessFully Reviewed!!');
        res.redirect(`/product/${req.params.id}/show`);
    
    }
    catch(e)
    {
        req.flash('error',e.message);
        res.redirect('/error');
    }   
})


// Edit Comment

router.get('/product/:prodId/:reviewId',isLoggedIn,async(req,res)=>{
    const review=await Review.findById(req.params.reviewId);
    const prod=await (await Product.findById(req.params.prodId)).populate('reviews');
    res.render('editReview',{prod,review});
})


router.patch('/product/:prodId/:reviewId',isLoggedIn,async(req,res)=>{
    await Review.findByIdAndUpdate(req.params.reviewId,req.body);
    res.redirect(`/product/${req.params.prodId}/show`)
})



// Delete Comment
router.delete('/product/:prodId/:reviewId',isLoggedIn,async(req,res)=>{
    await Review.findByIdAndDelete(req.params.reviewId);
    await Product.findByIdAndUpdate(req.params.prodId,{$pull:{review:req.params.reviewId}});
    req.flash("success","Review Deleted Successfully");
    res.redirect(`/product/${req.params.prodId}/show`);

})


module.exports=router;