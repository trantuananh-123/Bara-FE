import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CatalogService } from 'src/app/Service/catalog.service';
import { LazyLoadScriptService } from 'src/app/Service/lazy-load.service';
import { UploadService } from 'src/app/Service/upload.service';

@Component({
  selector: 'app-catalog-add',
  templateUrl: './catalog-add.component.html',
  styleUrls: ['./catalog-add.component.css'],
})
export class CatalogAddComponent implements OnInit, AfterViewInit {
  frmAddCat!: FormGroup;

  selectedFiles!: FileList;
  currentFile!: File;
  imageUrl!: String;

  constructor(
    private fb: FormBuilder,
    private catService: CatalogService,
    private fileService: UploadService,
    private router: Router,
    private lazyService: LazyLoadScriptService
  ) {}

  ngAfterViewInit() {
    // this.lazyService.load('assets/js/plugins/sidebarmenu.js');
    this.lazyService.load('assets/js/plugins/switchery.min.js');
    // this.lazyService.load('assets/js/custom.min.js');
  }

  ngOnInit(): void {
    this.lazyService.load('assets/js/plugins/sidebarmenu.js');
    this.lazyService.load('assets/js/custom.min.js');

    this.initFormAdd();
  }

  initFormAdd() {
    this.frmAddCat = this.fb.group({
      catalogName: new FormControl(),
      catalogParentId: new FormControl(),
      catalogImg: new FormControl(),
      catalogDescription: new FormControl(),
      catalogStatus: new FormControl(),
      catalogIsHot: new FormControl(),
      catalogType: new FormControl(),
    });
  }

  addNewCat() {
    let cat = this.frmAddCat.value;

    const file: File = this.selectedFiles.item(0)!;
    if (file) {
      this.currentFile = file;
      console.log(this.currentFile);
      this.fileService.upload(this.currentFile).subscribe((e) => {
        cat.catalogImg = String(e.fileDownloadUri);
        this.catService.addCatalog(cat).subscribe((x) => {
          console.log(x);
        });
      });
    }

    this.router.navigate(['/admin-catalog_list']);
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
