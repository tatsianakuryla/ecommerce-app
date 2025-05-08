import { NotFoundPage } from '@/pages/Not-found-page.tsx'
import { AboutPage } from '@/pages/About-page.tsx'
import { LoginPage } from '@/pages/Login-page.tsx'
import { MainPage } from '@/pages/Main-page.tsx'
import { RegisterPage } from '@/pages/Register-page.tsx'
import { MainLayout } from '@/layouts/Main-layout.tsx'
import { Route, Routes, Navigate } from 'react-router-dom'

export const AppRoutes = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route index element={<Navigate to='/main' replace />} />

      <Route path='main' element={<MainPage />} />
      <Route path='about' element={<AboutPage />} />
      <Route path='login' element={<LoginPage />} />
      <Route path='register' element={<RegisterPage />} />

      <Route path='*' element={<NotFoundPage />} />
    </Route>
  </Routes>
)
