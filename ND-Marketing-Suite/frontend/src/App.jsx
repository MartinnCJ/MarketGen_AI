/**
 * App.jsx — Root component.
 * Sets up React Query, Keycloak provider, router, and toast notifications.
 */
import { ReactKeycloakProvider } from '@react-keycloak/web'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import keycloak             from '@/keycloak'
import useAuthStore         from '@/store/authStore'
import Layout               from '@/components/layout/Layout'
import { FullPageSpinner }  from '@/components/ui/Spinner'

// Pages
import Dashboard            from '@/pages/Dashboard'
import BookList             from '@/pages/books/BookList'
import BookWorkflow         from '@/pages/books/BookWorkflow'
import BookEditor           from '@/pages/books/BookEditor'
import ProposalList         from '@/pages/proposals/ProposalList'
import CustomerList         from '@/pages/customers/CustomerList'
import Reports              from '@/pages/reports/Reports'
import Settings             from '@/pages/settings/Settings'
import Chat                 from '@/pages/chat/Chat'
import AssetList            from '@/pages/assets/AssetList'
import TemplateList         from '@/pages/templates/TemplateList'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
})

function AuthGate({ children }) {
  const { isLoading } = useAuthStore()
  if (isLoading) return <FullPageSpinner />
  return children
}

export default function App() {
  const { setAuthenticated, setUnauthenticated } = useAuthStore()

  const onKeycloakEvent = (event) => {
    if (event === 'onAuthSuccess')  setAuthenticated(keycloak)
    if (event === 'onAuthLogout' || event === 'onAuthError') setUnauthenticated()
    if (event === 'onTokenExpired') keycloak.updateToken(30).catch(() => keycloak.login())
  }

  const onKeycloakTokens = ({ token }) => {
    if (token) setAuthenticated(keycloak)
  }

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{ onLoad: 'login-required', checkLoginIframe: false }}
      onEvent={onKeycloakEvent}
      onTokens={onKeycloakTokens}
    >
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthGate>
            <Routes>
              {/* Protected app routes wrapped in persistent layout */}
              <Route element={<Layout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />

                {/* Dashboard */}
                <Route path="/dashboard"            element={<Dashboard />} />

                {/* Books */}
                <Route path="/books"                element={<BookList />} />
                <Route path="/books/new"            element={<BookWorkflow />} />
                <Route path="/books/:id/edit"       element={<BookWorkflow />} />
                <Route path="/books/:id/editor"     element={<BookEditor />} />

                {/* Proposals */}
                <Route path="/proposals"            element={<ProposalList />} />

                {/* Customers */}
                <Route path="/customers"            element={<CustomerList />} />

                {/* Marketing Assets */}
                <Route path="/assets"               element={<AssetList />} />

                {/* Templates */}
                <Route path="/templates"            element={<TemplateList />} />

                {/* Reports */}
                <Route path="/reports"              element={<Reports />} />

                {/* Settings */}
                <Route path="/settings"             element={<Settings />} />

                {/* AI Chat */}
                <Route path="/chat"                 element={<Chat />} />

                {/* 404 */}
                <Route path="*" element={
                  <div className="p-8 text-center text-slate-400">
                    <h2 className="text-xl font-semibold mb-2">404</h2>
                    <p>Página no encontrada</p>
                  </div>
                } />
              </Route>
            </Routes>
          </AuthGate>
        </BrowserRouter>

        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { fontSize: '14px' },
            success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
          }}
        />
      </QueryClientProvider>
    </ReactKeycloakProvider>
  )
}
