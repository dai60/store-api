import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    categories: {
        type: [String],
        default: [],
    }
});

const Product = mongoose.model("product", ProductSchema);
export default Product;
