import type { FormFieldError, FormFieldErrorsInput, FormModel } from './types/form'

export function normalizeFormFieldErrors<TModel extends FormModel = FormModel>(
  input: FormFieldErrorsInput<TModel>
): FormFieldError<TModel>[] {
  if (Array.isArray(input)) return input

  return Object.entries(input).map(([name, errors]) => ({ name, errors }))
}
