export interface OrderModel {
  id: number;
  product_id: number;
  user_id: number;
  quantity: number;
}

export interface GetAllOrderResponse {
	id: number;
  product_id: number;
  user_id: number;
  quantity: number;
}

export interface CreateOrderRequest {
	product_id: number;
  quantity: number;
}
