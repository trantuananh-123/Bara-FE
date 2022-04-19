import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Catalog } from 'src/app/Model/catalog';
import { CatalogService } from 'src/app/Service/catalog.service';
import { LazyLoadScriptService } from 'src/app/Service/lazy-load.service';

@Component({
  selector: 'app-catalog-update',
  templateUrl: './catalog-update.component.html',
  styleUrls: ['./catalog-update.component.css'],
})
export class CatalogUpdateComponent implements OnInit, AfterViewInit {
  frmUpCat!: FormGroup;
  id!: number;
  catalog: Catalog = new Catalog();

  constructor(
    private lazyService: LazyLoadScriptService,
    private catService: CatalogService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngAfterViewInit() {
    this.lazyService.load('assets/js/plugins/sidebarmenu.js');
    this.lazyService.load('assets/js/custom.min.js');
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.catService.getCatalogById(this.id).subscribe(data => {
      this.catalog = data;
      this.frmUpCat.get('catalogId')!.setValue(this.catalog.catalogId);
      this.frmUpCat.get('catalogName')!.setValue(this.catalog.catalogName);
      this.frmUpCat
        .get('catalogParentId')!
        .setValue(this.catalog.catalogParentId);
      this.frmUpCat.get('catalogImg')!.setValue(this.catalog.catalogImg);
      this.frmUpCat
        .get('catalogDescription')!
        .setValue(this.catalog.catalogDescription);
      this.frmUpCat.get('catalogStatus')!.setValue(this.catalog.catalogStatus);
      this.frmUpCat.get('catalogIsHot')!.setValue(this.catalog.catalogIsHot);
      this.frmUpCat.get('catalogType')!.setValue(this.catalog.catalogType);
    });
    this.initFormUp();
  }

  initFormUp() {
    this.frmUpCat = this.fb.group({
      catalogId: new FormControl(),
      catalogName: new FormControl(),
      catalogParentId: new FormControl(),
      catalogImg: new FormControl(),
      catalogDescription: new FormControl(),
      catalogStatus: new FormControl(),
      catalogIsHot: new FormControl(),
      catalogType: new FormControl(),
    });
  }

  updateCat() {
    let cat = this.frmUpCat.value;
    this.catService.updateCatalog(cat.catalogId, cat).subscribe((data) => {
      console.log(data);
      this.router.navigate(['/admin-catalog_list']);
    });
  }
}
