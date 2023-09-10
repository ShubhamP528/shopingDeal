const mongoose=require('mongoose');
const passportLocalmongoose=require('passport-local-mongoose');
const Product=require('../model/product');

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    userType:{
        type:String,
        required:true
    },
    carts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
})

userSchema.plugin(passportLocalmongoose);  // it will add user and passport property automatically  and other Stuff!!

const user=mongoose.model('User',userSchema);

module.exports=user;