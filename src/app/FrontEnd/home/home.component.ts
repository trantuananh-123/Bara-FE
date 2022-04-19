import {
  AfterViewInit,
  Component,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/Model/product';
import { AuthService } from 'src/app/Service/auth.service';
import { LazyLoadScriptService } from 'src/app/Service/lazy-load.service';
import { ProductService } from 'src/app/Service/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  cartNumber: number = 0;
  cartItem: any[] = [];
  totalCart: number = 0;

  productList!: Product[];

  constructor(
    private lazyService: LazyLoadScriptService,
    private productService: ProductService,
    private authService: AuthService,
    private route: Router,
    private toastr: ToastrService
  ) {}

  ngAfterViewInit() {
    this.lazyService.load('assets/js/plugins/swiper.min.js');
    this.lazyService.load('assets/js/plugins/jarallax.min.js');
    this.lazyService.load('assets/js/main.js');
  }

  baseUrl = 'http://localhost:8080/api/fileManager/downloadFile/';

  ngOnInit(): void {
    this.lazyService.load('assets/js/plugins/swiper.min.js');
    this.lazyService.load('assets/js/plugins/jarallax.min.js');
    this.lazyService.load('assets/js/main.js');
    this.productService.getAllProduct().subscribe((data) => {
      data.forEach((x) => {
        x.productImgIds = [];
        x.productImgs = x.productImg.split(';');
        x.productImgs.forEach((e) => {
          // console.log(e.substring(this.baseUrl.length));
          x.productImgIds.push(parseInt(e.substring(this.baseUrl.length)));
        });
      });
      this.productList = data;
      console.log(this.productList);
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
}
