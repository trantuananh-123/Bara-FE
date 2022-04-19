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
  selector: '[appProductLength][ngModel]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: ProductLengthDirective,
      multi: true,
    },
  ],
})
export class ProductLengthDirective implements AsyncValidator {
  constructor(private productService: ProductService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    // return of(this.createProductNameValidator()(control));
    return this.productService.checkProductLength(control.value).pipe(
      map((isValid) => (!isValid ? { proLength: true } : null)),
      catchError(() => of(null))
    );
  }
}
