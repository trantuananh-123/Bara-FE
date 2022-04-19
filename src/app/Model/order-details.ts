import { Order } from './order';
import { Product } from './product';

export class OrderDetails {
  orderDetailsId!: number;
  orderDetailsQuantity!: number;
  product!: Product;
  order!: Order;
}
