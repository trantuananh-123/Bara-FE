import { Brand } from './brand';
import { Catalog } from './catalog';
import { Size } from './size';
import { Color } from './color';

export class Product {
  productId!: number;
  productName!: String;
  productPriceIn!: number;
  productPriceOut!: number;
  productDiscount!: number;
  productImg!: String;
  productImgs!: String[];
  // productImgId!: String;
  productImgIds!: number[];
  productDescription!: string;
  productCreatedDay!: String;
  productQuantity!: number;
  productIsHot!: boolean;
  productStatus!: boolean;
  catalog!: Catalog;
  brand!: Brand;
  sizes!: Size[];
  colors!: Color[];
  comments!: Comment[];
}
