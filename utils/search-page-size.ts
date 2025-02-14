export function getSearchPageSize(width: number): number {
  if (width > 1199) {
    return 16;
  } else if (width > 744) {
    return 9;
  } else {
    return 8;
  }
}
