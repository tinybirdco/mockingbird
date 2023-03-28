export const cx = (...args: (string | undefined | false)[]) =>
  args.filter(Boolean).join(' ')
