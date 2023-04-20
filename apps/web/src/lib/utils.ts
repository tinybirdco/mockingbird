export const cx = (...args: (string | undefined | false)[]) =>
  args.filter(Boolean).join(' ')

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
