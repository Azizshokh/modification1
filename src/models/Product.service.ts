import { Product, ProductInput, ProductUpdateInput } from "../libs/types/product";
import ProductModel from "../schema/Product.model";
import Errors, { Message, HttpCode } from "../libs/Error";
import { shapeIntoMongooseObjectId } from "../libs/config";

class ProductService {
    private readonly productModel;

    constructor() {
        this.productModel = ProductModel;
    }

    /*** SPA ***/

    /*** SSR ***/
    public async getAllProducts(): Promise<Product[]> {
        try {
            return await this.productModel.find().exec();
        } catch (error) {
            console.error("Error in getAllProducts:", error);
            throw new Errors(HttpCode.BAD_REQUEST, Message.NO_DATA_FOUND);
        }
    }

    public async createNewProduct(input: ProductInput): Promise<Product> {
        try {
            return await this.productModel.create(input);
        } catch (error) {
            console.error("Error in createNewProduct:", error);
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
    }

    public async updateChosenProduct(id: string, input: ProductUpdateInput): Promise<Product> {
        id = shapeIntoMongooseObjectId(id);
        const result = await this.productModel
            .findOneAndUpdate({ _id: id }, input, { new: true })
            .exec();
        if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
        return result;
    }
}

export default ProductService;