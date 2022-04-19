import { OrderDetails } from './order-details';
import { User } from './user';

export class Order {
  orderId!: number;
  orderStatus!: boolean;
  user!: User;
  orderDetail!: OrderDetails[];

  constructor(orderStatus: boolean) {
    this.orderStatus = orderStatus;
  }
}
