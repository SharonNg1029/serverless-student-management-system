import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import { useEffect } from 'react'
import { ChakraProvider, defaultSystem, Portal } from '@chakra-ui/react'
import { configureAmplify } from './config/amplify-config'
import { useAuthStore } from './store/authStore'
import { Toaster } from './components/ui/toaster'
import './style/layout.css'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/Logo_AWS_FCJ.png" />
        <title>StudentManager Pro - LMS</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: `
          body {
            font-family: 'Inter', sans-serif;
            background-color: #F3F4F6;
          }
        ` }} />
        <Meta />
        <Links />
      </head>
      <body>
        <ChakraProvider value={defaultSystem}>
          <Toaster />
          {children}
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

  // Root just renders Outlet - layouts are handled by route config
  return <Outlet />
}
