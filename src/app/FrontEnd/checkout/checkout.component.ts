import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Order } from 'src/app/Model/order';
import { OrderDetails } from 'src/app/Model/order-details';
import { User } from 'src/app/Model/user';
import { AuthService } from 'src/app/Service/auth.service';
import { LazyLoadScriptService } from 'src/app/Service/lazy-load.service';
import { MailService } from 'src/app/Service/mail.service';
import { OrderDetailsService } from 'src/app/Service/order-details.service';
import { OrderService } from 'src/app/Service/order.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit, AfterViewInit {
  frmUser!: FormGroup;
  user: User = new User(0, '', '', '', '', [], '', '', 0, '', false);
  id!: number;

  data: any[] = [];
  cartNumber: number = 0;
  totalCart: number = 0;
  cartItem: any[] = [];

  constructor(
    private authService: AuthService,
    private mailService: MailService,
    private orderService: OrderService,
    private orderDetailService: OrderDetailsService,
    private router: Router,
    private fb: FormBuilder,
    private lazyService: LazyLoadScriptService,
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
    this.id =
      parseInt(sessionStorage.getItem('id') || '0') ||
      parseInt(localStorage.getItem('id') || '0');
    this.authService.getUserById(this.id).subscribe((data) => {
      this.user = data;
      this.frmUser.patchValue(data);
    });
    this.initFormUp();
    this.initFormOrder();
    this.loadCart();
    this.cartNumberFunc();
    console.log(this.frmUser);
  }

  loadCart() {
    this.data =
      this.authService.isLoggedIn() && localStorage.getItem('carts')
        ? JSON.parse(localStorage.getItem('carts')!)
        : [];
    this.cartNumber = this.data.length;
    console.log(this.data);
  }

  cartNumberFunc() {
    var cartValue =
      this.authService.isLoggedIn() && localStorage.getItem('carts')
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

  initFormUp() {
    this.frmUser = this.fb.group({
      id: new FormControl(),
      username: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      phone: new FormControl(null, [
        Validators.required,
        Validators.pattern('^0([3|4|9]{1})([0-9]{8}|[0-9]{9})'),
      ]),
      address: new FormControl(null, [Validators.required]),
      avatar: new FormControl(),
      balance: new FormControl(),
      dob: new FormControl(null),
    });
  }

  frmOrderDetail!: FormGroup;
  initFormOrder() {
    this.frmOrderDetail = this.fb.group({
      orderDetailsQuantity: new FormControl(null),
      order: new FormControl(null),
      product: new FormControl(null),
    });
  }

  order: Order = new Order(true);

  async buyItem() {
    const cartValue = localStorage.getItem('carts')
      ? JSON.parse(localStorage.getItem('carts')!)
      : [];

    const user = this.frmUser.value;
    const updateUser = await this.authService
      .updateUser(user.id, user)
      .subscribe((data) => {
        console.log(data);
      });

    const createOrder = await this.orderService
      .addOrder(this.order, user.id)
      .toPromise();

    const createOD = await cartValue.forEach(async (element: any) => {
      const frmOD = this.frmOrderDetail.value;
      frmOD.orderDetailsQuantity = element.quantity;

      const odOrder: any = {
        orderId: createOrder.orderId,
      };
      frmOD.order = odOrder;

      const product: any = {
        productId: element.product.productId,
      };
      frmOD.product = product;
      const createOD = await this.orderDetailService
        .addOrderDetails(frmOD)
        .subscribe((data) => {
          console.log(data);
        });
    });
    let mail = await this.mailService
      .sendEmail(user.id, createOrder.orderId)
      .subscribe(
        (e) => {
          console.log(e);
          this.toastrService.success(
            'Check email for detail purchase',
            'Successfully purchase'
          );
          this.deleteCart();
        },
        (error) => {
          this.toastrService.error(
            'Something wrong! Please Try Again',
            'Failed'
          );
        }
      );
  }

  deleteCart() {
    localStorage.setItem('carts', JSON.stringify([]));
    this.authService.cartSubject.next(0);
    this.authService.cartItem.next(null);
    this.authService.totalCart.next(0);
  }

  isChecked = false;
  checked(event: any) {
    if (event.target.checked) {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }
  }
}
