export function cx(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
}

export const isInViewport = (element: HTMLElement) => {
  var rect = element.getBoundingClientRect()

  return (
    rect.top + rect.height / 2 > 0 && // top
    rect.left + rect.width / 2 > 0 && // left
    rect.top + rect.height / 2 <
      (window.innerHeight || document.documentElement.clientHeight) && // bottom
    rect.left + rect.width / 2 <
      (window.innerWidth || document.documentElement.clientWidth) // right
  )
}
