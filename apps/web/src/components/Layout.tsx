import { useState } from 'react'

import SettingsModal from '@/components/SettingsModal'

type LayoutProps = {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [isSetttingsModalOpen, setIsSettingsModalOpen] = useState(false)

  return (
    <>
      <nav
        className="flex items-center justify-between px-6 py-4"
        aria-label="main navigation"
      >
        <a href="https://tinybird.co" rel="noopener noreferrer" target="_blank">
          <img src="/logo.svg" alt="Tinybird" width="112" height="28" />
        </a>

        <button
          className="btn-base bg-tb-primary text-white"
          onClick={() => setIsSettingsModalOpen(true)}
        >
          Tinybird Settings
        </button>
      </nav>

      <main className="px-4 md:px-12 max-w-5xl mx-auto">{children}</main>

      <SettingsModal
        isOpen={isSetttingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </>
  )
}
