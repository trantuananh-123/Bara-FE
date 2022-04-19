import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Brand } from 'src/app/Model/brand';
import { Catalog } from 'src/app/Model/catalog';
import { Color } from 'src/app/Model/color';
import { Comment } from 'src/app/Model/comment';
import { Product } from 'src/app/Model/product';
import { Size } from 'src/app/Model/size';
import { CommentService } from 'src/app/Service/comment.service';
import { LazyLoadScriptService } from 'src/app/Service/lazy-load.service';
import { ProductService } from 'src/app/Service/product.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/Service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/Model/user';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('userInput') input!: ElementRef;

  baseUrl = 'http://localhost:8080/api/fileManager/downloadFile/';

  productDetail!: Product;
  productCatalog!: Catalog;
  productBrand!: Brand;
  productSize!: Size[];
  productColor!: Color[];
  productComment!: Comment[];
  productId!: number;
  userId!: number;

  cartNumber: number = 0;
  cartItem: any[] = [];
  totalCart: number = 0;

  constructor(
    private lazyService: LazyLoadScriptService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private commentService: CommentService,
    private datePipe: DatePipe,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.productId = this.activatedRoute.snapshot.params['id'];
    this.userId = parseInt(sessionStorage.getItem('id')!);
    this.commentService.allComment.subscribe((data) => {
      this.productComment = data;
    });
  }

  ngAfterViewInit() {
    this.lazyService.load('assets/js/main.js');
  }

  ngOnInit(): void {
    this.productService.getProductById(this.productId).subscribe((data) => {
      data.productImgIds = [];
      data.productImgs = data.productImg.split(';');
      data.productImgs.forEach((e) => {
        console.log(e.substring(this.baseUrl.length));
        data.productImgIds.push(parseInt(e.substring(this.baseUrl.length)));
      });
      this.productDetail = data;
      this.productCatalog = data.catalog;
      this.productBrand = data.brand;
      this.productSize = data.sizes;
      this.productColor = data.colors;
      console.log(this.productDetail);
      console.log(this.productCatalog);
      console.log(this.productBrand);
      console.log(this.productSize);
      console.log(this.productColor);
    });
    this.commentService
      .getAllCommentByProduct(this.productId)
      .subscribe((data) => {
        this.productComment = data;
        console.log(data);
      });
  }

  loggedIn() {
    return this.authService.isLoggedIn();
  }

  buy(product: any) {
    if (this.loggedIn()) {
      let carts = localStorage.getItem('carts')
        ? JSON.parse(localStorage.getItem('carts')!)
        : [];
      let itemCart = {
        product: product,
        quantity: 1,
      };
      let flag = false;
      carts = carts.map((x: any) => {
        if (x.product.productId == product.productId) {
          x.quantity++;
          flag = true;
        }
        return x;
      });
      if (!flag) carts.push(itemCart);
      localStorage.setItem('carts', JSON.stringify(carts));

      console.log(carts);
      this.cartNumberFunc();
      this.toastr.success(
        'Your item has been added to your cart!',
        'Succesfully'
      );
    } else {
      this.toastr.error('You need to login first!', 'Failed');
    }
  }

  cartNumberFunc() {
    var cartValue = localStorage.getItem('carts')
      ? JSON.parse(localStorage.getItem('carts')!)
      : [];
    this.totalCart = 0;
    cartValue.forEach((element: any) => {
      this.totalCart += element.product.productPriceOut * element.quantity;
    });
    this.cartItem = cartValue;
    this.cartNumber = cartValue.length;
    this.authService.cartSubject.next(this.cartNumber);
    this.authService.cartItem.next(this.cartItem);
    this.authService.totalCart.next(this.totalCart);
    console.log(this.cartNumber);
  }

  postComment(content: String) {
    // if(event.keydown === 13){}
    if (this.loggedIn()) {
      this.rateCounter = Array(this.ratingDisplay).fill(this.ratingDisplay);
      let date = moment().format('DD-MM-YYYY');
      console.log(date);
      console.log(content);
      let comment: Comment = new Comment(content, date, this.rateCounter, true);
      this.commentService
        .postUserComment(comment, this.productId, this.userId)
        .subscribe((data) => {
          this.productComment.push(data);
          this.commentService.allComment.next(this.productComment);
          console.log(data);
        });
      this.toastr.success('Comment succesfully', 'Succesfully');
      this.input.nativeElement.value = '';
    } else {
      this.toastr.error('You need to login first!', 'Failed');
    }
  }

  ratingDisplay!: number;
  rateCounter!: any;

  onRatingSet(rating: number): void {
    this.ratingDisplay = rating;
    console.log(this.ratingDisplay);
  }
}
