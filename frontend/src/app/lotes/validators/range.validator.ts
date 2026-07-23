import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function rangeValidator(minField: string, maxField: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const minValue = control.get(minField)?.value;
    const maxValue = control.get(maxField)?.value;

    if (minValue == null || maxValue == null || minValue === '' || maxValue === '') {
      return null;
    }

    const minDate = minValue instanceof Date ? minValue : Number(minValue);
    const maxDate = maxValue instanceof Date ? maxValue : Number(maxValue);

    if (minDate > maxDate) {
      return { rangeInvalid: { minField, maxField } };
    }

    return null;
  };
}
