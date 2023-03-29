type MessageCountProps = {
  sentMessages: {
    total: number
    session: number
  }
}

export default function MessageCount({ sentMessages }: MessageCountProps) {
  return (
    <div className="flex flex-col gap-6 card md:flex-row md:justify-between">
      <div className="flex flex-col gap-6">
        <p className="text-[32px] leading-10 font-semibold">
          {sentMessages.total}
        </p>
        <p className="text-[22px] leading-7 font-medium text-tb-text1">
          Messages Sent (Total)
        </p>
      </div>

      <div className="h-[1px] w-full md:w-[1px] md:h-[90px] bg-tb-text2 bg-opacity-70" />

      <div className="flex flex-col gap-6">
        <p className="text-[32px] leading-10 font-semibold">
          {sentMessages.session}
        </p>
        <p className="text-[22px] leading-7 font-medium text-tb-text1">
          Messages Sent (Session)
        </p>
      </div>
    </div>
  )
}
