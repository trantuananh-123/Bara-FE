import { AfterViewInit, Component, OnInit } from '@angular/core';
import { LazyLoadScriptService } from 'src/app/Service/lazy-load.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
})
export class PortfolioComponent implements OnInit, AfterViewInit {
  constructor(private lazyService: LazyLoadScriptService) {}

  ngAfterViewInit() {
    this.lazyService.load('assets/js/main.js');
  }
  
  ngOnInit(): void {}
}
