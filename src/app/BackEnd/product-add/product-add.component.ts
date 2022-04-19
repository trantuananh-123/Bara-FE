import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
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
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css'],
})
export class ProductAddComponent implements OnInit, AfterViewInit {
  frmAddPro!: FormGroup;
  catalogList!: Catalog[];
  cat!: Catalog;
  brandList: Brand[] = [];
  colorList: Color[] = [];
  sizeList: Size[] = [];
  dropdownColorSettings = {};
  dropdownSizeSettings = {};

  selectedFiles!: FileList;
  currentFile!: File;
  imageUrl!: String;

  constructor(
    private fileService: UploadService,
    private lazyService: LazyLoadScriptService,
    private proService: ProductService,
    private catService: CatalogService,
    private brandService: BrandService,
    private colorService: ColorService,
    private sizeService: SizeService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.lazyService.load('assets/js/plugins/sidebarmenu.js');
    this.lazyService.load('assets/js/plugins/switchery.min.js');
    this.lazyService.load('assets/js/custom.min.js');
  }

  ngOnInit(): void {
    this.dropdownColorSettings = {
      singleSelection: false,
      idField: 'colorId',
      textField: 'colorName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
    };
    this.dropdownSizeSettings = {
      singleSelection: false,
      idField: 'sizeId',
      textField: 'sizeName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
    };
    this.initFormAdd();
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

  initFormAdd() {
    let date = moment().format('DD-MM-YYYY');
    this.frmAddPro = this.fb.group({
      productName: new FormControl(null),
      productPriceIn: new FormControl(null),
      productPriceOut: new FormControl(null),
      productDiscount: new FormControl(null),
      productImg: new FormControl(null),
      productDescription: new FormControl(null),
      productCreatedDay: new FormControl(date),
      productQuantity: new FormControl(null),
      productIsHot: new FormControl(null),
      productStatus: new FormControl(null),
      catalog: new FormControl(null),
      brand: new FormControl(null),
      sizes: new FormControl(null),
      colors: new FormControl(null),
      filename: [''],
    });
  }

  onItemSelect(item: any) {
    console.log('onItemSelect', item);
  }
  onSelectAll(items: any) {
    console.log('onSelectAll', items);
  }

  async addNewPro() {
    const formProduct: Product = this.frmAddPro.value;

    const catalog: any = {
      catalogId: this.frmAddPro.get('catalog')!.value,
    };
    formProduct.catalog = catalog;

    const brand: any = {
      brandId: this.frmAddPro.get('brand')!.value,
    };
    formProduct.brand = brand;

    const file: File = this.selectedFiles.item(0)!;
    if (file) {
      this.currentFile = file;
      console.log(this.currentFile);
      this.fileService.upload(this.currentFile).subscribe((e) => {
        formProduct.productImg = String(e.fileDownloadUri);
        this.proService.addProduct(formProduct).subscribe((x) => {
          console.log(x);
        });
      });
    }
  }

  filePath!: string;

  selectFile(evt: any) {
    this.selectedFiles = evt.target.files;
    const file = this.selectedFiles.item(0)!;

    const reader = new FileReader();
    reader.onload = () => {
      this.filePath = String(reader.result);
    };
    reader.readAsDataURL(file);

    console.log(this.selectedFiles);
  }
}
