export const SUPER_STIFF_CONFIG = {
  mass: 1,
  tension: 1000,
  friction: 1,
  clamp: true
}
export function getZ(index) {
  switch (index) {
    case 0:
      return 0
    case 1:
      return 1
    case 2:
      return 2
    case 3:
      return 3
    case 4:
      return 8
    case 5:
      return 4
    case 6:
      return 5
    case 7:
      return 6
    case 8:
      return 7
    default:
      return 0
  }
}
