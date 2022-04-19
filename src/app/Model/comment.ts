import { Product } from './product';
import { User } from './user';

export class Comment {
  commentId!: number;
  commentContent!: String;
  createdDay!: String;
  commentRate!: number[];
  commentStatus!: boolean;
  product!: Product;
  user!: User;

  constructor(
    commentContent: String,
    createdDay: String,
    commentRate: number[],
    commentStatus: boolean
  ) {
    this.commentContent = commentContent;
    this.createdDay = createdDay;
    this.commentRate = commentRate;
    this.commentStatus = commentStatus;
  }
}
