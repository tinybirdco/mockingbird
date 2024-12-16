import { ReactNode } from "react"

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen">
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  )
}
