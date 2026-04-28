import mongoose, { Schema } from 'mongoose';
import { ProductCollection, ProductSize, ProductStatus, ProductVolume, ProductWeight } from '../libs/enums/product.enum';


const productSchema = new Schema(
    {
        productStatus: {
            type: String,
            enum: ProductStatus,
            default: ProductStatus.PAUSE,
        },

        productCollection: {
            type: String,
            enum: ProductCollection,
            required: true,
        },

        productName: {
            type: String,
            required: true,
        },

        productPrice: {
            type: Number,
            required: true,
        },

        productLeftCount: {
            type: Number,
            required: true,
        },

        productSize: {
            type: String,
            enum: ProductSize,
            default: ProductSize.NORMAL,
        },

        productWeight: {
            type: Number,
            enum: ProductWeight,
            default: ProductWeight.G500,
        },

        productVolume: {
            type: Number,
            enum: ProductVolume,
            default: ProductVolume.ONE,
        },

        productDesc: {
            type: String,
        },

        productImages: {
            type: [String],
            default: [],
        },

        productViews: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true } // updateAt, createdAt
);

productSchema.index(
    { productName: 1, productSize: 1, productVolume: 1, productWeight: 1 },
    { unique: true }
);
export default mongoose.model('Product', productSchema);