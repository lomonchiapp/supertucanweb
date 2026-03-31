import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'

// Lazy load admin to keep it out of the main bundle
const AdminRoutes = lazy(() => import('./admin/routes.tsx'))

// Lazy load model detail page
const ModelPage = lazy(() => import('./components/ModelPage.tsx'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          {/* Public site */}
          <Route path="/" element={<App />} />

          {/* Individual model pages (SEO-friendly, lazy loaded) */}
          <Route
            path="/modelos/:slug"
            element={
              <Suspense fallback={
                <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
                </div>
              }>
                <ModelPage />
              </Suspense>
            }
          />

          {/* Admin dashboard (lazy loaded) */}
          <Route
            path="/admin/*"
            element={
              <Suspense fallback={
                <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
                </div>
              }>
                <AdminRoutes />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
