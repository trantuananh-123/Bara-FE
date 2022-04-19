import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Toast, ToastrModule, ToastrService } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './FrontEnd/header/header.component';
import { FooterComponent } from './FrontEnd/footer/footer.component';
import { HomeComponent } from './FrontEnd/home/home.component';
import { NotFoundComponent } from './FrontEnd/not-allowed/not-found/not-found.component';
import { CatalogComponent } from './FrontEnd/catalog/catalog.component';
import { ProductComponent } from './FrontEnd/product/product.component';
import { LazyLoadScriptService } from './Service/lazy-load.service';
import { BlogComponent } from './FrontEnd/blog/blog.component';
import { AboutComponent } from './FrontEnd/about/about.component';
import { ContactComponent } from './FrontEnd/contact/contact.component';
import { NewsComponent } from './FrontEnd/news/news.component';
import { PortfolioComponent } from './FrontEnd/portfolio/portfolio.component';
import { FAQComponent } from './FrontEnd/faq/faq.component';
import { LoginComponent } from './FrontEnd/login/login.component';
import { RegisterComponent } from './FrontEnd/register/register.component';
import { AccountComponent } from './FrontEnd/account/account.component';
import { AdminComponent } from './BackEnd/admin/admin.component';
import { CatalogListComponent } from './BackEnd/catalog-list/catalog-list.component';
import { CatalogAddComponent } from './BackEnd/catalog-add/catalog-add.component';
import { CatalogUpdateComponent } from './BackEnd/catalog-update/catalog-update.component';
import { ProductListComponent } from './BackEnd/product-list/product-list.component';
import { ProductAddComponent } from './BackEnd/product-add/product-add.component';
import { AuthInterceptorService } from './Service/auth-interceptor.service';
import { ProductUpdateComponent } from './BackEnd/product-update/product-update.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CartComponent } from './FrontEnd/cart/cart.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProductDetailComponent } from './FrontEnd/product-detail/product-detail.component';
import { UploadService } from './Service/upload.service';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { NgxStarsModule } from 'ngx-stars';
import { CheckoutComponent } from './FrontEnd/checkout/checkout.component';
import { ProductNameDirective } from './Directive/product-name.directive';
import { ProductLengthDirective } from './Directive/product-length.directive';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxPaginationModule } from 'ngx-pagination';
import { CKEditorModule } from 'ckeditor4-angular';
import { AuthGuardService } from './Service/auth-guard.service';
import { AuthService } from './Service/auth.service';
import { ProductPriceDirective } from './Directive/product-price.directive';
import { ProductDiscountDirective } from './Directive/product-discount.directive';
import { CKEditorPipe } from './Pipe/ckeditor.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    NotFoundComponent,
    CatalogComponent,
    ProductComponent,
    BlogComponent,
    AboutComponent,
    ContactComponent,
    NewsComponent,
    PortfolioComponent,
    FAQComponent,
    LoginComponent,
    RegisterComponent,
    AccountComponent,
    AdminComponent,
    CatalogListComponent,
    CatalogAddComponent,
    CatalogUpdateComponent,
    ProductListComponent,
    ProductAddComponent,
    ProductUpdateComponent,
    CartComponent,
    ProductDetailComponent,
    CheckoutComponent,
    ProductNameDirective,
    ProductLengthDirective,
    ProductPriceDirective,
    ProductDiscountDirective,
    CKEditorPipe
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMultiSelectModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgSelectModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-right-center',
    }),
    TableModule,
    DialogModule,
    CheckboxModule,
    ToolbarModule,
    FileUploadModule,
    InputNumberModule,
    CalendarModule,
    MultiSelectModule,
    DropdownModule,
    NgxStarsModule,
    NgxSliderModule,
    NgxPaginationModule,
    CKEditorModule,
  ],
  providers: [
    ToastrService,
    LazyLoadScriptService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    DatePipe,
    UploadService,
    AuthService,
    AuthGuardService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
