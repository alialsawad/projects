/**
 * Concatenate classNames together
 */
export function classes(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
