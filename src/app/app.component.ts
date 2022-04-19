import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { HomeComponent } from './FrontEnd/home/home.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Bara';

  // number: number = localStorage.getItem('number')
  //   ? JSON.parse(localStorage.getItem('number')!)
  //   : 0;
  showHead: boolean = false;

  ngOnInit() {}

  constructor(public router: Router) {}

  // onActive(componentRef: any) {
  //   if (componentRef instanceof HomeComponent) {
  //     console.log(componentRef);
  //     componentRef.addToCart.subscribe(() => {
  //       this.number++;
  //       localStorage.setItem('number', JSON.stringify(this.number));
  //       console.log('Clicked!');
  //     });
  //   }
  // }
}
