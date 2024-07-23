'use client'
import { ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import Navigation from '@/components/Layouts/Navigation'

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth({ middleware: 'auth', redirectIfNotAuthenticated: '/login' })

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation user={user} />
      {/* Page Content */}
      <main>{children}</main>
    </div>
  )
}

export default AppLayout