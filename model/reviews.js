const mongoose=require('mongoose');




const reviewSchema=new mongoose.Schema({
    rating:{
        type:Number,
        min:0,
        default:null
    },
    comment:{
        type:String,
        require:true
    },
    user:{
        type:String,
        require:true
    }
})

const review=mongoose.model('Review',reviewSchema);

module.exports=review;