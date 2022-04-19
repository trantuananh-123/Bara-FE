import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Product } from 'src/app/Model/product';
import { LazyLoadScriptService } from 'src/app/Service/lazy-load.service';
import { ProductService } from 'src/app/Service/product.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
})
export class CatalogComponent implements OnInit {

  constructor(
    
  ) {}


  ngOnInit(): void {

  }
}
