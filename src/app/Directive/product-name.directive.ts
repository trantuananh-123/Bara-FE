import { Directive } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ProductService } from '../Service/product.service';

@Directive({
  selector: '[appProductName][ngModel]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: ProductNameDirective,
      multi: true,
    },
  ],
})

export class ProductNameDirective implements AsyncValidator {

  constructor(private productService: ProductService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    // return of(this.createProductNameValidator()(control));
    return this.productService.checkProductName(control.value).pipe(
      map((isValid) => (!isValid ? { proName: true } : null)),
      catchError(() => of(null))
    );
  }
}
