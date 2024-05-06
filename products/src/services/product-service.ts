import { AddProductRequest, GetAllProductsResponse, GetOneProductResponse } from "../models/product-model";
import { ProductRepository } from "../repositories/product-repository";

export class ProductService {
  private productRepository: ProductRepository;

	constructor(productRepository: ProductRepository) {
		this.productRepository = productRepository;
	}

	async getAll(): Promise<GetAllProductsResponse[]> {
		const products = await this.productRepository.getAll();

		let productResponse: GetAllProductsResponse[] = [];

		products.forEach((product) => {
			productResponse.push({
				id: product.id,
				name: product.name,
				quantity: product.quantity,
				price: product.price
			})
		});

		return productResponse;
	}

	async getOne(product_id: number): Promise<GetOneProductResponse> {
		const getProductResponse = await this.productRepository.getOne(product_id);

		return getProductResponse;
	}

	async add(addProductRequest: AddProductRequest) {
		const products = await this.productRepository.add({
			id: 0,
			name: addProductRequest.name,
			quantity: addProductRequest.quantity,
			price: addProductRequest.price
		})

		return {
			id: products
		}
	}

	async delete(id: number) {
    const deleteProduct = await this.productRepository.delete(id);

    return {
      message: "deleted",
    };
  }
}