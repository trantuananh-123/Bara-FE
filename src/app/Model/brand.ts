import { Product } from './product';

export class Brand {
  brandId!: number;
  brandName!: string;
  brandImg!: string;
  brandStatus!: boolean;
  products!: Product[];
}
