import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { Brand } from 'src/app/Model/brand';
import { Catalog } from 'src/app/Model/catalog';
import { Color } from 'src/app/Model/color';
import { Product } from 'src/app/Model/product';
import { BrandService } from 'src/app/Service/brand.service';
import { CatalogService } from 'src/app/Service/catalog.service';
import { ColorService } from 'src/app/Service/color.service';
import { LazyLoadScriptService } from 'src/app/Service/lazy-load.service';
import { ProductService } from 'src/app/Service/product.service';
import { SizeService } from 'src/app/Service/size.service';
import { Size } from 'src/app/Model/size';
import { UploadService } from 'src/app/Service/upload.service';

@Component({
  selector: 'app-product-update',
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.css'],
})
export class ProductUpdateComponent implements OnInit, AfterViewInit {
  constructor(
    private lazyService: LazyLoadScriptService,
    private proService: ProductService,
    private catService: CatalogService,
    private brandService: BrandService,
    private colorService: ColorService,
    private sizeService: SizeService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private datepipe: DatePipe,
    private fileService: UploadService
  ) {
    this.initFormUp();
    this.id = this.route.snapshot.params['id'];
    this.proService.getProductById(this.id).subscribe((data) => {
      this.product = data;
      this.frmUpPro.patchValue(data);
      this.imageUrl = data.productImg;
      console.log(data);
      // this.frmUpPro.patchValue({
      //   productCreatedDay: this.datepipe.transform(
      //     data.productCreatedDay,
      //     'dd/MM/yyyy'
      //   ),
      // });
      this.frmUpPro.controls['catalog'].setValue(data.catalog.catalogId, {
        onlySelf: true,
      });
      this.frmUpPro.controls['brand'].setValue(data.brand.brandId, {
        onlySelf: true,
      });
    });
  }

  ngAfterViewInit() {
    this.lazyService.load('assets/js/plugins/sidebarmenu.js');
    this.lazyService.load('assets/js/plugins/switchery.min.js');
    this.lazyService.load('assets/js/custom.min.js');
  }

  id!: number;
  frmUpPro!: FormGroup;
  product!: Product;
  cat!: Catalog;
  catalogList: Catalog[] = [];
  brandList: Brand[] = [];
  colorList: Color[] = [];
  sizeList: Size[] = [];
  
  selectedFiles!: FileList;
  currentFile!: File;
  imageUrl!: String;

  dropdownColorSettings = {
    singleSelection: false,
    idField: 'colorId',
    textField: 'colorName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
  };
  dropdownSizeSettings = {
    singleSelection: false,
    idField: 'sizeId',
    textField: 'sizeName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
  };


  ngOnInit(): void {
    
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
      console.log(this.colorList);
    });
    this.sizeService.getAllSize().subscribe((data) => {
      this.sizeList = data;
      console.log(this.sizeList);
    });
  }

  onItemSelect(item: any) {
    console.log('onItemSelect', item);
  }
  onSelectAll(items: any) {
    console.log('onSelectAll', items);
  }

  initFormUp() {
    this.frmUpPro = this.fb.group({
      productId: new FormControl(),
      productName: new FormControl(),
      productPriceIn: new FormControl(),
      productPriceOut: new FormControl(),
      productDiscount: new FormControl(),
      productImg: new FormControl(),
      productDescription: new FormControl(),
      productCreatedDay: new FormControl(),
      productQuantity: new FormControl(),
      productIsHot: new FormControl(),
      productStatus: new FormControl(),
      catalog: new FormControl(),
      brand: new FormControl(),
      colors: new FormControl(),
      sizes: new FormControl(),
    });
  }

  updatePro() {
    const formProduct: Product = this.frmUpPro.value;
    const catalog: any = {
      catalogId: this.frmUpPro.get('catalog')!.value,
    };
    formProduct.catalog = catalog;

    const brand: any = {
      brandId: this.frmUpPro.get('brand')!.value,
    };
    formProduct.brand = brand;

    const file: File = this.selectedFiles.item(0)!;
    if (file) {
      this.currentFile = file;
      console.log(this.currentFile);
      this.fileService.upload(this.currentFile).subscribe((e) => {
        formProduct.productImg = String(e.fileDownloadUri);
        this.proService.updateProduct(formProduct.productId, formProduct)
        .subscribe((data) => {
          console.log(data);
          this.router.navigate(['/admin-product_list']);
        });
      });
    }

    // this.proService
    //   .updateProduct(formProduct.productId, formProduct)
    //   .subscribe((data) => {
    //     console.log(data);
    //     this.router.navigate(['/admin-product_list']);
    //   });
  }

  selectFile(evt: any) {
    this.selectedFiles = evt.target.files;
    this.imageUrl = '';
    console.log(this.selectedFiles);
  }
}
