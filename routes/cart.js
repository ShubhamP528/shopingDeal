const express=require('express');
const router=express.Router();
const{isLoggedIn}=require('../middleware');
const Product=require('../model/product');
const User=require('../model/user');



// Adding product to cart
router.post('/user/:id/cart',isLoggedIn, async(req,res)=>{
    try
    {
        const product=await Product.findById(req.params.id);
        const user=req.user;
        user.carts.push(product);
        await user.save();
        res.redirect(`/user/${req.user._id}/cart`);
    }
    catch(e)
    {
        req.flash('error','Unable to add the product to cart');
        res.redirect('/error');
    }

})


// Showing cart
router.get('/user/:userid/cart',isLoggedIn, async(req,res)=>{
    const user = await(await User.findById(req.params.userid)).populate('carts');    
    res.render('cart/showCart',{ user});
})

//Remove item cart
router.delete('/user/:userid/cart/:id',isLoggedIn,async(req,res)=>{
    const{userid,id}=req.params;
    await User.findByIdAndUpdate(userid,{$pull:{carts:id}});
    res.redirect(`/user/${req.user._id}/cart`);
})


module.exports=router;