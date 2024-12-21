"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const currentStep = pathname === "/schema" ? "schema" : pathname === "/generate" ? "generate" : null;

  return (
    <div className="flex h-screen">
      {currentStep && (
        <div className="w-64 border-r border-gray-200 bg-gray-50">
          <Sidebar currentStep={currentStep} />
        </div>
      )}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  )
}
