import { consumeFromQueue, sendToQueue } from "../consumers/product-consumer";
import {
  AddProductRequest,
  EditProductRequest,
  GetAllProductsResponse,
  GetOneProductResponse,
} from "../models/product-model";
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
        price: product.price,
      });
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
      price: addProductRequest.price,
    });

    return {
      id: products,
    };
  }

  async edit(editProductRequest: EditProductRequest, id: number) {
    await this.productRepository.edit(
      {
        id: 0,
        name: editProductRequest.name,
        quantity: editProductRequest.quantity,
        price: editProductRequest.price,
      },
      id
    );

    return {
      message: "updated",
    };
  }

  async delete(id: number) {
    await this.productRepository.delete(id);

    return {
      message: "deleted",
    };
  }

  async getProductQuantity() {
    consumeFromQueue("product-availability", async (msg: any) => {
      try {
        const product = await this.productRepository.getOne(msg.product_id);

        sendToQueue("get-product-quantity", {
          requestId: msg.request_id,
          productId: msg.product_id,
          quantity: product.quantity
        });
      } catch (e) {
        console.error("Error getting quantity:", e);

        sendToQueue("get-product-quantity", {
          requestId: msg.request_id,
          productId: msg.product_id,
          error: e,
        });
      }
    });
  }

  async updateProductQuantity() {
    consumeFromQueue("update-product-quantity", async (order: any) => {
      try {
        const product = await this.productRepository.getOne(order.product_id);

        const newQuantity = product.quantity - order.quantity;

        await this.productRepository.edit(
          {
            id: product.id,
            name: product.name,
            quantity: newQuantity,
            price: product.price,
          },
          product.id
        );

        return {
          message: "product updated",
        };
      } catch (error) {
        console.error("Error updating product:", error);
      }
    });
  }
}
