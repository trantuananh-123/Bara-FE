import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Directive({
  selector: '[appProductDiscount][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ProductDiscountDirective,
      multi: true,
    },
  ],
})
export class ProductDiscountDirective implements Validator {
  validate(control: AbstractControl): { [key: string]: any } | null {
    if (control.value && (control.value < 0 || control.value > 100)) {
      console.log(control.value);
      return { proDiscount: true };
    } else if (control.value === null) {
      return { required: true };
    }
    return null;
  }
}
