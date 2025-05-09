import Header from '@/components/Header/Header.tsx'
import { Outlet } from 'react-router-dom'

export const MainLayout = () => {
  return (
    <>
      <Header></Header>
      <Outlet />
    </>
  )
}
