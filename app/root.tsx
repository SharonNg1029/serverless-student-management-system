import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import { useEffect } from 'react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import Navbar from './components/layout/navbar'
import Footer from './components/layout/footer'
import { configureAmplify } from './config/amplify-config'
import { useAuthStore } from './store/authStore'
import './style/layout.css'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/Logo_AWS_FCJ.png" />
        <title>LMS - Student Management System</title>
        <Meta />
        <Links />
      </head>
      <body>
        <ChakraProvider value={defaultSystem}>
          <div className="layout">
            <Navbar />
            <main className="layout-content">
              <div className="container">
                {children}
              </div>
            </main>
            <Footer />
          </div>
          <ScrollRestoration />
          <Scripts />
        </ChakraProvider>
      </body>
    </html>
  )
}

export default function Root() {
  const { checkAuthStatus } = useAuthStore()

  useEffect(() => {
    // Initialize Amplify configuration
    configureAmplify()
    
    // Check authentication status on app load
    checkAuthStatus()
  }, [])

  return <Outlet />
}
