export function getPageSize(width: number): number {
  if (width > 1199) {
    return 8;
  } else if (width > 744) {
    return 9;
  } else {
    return 4;
  }
}
