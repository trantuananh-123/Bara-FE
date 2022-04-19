import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Table } from 'primeng/table';
import { Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Brand } from 'src/app/Model/brand';
import { Catalog } from 'src/app/Model/catalog';
import { Color } from 'src/app/Model/color';
import { Product } from 'src/app/Model/product';
import { Size } from 'src/app/Model/size';
import { BrandService } from 'src/app/Service/brand.service';
import { CatalogService } from 'src/app/Service/catalog.service';
import { ColorService } from 'src/app/Service/color.service';
import { LazyLoadScriptService } from 'src/app/Service/lazy-load.service';
import { ProductService } from 'src/app/Service/product.service';
import { SizeService } from 'src/app/Service/size.service';
import { UploadService } from 'src/app/Service/upload.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit, AfterViewInit {
  @ViewChild('dt1') table!: Table;

  catalogList!: Catalog[];
  selectedCatalog!: Catalog;

  brandList: Brand[] = [];
  selectedBrand!: Brand;

  colorList: Color[] = [];
  selectedColors!: Color[];

  sizeList: Size[] = [];
  selectedSizes!: Size[];

  productList!: Product[];
  productDialog!: boolean;
  product!: Product;
  selectedProducts!: Product[];
  submitted!: boolean;

  cols!: any[];

  baseUrl = 'http://localhost:8080/api/fileManager/downloadFile/';

  constructor(
    private lazyService: LazyLoadScriptService,
    private proService: ProductService,
    private catService: CatalogService,
    private brandService: BrandService,
    private colorService: ColorService,
    private sizeService: SizeService,
    private router: Router,
    private fileService: UploadService,
    private toastrService: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.lazyService.load('assets/js/plugins/sidebarmenu.js');
    this.lazyService.load('assets/js/custom.min.js');
    this.cdr.detectChanges();
    this.getAll();
  }

  date!: Date;
  config: any;

  ngOnInit(): void {
    this.config = {
      toolbarGroups: [
        { name: 'document', groups: ['mode', 'document', 'doctools'] },
        { name: 'clipboard', groups: ['clipboard', 'undo'] },
        {
          name: 'editing',
          groups: ['find', 'selection', 'spellchecker', 'editing'],
        },
        { name: 'forms', groups: ['forms'] },
        '/',
        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
        {
          name: 'paragraph',
          groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'],
        },
        { name: 'links', groups: ['links'] },
        { name: 'insert', groups: ['insert'] },
        '/',
        { name: 'styles', groups: ['styles'] },
        { name: 'colors', groups: ['colors'] },
        { name: 'tools', groups: ['tools'] },
        { name: 'others', groups: ['others'] },
        { name: 'about', groups: ['about'] },
      ],
    };
    this.date = moment().toDate();
    // this.product.productCreatedDay = moment().format('DD-MM-YYYY');
    // console.log(typeof(this.product.productCreatedDay));

    this.cols = [
      { field: 'productId', header: '#' },
      { field: 'productName', header: 'Name' },
      { field: 'productPriceIn', header: 'PriceIn' },
      { field: 'productPriceOut', header: 'PriceOut' },
      { field: 'productDiscount', header: 'Discount' },
      { field: 'productDescription', header: 'Description' },
      { field: 'productQuantity', header: 'Quantity' },
      { field: 'productCreatedDay', header: 'CreatedDay' },
      { field: 'productIsHot', header: 'Hot' },
      { field: 'colors', header: 'Color' },
      { field: 'sizes', header: 'Size' },
      { field: 'brand', header: 'Catalog' },
      { field: 'catalog', header: 'Brand' },
    ];
  }

  getAll() {
    this.proService.getAllProduct().subscribe((data) => {
      data.forEach((x) => {
        x.productImgIds = [];
        x.productImgs = x.productImg.split(';');
        x.productImgs.forEach((e) => {
          console.log(e.substring(this.baseUrl.length));
          x.productImgIds.push(parseInt(e.substring(this.baseUrl.length)));
        });
      });

      this.productList = data;
      console.log(this.productList);
    });

    this.catService.getAllCatalog().subscribe((data) => {
      this.catalogList = data;
      console.log(this.catalogList);
    });

    this.brandService.getAllBrand().subscribe((data) => {
      this.brandList = data;
      console.log(this.brandList);
    });

    this.colorService.getAllColor().subscribe((data) => {
      this.colorList = data;
    });

    this.sizeService.getAllSize().subscribe((data) => {
      this.sizeList = data;
    });
  }

  openModal() {
    this.product = new Product();
    this.selectedCatalog = new Catalog();
    this.selectedBrand = new Brand();
    this.selectedColors = [];
    this.selectedSizes = [];
    this.submitted = false;
    this.productDialog = true;
    this.uploadedFiles = [];
  }

  editProduct(product: Product) {
    // product.productImgs = product.productImg.split(';');
    this.product = { ...product };
    const currentPro = { ...product };
    this.selectedCatalog = currentPro.catalog;
    this.selectedBrand = currentPro.brand;
    this.selectedColors = currentPro.colors;
    this.selectedSizes = currentPro.sizes;
    this.productDialog = true;
    console.log(product);
  }

  hideProduct() {
    this.productDialog = false;
    this.submitted = false;
  }

  selectedFiles!: FileList;
  currentFile!: File;
  uploadedFiles: any[] = [];

  selectFile(evt: any) {
    for (let file of evt.files) {
      this.uploadedFiles.push(file);
      console.log(file);
    }
  }

  async saveProduct() {
    this.submitted = true;

    console.log(this.uploadedFiles);

    const files: File[] = [];
    for (let i = 0; i < this.uploadedFiles.length; i++) {
      files.push(this.uploadedFiles[i]);
    }
    if (this.product.productId == null) {
      const currentPro = { ...this.product };
      currentPro.catalog = this.selectedCatalog;
      currentPro.brand = this.selectedBrand;
      currentPro.colors = this.selectedColors;
      currentPro.sizes = this.selectedSizes;
      currentPro.productCreatedDay = moment().format('DD-MM-YYYY');

      let uploadFileResponse = await this.fileService
        .uploads(files)
        .toPromise();

      const selectedImg: String[] = [];
      uploadFileResponse.map((x) => {
        selectedImg.push(x.fileDownloadUri);
      });
      currentPro.productImg = selectedImg.join(';');
      // currentPro.productImgs.forEach((e) => {
      //   console.log(e.substring(this.baseUrl.length));
      //   currentPro.productImgIds.push(
      //     parseInt(e.substring(this.baseUrl.length))
      //   );
      // });
      console.log(currentPro);

      this.proService.addProduct(currentPro).subscribe(
        (data) => {
          data.productImgIds = [];
          data.productImgs = data.productImg.split(';');
          data.productImgs.forEach((e) => {
            console.log(e.substring(this.baseUrl.length));
            data.productImgIds.push(parseInt(e.substring(this.baseUrl.length)));
          });
          this.product = data;
          console.log(data);
          console.log(this.product);
          this.productList.push(data);
          this.table.totalRecords++;
          this.toastrService.success(
            'Product has been added succesfully!',
            'Succesfull'
          );
        },
        () => {
          currentPro.productImgIds.forEach((x) => {
            this.fileService.delete(x).subscribe((e) => {
              console.log(e);
            });
          });
          this.toastrService.error(
            'Something wrong! Please Try Again',
            'Failed!'
          );
        }
      );
    } else {
      let uploadFileResponse = await this.fileService
        .uploads(files)
        .toPromise();

      const selectedImg: String[] = [];
      if (this.product.productImg != '')
        selectedImg.push(this.product.productImg);
      uploadFileResponse.map((x) => {
        selectedImg.push(x.fileDownloadUri);
      });

      const currentPro = { ...this.product };
      currentPro.catalog = this.selectedCatalog;
      currentPro.brand = this.selectedBrand;
      currentPro.colors = this.selectedColors;
      currentPro.sizes = this.selectedSizes;
      currentPro.productCreatedDay = moment().format('DD-MM-YYYY');
      currentPro.productImg = selectedImg.join(';');
      console.log(currentPro);

      this.proService
        .updateProduct(currentPro.productId, currentPro)
        .subscribe((data) => {
          currentPro.productImgIds = [];
          currentPro.productImgs = currentPro.productImg.split(';');
          currentPro.productImgs.forEach((e) => {
            console.log(e.substring(this.baseUrl.length));
            currentPro.productImgIds.push(
              parseInt(e.substring(this.baseUrl.length))
            );
          });
          this.productList[this.findIndexById(currentPro.productId)] =
            currentPro;
          this.product = currentPro;
          console.log(data);
          console.log(this.product);
        });
      this.toastrService.success('Updated succesfully', 'Succesfully');
    }

    this.productList = [...this.productList];
    this.productList = this.productList.slice();

    this.productDialog = false;
    this.uploadedFiles = [];
    this.product = new Product();
  }

  deleteProduct(product: Product) {
    product.productImgIds = [];
    product.productImgs = product.productImg.split(';');
    product.productImgs.forEach((e) => {
      console.log(e.substring(this.baseUrl.length));
      product.productImgIds.push(parseInt(e.substring(this.baseUrl.length)));
    });
    product.productImgIds.forEach((x) => {
      this.fileService.delete(x).subscribe((e) => {
        console.log(e);
      });
    });

    this.proService.deleteProduct(product.productId).subscribe((data) => {
      console.log(data);
    });

    this.productList = this.productList.filter(
      (val) => val.productId !== product.productId
    );

    this.product = new Product();
    this.table.totalRecords--;
  }

  deleteFile(file: any, i: number) {
    this.fileService
      .delete(parseInt(file.substring(this.baseUrl.length)))
      .subscribe((e) => {
        console.log(e);
      });

    this.product.productImgs.splice(i, 1);
    if (this.product.productImgs.length == 0) {
      this.product.productImgs = [];
    }
    this.product.productImg = this.product.productImgs.join(';');
    this.product.productImgIds.splice(i, 1);
    if (this.product.productImgIds.length == 0) {
      this.product.productImgIds = [];
    }

    console.log(this.product);
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.productList.length; i++) {
      if (this.productList[i].productId === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  isValid() {
    if (
      this.product.productName == null ||
      this.product.productPriceIn == null ||
      this.product.productPriceOut == null ||
      this.product.productDescription == null ||
      this.product.productDiscount == null ||
      this.product.productQuantity == null ||
      this.selectedCatalog == null ||
      this.selectedBrand == null ||
      this.selectedColors == null ||
      this.selectedSizes == null ||
      this.product.productStatus == null ||
      this.product.productIsHot == null ||
      !(
        this.proService.checkProductName(this.product.productName) &&
        this.proService.checkProductLength(this.product.productName)
      )
    ) {
      return false;
    }
    return true;
  }
}
