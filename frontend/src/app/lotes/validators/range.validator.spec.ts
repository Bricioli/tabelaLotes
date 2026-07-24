import { FormBuilder } from '@angular/forms';
import { rangeValidator } from './range.validator';

describe('rangeValidator', () => {
  const fb = new FormBuilder();

  it('should return error when minimum value is greater than maximum value', () => {
    const form = fb.group(
      {
        valorMinimo: [10],
        valorMaximo: [5],
      },
      { validators: [rangeValidator('valorMinimo', 'valorMaximo')] }
    );

    expect(form.errors).toEqual({ rangeInvalid: { minField: 'valorMinimo', maxField: 'valorMaximo' } });
  });

  it('should return null when range values are valid', () => {
    const form = fb.group(
      {
        dataInicio: [new Date('2026-07-20')],
        dataFim: [new Date('2026-07-21')],
      },
      { validators: [rangeValidator('dataInicio', 'dataFim')] }
    );

    expect(form.errors).toBeNull();
  });
});
