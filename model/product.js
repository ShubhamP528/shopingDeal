const mongoose=require("mongoose");
const Review=require('./reviews')


const productSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    price:{
        type:Number,
        min:0,
        require:true
    },
    img:{
        type:String
    },
    desc:{
        type:String,
        require:true
    },
    owner:
    {
        type:String,
        require:true,
        default:"admin"
    },
    reviews:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Review'
    }]
})

const Product=mongoose.model('Product',productSchema);

module.exports=Product;