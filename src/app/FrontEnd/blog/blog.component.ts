import { AfterViewInit, Component, OnInit } from '@angular/core';
import { LazyLoadScriptService } from 'src/app/Service/lazy-load.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent implements OnInit, AfterViewInit {
  constructor(private lazyService: LazyLoadScriptService) {}

  ngAfterViewInit() {
    this.lazyService.load('assets/js/main.js');
  }

  ngOnInit(): void {}
}
