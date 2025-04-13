import Product from "../models/product.model.js"
import mongoose from "mongoose";

export const getProducts =  async (req, res) => {
    try{
        const products = await Product.find({});
        res.status(200).json({success: true, data:products});
    } catch (error){
        console.log("Có lỗi khi tìm kiếm sản phẩm", error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
};

export const createProducts = async (req, res) => {
    const product = req.body; // Đây là người dùng nhập vào sẽ lưu thông tin product ở đây

    if(!product.name || !product.price || !product.image){
        return res.status(400).json({success: false, message:"Vui lòng nhập đủ các trường thông tin"});
    }   

    const newProduct = new Product(product)

    try{
        await newProduct.save();
        res.status(201).json({success: true, data: newProduct});
    } catch (error){
        console.error("Có lỗi trong quá trình tạo sản phẩm: ", error.message);
        res.status(500).json({success: false, message: "Server đang có lỗi!!!"});
    }
};

export const updateProduct = async (req, res) => {
    const {id} = req.params;
    const product = req.body;

    // Dòng này là nếu không tìm thấy Id sẽ báo lại là Id không khả dụng
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success: false, message: "Id sản phẩm không khả dụng"});
    }

    try{
        const updatedProduct = await Product.findByIdAndUpdate(id, product, {new:true});
        res.status(200).json({success: true, data: updatedProduct});
    } catch (error){
        res.status(500).json({success: false, message:"Lỗi server!!!"});

    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success: false, message: "Id sản phẩm không khả dụng"});
    }
    
    try{
        await Product.findByIdAndDelete(id);
        res.status(200).json({success: true, message: "Đã xóa sản phẩm"});
    } catch (error){
        console.log("Có lỗi khi xóa sản phẩm", error.message);
        res.status(500).json({success: false, message: "Lỗi Server!!"})
    }

};