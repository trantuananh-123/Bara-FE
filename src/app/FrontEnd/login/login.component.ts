import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/app/Model/order';
import { User } from 'src/app/Model/user';
import { AuthService } from 'src/app/Service/auth.service';
import { OrderService } from 'src/app/Service/order.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted: boolean = false;
  errorMessage: string = '';
  isLogin: boolean = false;
  isLoginFailed: boolean = false;
  isAdmin: boolean = false;
  isUser: boolean = true;
  rememberMe: boolean = false;

  username!: string;
  userRoles!: string;
  email!: string;
  phone!: string;
  address!: string;
  avatar!: string;
  balance!: number;
  dob!: Date;

  id!: number;
  frmUserUp!: FormGroup;
  user: User = new User(0, '', '', '', '', [], '', '', 0, '', false);
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService
  ) {}

  order!: Order
  ngOnInit(): void {
    this.initLoginForm();
    this.authService.getUserById(this.id).subscribe((data) => {
      this.user = data;
      this.frmUserUp.get('id')!.setValue(this.user.id);
      this.frmUserUp.get('username')!.setValue(this.user.username);
      this.frmUserUp.get('email')!.setValue(this.user.email);
      this.frmUserUp.get('phone')!.setValue(this.user.phone);
      this.frmUserUp.get('address')!.setValue(this.user.address);
      this.frmUserUp.get('avatar')!.setValue(this.user.avatar);
      this.frmUserUp.get('balance')!.setValue(this.user.balance);
      this.frmUserUp.get('dob')!.setValue(this.user.dob);
      console.log(this.user.address);
    });
    this.initFormUp();
  }

  initFormUp() {
    this.frmUserUp = this.fb.group({
      id: new FormControl(),
      username: new FormControl(),
      email: new FormControl(),
      phone: new FormControl(),
      address: new FormControl(),
      avatar: new FormControl(),
      balance: new FormControl(),
      dob: new FormControl(),
    });
  }

  initLoginForm() {
    this.loginForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
    this.id = parseInt(sessionStorage.getItem('id') || '0');
    this.username = sessionStorage.getItem('username')!;
    this.email = sessionStorage.getItem('username')!;
    this.phone = sessionStorage.getItem('phone') || '';
    this.address = sessionStorage.getItem('address') || 'hello';
    this.avatar = sessionStorage.getItem('avatar') || 'hello';
    this.balance = parseFloat(sessionStorage.getItem('balance') || '0');
    this.dob = new Date(sessionStorage.getItem('dob') || 'hello');
  }

  onSubmit() {
    this.submitted = true;

    if (!this.rememberMe) {
      this.authService
        .loginNoSave(
          this.loginForm.value.username,
          this.loginForm.value.password
        )
        .subscribe(
          (data) => {
            this.isLogin = true;
            this.id = data.id;
            console.log(this.id);
            this.loadCart();
            this.cartNumberFunc();
            this.router.navigate(['/home']);
          },
          (error) => {
            console.log(error);
            this.errorMessage = error;
            this.isLogin = false;
            this.isLoginFailed = true;
          }
        );
    } else {
      this.authService
        .loginSave(this.loginForm.value.username, this.loginForm.value.password)
        .subscribe(
          (data) => {
            this.isLogin = true;
            this.id = data.id;
            console.log(this.id);
            this.loadCart();
            this.cartNumberFunc();
            this.router.navigate(['/home']);
          },
          (error) => {
            console.log(error);
            this.errorMessage = error;
            this.isLogin = false;
            this.isLoginFailed = true;
          }
        );
    }
  }

  updateUser() {
    if (!this.rememberMe) {
      this.sesionGet();
    } else {
      this.localGet();
    }
  }

  loggedIn() {
    return this.authService.isLoggedIn();
  }

  isChecked(event: any) {
    if (event.target.checked) {
      this.rememberMe = true;
      console.log('HELLO');
    } else {
      this.rememberMe = false;
      console.log('NGU');
    }
  }

  sesionGet() {
    let user = this.frmUserUp.value;
    this.authService.updateUser(user.id, user).subscribe((data) => {
      console.log(data);
      sessionStorage.setItem('username', user.username);
      // sessionStorage.setItem('token', user);
      // sessionStorage.setItem('roles', JSON.stringify(user.roles));
      sessionStorage.setItem('email', user.email);
      sessionStorage.setItem('phone', user.phone);
      sessionStorage.setItem('address', user.address);
      sessionStorage.setItem('avatar', user.avatar);
      sessionStorage.setItem('balance', user.balance);
      sessionStorage.setItem('dob', user.dob);
      sessionStorage.setItem('status', user.status);
      this.initLoginForm();
      window.location.reload();
    });
  }

  localGet() {
    let user = this.frmUserUp.value;
    this.authService.updateUser(user.id, user).subscribe((data) => {
      console.log(data);
      localStorage.setItem('username', user.username);
      // sessionStorage.setItem('token', user);
      // sessionStorage.setItem('roles', JSON.stringify(user.roles));
      localStorage.setItem('email', user.email);
      localStorage.setItem('phone', user.phone);
      localStorage.setItem('address', user.address);
      localStorage.setItem('avatar', user.avatar);
      localStorage.setItem('balance', user.balance);
      localStorage.setItem('dob', user.dob);
      localStorage.setItem('status', user.status);
      this.initLoginForm();
      window.location.reload();
    });
  }

  data: any[] = [];
  cartNumber: number = 0;
  totalCart: number = 0;
  cartItem: any[] = [];

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
}
