import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Table } from 'primeng/table';
import { Catalog } from 'src/app/Model/catalog';
import { CatalogService } from 'src/app/Service/catalog.service';
import { LazyLoadScriptService } from 'src/app/Service/lazy-load.service';
import { UploadService } from 'src/app/Service/upload.service';

@Component({
  selector: 'app-catalog-list',
  templateUrl: './catalog-list.component.html',
  styleUrls: ['./catalog-list.component.css'],
})
export class CatalogListComponent implements OnInit, AfterViewInit {
  @ViewChild('dt') table!: Table;

  config: any;
  catalogList!: Catalog[];
  catalogDialog!: boolean;
  catalog!: Catalog;
  selectedCatalogs!: Catalog[];
  submitted!: boolean;

  cols!: any[];

  constructor(
    private lazyService: LazyLoadScriptService,
    private catService: CatalogService,
    private fileService: UploadService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngAfterViewInit() {
    this.lazyService.load('assets/js/plugins/sidebarmenu.js');
    this.lazyService.load('assets/js/custom.min.js');

    this.getAllCatalog();
  }

  ngOnInit(): void {

    this.cols = [
      { field: 'catalogId', header: '#' },
      { field: 'catalogName', header: 'Name' },
      { field: 'catalogDescription', header: 'Description' },
      { field: 'catalogIsHot', header: 'Hot' },
      { field: 'catalogImg', header: 'Image' },
    ];
    
  }

  getAllCatalog() {
    this.catService.getAllCatalog().subscribe((data) => {
      this.catalogList = data;
      console.log(data);
    });
  }

  openModal() {
    this.catalog = new Catalog();
    this.submitted = false;
    this.catalogDialog = true;
    this.uploadedFiles = [];
  }

  editCatalog(catalog: Catalog) {
    this.catalog = { ...catalog };
    this.catalogDialog = true;
  }

  hideDialog() {
    this.catalogDialog = false;
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

  saveCatalog() {
    this.submitted = true;

    const file: File = this.uploadedFiles[0];
    console.log(file);

    this.currentFile = file;
    console.log(this.currentFile);

    if (this.catalog.catalogId != null) {
      const currentCat = { ...this.catalog };

      this.fileService
        .update(this.currentFile, currentCat.catalogImgId)
        .subscribe((e) => {
          currentCat.catalogImg = String(e.fileDownloadUri);
          console.log(currentCat);

          this.catalogList[this.findIndexById(currentCat.catalogId)] =
            currentCat;

          this.catService
            .updateCatalog(currentCat.catalogId, currentCat)
            .subscribe((data) => {
              console.log(data);
            });

          this.toastr.success('Updated succesfully', 'Succesfull');
        });
    } else {
      const currentCat = { ...this.catalog };

      this.fileService.upload(this.currentFile).subscribe((e) => {
        currentCat.catalogImg = String(e.fileDownloadUri);
        currentCat.catalogImgId = e.fileId;
        console.log(currentCat);

        this.catService.addCatalog(currentCat).subscribe((data) => {
          this.catalog = data;
          console.log(this.catalog);
          this.catalogList.push(data);
          this.table.totalRecords++;
        });

        this.toastr.success(
          'Catalog has been added succesfully!',
          'Succesfull'
        );
      });
    }

    this.catalogList = [...this.catalogList];
    this.catalogList = this.catalogList.slice();
    this.catalogDialog = false;
    this.uploadedFiles = [];
    this.catalog = new Catalog();
  }

  deleteCatalog(catalog: Catalog) {
    this.catService.deleteCatalog(catalog.catalogId).subscribe((data) => {
      this.fileService.delete(catalog.catalogImgId).subscribe((e) => {
        console.log(e);
      });
      console.log(data);
    });

    this.catalogList = this.catalogList.filter(
      (val) => val.catalogId !== catalog.catalogId
    );

    this.catalog = new Catalog();
    this.table.totalRecords--;
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.catalogList.length; i++) {
      if (this.catalogList[i].catalogId === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  isChecked = false;
  checked() {
    if (
      this.catalog.catalogName &&
      this.catalog.catalogDescription &&
      this.uploadedFiles[0]
    ) {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }
  }
}
