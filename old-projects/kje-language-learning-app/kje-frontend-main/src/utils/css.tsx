/**
 * Concatenate classNames together
 */

export function concatClasses(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
