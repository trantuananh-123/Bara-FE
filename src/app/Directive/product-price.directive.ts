import { Directive } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Directive({
  selector: '[appProductPrice][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ProductPriceDirective,
      multi: true,
    },
  ],
})
export class ProductPriceDirective implements Validator {
  constructor() {}

  validate(control: AbstractControl): { [key: string]: any } | null {
    if (control.value && control.value <= 0) {
      console.log(control.value);
      return { proPrice: true };
    } else if (control.value === null) {
      return { required: true };
    }
    return null;
  }
}
