import { ViewportScroller } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Event, Router, Scroll } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Catalog } from 'src/app/Model/catalog';
import { Color } from 'src/app/Model/color';
import { Product } from 'src/app/Model/product';
import { Size } from 'src/app/Model/size';
import { CatalogService } from 'src/app/Service/catalog.service';
import { ColorService } from 'src/app/Service/color.service';
import { LazyLoadScriptService } from 'src/app/Service/lazy-load.service';
import { ProductService } from 'src/app/Service/product.service';
import { SizeService } from 'src/app/Service/size.service';
import { ChangeContext, LabelType, Options } from '@angular-slider/ngx-slider';
import { PaginationInstance } from 'ngx-pagination';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit, AfterViewInit {
  public config1: PaginationInstance = {
    id: 'custom1',
    itemsPerPage: 10,
    currentPage: 1,
  };

  public config2: PaginationInstance = {
    id: 'custom2',
    itemsPerPage: 1,
    currentPage: 1,
  };

  changePage: boolean = false;

  minValue: number = 0;
  maxValue: number = 1000;
  options: Options = {
    floor: 0,
    ceil: 1000,
    step: 200,
    showTicks: true,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '<b>Min price:</b> $' + value;
        case LabelType.High:
          return '<b>Max price:</b> $' + value;
        default:
          return '$' + value;
      }
    },
  };

  currentUrl!: String;

  productList!: Product[];
  catalogList!: Catalog[];
  colorList!: Color[];
  sizeList!: Size[];

  catalog = '';
  color = '';
  size = '';
  minMoney!: number;
  maxMoney!: number;

  filterPro: any[] = [];
  filterColor: any[] = [];
  filterSize: any[] = [];

  filter = {
    keyword: '',
    sortBy: 'Name A - Z',
    cat: '',
  };

  baseUrl = 'http://localhost:8080/api/fileManager/downloadFile/';

  constructor(
    private lazyService: LazyLoadScriptService,
    private productService: ProductService,
    private catalogService: CatalogService,
    private colorService: ColorService,
    private sizeService: SizeService,
    private router: Router,
    private view: ViewportScroller,
    private route: ActivatedRoute
  ) {
    router.events
      .pipe(filter((e: Event): e is Scroll => e instanceof Scroll))
      .subscribe((e) => {
        if (e.position) {
          // backward navigation
          view.scrollToPosition(e.position);
        } else if (e.anchor) {
          // anchor navigation
          view.scrollToAnchor(e.anchor);
        } else {
          // forward navigation
          if (
            router.url.includes('/shop?catalog') ||
            router.url.includes('/shop?color') ||
            router.url.includes('/shop?minMoney')
          ) {
            view.scrollToPosition([0, 250]);
          }
        }
      });

    this.listCatalog();
    this.listColor();
    this.listSize();

    this.productService.getAllProduct().subscribe((data) => {
      data.forEach((x) => {
        x.productImgIds = [];
        x.productImgs = x.productImg.split(';');
        x.productImgs.forEach((e) => {
          x.productImgIds.push(parseInt(e.substring(this.baseUrl.length)));
        });
      });
      this.productList = data;
      this.route.queryParamMap.subscribe((params) => {
        this.catalog = params.get('catalog')!;
        this.color = params.get('color')!;
        this.size = params.get('size')!;

        if (this.catalog === 'All Catalog') {
          this.filterPro = this.productList;
        } else {
          this.filterPro = this.catalog
            ? this.productList.filter(
                (p) => p.catalog.catalogName === this.catalog
              )
            : this.productList;
        }

        const tempColor: any[] = [];
        const tempSize: any[] = [];

        if (this.color != null) {
          this.filterPro.filter((p) => {
            for (let i = 0; i < p.colors.length; i++) {
              if (p.colors[i].colorName === this.color) {
                tempColor.push(p);
              }
            }
            this.filterPro = tempColor;
          });
        }

        if (this.size != null) {
          this.filterPro.filter((p) => {
            for (let i = 0; i < p.sizes.length; i++) {
              if (p.sizes[i].sizeName === this.size) {
                tempSize.push(p);
              }
            }
            this.filterPro = tempSize;
          });
        }
      });
    });
  }

  ngAfterViewInit() {
    this.lazyService.load('assets/js/main.js');
  }

  ngOnInit(): void {
    this.lazyService.load('assets/js/main.js');
  }

  listCatalog() {
    this.catalogService.getAllCatalog().subscribe((data) => {
      this.catalogList = data;
    });
  }

  listProduct() {
    this.productService.getAllProduct().subscribe((data) => {
      this.productList = data;
      this.filterPro = this.filterProduct(this.filterPro);
    });
    console.log(this.filter.sortBy);
  }

  listSize() {
    this.sizeService.getAllSize().subscribe((data) => {
      this.sizeList = data;
      this.filterSize = data;
    });
  }

  listColor() {
    this.colorService.getAllColor().subscribe((data) => {
      this.colorList = data;
      this.filterColor = data;
    });
  }

  filterProduct(products: Product[]) {
    return products
      .filter((product) => {
        return product.productName
          .toLowerCase()
          .startsWith(this.filter.keyword.toLowerCase());
      })
      .filter((product) => {
        return product.catalog.catalogName
          .toLowerCase()
          .includes(this.filter.cat.toLowerCase());
      })
      .sort((a, b) => {
        if (this.filter.sortBy === 'Name A - Z') {
          return a.productName.toLowerCase() < b.productName.toLowerCase()
            ? -1
            : 1;
        } else if (this.filter.sortBy === 'Name Z - A') {
          return a.productPriceOut < b.productPriceOut ? -1 : 1;
        } else if (this.filter.sortBy === 'Price High to Low') {
          return a.productPriceOut > b.productPriceOut ? -1 : 1;
        } else if (this.filter.sortBy === 'Price Low to High') {
          return a.productPriceOut < b.productPriceOut ? -1 : 1;
        }
        return -1;
      });
  }

  onUserChange(changeContext: ChangeContext) {
    this.minMoney = changeContext.value!;
    this.maxMoney = changeContext.highValue!;
    this.productService.getAllProduct().subscribe((data) => {
      data.forEach((x) => {
        x.productImgIds = [];
        x.productImgs = x.productImg.split(';');
        x.productImgs.forEach((e) => {
          x.productImgIds.push(parseInt(e.substring(this.baseUrl.length)));
        });
      });
      this.productList = data;
      this.filterPro = this.productList.filter((product) => {
        return (
          product.productPriceOut >= this.minMoney &&
          product.productPriceOut <= this.maxMoney
        );
      });
    });
  }

  backToPosition() {
    window.scrollTo({
      top: 250,
      behavior: 'smooth',
    });
  }
}
