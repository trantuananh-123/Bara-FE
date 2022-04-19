import { Component, Input, OnInit } from '@angular/core';
import { Catalog } from 'src/app/Model/catalog';
import { Product } from 'src/app/Model/product';
import { AuthService } from 'src/app/Service/auth.service';
import { CatalogService } from 'src/app/Service/catalog.service';
import { ProductService } from 'src/app/Service/product.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  // @Input() data: number = 0;

  data: any[] = [];
  cartNumber: number = 0;
  totalCart: number = 0;
  cartItem: any[] = [];

  isUser: boolean = true;
  username!: string;
  userRoles!: string;
  email!: string;
  phone!: string;
  address!: string;
  avatar!: string;
  balance!: string;
  dob!: string;

  productList!: Product[];
  catalogList!: Catalog[];

  baseUrl = 'http://localhost:8080/api/fileManager/downloadFile/';

  filterPro: any[] = [];
  filterCat: any[] = [];

  filter = {
    keyword: '',
  };

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private catalogService: CatalogService
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
    this.productService.getAllProduct().subscribe((data) => {
      data.forEach((x) => {
        x.productImgIds = [];
        x.productImgs = x.productImg.split(';');
        x.productImgs.forEach((e) => {
          x.productImgIds.push(parseInt(e.substring(this.baseUrl.length)));
        });
      });
      this.productList = data;
    });
    this.catalogService.getAllCatalog().subscribe((data) => {
      this.catalogList = data;
    });
  }

  ngOnInit(): void {
    if (sessionStorage.getItem('token') != null) {
      this.username = sessionStorage.getItem('username')!;
      this.email = sessionStorage.getItem('email')!;
      this.phone = sessionStorage.getItem('phone')!;
      this.address = sessionStorage.getItem('address')!;
      this.avatar = sessionStorage.getItem('avatar')!;
      this.balance = sessionStorage.getItem('balance')!;
      this.dob = sessionStorage.getItem('dob')!;
      console.log(sessionStorage.getItem('token'));
    } else {
      this.username = localStorage.getItem('username')!;
      this.email = localStorage.getItem('email')!;
      this.phone = localStorage.getItem('phone')!;
      this.address = localStorage.getItem('address')!;
      this.avatar = localStorage.getItem('avatar')!;
      this.balance = localStorage.getItem('balance')!;
      this.dob = localStorage.getItem('dob')!;
      console.log(localStorage.getItem('token'));
    }
    this.loadCart();
    this.cartNumberFunc();
  }

  loadCart() {
    this.data =
      this.authService.isLoggedIn() && localStorage.getItem('carts')
        ? JSON.parse(localStorage.getItem('carts')!)
        : [];
    this.cartNumber = this.data.length;
    console.log(this.data);
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

  deleteCart(index: number) {
    this.data.splice(index, 1);
    this.updateCart();
  }

  isLogOut() {
    this.data = [];
    this.totalCart = 0;
    this.cartItem = [];
    this.cartNumber = 0;
    this.authService.cartSubject.next(this.cartNumber);
    this.authService.cartItem.next(this.cartItem);
    this.authService.totalCart.next(this.totalCart);
    this.authService.logout();
  }

  loggedIn() {
    return this.authService.isLoggedIn();
  }

  isAdmin() {
    return this.authService.isAdmin();
  }

  searchChange: boolean = false;

  // listProduct() {
  //   this.productService.getAllProduct().subscribe((data) => {
  //     this.productList = data;
  //     this.filterPro = this.filterProduct(this.productList);
  //   });
  //   console.log(this.searchChange);
  // }

  // listCatalog() {
  //   this.catalogService.getAllCatalog().subscribe((data) => {
  //     this.catalogList = data;
  //     this.filterCat = this.filterCatalog(this.catalogList);
  //   });
  //   console.log(this.searchChange);
  // }

  // filterProduct(products: Product[]) {
  //   return products.filter((product) => {
  //     return product.productName
  //       .toLowerCase()
  //       .includes(this.filter.keyword.toLowerCase());
  //   });
  // }

  // filterCatalog(catalogs: Catalog[]) {
  //   return catalogs.filter((catalog) => {
  //     return catalog.catalogName
  //       .toLowerCase()
  //       .includes(this.filter.keyword.toLowerCase());
  //   });
  // }

  listProduct(name: String) {
    if (name !== '') {
      this.productService.search(name).subscribe((data) => {
        this.filterPro = data;
        console.log(this.filterPro);
      });
    }
  }

  closeSearch() {
    this.searchChange = false;
  }

  openSearch() {
    if (this.filter.keyword != '') {
      this.searchChange = true;
    }
  }
}
