import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    image:{
        type: String,
        required: true
    },
}, {
    timestamps: true // thuộc tình này lưu thời gian tạo (CreateAt) và thời gian update (UpdateAt)
});

const Product = mongoose.model('Product', productSchema);

export default Product;