import SettingsModal from '@/components/SettingsModal'
import { useState } from 'react'

type LayoutProps = {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [isSetttingsModalOpen, setIsSettingsModalOpen] = useState(false)

  return (
    <>
      <nav
        className="flex justify-between min-h-[3.25rem] px-3 py-2 shadow-sm"
        aria-label="main navigation"
      >
        <a href="https://tinybird.co">
          <img src="/logo.svg" alt="Tinybird" width="112" height="28" />
        </a>

        <button
          className="btn-base bg-tb_emerald text-white"
          onClick={() => setIsSettingsModalOpen(true)}
        >
          Tinybird Settings
        </button>
      </nav>

      <main className="p-4 max-w-7xl mx-auto">{children}</main>

      <SettingsModal
        isOpen={isSetttingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </>
  )
}
