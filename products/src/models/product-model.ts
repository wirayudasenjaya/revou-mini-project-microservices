export interface ProductModel {
	id: number;
	name: string;
	quantity: number;
	price: number;
}

export interface GetAllProducts {
	id: number;
	name: string;
	quantity: number;
	price: number;
}

export interface GetAllProductsResponse {
	id: number;
	name: string;
	quantity: number;
	price: number;
}

export interface GetOneProductResponse {
	id: number;
	name: string;
	quantity: number;
	price: number;
}

export interface AddProductRequest {
	name: string;
	quantity: number;
	price: number;
}

export interface EditProductRequest {
	name: string;
	quantity: number;
	price: number;
}