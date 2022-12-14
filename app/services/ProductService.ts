import Database from "@ioc:Adonis/Lucid/Database";
import Category from "App/Models/Category";
import Product from "App/Models/Product";
import ProductVarian from "App/Models/ProductVarian";
import Users from "App/Models/Users";
import Logger from '@ioc:Adonis/Core/Logger'

class ProductService {
    protected table = "products";
    protected tableVariant = "product_varians";
    protected status = {
        DRAFT: "DRAFT",
        REVIEW: "REVIEW",
        PUBLISH: "PUBLISH",
    }

    public async create(userId, data) {
        const user = await Users.findOrFail(userId);
        const category = await Category.findOrFail(data.category);

        const products = new Product();
        products.title = data.title;
        products.image = data.image;
        products.brand = data.brand;
        products.description = data.description;
        products.status = data.status;

        await products.related("created").associate(user);
        await products.related("category").associate(category);
        return await products.save();
    }

    public async createProduct(userId, data){

        const product = await Database.transaction(async (trx) => {
            const user = await trx.query().select("*").from('users').where('id', userId).first()

            const response = await trx.insertQuery()
                .table(this.table)
                .insert({...data, create_by: user.id})

                return response[0]
            })

        return product
    }

    public async findAllByParams(keyword) {
        return await Product.query()
            .preload("variant")
            .where("status", this.status.PUBLISH)
            .andWhereLike("title", `%${keyword}%`)
            .orderBy("title");
    }

    public async findAll(page = 1, limit = 10) {
        const product = await Database.from(this.table)
            .leftJoin(this.tableVariant, "products.id", "=", "product_varians.product_id")
            .select("*")
            .where("products.status", this.status.PUBLISH)
            .orderBy("products.title")
            .paginate(page, limit);

        return await product;
    }

    public async getProduct() {
        const product = await Product.query()
            .preload("variant")
            .where("status", this.status.PUBLISH);

        return product;
    }

    public async findOne(id) {
        return await Product.findOrFail(id);
    }

    public async findSlug(slug) {
        return await Product.findByOrFail("slug", slug);
    }

    public async update(id, data) {
        const product = await this.findOne(id);
        const category = await Category.findOrFail(data.category);

        product.title = data.title;
        product.image = data.image;
        product.brand = data.brand;
        product.description = data.description;
        product.status = data.status;

        await product.related("category").associate(category);
        return await product.save();
    }

    public async remove(id) {
        const product = await this.findOne(id);

        return await product.delete();
    }

    // varian
    public async variantCreate(data: any[]) {
        return await ProductVarian.createMany(data)
    }

    public async variantUpdate(id, data) {
        const variant = await ProductVarian.findOrFail(id);
        variant.type = data.type;
        variant.name = data.name;
        variant.model = data.model;
        variant.price = data.price;
        variant.cost = data.cost;
        variant.stock = variant.stock + data.stock;
        variant.minimum = data.minimum;
        variant.unit = data.unit;
        variant.description = data.description;

        return await variant.save();
    }

    public async removeVarian(id){
        const variant = await ProductVarian.findOrFail(id);
        return await variant.delete()
    }
}

export default new ProductService();
