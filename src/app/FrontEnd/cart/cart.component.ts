import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/Service/auth.service';
import { LazyLoadScriptService } from 'src/app/Service/lazy-load.service';
import { ProductService } from 'src/app/Service/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit, AfterViewInit {
  data: any[] = [];
  totalCart: number = 0;
  cartNumber: number = 0;
  cartItem: any[] = [];

  constructor(
    private lazyService: LazyLoadScriptService,
    private productService: ProductService,
    private authService: AuthService,
    private toastrService: ToastrService
  ) {
    this.authService.cartSubject.subscribe((data) => {
      this.cartNumber = data;
    });
    this.authService.cartItem.subscribe((data) => {
      this.data = data;
    });
    this.authService.totalCart.subscribe((data) => {
      this.totalCart = data;
    });
  }

  ngAfterViewInit() {
    this.lazyService.load('assets/js/main.js');
  }

  ngOnInit(): void {
    this.loadCart();
    console.log(this.data);
  }

  loadCart() {
    this.data = localStorage.getItem('carts')
      ? JSON.parse(localStorage.getItem('carts')!)
      : [];
    this.data.forEach((element) => {
      this.totalCart += element.product.productPriceOut * element.quantity;
    });
  }

  updateCart() {
    localStorage.setItem('carts', JSON.stringify(this.data));
    this.data = localStorage.getItem('carts')
      ? JSON.parse(localStorage.getItem('carts')!)
      : [];
    this.cartNumberFunc();
    console.log(this.data);
  }

  cartNumberFunc() {
    var cartValue = localStorage.getItem('carts')
      ? JSON.parse(localStorage.getItem('carts')!)
      : [];
    this.totalCart = 0;
    cartValue.forEach((element: any) => {
      if (element.quantity > 0) {
        this.totalCart += element.product.productPriceOut * element.quantity;
      } else {
        this.toastrService.error('Product number must > 0, please try again', 'Failed');
      }
    });
    this.cartItem = cartValue;
    this.cartNumber = cartValue.length;
    this.authService.cartSubject.next(this.cartNumber);
    this.authService.cartItem.next(this.cartItem);
    this.authService.totalCart.next(this.totalCart);
    console.log(this.cartNumber);
  }

  deleteAllItem() {
    localStorage.removeItem('carts');
    this.cartNumberFunc();
    this.loadCart();
  }

  deleteCart(index: number) {
    this.data.splice(index, 1);
    this.updateCart();
  }
}
